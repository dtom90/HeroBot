import { QueryClient, experimental_streamedQuery as streamedQuery } from '@tanstack/react-query';
import { Message, StreamingMessageRequest, ValidHero } from '../../shared/types';

const IS_PROD = process.env.EXPO_PUBLIC_ENV === 'production';
const HOSTNAME = IS_PROD ? '/api' : 'localhost:3000';
const HTTP_URL = IS_PROD ? '/api' : `http://${HOSTNAME}`;
const WEBSOCKET_URL = IS_PROD ? '/api' : `ws://${HOSTNAME}`;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Types for streaming message data
export interface StreamingMessageData {
  type: 'chunk' | 'complete' | 'error';
  text?: string;
  audio?: string;
  error?: string;
  isComplete: boolean;
}

// Streaming message function
const streamingMessageFn = async function* (
  context: { signal: AbortSignal; queryKey: readonly unknown[] }
): AsyncGenerator<StreamingMessageData> {
  const hero = context.queryKey[1] as ValidHero;
  const userMessage = context.queryKey[2] as Message;
  const body = { hero, userMessage } as StreamingMessageRequest;
  const { signal } = context;
  
  const response = await fetch(`${HTTP_URL}/message/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body reader available');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      if (signal.aborted) {
        break;
      }

      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6)); // Remove 'data: ' prefix
            yield data as StreamingMessageData;
            
            if (data.isComplete) {
              return;
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
};

// Streaming message query
export const streamingMessageQuery = streamedQuery({
  queryFn: streamingMessageFn
});

// Types for transcription data
export interface TranscriptionData {
  transcription: string;
  isFinal: boolean;
}

const transcriptionStreamFn = async function* ({ signal }: { signal: AbortSignal }): AsyncGenerator<TranscriptionData> {
  
  let mediaRecorder: MediaRecorder | null = null;
  let ws: WebSocket | null = null;
  let stream: MediaStream | null = null;

  const cleanup = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  // Handle abort signal
  signal.addEventListener('abort', () => {
    cleanup();
  });

  try {
    stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        channelCount: 1,
        sampleRate: 16000,
        sampleSize: 16,
      } 
    });

    ws = new WebSocket(WEBSOCKET_URL);

    await new Promise<void>((resolve, reject) => {
      if (!ws) {
        reject(new Error('WebSocket not available'));
        return;
      }

      ws.onopen = () => {
        if (!stream) {
          reject(new Error('No audio stream available'));
          return;
        }
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus',
          bitsPerSecond: 128000,
        });

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          cleanup();
        };

        mediaRecorder.onerror = (event) => {
          console.error('MediaRecorder error:', event);
          cleanup();
          reject(new Error('MediaRecorder error'));
        };

        mediaRecorder.start(100); // Send data every 100ms
        resolve();
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        cleanup();
        reject(new Error('WebSocket error'));
      };
    });

    // Yield transcription data as it comes in
    while (true) {
      if (signal.aborted) {
        break;
      }

      const data = await new Promise<TranscriptionData>((resolve, reject) => {
        if (!ws) {
          reject(new Error('WebSocket not available'));
          return;
        }

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.transcription) {
              resolve(data);
              if (data.isFinal) {
                cleanup();
              }
            }
          } catch (e) {
            console.error('Error parsing WebSocket message:', e);
            reject(new Error('Failed to parse WebSocket message'));
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(new Error('WebSocket error'));
        };
      });

      yield data;

      if (data.isFinal) {
        break;
      }
    }

  } catch (error) {
    console.error('Error in transcription stream:', error);
    cleanup();
    throw error;
  } finally {
    cleanup();
  }
}

// WebSocket transcription stream function
export const transcriptionStreamQuery = streamedQuery({
  queryFn: transcriptionStreamFn,
  refetchMode: 'replace',
});

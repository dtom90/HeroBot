import { QueryClient, experimental_streamedQuery as streamedQuery } from '@tanstack/react-query';
import { Message } from '../../shared/types';

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

export const sendMessageMutation = async (userMessage: Message) => {
  const response = await fetch(`${HTTP_URL}/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userMessage),
  });
  return response.json();
};

// Types for transcription data
export interface TranscriptionData {
  transcription: string;
  isFinal: boolean;
}

const transcriptionStreamFn = async function* ({ signal }: { signal: AbortSignal }): AsyncGenerator<TranscriptionData> {
  console.log('transcriptionStreamFn');
  
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
        console.log('WebSocket connection opened');
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
          console.log('MediaRecorder stopped');
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

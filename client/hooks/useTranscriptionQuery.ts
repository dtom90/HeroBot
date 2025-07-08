import { useQuery, experimental_streamedQuery as streamedQuery } from "@tanstack/react-query";
import { WEBSOCKET_URL } from "../lib/queryClient";

export const useTranscriptionQuery = (isRecording: boolean) => {
  return useQuery({
    queryKey: ['transcription'],
    enabled: isRecording, // Only run when recording
    queryFn: transcriptionStreamQuery,
  });
};

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

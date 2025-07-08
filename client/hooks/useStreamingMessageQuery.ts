import { useQuery, experimental_streamedQuery as streamedQuery } from '@tanstack/react-query';
import { Message, StreamingMessageRequest, ValidHero } from '../../shared/types';
import { HTTP_URL } from "./useApiClient";

export const useStreamingMessageQuery = (hero: ValidHero, streamingMessage: Message | null) => {
  return useQuery({
    queryKey: ['streamingMessage', hero, streamingMessage],
    enabled: !!streamingMessage,
    queryFn: streamingMessageQuery,
  });
};

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

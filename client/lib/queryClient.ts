import { QueryClient } from '@tanstack/react-query';
import { Message } from '../../shared/types';

const IS_PROD = process.env.EXPO_PUBLIC_ENV === 'production';
const HOSTNAME = IS_PROD ? '/api' : 'localhost:3000';
const HTTP_URL = IS_PROD ? '/api' : `http://${HOSTNAME}`;

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

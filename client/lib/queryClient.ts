import { QueryClient } from '@tanstack/react-query';

const IS_PROD = process.env.EXPO_PUBLIC_ENV === 'production';
const HOSTNAME = IS_PROD ? '/api' : 'localhost:3000';

export const HTTP_URL = IS_PROD ? '/api' : `http://${HOSTNAME}`;
export const WEBSOCKET_URL = IS_PROD ? '/api' : `ws://${HOSTNAME}`;

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

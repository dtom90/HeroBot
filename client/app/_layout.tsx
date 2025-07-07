import '../global.css';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen 
            name="index" 
            options={{ 
              title: 'Home',
              headerShown: true 
            }} 
          />
          <Stack.Screen 
            name="[hero]" 
            options={{ 
              headerShown: true 
            }} 
          />
          <Stack.Screen 
            name="hero-chat" 
            options={{ 
              headerShown: true 
            }} 
          />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

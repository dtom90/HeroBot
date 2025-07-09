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
      <GestureHandlerRootView style={{ flex: 1 }} className="dark">
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1f2937',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              color: '#ffffff',
            },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen 
            name="index" 
            options={{ 
              title: 'Hero Chat',
              headerTitleAlign: 'center',
              headerLeft: () => null
            }} 
          />
          <Stack.Screen
            name="[hero]"
            options={{
              headerTitleAlign: 'center',
              headerLeft: () => null
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

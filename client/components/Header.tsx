import { Stack } from 'expo-router';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <Stack.Screen 
      options={{ 
        title,
        headerTitleAlign: 'center'
      }} 
    />
  );
}

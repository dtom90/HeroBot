import { Stack, Link } from 'expo-router';
import { Pressable, Text } from 'react-native';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <Stack.Screen 
      options={{ 
        title,
        headerLeft: () => (
          <Link href="/" asChild>
            <Pressable className="ml-4">
              <Text className="text-xl">Heroes</Text>
            </Pressable>
          </Link>
        ),
        headerTitleAlign: 'center',
      }} 
    />
  );
}

import { Stack, Link } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeroScreenHeaderProps {
  title: string;
}

export function HeroScreenHeader({ title }: HeroScreenHeaderProps) {
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

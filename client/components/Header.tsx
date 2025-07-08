import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <Stack.Screen 
      options={{ 
        title,
        headerTitleAlign: 'center',
        headerLeft: () => (
          <Link href="/" className="ml-4">
            <View className="flex-row items-center">
              <Ionicons name="arrow-back" size={24} color="#1e293b" className="mr-2" />
              <Text className="font-medium text-base">Heroes</Text>
            </View>
          </Link>
        ),
        headerShadowVisible: true,
      }} 
    />
  );
}

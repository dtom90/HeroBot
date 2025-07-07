import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { Container } from '~/components/Container';
import { VALID_HEROES, HERO_CONFIGS, isValidHero, type ValidHero } from '~/utils/heroNavigation';

export default function HeroChat() {
  const { hero } = useLocalSearchParams<{ hero: string }>();
  
  // Validate the hero parameter
  if (!hero || !isValidHero(hero)) {
    return (
      <>
        <Stack.Screen options={{ title: 'Invalid Hero' }} />
        <Container>
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg font-semibold mb-2">Invalid Hero</Text>
            <Text className="text-gray-600 text-center">
              Please select a valid hero from the drawer menu.
            </Text>
          </View>
        </Container>
      </>
    );
  }

  const heroConfig = HERO_CONFIGS[hero as ValidHero];

  return (
    <>
      <Stack.Screen options={{ title: heroConfig.name }} />
      <Container>
        <View className="flex-1 p-4">
          <View className="bg-white rounded-lg p-6 shadow-sm">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              {heroConfig.name}
            </Text>
            <Text className="text-lg text-blue-600 font-semibold mb-4">
              {heroConfig.title}
            </Text>
            <Text className="text-gray-700 leading-relaxed">
              {heroConfig.description}
            </Text>
          </View>
        </View>
      </Container>
    </>
  );
} 
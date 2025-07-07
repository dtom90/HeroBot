import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { Container } from '~/components/Container';
import { isValidHero, ValidHero } from '../../shared/types';
import HeroPage from '~/components/HeroPage';

export default function HeroPageRoute() {
  const { hero } = useLocalSearchParams<{ hero: string }>();

  // Validate the hero parameter
  if (!hero || !isValidHero(hero)) {
    return (
      <>
        <Stack.Screen options={{
          title: 'Invalid Hero',
          headerTitleAlign: 'center',
          headerLeft: () => null
        }} />
        <Container>
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg font-semibold mb-2">Invalid Hero</Text>
            <Text className="text-gray-600 text-center">
              Please select a valid hero from the <Link href="/" className="text-blue-600">Home Page</Link>.
            </Text>
          </View>
        </Container>
      </>
    );
  }

  return <HeroPage hero={hero as ValidHero} />;
}

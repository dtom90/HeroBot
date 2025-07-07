import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { Container } from '~/components/Container';
import { HeroScreenHeader } from '~/components/HeroScreenHeader';
import { HeroTile } from '~/components/HeroTile';
import { HERO_CONFIGS, isValidHero } from '~/utils/heroNavigation';

export default function HeroChat() {
  const { hero } = useLocalSearchParams<{ hero: string }>();
  
  // Validate the hero parameter
  if (!hero || !isValidHero(hero)) {
    return (
      <>
        <HeroScreenHeader title="Invalid Hero" />
        <Container>
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg font-semibold mb-2">Invalid Hero</Text>
            <Text className="text-gray-600 text-center">
              Please select a valid hero from the home page.
            </Text>
          </View>
        </Container>
      </>
    );
  }

  return (
    <>
      <HeroScreenHeader title={HERO_CONFIGS[hero].name} />
      <Container>
        <HeroTile hero={hero} />
      </Container>
    </>
  );
}

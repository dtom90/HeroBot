import { Link, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { Container } from '~/components/Container';
import { Header } from '~/components/Header';
import { HERO_CONFIGS, isValidHero, ValidHero } from '~/lib/heroes';
import { HeroChat } from '~/components/HeroChat';
import { useConversationStore } from '~/lib/store';
import { useEffect } from 'react';

export default function HeroPage() {
  const { hero } = useLocalSearchParams<{ hero: string }>();
  const setCurrentHero = useConversationStore((state) => state.setCurrentHero);
  
  useEffect(() => {
    if (hero) {
      setCurrentHero(hero as ValidHero);
    }
  }, [hero, setCurrentHero]);

  // Validate the hero parameter
  if (!hero || !isValidHero(hero)) {
    return (
      <>
        <Header title="Invalid Hero" />
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

  return (
    <>
      <Header title={HERO_CONFIGS[hero].name} />
      <Container>
        <HeroChat hero={hero} />
      </Container>
    </>
  );
}

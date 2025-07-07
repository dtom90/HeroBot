import { Link, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { Container } from '~/components/Container';
import { HeroScreenHeader } from '~/components/HeroScreenHeader';
import { HERO_CONFIGS, isValidHero } from '~/lib/heroes';
import { ChatConent } from '~/components/ChatConent';

export default function HeroPage() {
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
              Please select a valid hero from the <Link href="/" className="text-blue-600">Home Page</Link>.
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
        <ChatConent hero={hero} />
      </Container>
    </>
  );
}

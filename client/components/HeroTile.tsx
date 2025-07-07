import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import type { ValidHero } from '~/utils/heroNavigation';
import { HERO_CONFIGS } from '~/utils/heroNavigation';

interface HeroTileProps {
  hero: ValidHero;
}

export function HeroTile({ hero }: HeroTileProps) {
  const heroConfig = HERO_CONFIGS[hero];

  return (
    <Link href={`/${hero}`}>
      <View className="w-full bg-white rounded-lg p-6 mb-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
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
    </Link>
  );
}

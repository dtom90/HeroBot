import { Link } from 'expo-router';
import { Image, Text, View } from 'react-native';
import type { ValidHero } from '~/lib/heroes';
import { HERO_CONFIGS } from '~/lib/heroes';

interface HeroTileProps {
  hero: ValidHero;
}

export function HeroTile({ hero }: HeroTileProps) {
  const heroConfig = HERO_CONFIGS[hero];

  return (
    <Link href={`/${hero}`}>
      <View className="w-full bg-white rounded-lg p-6 mb-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
        <View className="flex flex-row">
          <View className='mr-4'>
            <Image source={heroConfig.image} style={{ width: 100, height: 150 }} />
          </View>
          <View className="flex-1">
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
      </View>
    </Link>
  );
}

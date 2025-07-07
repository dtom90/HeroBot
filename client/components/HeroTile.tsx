import { Link } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { HERO_INFORMATION, ValidHero } from '../../shared/types';
import { HERO_ASSETS } from '~/lib/heroAssets';

interface HeroTileProps {
  hero: ValidHero;
}

export function HeroTile({ hero }: HeroTileProps) {
  const heroConfig = HERO_INFORMATION[hero];

  return (
    <Link href={`/${hero}`}>
      <View className="w-full h-48 bg-white rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow duration-300">
        <View className="flex flex-row h-full">
          <View className='mr-3 flex-shrink-0'>
            <Image 
              source={HERO_ASSETS[hero].image} 
              style={{ width: 100, height: 150 }} 
              className="rounded"
            />
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900 mb-1" numberOfLines={1}>
              {heroConfig.name}
            </Text>
            <Text className="text-base text-blue-600 font-semibold mb-2" numberOfLines={1}>
              {heroConfig.title}
            </Text>
            <Text className="text-sm text-gray-700 leading-relaxed" numberOfLines={4}>
              {heroConfig.description}
            </Text>
          </View>
        </View>
      </View>
    </Link>
  );
}

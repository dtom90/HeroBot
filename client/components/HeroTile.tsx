import { Link } from 'expo-router';
import { Image, Text, View, Pressable } from 'react-native';
import { HERO_INFORMATION, ValidHero } from '../../shared/types';
import { HERO_ASSETS } from '~/lib/heroAssets';
import { useState } from 'react';
import { HeroAnimation } from './HeroAnimation';

interface HeroTileProps {
  hero: ValidHero;
}

export function HeroTile({ hero }: HeroTileProps) {
  const heroConfig = HERO_INFORMATION[hero];
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Link href={`/${hero}`}>
      <Pressable
        onHoverIn={() => setIsHovering(true)}
        onHoverOut={() => setIsHovering(false)}
      >
        <View 
          className={`w-full h-45 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm transition-shadow duration-300 shadow-sm hover:shadow-lg dark:shadow-gray-600/50 dark:hover:shadow-gray-600/70`}
        >
          <View className="flex flex-row h-full">
            <View className='mr-3 flex-shrink-0 relative'>
              <Image 
                source={HERO_ASSETS[hero].image} 
                style={{ width: 100, height: 150 }} 
                className="rounded-md overflow-hidden"
              />
              {isHovering && (
                <View className="absolute inset-0 z-10">
                  <HeroAnimation hero={hero} style={{ width: 100, height: 150 }} />
                </View>
              )}
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 dark:text-white mb-1" numberOfLines={1}>
                {heroConfig.name}
              </Text>
              <Text className="text-base text-gray-600 dark:text-gray-400 font-semibold mb-2" numberOfLines={1}>
                {heroConfig.title}
              </Text>
              <Text className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed" numberOfLines={4}>
                {heroConfig.description}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

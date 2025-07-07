import { isValidHero, ValidHero } from '../../shared/types';
import { HERO_ASSETS } from '~/lib/heroAssets';
import { HeroAnimation } from './HeroAnimation';
import { Image } from 'expo-image';
import { View } from 'react-native';

export const HeroImage = ({ hero }: { hero: ValidHero }) => {
  if (!isValidHero(hero)) {
    return null;
  }

  if (HERO_ASSETS[hero].video) {
    return <HeroAnimation hero={hero} />;
  } else {
    return (
      <View className='flex-1'>
        <Image
          source={HERO_ASSETS[hero].image}
          contentFit='contain'
          style={{ width: '100%', height: '100%' }}
        />
      </View>
    );
  }
};

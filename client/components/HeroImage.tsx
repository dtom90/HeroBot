import { isValidHero, ValidHero } from '../../shared/types';
import { HERO_CONFIGS } from '~/lib/heroes';
import { HeroAnimation } from './HeroAnimation';
import { Image } from 'expo-image';
import { View } from 'react-native';

export const HeroImage = ({ hero }: { hero: ValidHero }) => {
  if (!isValidHero(hero)) {
    return null;
  }

  if (HERO_CONFIGS[hero].video) {
    return <HeroAnimation hero={hero} />;
  } else {
    return (
      <View className='flex-1'>
        <Image
          source={HERO_CONFIGS[hero].image}
          contentFit='contain'
          style={{ width: '100%', height: '100%' }}
        />
      </View>
    );
  }
};

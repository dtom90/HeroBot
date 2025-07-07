import { HERO_CONFIGS, isValidHero, ValidHero } from '~/lib/heroes';
import { HeroAnimation } from './HeroAnimation';
import { Image, View } from 'react-native';

export const HeroImage = ({ hero }: { hero: ValidHero }) => {
  if (!isValidHero(hero)) {
    return null;
  }

  if (HERO_CONFIGS[hero].video) {
    return <HeroAnimation hero={hero} />;
  } else {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Image
          source={HERO_CONFIGS[hero].image}
          style={{ width: undefined, height: '100%', resizeMode: 'contain' }}
        />
      </View>
    );
  }
};

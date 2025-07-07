import { ValidHero } from '../../shared/types';

export type HeroConfig = {
  image: any;
  video?: any;
};

// Hero configurations
export const HERO_CONFIGS: Record<ValidHero, HeroConfig> = {
  washington: {
    image: require('~/assets/images/washington.png'),
  },
  jefferson: {
    image: require('~/assets/images/jefferson.png'),
  },
  lincoln: {
    image: require('~/assets/images/lincoln.png'),
  },
  teddy: {
    image: require('~/assets/images/teddy.png'),
    video: require('~/assets/videos/teddy-idle.mp4'),
  }
};

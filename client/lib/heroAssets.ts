import { ValidHero } from '../../shared/types';

type HeroAsset = {
  image: any;
  video?: any;
};

// Hero assets
export const HERO_ASSETS: Record<ValidHero, HeroAsset> = {
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

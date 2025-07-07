import { ValidHero } from '../../shared/types';

type HeroAsset = {
  image: any;
  video?: any;
};

// Hero assets
export const HERO_ASSETS: Record<ValidHero, HeroAsset> = {
  washington: {
    image: require('~/assets/images/washington.png'),
    video: require('~/assets/videos/washington.mp4'),
  },
  jefferson: {
    image: require('~/assets/images/jefferson.png'),
    video: require('~/assets/videos/jefferson.mp4'),
  },
  lincoln: {
    image: require('~/assets/images/lincoln.png'),
    video: require('~/assets/videos/lincoln.mp4'),
  },
  teddy: {
    image: require('~/assets/images/teddy.png'),
    video: require('~/assets/videos/teddy.mp4'),
  }
};

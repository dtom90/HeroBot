// Fixed list of valid hero names
export const VALID_HEROES = ['washington', 'jefferson', 'lincoln', 'teddy'] as const;
export type ValidHero = typeof VALID_HEROES[number];
export type HeroConfig = {
  name: string;
  title: string;
  description: string;
  image: any;
  video?: any;
};

// Hero configurations
export const HERO_CONFIGS: Record<ValidHero, HeroConfig> = {
  washington: {
    name: 'George Washington',
    title: 'First President',
    description: 'The first President of the United States and Commander-in-Chief of the Continental Army.',
    image: require('~/assets/images/washington.png'),
  },
  jefferson: {
    name: 'Thomas Jefferson',
    title: 'Author of Independence',
    description: 'The third President of the United States and principal author of the Declaration of Independence.',
    image: require('~/assets/images/jefferson.png'),
  },
  lincoln: {
    name: 'Abraham Lincoln',
    title: 'The Great Emancipator',
    description: 'The 16th President of the United States, known for preserving the Union and abolishing slavery.',
    image: require('~/assets/images/lincoln.png'),
  },
  teddy: {
    name: 'Teddy Roosevelt',
    title: 'Rough Rider',
    description: 'The 26th President of the United States, known for his progressive policies and conservation efforts.',
    image: require('~/assets/images/teddy.png'),
    video: require('~/assets/videos/teddy-idle.mp4'),
  }
};

// Helper function to validate hero parameter
export function isValidHero(hero: string): hero is ValidHero {
  return VALID_HEROES.includes(hero as ValidHero);
}

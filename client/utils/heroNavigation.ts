// Fixed list of valid hero names
export const VALID_HEROES = ['teddy', 'washington', 'lincoln', 'jefferson'] as const;
export type ValidHero = typeof VALID_HEROES[number];

// Hero configurations
export const HERO_CONFIGS: Record<ValidHero, { name: string; title: string; description: string }> = {
  teddy: {
    name: 'Teddy Roosevelt',
    title: 'Rough Rider',
    description: 'The 26th President of the United States, known for his progressive policies and conservation efforts.'
  },
  washington: {
    name: 'George Washington',
    title: 'First President',
    description: 'The first President of the United States and Commander-in-Chief of the Continental Army.'
  },
  lincoln: {
    name: 'Abraham Lincoln',
    title: 'The Great Emancipator',
    description: 'The 16th President of the United States, known for preserving the Union and abolishing slavery.'
  },
  jefferson: {
    name: 'Thomas Jefferson',
    title: 'Author of Independence',
    description: 'The third President of the United States and principal author of the Declaration of Independence.'
  }
};

// Helper function to validate hero parameter
export function isValidHero(hero: string): hero is ValidHero {
  return VALID_HEROES.includes(hero as ValidHero);
}

// Helper function to get hero route
export function getHeroRoute(hero: ValidHero): string {
  return `/(drawer)/${hero}`;
}

// Helper function to get all hero routes
export function getAllHeroRoutes(): string[] {
  return VALID_HEROES.map(getHeroRoute);
}

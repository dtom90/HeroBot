export const VALID_HEROES = ['washington', 'jefferson', 'lincoln', 'teddy'] as const;
export type ValidHero = typeof VALID_HEROES[number];

// Helper function to validate hero parameter
export function isValidHero(hero: string): hero is ValidHero {
  return VALID_HEROES.includes(hero as ValidHero);
}

export interface HeroInformation {
  name: string;
  title: string;
  description: string;
}

// Hero information
export const HERO_INFORMATION: Record<ValidHero, HeroInformation> = {
  washington: {
    name: 'George Washington',
    title: 'First President',
    description: 'The first President of the United States and Commander-in-Chief of the Continental Army.',
  },
  jefferson: {
    name: 'Thomas Jefferson',
    title: 'Author of Independence',
    description: 'The third President of the United States and principal author of the Declaration of Independence.',
  },
  lincoln: {
    name: 'Abraham Lincoln',
    title: 'The Great Emancipator',
    description: 'The 16th President of the United States, known for preserving the Union and abolishing slavery.',
  },
  teddy: {
    name: 'Teddy Roosevelt',
    title: 'Rough Rider',
    description: 'The 26th President of the United States, known for his progressive policies and conservation efforts.',
  }
};

export interface Message {
  type: 'user' | 'hero';
  text: string;
  audio?: string;
}

export interface StreamingMessageRequest {
  hero: ValidHero;
  userMessage: Message;
}

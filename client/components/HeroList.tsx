import { Link } from 'expo-router';
import { Text } from 'react-native';

import { HERO_CONFIGS, VALID_HEROES } from '~/utils/heroNavigation';

export function HeroList() {
  return (
    <>
      {VALID_HEROES.map((hero) => (
        <Link key={hero} href={`/${hero}`}>
          <Text>{HERO_CONFIGS[hero].name}</Text>
        </Link>
      ))}
    </>
  );
}

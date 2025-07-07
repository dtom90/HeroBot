import { View } from 'react-native';
import { VALID_HEROES } from '../../shared/types';
import { HeroTile } from './HeroTile';

export function HeroList() {
  return (
    <View className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {VALID_HEROES.map((hero) => (
        <HeroTile key={hero} hero={hero} />
      ))}
    </View>
  );
}

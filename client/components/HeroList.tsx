
import { VALID_HEROES } from '~/utils/heroNavigation';
import { HeroTile } from './HeroTile';

export function HeroList() {
  return (
    <>
      {VALID_HEROES.map((hero) => (
        <HeroTile key={hero} hero={hero} />
      ))}
    </>
  );
}

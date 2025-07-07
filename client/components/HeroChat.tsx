import { View } from 'react-native';

import { UserInput } from './UserInput';
import { Conversation } from './Conversation';
import { HeroImage } from './HeroImage';
import { ValidHero } from '~/lib/heroes';

export const HeroChat = ({ hero }: { hero: ValidHero }) => {
  return (
    <View className="flex-1">
      <View className="flex-1 w-full h-full overflow-y-auto flex flex-row">
        <HeroImage hero={hero} />
        <View className="flex-1">
          <Conversation />
        </View>
      </View>

      <UserInput />
    </View>
  );
};

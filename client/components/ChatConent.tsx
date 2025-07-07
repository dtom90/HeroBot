import { View } from 'react-native';

import { UserInput } from './UserInput';
import { Conversation } from './Conversation';
import { AnimatedHero } from './AnimatedHero';

export const ChatConent = () => {
  return (
    <View className="flex-1">
      <View className="flex-1 w-full h-full overflow-y-auto flex flex-row">
        <AnimatedHero />
        <Conversation />
      </View>

      <UserInput />
    </View>
  );
};

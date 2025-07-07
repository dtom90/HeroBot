import { View, Text } from 'react-native';
import { Message as MessageType } from '../../shared/types';

export const Message = ({ message }: { message: MessageType }) => {
  const bgColor = message.type === 'user' ? 'bg-blue-500' : 'bg-[#563D13]';
  const margin = message.type === 'user' ? 'ml-16' : 'mr-16';
  
  return (
    <View className={`flex-row mb-4 ${bgColor} ${margin} p-4 rounded-lg`}>
      <Text className="text-white">{message.text}</Text>
    </View>
  );
};

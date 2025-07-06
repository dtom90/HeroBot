import { View, Text } from 'react-native';
import { Message as MessageType } from '../../shared/types';

export const Message = ({ message }: { message: MessageType }) => {
  const bgColor = message.type === 'user' ? 'bg-blue-200' : 'bg-green-200';
  const margin = message.type === 'user' ? 'ml-16' : 'mr-16';
  
  return (
    <View className={`flex-row mb-4 ${bgColor} ${margin} p-4 rounded-lg`}>
      <Text>{message.text}</Text>
    </View>
  );
};

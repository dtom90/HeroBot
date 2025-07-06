import { View, Text, ScrollView } from 'react-native';
import { useConversationStore } from '../store/store';
import { useRef, useEffect } from 'react';

export const Conversation = () => {
  const { messages } = useConversationStore();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <ScrollView ref={scrollViewRef} className="flex-1">
      {messages.map((message, index) => (
        <View key={index} className="flex-row mb-4 bg-gray-300 p-4 rounded-lg">
          <Text>{message}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

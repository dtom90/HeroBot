import { View, Text, ScrollView } from 'react-native';
import { useConversationStore } from '../lib/store';
import { useRef, useEffect } from 'react';
import { Message } from './Message';

export const Conversation = () => {
  const { currentHero, heroStates } = useConversationStore();
  
  // Get the current hero's state, or use empty state if no hero is selected
  const currentHeroState = currentHero ? heroStates[currentHero] : { messages: [], isLoading: false };
  const { messages, isLoading } = currentHeroState;
  
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <ScrollView ref={scrollViewRef} className="flex-1">
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
      {isLoading && (
        <View className="flex-row mb-4 bg-gray-300 p-4 rounded-lg">
          <Text>Loading...</Text>
        </View>
      )}
    </ScrollView>
  );
};

import { create } from 'zustand';
import { Message } from '../../shared/types';

export interface ConversationState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  messages: Message[];
  addMessage: (message: Message) => void;
  upsertStreamingMessage: (text: string) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  messages: [],
  addMessage: (message: Message) => set((state) => ({ messages: [...state.messages, message] })),
  upsertStreamingMessage: (text: string) => set((state) => {
    const lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage && lastMessage.type === 'hero') {
      // Update the last message if it's a hero type
      lastMessage.text += text;
      return {
        messages: [...state.messages.slice(0, -1), lastMessage]
      };
    } else {
      // Add new message if last message is not hero type
      return {
        messages: [...state.messages, { type: 'hero', text }]
      };
    }
  }),
}));

import { create } from 'zustand';
import { Message } from '../../shared/types';

export interface ConversationState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  messages: Message[];
  addMessage: (message: Message) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  messages: [],
  addMessage: (message: Message) => set((state) => ({ messages: [...state.messages, message] })),
}));

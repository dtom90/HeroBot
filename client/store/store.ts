import { create } from 'zustand';

export interface ConversationState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  messages: string[];
  addMessage: (message: string) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
}));

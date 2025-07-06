import { create } from 'zustand';

export interface ConversationState {
  messages: string[];
  addMessage: (message: string) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
}));

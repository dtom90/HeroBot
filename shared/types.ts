export interface Message {
  type: 'user' | 'hero';
  text: string;
  audio?: string;
}

import type { Part } from '@google/generative-ai';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: Part[];
}

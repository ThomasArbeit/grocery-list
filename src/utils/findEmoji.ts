import { emojiMap } from './emojiMap';

export function findEmoji(text: string): string | null {
  const lower = text.toLowerCase();
  for (const { emoji, keywords } of emojiMap) {
    if (keywords.some(keyword => lower.includes(keyword))) {
      return emoji;
    }
  }
  return null;
}

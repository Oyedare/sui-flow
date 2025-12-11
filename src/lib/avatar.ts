export function getAvatarUrl(address: string): string {
  // Using the 'bottts' (Robots) collection from DiceBear v9
  // It's free, public, and requires no API key for basic usage.
  // We use the address as the seed to ensure the same wallet always gets the same robot.
  return `https://api.dicebear.com/9.x/bottts/svg?seed=${address}&backgroundColor=transparent`;
}

/**
 * Converts a unicode emoji character to its hex codepoint string.
 * This format matches the jsDelivr/emoji-datasource-apple filenames.
 * Example: 😭 -> 1f62d
 * Example: 🏳️‍🌈 -> 1f3f3-fe0f-200d-1f308
 */
export declare function toEmojiHex(emoji: string): string;
export declare function isShortcode(text: string): boolean;

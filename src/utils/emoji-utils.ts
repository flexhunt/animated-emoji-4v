/**
 * Converts a unicode emoji character to its hex codepoint string.
 * This format matches the jsDelivr/emoji-datasource-apple filenames.
 * Example: 😭 -> 1f62d
 * Example: 🏳️‍🌈 -> 1f3f3-fe0f-200d-1f308
 */
export function toEmojiHex(emoji: string): string {
    return Array.from(emoji)
        .map(c => c.codePointAt(0)?.toString(16))
        .filter(Boolean)
        .join('-');
}

export function isShortcode(text: string): boolean {
    return /^:[a-zA-Z0-9_+-]+:$/.test(text);
}

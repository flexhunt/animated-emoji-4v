import React from 'react';
import { AnimatedEmoji } from '../components/AnimatedEmoji';
import emojiMapRaw from '../data/emoji-map.json';

const emojiMap = emojiMapRaw as Record<string, string>;

// Escape regex characters
const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Generate regex pattern dynamically
// 1. Match shortcodes: :[a-zA-Z0-9_+-]+:
// 2. Match unicode characters corresponding to map keys
const keys = Object.keys(emojiMap);
// Filter for unicode keys (assuming anything not strictly alphanumeric+special chars used in shortcodes is unicode, 
// or simply anything that doesn't look like a shortcode key? Actually we only need to look for keys that are NOT shortcodes.
// Shortcodes in map DO NOT have colons. 
const unicodeKeys = keys.filter(k => !/^[a-zA-Z0-9_+-]+$/.test(k));
const sortedUnicodeKeys = unicodeKeys.sort((a, b) => b.length - a.length);
const unicodePattern = sortedUnicodeKeys.length > 0 ? sortedUnicodeKeys.map(escapeRegExp).join('|') : '';

// Combined regex: 
// Group 1: Whole match (Shortcode OR Unicode)
// Note: We wrap the whole alternation in a capturing group so split() includes it.
const patternString = unicodePattern
    ? `(:[a-zA-Z0-9_+-]+:|${unicodePattern})`
    : `(:[a-zA-Z0-9_+-]+:)`;

const COMBINED_REGEX = new RegExp(patternString, 'g');

interface EmojiRendererProps {
    text: string;
    size?: number | string;
    className?: string;
}

export const EmojiRenderer: React.FC<EmojiRendererProps> = ({ text, size = 24, className }) => {
    if (!text) return null;

    const parts = text.split(COMBINED_REGEX);

    return (
        <>
            {parts.map((part, index) => {
                // Split results: "text", "match", "text", "match"...
                // Matches are captured.

                // Check if this part is a match
                // 1. Is it a known unicode emoji?
                if (emojiMap[part]) {
                    return (
                        <AnimatedEmoji
                            key={`${part}-${index}`}

                            // We need to adjust AnimatedEmoji or pass the filename explicitly.
                            // CHECK AnimatedEmoji usage below.

                            // Adjusting logic:
                            // We should probably find the 'shortcode' for this unicode if we want to stick to ID.
                            // OR, update AnimatedEmoji to handle direct filenames?
                            // Actually AnimatedEmoji implementation: 
                            // const filename = emojiMap[id as keyof typeof emojiMap];
                            // So if we pass '😂' as id, emojiMap['😂'] = "sob.webp". It works!
                            id={part}
                            size={size}
                            className={className}
                        />
                    );
                }

                // 2. Is it a shortcode :joy: ?
                if (part.startsWith(':') && part.endsWith(':')) {
                    const shortcode = part.slice(1, -1);
                    if (emojiMap[shortcode]) {
                        return (
                            <AnimatedEmoji
                                key={`${shortcode}-${index}`}
                                id={shortcode}
                                size={size}
                                className={className}
                            />
                        );
                    }
                }

                // Otherwise render text
                return <span key={index}>{part}</span>;
            })}
        </>
    );
};

// Also export a functional utility if someone wants raw replacement (though React nodes are better)
export const parseTextToIncludeEmojis = (_text: string) => {
    // This is purely for logic reuse if needed outside a component, but the Component above is preferred.
    // Implementation omitted to keep it lightweight as requested.
    return [];
};

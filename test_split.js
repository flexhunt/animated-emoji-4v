const emojiRegex = require('emoji-regex');

const text = "Hello ❤️ 🦊 🏳️‍🌈 world";

// My current logic
const emojiRegexPattern = emojiRegex().source;
const patternString = `(:[a-zA-Z0-9_+-]+:|${emojiRegexPattern})`;
const COMBINED_REGEX = new RegExp(patternString, 'g');

const parts = text.split(COMBINED_REGEX);

console.log("Parts count:", parts.length);
console.log("Parts preview:", parts.slice(0, 10));

// Check if any part matches an emoji but isn't the whole emoji
parts.forEach((part, i) => {
    if (part && i % 2 !== 0) { // Should be a match
        console.log(`Part ${i}: "${part}"`);
    }
});

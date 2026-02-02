const toHex = (str) => {
    let output = []
    for (let i = 0; i < str.length; i++) {
        let code = str.codePointAt(i)
        if (code) {
            output.push(code.toString(16))
            // Handle surrogate pairs by skipping next char if needed
            if (code > 0xffff) {
                i++
            }
        }
    }
    return output.join("-")
}

const testEmojis = ['❤️', '🦊', '🦀', '🏳️‍🌈', '👨‍👩‍👧‍👦'];
const baseUrl = 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.0/img/apple/64/';

console.log("Testing URL generation with user Logic:");
testEmojis.forEach(emoji => {
    const hex = toHex(emoji);
    const url = `${baseUrl}${hex}.png`;
    console.log(`Emoji: ${emoji} | Hex: ${hex} | URL: ${url}`);
});

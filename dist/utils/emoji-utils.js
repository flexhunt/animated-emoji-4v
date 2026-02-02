// User-provided hex conversion logic (handles surrogate pairs explicitly)
export const toEmojiHex = (str) => {
    let output = [];
    for (let i = 0; i < str.length; i++) {
        let code = str.codePointAt(i);
        if (code) {
            output.push(code.toString(16));
            // Handle surrogate pairs by skipping next char if needed
            if (code > 0xffff) {
                i++;
            }
        }
    }
    return output.join("-");
};
export function isShortcode(text) {
    return /^:[a-zA-Z0-9_+-]+:$/.test(text);
}

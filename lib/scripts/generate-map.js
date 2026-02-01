const fs = require('fs');
const path = require('path');

// Configuration - adjust these paths as needed
const EMOJI_METADATA_PATH = path.resolve(__dirname, '../../emoji.json');
const ANIMATIONS_DIR = path.resolve(__dirname, '../../Telegram-Animated-Emojis-main');
const OUTPUT_PATH = path.resolve(__dirname, '../src/data/emoji-map.json');

console.log(`Reading metadata from: ${EMOJI_METADATA_PATH}`);
console.log(`Scanning animations in: ${ANIMATIONS_DIR}`);

// 1. Read metadata
try {
    const metadataRaw = fs.readFileSync(EMOJI_METADATA_PATH, 'utf8');
    const metadata = JSON.parse(metadataRaw);

    // Create a lookup map: normalized name -> id
    // We want to map: "joy" -> "Face With Tears Of Joy.json"
    // The metadata has: { id: "joy", name: "Face with Tears of Joy", ... }

    // We need to find the files. The files are organized in subfolders in ANIMATIONS_DIR
    // We will scan all files first to build a "filename -> full relative path" map (or just filename if we assume flat URL structure later, but user said "filename_from_map")

    // The user requirement said: "Fetches ... from GitHub Raw URL ... /Animations/{filename_from_map}"
    // The GitHub structure usually mirrors the folders. 
    // Let's first list all files recursively.

    const fileMap = new Map(); // "face with tears of joy" (normalized) -> "Smileys/Face With Tears Of Joy.json" (relative path useful for URL if needed, or just filename)
    // Actually, the prompt says: "Fetches ... /Animations/{filename_from_map}"
    // If the GitHub repo has subfolders (Smileys, Activity, etc.), we need the relative path from Animations root.

    function scanDirectory(dir, relativeDir = '') {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                scanDirectory(fullPath, path.join(relativeDir, item));
            } else if (item.endsWith('.webp') || item.endsWith('.json')) {
                // We found an animation file.
                // NOTE: Local files are .webp, and remote are also .webp.
                const filenameBase = path.basename(item, path.extname(item));
                const remoteFilename = path.join(relativeDir, filenameBase + '.webp').replace(/\\/g, '/'); // Ensure forward slashes for URL

                // Store normalized name for matching
                fileMap.set(filenameBase.toLowerCase(), remoteFilename);
            }
        }
    }

    scanDirectory(ANIMATIONS_DIR);
    console.log(`Found ${fileMap.size} animation files.`);

    // 2. Build the map
    const emojiMap = {};
    let matchCount = 0;
    let missingCount = 0;

    // We can iterate through categories or just a flat list of emojis if available.
    // The structure seems to be: { categories: [...], emojis: { "joy": { id: "joy", name: "Face with Tears of Joy", ... }, ... } }

    // Let's look at "emojis" object keys
    const emojis = metadata.emojis;
    if (!emojis) {
        throw new Error("Metadata file does not have 'emojis' property");
    }

    for (const [shortCode, emojiData] of Object.entries(emojis)) {
        const name = emojiData.name;
        if (!name) continue;

        const normalizedName = name.toLowerCase();

        // Try exact match first
        if (fileMap.has(normalizedName)) {
            emojiMap[shortCode] = fileMap.get(normalizedName);

            // Allow mapping by Unicode character as well (e.g. 😭 -> sob.webp)
            if (emojiData.skins && emojiData.skins.length > 0 && emojiData.skins[0].native) {
                const unicodeChar = emojiData.skins[0].native;
                emojiMap[unicodeChar] = fileMap.get(normalizedName);
            }

            matchCount++;
        } else {
            // Try cleaning up name? (e.g. remove colons)
            // Some emojis might not have animations.
            // console.warn(`No animation found for: ${shortCode} ("${name}")`);
            missingCount++;
        }
    }

    console.log(`Mapped: ${matchCount}`);
    console.log(`Missing/No Animation: ${missingCount}`);

    // 3. Write output
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(emojiMap, null, 2));
    console.log(`Successfully wrote map to: ${OUTPUT_PATH}`);

} catch (err) {
    console.error("Error generating map:", err);
    process.exit(1);
}

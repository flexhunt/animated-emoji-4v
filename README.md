# ✨ Telegram Animated Emojis for React

Hey there! 👋 This library helps you easily add those awesome **Telegram Animated Emojis** to your React apps.

It uses highly optimized WebP files (no heavy Lottie players needed!) so your app stays blazing fast. Plus, we've added some premium touches to make sure it looks great in every state.

## 👀 Preview

Here are some actual examples straight from the library:

<p align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/Face With Tears Of Joy.webp" alt="Joy" width="48" height="48" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/Smiling Face With Hearts.webp" alt="Love" width="48" height="48" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/Face Blowing A Kiss.webp" alt="Kiss" width="48" height="48" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/Face Vomiting.webp" alt="Vomit" width="48" height="48" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/Zany Face.webp" alt="Zany" width="48" height="48" />
</p>

## 🌟 Why use this?

*   **🚀 Super Light:** Uses simple `<img>` tags. No bloated JS bundles.
*   **🍎 Premium Fallback:** If an animation is missing or fails to load, we automatically show the **Apple Emoji** version (via emoji-mart). No more ugly native text fallbacks!
*   **✨ Beautiful Loading:** While the animation loads, you get a **shimmering metallic skeleton** of the emoji shape. Zero layout shift, zero ugly gray blocks.
*   **🦄 Smart Rendering:** Automatically turns normal emojis (like 😭, 😂, 🔥) in your text into animated ones.


---

### 1. Installation

Right now, you can install it directly from GitHub:

```bash
npm install github:flexhunt/animated-emoji-4v
```

### 2. Basic Usage

Using a single emoji is super simple:

```tsx
import { AnimatedEmoji } from 'animated-emoji-4v';

const App = () => (
  <div>
    <h1>
      Hello! <AnimatedEmoji id="wave" size={40} />
    </h1>
  </div>
);
```

### 3. Magic Text Replacer ✨

Want to turn all emojis in a sentence into animated ones? Use the `EmojiRenderer`:

```tsx
import { EmojiRenderer } from 'animated-emoji-4v';

const ChatBubble = () => (
  <div className="chat">
    <EmojiRenderer text="Omg this is fiery! 🔥🚀 :scream:" />
  </div>
);

### 4. Using in HTML (Script Tag) 🌐

You can also use it directly in plain HTML without any build step!

```html
<!-- Import via UNPKG -->
<script src="https://unpkg.com/animated-emoji-4v"></script>

<!-- Use the global variable -->
<script>
  // The library exposes 'AnimatedEmoji' global
  console.log(window.AnimatedEmoji); // Check console
</script>

<!-- Note: For React components in raw HTML, you generally need ReactDOM.render -->
```


---

## 🧩 directory Structure

*   `lib/` - The core library code.
    *   `src/components/AnimatedEmoji.tsx` - The main image component.
    *   `src/utils/EmojiRenderer.tsx` - The parser for converting text to emojis.
    *   `src/data/emoji-map.json` - The database mapping emojis to file paths.
*   `demo/` - A working Vite+React example app showing the library in action.

## 🤝 Contributing
Feel free to fork this repository and submit Pull Requests!

## 📄 License
MIT
"# animated-emoji" 

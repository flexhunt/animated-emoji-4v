# ✨ Telegram Animated Emojis for React

A high-performance, lightweight React library that brings Telegram's famous animated emojis to your web app. 

Unlike other libraries that use heavy JSON Lottie files, this library uses **optimized Animated WebP** format, making it incredibly fast and efficient.

## 🌟 Features

*   **🚀 Ultra Lightweight:** Uses `<img>` tags with WebP assets (fetched from CDN). No heavy Lottie player required.
*   **🦄 Unicode Support:** Automatically converts standard emojis (😭, 😂, 🔥) into animated ones.
*   **⌨️ Shortcode Support:** Supports Slack/Discord style shortcodes (e.g., `:rocket:`, `:tada:`).
*   **⚡ Lazy Loading:** Built-in Intersection Observer ensures emojis only load when visible.
*   **🎨 Customizable:** Easily adjust size and styling via props.

---

## 🛠️ How to Use

Since this is a custom library, the easiest way to use it is to **copy the source code** into your project.

### 1. Installation
You can install this library directly from your GitHub repository:

```bash
npm install github:flexhunt/animated-emoji-4v
```


### 2. Using the Component
Use `AnimatedEmoji` to render a specific emoji by its shortcode.

```tsx
import { AnimatedEmoji } from 'telegram-animated-emojis-react';

const MyComponent = () => (
  <div>
    <h1>Hello World! <AnimatedEmoji id="wave" size={50} /></h1>
  </div>
);
```

### 3. Rendering Text with Emojis
Use `EmojiRenderer` to automatically find and replace emojis in a text string. It supports both **Unicode** and **Shortcodes**.

```tsx
import { EmojiRenderer } from 'telegram-animated-emojis-react';

const ChatMessage = () => (
  <p className="message">
    {/* This will animate the rocket and the crying face! */}
    <EmojiRenderer text="Launching in 3... 2... 1... :rocket: 😭" />
  </p>
);
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

# Emoji-Mart Integration Guide

## What Changed?

We've replaced the native system emoji fallback with **emoji-mart**, which provides beautiful Apple-style emojis from a CDN. No more ugly Windows emojis! 🎉

## Installation Steps

Run this in your project directory:

```bash
npm install
```

This will install the new dependencies:
- `@emoji-mart/data` - Emoji data
- `@emoji-mart/react` - React components  
- `emoji-mart` - Core library

## How It Works Now

### Priority Order:
1. **Telegram Animated Emoji** (if available in emoji-map.json)
2. **emoji-mart Apple-style emoji** (from jsDelivr CDN)
3. **Native emoji character** (last resort with better styling)

### Key Features:
✅ No more native Microsoft emojis - uses Apple emoji set from CDN
✅ Dual-retry logic for hex variants (with/without -fe0f)
✅ Skeleton loading with shimmer animation
✅ Lazy loading with Intersection Observer
✅ Graceful fallback chain

## Example Usage

```tsx
import { AnimatedEmoji } from 'animated-emoji-4v';

// Will show Telegram animated emoji
<AnimatedEmoji id="😂" size={64} />

// Will fallback to emoji-mart Apple emoji
<AnimatedEmoji id="🎯" size={48} />
```

## Testing

Check the demo folder to test different scenarios:
- Emojis with animations
- Emojis without animations (emoji-mart fallback)
- Different emoji variants

## Build & Publish

```bash
npm run build
npm version patch  # or minor/major
npm publish
```

## Notes

- emoji-mart uses Apple emoji sprites from jsDelivr CDN
- Fallback images are 64x64 PNG format
- Works in all modern browsers
- SSR compatible

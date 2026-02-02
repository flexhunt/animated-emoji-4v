import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import emojiMapRaw from '../data/emoji-map.json';
import { toEmojiHex } from '../utils/emoji-utils';
const emojiMap = emojiMapRaw;
const BASE_URL = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main';
export const AnimatedEmoji = ({ id, size = 50, className }) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);
    // Intersection Observer for Lazy Loading
    useEffect(() => {
        if (!containerRef.current)
            return;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setIsVisible(true);
                observer.disconnect(); // Only load once
            }
        }, { threshold: 0.1 });
        observer.observe(containerRef.current);
        return () => {
            observer.disconnect();
        };
    }, []);
    // --------------------------------------------------------
    // RENDER LOGIC
    // --------------------------------------------------------
    // 1. If it's a known animated emoji
    if (emojiMap[id]) {
        const filename = emojiMap[id];
        const url = `${BASE_URL}/${filename}`;
        return (_jsx("div", { ref: containerRef, className: className, style: { width: size, height: size, display: 'inline-block', verticalAlign: 'middle', lineHeight: 0 }, children: isVisible ? (_jsx("img", { src: url, alt: id, width: "100%", height: "100%", style: { width: '100%', height: '100%', objectFit: 'contain' }, loading: "lazy" })) : (_jsx("div", { style: { width: '100%', height: '100%' } })) }));
    }
    // 2. Fallback: If it's NOT in the map, but it IS a unicode character (not a shortcode)
    // We render the iOS version from CDN.
    // Note: 'id' here might be the raw unicode char if passed from EmojiRenderer.
    const isRawEmoji = !id.startsWith(':');
    if (isRawEmoji) {
        const hex = toEmojiHex(id);
        const fallbackUrl = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${hex}.png`;
        return (_jsx("div", { ref: containerRef, className: className, style: { width: size, height: size, display: 'inline-block', verticalAlign: 'middle', lineHeight: 0 }, children: isVisible ? (_jsx("img", { src: fallbackUrl, alt: id, width: "100%", height: "100%", style: { width: '100%', height: '100%', objectFit: 'contain' }, loading: "lazy", onError: (e) => {
                    // If even fallback fails, hide image and show native char
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement.innerText = id;
                } })) : _jsx("div", { style: { width: '100%', height: '100%' } }) }));
    }
    // 3. Unknown shortcode
    return _jsxs("span", { title: `Unknown emoji: ${id}`, children: [":", id, ":"] });
};

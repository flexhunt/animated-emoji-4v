import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import emojiMapRaw from '../data/emoji-map.json';
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
    if (!emojiMap[id]) {
        return _jsxs("span", { title: `Unknown emoji: ${id}`, children: [":", id, ":"] });
    }
    const filename = emojiMap[id];
    const url = `${BASE_URL}/${filename}`;
    return (_jsx("div", { ref: containerRef, className: className, style: { width: size, height: size, display: 'inline-block', verticalAlign: 'middle', lineHeight: 0 }, children: isVisible ? (_jsx("img", { src: url, alt: id, width: "100%", height: "100%", style: { width: '100%', height: '100%', objectFit: 'contain' }, loading: "lazy" })) : (_jsx("div", { style: { width: '100%', height: '100%' } })) }));
};

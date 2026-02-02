import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import emojiMapRaw from '../data/emoji-map.json';
import { toEmojiHex } from '../utils/emoji-utils';
const emojiMap = emojiMapRaw;
const BASE_URL = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main';
export const AnimatedEmoji = ({ id, size = 50, className }) => {
    const [isLoaded, setIsLoaded] = useState(false);
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
    // Inject keyframes strictly on client side
    useEffect(() => {
        if (typeof document !== 'undefined' && !document.getElementById('telegram-emoji-shimmer')) {
            const style = document.createElement('style');
            style.id = 'telegram-emoji-shimmer';
            style.textContent = `
                @keyframes telegramEmojiShimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .emoji-skeleton::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
                    animation: telegramEmojiShimmer 1.5s infinite;
                }
            `;
            document.head.appendChild(style);
        }
    }, []);
    const skeletonStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#e0e0e0',
        borderRadius: '8px',
        opacity: isVisible && !isLoaded ? 1 : 0,
        transition: 'opacity 0.2s ease-out',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0
    };
    const imgStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.2s ease-in',
        position: 'relative',
        zIndex: 1
    };
    // 1. Fallback / Raw Emoji
    if (!emojiMap[id]) {
        const hex = toEmojiHex(id);
        const appleUrl = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.0/img/apple/64/${hex}.png`;
        return (_jsxs("div", { ref: containerRef, className: `emoji-skeleton ${className || ''}`, style: { width: size, height: size, display: 'inline-block', verticalAlign: 'middle', lineHeight: 0, position: 'relative' }, children: [_jsx("div", { style: skeletonStyle }), isVisible && (_jsx("img", { src: appleUrl, alt: id, style: imgStyle, loading: "lazy", onLoad: () => setIsLoaded(true), onError: (e) => {
                        // If fallback fails, just show text, hide image container specific tweaks
                        e.currentTarget.style.display = 'none';
                        setIsLoaded(true); // Stop skeleton
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                            parent.innerText = id;
                            parent.style.lineHeight = 'normal';
                            parent.style.fontSize = typeof size === 'number' ? `${size}px` : size;
                        }
                    } }))] }));
    }
    // 2. Animated Emoji
    const filename = emojiMap[id];
    const url = `${BASE_URL}/${filename}`;
    return (_jsxs("div", { ref: containerRef, className: `emoji-skeleton ${className || ''}`, style: { width: size, height: size, display: 'inline-block', verticalAlign: 'middle', lineHeight: 0, position: 'relative' }, children: [_jsx("div", { style: skeletonStyle }), isVisible && (_jsx("img", { src: url, alt: id, style: imgStyle, loading: "lazy", onLoad: () => setIsLoaded(true) }))] }));
};

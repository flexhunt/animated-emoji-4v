import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import * as emojiMartData from '@emoji-mart/data';
import { init } from 'emoji-mart';
import emojiMapRaw from '../data/emoji-map.json';
import { toEmojiHex } from '../utils/emoji-utils';
const emojiMap = emojiMapRaw;
const BASE_URL = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main';
// Initialize emoji-mart with handle for potential default export in CJS
const dataObj = emojiMartData.default || emojiMartData;
init({ data: dataObj });
export const AnimatedEmoji = ({ id, size = 50, className }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [fallbackSrc, setFallbackSrc] = useState(null);
    const containerRef = useRef(null);
    // Intersection Observer for Lazy Loading
    useEffect(() => {
        if (!containerRef.current)
            return;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
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
    // Get emoji-mart URL for fallback
    const getEmojiMartUrl = async (emojiChar) => {
        try {
            const hex = toEmojiHex(emojiChar);
            // emoji-mart uses Apple emoji set by default from jsDelivr CDN
            return `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/${hex}.png`;
        }
        catch (error) {
            console.error('Error getting emoji-mart URL:', error);
            return null;
        }
    };
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
    // Load emoji-mart fallback URL when needed
    useEffect(() => {
        if (!emojiMap[id] && isVisible) {
            getEmojiMartUrl(id).then(url => {
                if (url)
                    setFallbackSrc(url);
            });
        }
    }, [id, isVisible]);
    // 1. Fallback to emoji-mart Apple emoji component (instead of native emoji)
    if (!emojiMap[id]) {
        return (_jsxs("div", { ref: containerRef, className: `emoji-skeleton ${className || ''}`, style: {
                width: size,
                height: size,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                verticalAlign: 'middle',
                lineHeight: 0,
                position: 'relative'
            }, children: [_jsx("div", { style: skeletonStyle }), isVisible && (_jsx("em-emoji", { native: id, set: "apple", size: typeof size === 'number' ? `${size}px` : size, style: {
                        opacity: isLoaded ? 1 : 0,
                        transition: 'opacity 0.2s ease-in'
                    }, 
                    // @ts-ignore - em-emoji is a web component
                    ref: (el) => {
                        if (el && !isLoaded) {
                            // Check when the emoji-mart component has rendered
                            const checkLoaded = () => {
                                if (el.shadowRoot?.querySelector('span') || el.querySelector('span')) {
                                    setIsLoaded(true);
                                }
                                else {
                                    requestAnimationFrame(checkLoaded);
                                }
                            };
                            requestAnimationFrame(checkLoaded);
                        }
                    } }))] }));
    }
    // 2. Animated Emoji from Telegram
    const filename = emojiMap[id];
    const url = `${BASE_URL}/${filename}`;
    return (_jsxs("div", { ref: containerRef, className: `emoji-skeleton ${className || ''}`, style: {
            width: size,
            height: size,
            display: 'inline-block',
            verticalAlign: 'middle',
            lineHeight: 0,
            position: 'relative'
        }, children: [_jsx("div", { style: skeletonStyle }), isVisible && (_jsx("img", { src: url, alt: id, style: imgStyle, loading: "lazy", onLoad: () => setIsLoaded(true), onError: () => {
                    console.error(`Animated emoji failed to load: ${url}`);
                    // Fallback to emoji-mart if animated version fails
                    getEmojiMartUrl(id).then(fallbackUrl => {
                        if (fallbackUrl) {
                            setFallbackSrc(fallbackUrl);
                        }
                    });
                } }))] }));
};

import React, { useEffect, useState, useRef } from 'react';
import emojiMapRaw from '../data/emoji-map.json';
import { toEmojiHex } from '../utils/emoji-utils';

const emojiMap = emojiMapRaw as Record<string, string>;

interface AnimatedEmojiProps {
    id: string; // The shortcode, e.g., "joy", "fire"
    size?: number | string;
    className?: string; // Additional classes
    loop?: boolean; // Kept for API compatibility, unused for WebP
}

const BASE_URL = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main';

export const AnimatedEmoji: React.FC<AnimatedEmojiProps> = ({
    id,
    size = 50,
    className
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for Lazy Loading
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Only load once
                }
            },
            { threshold: 0.1 }
        );

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

    const skeletonStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#e0e0e0', // Slightly darker base
        borderRadius: '8px', // Softer corners
        opacity: isVisible && !isLoaded ? 1 : 0,
        transition: 'opacity 0.2s ease-out',
        pointerEvents: 'none',
        overflow: 'hidden', // Contain shimmer
        zIndex: 0
    };

    const imgStyle: React.CSSProperties = {
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
        // Try a more modern version of the datasource
        const [currentUrl, setCurrentUrl] = useState(`https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.1/img/apple/64/${hex}.png`);
        const [hasRetried, setHasRetried] = useState(false);

        return (
            <div
                ref={containerRef}
                className={`emoji-skeleton ${className || ''}`}
                style={{ width: size, height: size, display: 'inline-block', verticalAlign: 'middle', lineHeight: 0, position: 'relative' }}
            >
                <div style={skeletonStyle} />

                {isVisible && (
                    <img
                        src={currentUrl}
                        alt={id}
                        style={imgStyle}
                        loading="lazy"
                        onLoad={() => setIsLoaded(true)}
                        onError={(e) => {
                            // If it failed and we haven't retried without fe0f, try that
                            if (!hasRetried && hex.includes('fe0f')) {
                                const minimalHex = hex.replace(/-fe0f/g, '');
                                console.log(`Retrying minimalist hex for ${id}: ${minimalHex}`);
                                setHasRetried(true);
                                setCurrentUrl(`https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.1/img/apple/64/${minimalHex}.png`);
                                return;
                            }

                            // Debug logging as requested
                            console.error(`Final fallback failed for id: "${id}" at ${currentUrl}`);

                            // Total failure: show native character
                            e.currentTarget.style.display = 'none';
                            setIsLoaded(true); // Stop skeleton
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                                parent.innerText = id;
                                parent.style.lineHeight = '1';
                                parent.style.fontSize = typeof size === 'number' ? `${size}px` : size;
                                parent.style.display = 'inline-block';
                                parent.style.verticalAlign = 'middle';
                            }
                        }}
                    />
                )}
            </div>
        );
    }

    // 2. Animated Emoji
    const filename = emojiMap[id];
    const url = `${BASE_URL}/${filename}`;

    return (
        <div
            ref={containerRef}
            className={`emoji-skeleton ${className || ''}`}
            style={{ width: size, height: size, display: 'inline-block', verticalAlign: 'middle', lineHeight: 0, position: 'relative' }}
        >
            <div style={skeletonStyle} />

            {isVisible && (
                <img
                    src={url}
                    alt={id}
                    style={imgStyle}
                    loading="lazy"
                    onLoad={() => setIsLoaded(true)}
                />
            )}
        </div>
    );
};

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

    // --------------------------------------------------------
    // STYLES
    // --------------------------------------------------------
    // --------------------------------------------------------
    // STYLES & ANIMATION
    // --------------------------------------------------------
    // Inject keyframes for shimmer effect
    useEffect(() => {
        if (typeof document === 'undefined') return;
        const styleId = 'animated-emoji-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                @keyframes telegramEmojiShimmer {
                    0% { background-position: -200px 0; }
                    100% { background-position: calc(200px + 100%) 0; }
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
        backgroundColor: '#f6f7f8',
        backgroundImage: 'linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '200% 100%', // Larger than container for movement
        animation: 'telegramEmojiShimmer 1.5s infinite linear',
        borderRadius: '5px',
        opacity: isVisible && !isLoaded ? 1 : 0,
        transition: 'opacity 0.2s ease-out',
        pointerEvents: 'none',
        zIndex: 0 // Behind image
    };

    const imgStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.2s ease-in',
        position: 'relative', // Ensure Z-index works if needed
        zIndex: 1
    };

    // --------------------------------------------------------
    // RENDER LOGIC
    // --------------------------------------------------------

    // 1. If it's a known animated emoji
    if (emojiMap[id]) {
        const filename = emojiMap[id];
        const url = `${BASE_URL}/${filename}`;

        return (
            <div
                ref={containerRef}
                className={className}
                style={{ width: size, height: size, display: 'inline-block', verticalAlign: 'middle', lineHeight: 0, position: 'relative' }}
            >
                {/* Skeleton Overlay */}
                <div style={skeletonStyle} />

                {isVisible && (
                    <img
                        src={url}
                        alt={id}
                        width="100%"
                        height="100%"
                        style={imgStyle}
                        loading="lazy"
                        onLoad={() => setIsLoaded(true)}
                    />
                )}
            </div>
        );
    }

    // 2. Fallback: If it's NOT in the map, but it IS a unicode character (not a shortcode)
    // We render the iOS version from CDN.
    // Note: 'id' here might be the raw unicode char if passed from EmojiRenderer.
    const isRawEmoji = !id.startsWith(':');

    if (isRawEmoji) {
        const hex = toEmojiHex(id);
        const fallbackUrl = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${hex}.png`;

        return (
            <div
                ref={containerRef}
                className={className}
                style={{ width: size, height: size, display: 'inline-block', verticalAlign: 'middle', lineHeight: 0, position: 'relative' }}
            >
                {/* Skeleton Overlay */}
                <div style={skeletonStyle} />

                {isVisible && (
                    <img
                        src={fallbackUrl}
                        alt={id}
                        width="100%"
                        height="100%"
                        style={imgStyle}
                        loading="lazy"
                        onLoad={() => setIsLoaded(true)}
                        onError={(e) => {
                            // If even fallback fails, hide image and show native char
                            e.currentTarget.style.display = 'none';
                            setIsLoaded(true); // Hide skeleton so we see text
                            e.currentTarget.parentElement!.innerText = id;
                        }}
                    />
                )}
            </div>
        );
    }

    // 3. Unknown shortcode
    return <span title={`Unknown emoji: ${id}`}>:{id}:</span>;
};

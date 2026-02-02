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
    const skeletonStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#E0E0E0',
        borderRadius: '5px',
        opacity: isVisible && !isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
        pointerEvents: 'none',
    };

    const imgStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in',
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

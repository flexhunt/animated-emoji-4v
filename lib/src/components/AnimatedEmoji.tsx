import React, { useEffect, useState, useRef } from 'react';
import emojiMapRaw from '../data/emoji-map.json';

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

    if (!emojiMap[id]) {
        return <span title={`Unknown emoji: ${id}`}>:{id}:</span>;
    }

    const filename = emojiMap[id];
    const url = `${BASE_URL}/${filename}`;

    return (
        <div
            ref={containerRef}
            className={className}
            style={{ width: size, height: size, display: 'inline-block', verticalAlign: 'middle', lineHeight: 0 }}
        >
            {isVisible ? (
                <img
                    src={url}
                    alt={id}
                    width="100%"
                    height="100%"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    loading="lazy"
                />
            ) : (
                <div style={{ width: '100%', height: '100%' }} />
            )}
        </div>
    );
};

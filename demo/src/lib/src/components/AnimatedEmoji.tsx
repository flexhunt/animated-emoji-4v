import React, { useEffect, useState, useRef } from 'react';
import * as emojiMartData from '@emoji-mart/data';
import { init } from 'emoji-mart';
import emojiMapRaw from '../data/emoji-map.json';

const emojiMap = emojiMapRaw as Record<string, string>;

interface AnimatedEmojiProps {
    id: string; // The shortcode, e.g., "joy", "fire" or the emoji character itself
    size?: number | string;
    className?: string;
    loop?: boolean; // Kept for API compatibility, unused for WebP
}

const BASE_URL = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main';

// Initialize emoji-mart with handle for potential default export in CJS
const dataObj = (emojiMartData as any).default || emojiMartData;
init({ data: dataObj });

export const AnimatedEmoji: React.FC<AnimatedEmojiProps> = ({
    id,
    size = 50,
    className
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [hasError, setHasError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for Lazy Loading
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
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
        if (typeof document !== 'undefined' && !document.getElementById('emoji-text-shimmer')) {
            const style = document.createElement('style');
            style.id = 'emoji-text-shimmer';
            style.textContent = `
                @keyframes emojiTextShimmer {
                    0% { background-position: 200% center; }
                    100% { background-position: -200% center; }
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    // Native emoji placeholder style (shows emoji shape with shimmer)
    const placeholderStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: typeof size === 'number' ? `${size * 0.85}px` : size,
        opacity: isVisible && !isLoaded ? 1 : 0,
        transition: 'opacity 0.2s ease-out',
        pointerEvents: 'none',
        zIndex: 0,
        // Text shimmer effect
        background: 'linear-gradient(90deg, #777 0%, #ffffff 50%, #777 100%)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent', // Fallback
        animation: 'emojiTextShimmer 2.5s linear infinite',
        filter: 'grayscale(100%) brightness(1.2)'
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

    // DEBUG: Log emoji lookup
    const isInMap = !!emojiMap[id];
    console.log(`[AnimatedEmoji] id="${id}" | inMap=${isInMap} | isVisible=${isVisible}`);

    // If not in map OR if we encountered an error loading the animated version, use fallback
    if (!emojiMap[id] || hasError) {
        if (hasError) console.log(`[AnimatedEmoji FALLBACK] Error loading animated, using em-emoji for "${id}"`);
        else console.log(`[AnimatedEmoji FALLBACK] Not in map, using em-emoji for "${id}"`);

        return (
            <div
                ref={containerRef}
                className={className}
                style={{
                    width: size,
                    height: size,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    verticalAlign: 'middle',
                    lineHeight: 0,
                    position: 'relative'
                }}
            >
                <div style={placeholderStyle}>{id}</div>

                {isVisible && (
                    <em-emoji
                        native={id}
                        set="apple"
                        size={typeof size === 'number' ? `${size}px` : size}
                        style={{
                            opacity: isLoaded ? 1 : 0,
                            transition: 'opacity 0.2s ease-in'
                        }}
                        // @ts-ignore - em-emoji is a web component
                        ref={(el: HTMLElement | null) => {
                            if (el && !isLoaded) {
                                // Check when the emoji-mart component has rendered
                                const checkLoaded = () => {
                                    if (el.shadowRoot?.querySelector('span') || el.querySelector('span')) {
                                        setIsLoaded(true);
                                    } else {
                                        requestAnimationFrame(checkLoaded);
                                    }
                                };
                                requestAnimationFrame(checkLoaded);
                            }
                        }}
                    />
                )}
            </div>
        );
    }

    // 2. Animated Emoji from Telegram
    const filename = emojiMap[id];
    const url = `${BASE_URL}/${filename}`;

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                width: size,
                height: size,
                display: 'inline-block',
                verticalAlign: 'middle',
                lineHeight: 0,
                position: 'relative'
            }}
        >
            <div style={placeholderStyle}>{id}</div>

            {isVisible && (
                <img
                    src={url}
                    alt={id}
                    style={imgStyle}
                    loading="lazy"
                    onLoad={() => setIsLoaded(true)}
                    onError={() => {
                        console.error(`Animated emoji failed to load: ${url}`);
                        setHasError(true);
                        setIsLoaded(false); // Reset loaded state for fallback
                    }}
                />
            )}
        </div>
    );
};

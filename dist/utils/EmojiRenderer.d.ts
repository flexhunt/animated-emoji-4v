import React from 'react';
interface EmojiRendererProps {
    text: string;
    size?: number | string;
    className?: string;
}
export declare const EmojiRenderer: React.FC<EmojiRendererProps>;
export declare const parseTextToIncludeEmojis: (_text: string) => never[];
export {};

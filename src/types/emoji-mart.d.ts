// TypeScript declarations for emoji-mart web components
declare namespace JSX {
    interface IntrinsicElements {
        'em-emoji': React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement> & {
                id?: string;
                shortcodes?: string;
                native?: string;
                size?: string;
                fallback?: string;
                set?: 'native' | 'apple' | 'facebook' | 'google' | 'twitter';
                skin?: string;
            },
            HTMLElement
        >;
    }
}

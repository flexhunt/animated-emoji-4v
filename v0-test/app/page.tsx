'use client';

import { AnimatedEmoji, EmojiRenderer } from 'animated-emoji-4v';

export default function Home() {
    return (
        <main style={{ padding: '50px', fontFamily: 'sans-serif', textAlign: 'center' }}>
            <h1>v0 Verification Test 🧪</h1>

            <div style={{ margin: '40px 0', border: '1px solid #ddd', padding: '20px', borderRadius: '12px' }}>
                <h3>1. Direct Components</h3>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', fontSize: '24px' }}>
                    <AnimatedEmoji id="rocket" size={60} />
                    <AnimatedEmoji id="fire" size={60} />
                    <AnimatedEmoji id="joy" size={60} />
                </div>
            </div>

            <div style={{ margin: '40px 0', border: '1px solid #ddd', padding: '20px', borderRadius: '12px' }}>
                <h3>2. Text Renderer</h3>
                <p style={{ fontSize: '18px' }}>
                    <EmojiRenderer text="This text has hidden powers! 🦄 ✨ :tada:" />
                </p>
            </div>
        </main>
    );
}

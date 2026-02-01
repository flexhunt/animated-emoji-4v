'use client'

import { useState } from 'react'
import { AnimatedEmoji } from '../lib/src/components/AnimatedEmoji'
import { EmojiRenderer } from '../lib/src/utils/EmojiRenderer'

export default function Page() {
  const [input, setInput] = useState("Hello :joy: world! :rocket: 😭")

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Telegram Animated Emojis Demo</h1>

      <div style={{ marginBottom: 40, padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
        <h2>Core Component</h2>
        <p>Direct usage of <code>&lt;AnimatedEmoji /&gt;</code></p>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div>
            <AnimatedEmoji id="joy" size={60} />
            <p>:joy:</p>
          </div>
          <div>
            <AnimatedEmoji id="rocket" size={60} />
            <p>:rocket:</p>
          </div>
          <div>
            <AnimatedEmoji id="heart" size={60} />
            <p>:heart:</p>
          </div>
          <div>
            <AnimatedEmoji id="unknown_emoji_xyz" size={60} />
            <p>Invalid</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 40, padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
        <h2>Parser Utility</h2>
        <p>Type below to see emojis render automatically!</p>
        <p>Try: <code>:fire: :100: :ghost: :cat:</code></p>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: '100%', padding: 10, fontSize: 16, marginBottom: 20 }}
        />

        <div style={{ fontSize: 24, minHeight: 40 }}>
          <EmojiRenderer text={input} size={40} />
        </div>
      </div>

      <div style={{ height: '150vh', background: '#f5f5f5', padding: 20, textAlign: 'center' }}>
        <h2>Scroll down for lazy load test...</h2>
        <div style={{ marginTop: '100vh' }}>
          <AnimatedEmoji id="alien" size={100} />
          <p>I just loaded!</p>
        </div>
      </div>
    </div>
  )
}

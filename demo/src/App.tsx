import { EmojiRenderer } from './lib/src'
import './App.css'

// Comprehensive emoji list organized by category
const EMOJI_CATEGORIES = {
  Smileys: ['😀', '😁', '😂', '😃', '😄', '😅', '😆', '😇', '😉', '😊', '😌', '😍', '😘', '😗', '😚', '😙', '🙂', '🤗', '🤩', '🤔'],
  Hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
  Hands: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👍', '👎', '👊', '👏', '🙌', '👐'],
  Animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒'],
  Food: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', '🍍', '🥥', '🥑', '🍅', '🍆', '🥒', '🥬', '🌽', '🌶️', '🍕', '🍔'],
  Travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '✈️', '🛫', '🛬', '🚁', '🛶', '⛵', '🚤', '🛳️', '⛴️', '🛥️'],
  Objects: ['💻', '⌨️', '🖱️', '🖨️', '🖥️', '📱', '📲', '💽', '💾', '💿', '🎮', '🎯', '🎲', '🎳', '🎪', '🎨', '🎭', '🎬', '🎤', '🎧'],
  Nature: ['🌍', '🌎', '🌏', '⭐', '🌟', '✨', '⚡', '☄️', '💥', '🔥', '🌪️', '🌈', '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️']
}

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="py-12 px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Animated Emojis Gallery
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore a delightful collection of beautifully animated emojis
          </p>
        </div>

        {/* Emoji Grid */}
        <div className="max-w-7xl mx-auto">
          {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
            <div key={category} className="mb-16">
              <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b-2 border-accent">
                {category}
              </h2>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {emojis.map((emoji, idx) => (
                  <div
                    key={`${category}-${idx}`}
                    className="flex items-center justify-center p-4 rounded-lg bg-card hover:bg-accent/10 transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105"
                  >
                    {/* Directly render the renderer with the unicode emoji */}
                    <div className="text-5xl inline-block h-[50px] w-[50px] flex items-center justify-center">
                      <EmojiRenderer text={emoji} size={48} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'

const chips = ['🍳 Recipe Generator', '🎯 Meal Decider', '🌏 10+ Cuisines']

const features = [
  {
    icon: '🍽️',
    title: 'What Should I Eat?',
    desc: 'Not sure what to eat? Tell us your mood, craving, or cuisine preference — our AI will decide for you.',
    tag: 'Mood-based decisions',
    accent: false,
  },
  {
    icon: '👨‍🍳',
    title: 'What Should I Cook?',
    desc: 'List your ingredients and available time — get a full AI-generated recipe tailored to your kitchen.',
    tag: 'Ingredient-based recipes',
    accent: true,
  },
]

const cuisines = ['Italian', 'Thai', 'Mexican', 'Japanese', 'Indian', 'Korean', 'Mediterranean', 'French', 'Vietnamese', 'American']

export default function Home() {
  return (
    <main className="page-container">
      <div className="page-glow" />
      <div className="dot-pattern" />

      <nav className="site-nav">
        <span className="brand">
          Kudo<span className="brand-accent">X</span>
        </span>
        <div className="status-chip">
          <span className="pulse-dot" />
          AI Powered
        </div>
      </nav>

      <div className="fade-up-1 ticket-tag">✦ Powered by Gemini</div>

      <h1 className="fade-up-2 hero-title">
        Kudo<span className="brand-accent">X</span>
      </h1>

      <p className="fade-up-3 hero-lede">
        An AI-powered eating decision &amp; cooking assistant.
      </p>
      <p className="fade-up-3 hero-sub">
        Tell us what you have. We&apos;ll tell you what to make.
      </p>

      <div className="fade-up-4 chip-row">
        {chips.map((c) => (
          <span key={c} className="chip">
            {c}
          </span>
        ))}
      </div>

      <div className="fade-up-5 cta-wrap">
        <Link href="/decide" className="cta-btn">
          Decide Your Next Meal
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="fade-up-5 ticker-wrap">
        <div className="ticker-track">
          {[...cuisines, ...cuisines].map((c, i) => (
            <span key={i} className="ticker-item">
              {c}
              <span className="ticker-dot">•</span>
            </span>
          ))}
        </div>
      </div>

      <div className="fade-up-5 overview-kicker">
        <span className="kicker-line" />
        <span className="kicker-box">
          <span className="kicker-dot" />
          Two ways to start
        </span>
        <span className="kicker-line" />
      </div>

      <section className="fade-up-5 section">
        <div className="feature-grid">
          {features.map((card) => (
            <div
              key={card.title}
              className={`feature-card${card.accent ? ' feature-card--accent' : ''}`}
            >
              <div className="feature-icon">{card.icon}</div>
              <h3 className="feature-title">{card.title}</h3>
              <p className="feature-desc">{card.desc}</p>
              <span className="feature-badge">{card.tag}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center py-6 text-sm" style={{ color: "#4a7060" }}>
        © 2026 KudoX. All rights reserved.
      </footer>

    </main>
  )
}

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen min-w-[360px] flex flex-col items-center relative overflow-hidden"
      style={{ padding: '0 64px 120px 64px' }}>

      {/* Background glow */}
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(200,241,53,0.07) 0%, transparent 70%)' }} />

      {/* Nav */}
      <nav className="w-full max-w-4xl flex items-center justify-between relative z-10"
        style={{ paddingTop: '36px', paddingBottom: '36px' }}>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif' }} className="text-xl font-bold tracking-tight">
          Kudo<span style={{ color: 'var(--accent)' }}>X</span>
        </span>
        <div className="flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full border"
          style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--accent)' }} />
          AI Powered
        </div>
      </nav>

      {/* Tag */}
      <div className="fade-up-1 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border relative z-10"
        style={{
          color: 'var(--accent)',
          background: 'rgba(200,241,53,0.08)',
          borderColor: 'rgba(200,241,53,0.2)',
          marginBottom: '40px',
          marginTop: '20px',
        }}>
        ✦ Powered by Gemini <p> </p>
      </div>

      {/* Heading */}
      <h1 className="fade-up-2 font-bold leading-none relative z-10"
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(4rem, 14vw, 9rem)',
          letterSpacing: '-0.05em',
          marginBottom: '40px',
          textAlign: 'center',
        }}>
        Kudo<span style={{ color: 'var(--accent)' }}>X</span>
      </h1>

      {/* Subheading */}
      <p className="fade-up-3 text-lg md:text-xl leading-relaxed relative z-10"
        style={{ textAlign: 'center', maxWidth: '600px', marginBottom: '16px' }}>
        An AI-powered eating decision &amp; cooking assistant.
      </p>
      <p className="fade-up-3 relative z-10"
        style={{ color: 'var(--text-secondary)', fontSize: '1rem', textAlign: 'center', marginBottom: '40px' }}>
        Tell us what you have. We&apos;ll tell you what to make.
      </p>

      {/* Pills */}
      <div className="fade-up-4 flex flex-wrap gap-2 justify-center relative z-10"
        style={{ marginBottom: '48px', maxWidth: '600px' }}>
        {['🍳 Recipe Generator', '🎯 Meal Decider', '🌏 10+ Cuisines', '⚡ Instant AI'].map(p => (
          <span key={p} className="text-xs font-medium px-4 py-2 rounded-full border"
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            {p}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="fade-up-5 relative z-10" style={{ marginBottom: '80px', maxWidth: '900px', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Link
          href="/decide"
          className="inline-flex items-center gap-3 font-bold text-base rounded-full transition-all duration-200 hover:-translate-y-0.5"
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            background: 'var(--accent)',
            color: '#0D0D0C',
            boxShadow: '0 0 40px rgba(200,241,53,0.25)',

            padding: '14px 28px',
            lineHeight: 1,
          }}
        >
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
            style={{ flexShrink: 0 }}
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <section className="fade-up-5 relative z-10 w-full"
        style={{ maxWidth: '900px', marginBottom: '80px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '24px' }}>
          {[
            {
              icon: '🍽️',
              title: 'What Should I Eat?',
              desc: "Not sure what to eat? Tell us your mood, craving, or cuisine preference — our AI will decide for you.",
              tag: 'Mood-based decisions',
              accent: false,
            },
            {
              icon: '👨‍🍳',
              title: 'What Should I Cook?',
              desc: "List your ingredients and available time — get a full AI-generated recipe tailored to your kitchen.",
              tag: 'Ingredient-based recipes',
              accent: true,
            }
          ].map(card => (
            <div key={card.title}
              className="flex flex-col rounded-2xl border transition-all duration-200 hover:-translate-y-1"
              style={{
                background: card.accent ? 'rgba(200,241,53,0.04)' : 'var(--bg-card)',
                borderColor: card.accent ? 'rgba(200,241,53,0.25)' : 'var(--border)',
                padding: '48px',
              }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '24px' }}>{card.icon}</div>
              <h3 className="font-semibold" style={{
                fontFamily: 'Space Grotesk, sans-serif',
                letterSpacing: '-0.02em',
                fontSize: '1.2rem',
                marginBottom: '16px',
              }}>
                {card.title}
              </h3>
              <p className="leading-relaxed" style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                marginBottom: '28px',
                flex: 1,
              }}>
                {card.desc}
              </p>
              <span className="self-start text-xs font-medium px-3 py-1 rounded-full border"
                style={{
                  color: 'var(--accent)',
                  background: 'rgba(200,241,53,0.08)',
                  borderColor: 'rgba(200,241,53,0.15)',
                }}>
                {card.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 text-xs" style={{ color: 'var(--text-muted)' }}>
        Decide your daily meal.
      </footer>
    </main>
  )
}
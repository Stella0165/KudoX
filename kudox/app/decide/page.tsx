import Link from "next/link";

type PathCard = {
  href: string;
  icon: string;
  title: string;
  desc: string;
  tag: string;
  accent: boolean;
};

const PATHS: PathCard[] = [
  {
    href: "/cook",
    icon: "👨‍🍳",
    title: "I want to cook",
    desc: "Tell us what ingredients you have and how much time you've got and we'll build a recipe around it.",
    tag: "Ingredient-based",
    accent: true,
  },
  {
    href: "/order",
    icon: "🍽️",
    title: "I want to decide what to eat",
    desc: "Not cooking? Tell us your mood or cuisine craving and we'll suggest something to order or eat out.",
    tag: "Mood-based",
    accent: false,
  },
];

export default function DecidePage() {
  return (
    <main className="min-h-screen min-w-[360px] flex flex-col items-center relative overflow-hidden" style={{ padding: "0 64px 120px 64px" }}>
      <div
        className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(200,241,53,0.07) 0%, transparent 70%)" }}
      />

      <nav className="w-full max-w-4xl flex items-center justify-between relative z-10" style={{ paddingTop: "36px", paddingBottom: "36px" }}>
        <Link href="/" style={{ fontFamily: "var(--font-space-grotesk)" }} className="text-xl font-bold tracking-tight">
          Kudo<span style={{ color: "var(--accent)" }}>X</span>
        </Link>
        <div
          className="flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full border"
          style={{ color: "var(--text-secondary)", background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "var(--accent)" }} />
          AI Powered
        </div>
      </nav>

      <div className="fade-up-1 relative z-10 text-center" style={{ marginTop: "40px", marginBottom: "64px" }}>
        <h1
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: "clamp(2.25rem, 6vw, 3.75rem)",
            letterSpacing: "-0.03em",
            marginBottom: "16px",
          }}
          className="font-bold"
        >
          What&apos;s the plan today?
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>
          Pick a path and we&apos;ll handle the rest.
        </p>
      </div>

      <section className="relative z-10 w-full" style={{ maxWidth: "900px" }}>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "24px" }}>
          {PATHS.map((card, i) => (
            <Link
              key={card.href}
              href={card.href}
              className={`fade-up-${i + 2} flex flex-col rounded-2xl border transition-all duration-200 hover:-translate-y-1.5 focus:outline-none`}
              style={{
                background: card.accent ? "rgba(200,241,53,0.04)" : "var(--bg-card)",
                borderColor: card.accent ? "rgba(200,241,53,0.25)" : "var(--border)",
                padding: "48px",
              }}
            >
              <div style={{ fontSize: "2.75rem", marginBottom: "24px" }}>{card.icon}</div>
              <h3
                className="font-semibold"
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  letterSpacing: "-0.02em",
                  fontSize: "1.35rem",
                  marginBottom: "16px",
                }}
              >
                {card.title}
              </h3>
              <p
                className="leading-relaxed"
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.92rem",
                  marginBottom: "28px",
                  flex: 1,
                }}
              >
                {card.desc}
              </p>
              <span
                className="self-start text-xs font-medium px-3 py-1 rounded-full border"
                style={{
                  color: "var(--accent)",
                  background: "rgba(200,241,53,0.08)",
                  borderColor: "rgba(200,241,53,0.15)",
                }}
              >
                {card.tag}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

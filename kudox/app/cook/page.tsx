"use client";

import { useState } from "react";
import Link from "next/link";
import TimeSlider from "../components/TimeSlider";
import SectionBox from "../components/SectionBox";
import RecipeDisplay from "../components/RecipeDisplay";
import type { RecipeResult } from "../api/recipe/route";

const DIETARY_OPTIONS = [
    { value: "vegetarian", label: "Vegetarian", emoji: "🥦" },
    { value: "vegan", label: "Vegan", emoji: "🌱" },
    { value: "gluten-free", label: "Gluten-free", emoji: "🌾" },
    { value: "nut-free", label: "Nut-free", emoji: "🥜" },
    { value: "halal", label: "Halal", emoji: "🕌" },
    { value: "dairy-free", label: "Dairy-free", emoji: "🥛" },
];

export default function CookPage() {
    const [ingredients, setIngredients] = useState("");
    const [timeMinutes, setTimeMinutes] = useState(30);
    const [dietary, setDietary] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recipe, setRecipe] = useState<RecipeResult | null>(null);

    function toggleDietary(value: string) {
        setDietary((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
    }

    async function handleSubmit(surprise = false) {
        setError(null);
        setRecipe(null);

        if (!surprise && !ingredients.trim()) {
            setError("Please list at least one ingredient you have.");
            return;
        }

        setLoading(true);
        try {
            const body = surprise
                ? { mode: "surprise", timeMinutes, dietary }
                : { mode: "cook", ingredients, timeMinutes, dietary };

            const res = await fetch("/api/recipe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

                if (!res.ok) {
                    setError(data.error || "Something went wrong. Please try again.");
                    return;
                }

                if (!data || !Array.isArray(data.steps) || !Array.isArray(data.ingredients)) {
                    setError("Received an incomplete recipe. Please try again.");
                    return;
                }

                setRecipe(data as RecipeResult);

        } catch {
            setError("Couldn't reach the server. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen min-w-[360px] flex flex-col items-center relative overflow-hidden" style={{ padding: "0 24px 120px 24px" }}>
            <div
                className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(200,241,53,0.07) 0%, transparent 70%)" }}
            />

            {/* Nav */}
            <nav className="w-full max-w-2xl flex items-center justify-between relative z-10" style={{ paddingTop: "36px", paddingBottom: "28px" }}>
                <Link href="/" style={{ fontFamily: "var(--font-space-grotesk)" }} className="text-xl font-bold tracking-tight">
                    Kudo<span style={{ color: "var(--accent)" }}>X</span>
                </Link>
                <Link
                    href="/decide"
                    className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "var(--text-secondary)",
                    }}
                    >
                    <span className="transition-transform duration-300 group-hover:-translate-x-1">
                        ←
                    </span>

                    <span className="group-hover:text-white transition-colors">
                        I don't want to cook
                    </span>

                    {/* subtle glow */}
                    <span
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                        background:
                            "radial-gradient(circle at center, rgba(200,241,53,0.12), transparent 70%)",
                        }}
                    />
                    </Link>
            </nav>

            <div className="relative z-10 w-full max-w-2xl flex flex-col gap-10">
                {/* Heading */}
                <div className="fade-up-1 mb-10">
                    <h1
                        className="font-bold"
                        style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(1.75rem, 5vw, 2.5rem)", letterSpacing: "-0.02em" }}
                    >
                        👨‍🍳 What should I cook?
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "12px" }}>
                        List what you&apos;ve got, how much time you have, and we&apos;ll build a recipe around it.
                    </p>
                </div>

                {/* Ingredients */}
                <SectionBox title="Ingredients I Have" icon={<span>🧺</span>}>
                    <textarea
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        placeholder="e.g. chicken breast, garlic, olive oil, pasta, tomatoes, onion, parmesan cheese…"
                        className="w-full h-44 resize-none border-0 focus:outline-none bg-transparent text-base leading-relaxed"
                        style={{ color: "var(--text-primary)" }}
                    />
                </SectionBox>

                {/* Cooking time */}
                <SectionBox title="Cooking Time Available" icon={<span>⏱️</span>}>
                    <TimeSlider value={timeMinutes} onChange={setTimeMinutes} />
                </SectionBox>

                {/* Dietary filter */}
                <SectionBox title="Dietary Needs" icon={<span>🥗</span>}>
                <div className="flex flex-wrap gap-3">
                    {DIETARY_OPTIONS.map((item) => {
                    const active = dietary.includes(item.value);

                    return (
                        <button
                        key={item.value}
                        type="button"
                        onClick={() => toggleDietary(item.value)}
                        className="relative px-3 py-2 rounded-full text-sm font-medium transition-all duration-300"
                        style={{
                            background: active
                            ? "linear-gradient(135deg, rgba(200,241,53,0.25), rgba(200,241,53,0.08))"
                            : "rgba(255,255,255,0.03)",
                            color: active ? "#EAFD8C" : "var(--text-secondary)",
                            border: active
                            ? "1px solid rgba(200,241,53,0.5)"
                            : "1px solid rgba(255,255,255,0.08)",
                            boxShadow: active
                            ? "0 0 20px rgba(200,241,53,0.15)"
                            : "none",
                            transform: active ? "translateY(-1px)" : "translateY(0px)",
                        }}
                        >
                            
                        <span
                            style={{
                            marginRight: 6,
                            filter: active ? "drop-shadow(0 0 6px rgba(200,241,53,0.8))" : "none",
                            }}
                        >
                            {item.emoji}
                        </span>

                        {item.label}

                        {active && (
                            <span
                            className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                            style={{
                                background: "#C8F135",
                                boxShadow: "0 0 8px rgba(200,241,53,0.8)",
                            }}
                            />
                        )}
                        </button>
                    );
                    })}
                </div>
                </SectionBox>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="button"
                        onClick={() => handleSubmit(false)}
                        disabled={loading}
                        className="flex-1 font-bold py-3.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                        style={{
                            fontFamily: "var(--font-space-grotesk)",
                            background: "var(--accent)",
                            color: "#0D0D0C",
                            boxShadow: "0 0 30px rgba(200,241,53,0.2)",
                        }}
                    >
                        {loading ? "Cooking up ideas…" : "✨ Suggest a recipe"}
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSubmit(true)}
                        disabled={loading}
                        className="sm:w-48 font-semibold py-3.5 rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ borderColor: "var(--border)", background: "var(--bg-card)", color: "var(--text-primary)" }}
                    >
                        🎲 Surprise Me
                    </button>
                </div>

                {/* Error state */}
                {error ? (
                    <div
                        className="text-sm rounded-md p-3 border"
                        style={{ color: "#fca5a5", background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.25)" }}
                    >
                        {error}
                    </div>
                ) : null}

                {/* Recipe suggestion box */}
                {(loading || recipe) && (
                    <SectionBox title="Recipe Suggestion" icon={<span>✨</span>} accent>
                        {loading ? (
                            <div className="py-8 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                                Cooking up a suggestion…
                            </div>
                        ) : recipe ? (
                            <RecipeDisplay recipe={recipe} />
                        ) : null}
                    </SectionBox>
                )}
            </div>
        </main>
    );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import SectionBox from "../components/SectionBox";
import DishDisplay from "../components/DishDisplay";
import type { DishResult } from "../api/eat/route";

const CUISINE_OPTIONS = [
    { value: "Japanese", emoji: "🍣" },
    { value: "Korean", emoji: "🍜" },
    { value: "Italian", emoji: "🍝" },
    { value: "Thai", emoji: "🌶️" },
    { value: "Mexican", emoji: "🌮" },
    { value: "Indian", emoji: "🍛" },
    { value: "Chinese", emoji: "🥟" },
    { value: "French", emoji: "🥐" },
];

const ALLERGY_OPTIONS = [
    { value: "nuts", label: "Nuts", emoji: "🥜" },
    { value: "shellfish", label: "Shellfish", emoji: "🦐" },
    { value: "dairy", label: "Dairy", emoji: "🥛" },
    { value: "eggs", label: "Eggs", emoji: "🥚" },
    { value: "gluten", label: "Gluten", emoji: "🌾" },
    { value: "soy", label: "Soy", emoji: "🫘" },
];

export default function EatPage() {
    const [cuisine, setCuisine] = useState<string | null>(null);
    const [allergies, setAllergies] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dish, setDish] = useState<DishResult | null>(null);
    const [otherAllergy, setOtherAllergy] = useState<string>("");

    function toggleAllergy(value: string) {
        setAllergies((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
    }

    async function handleSubmit() {
        setError(null);
        setDish(null);

        if (!cuisine) {
            setError("Please pick a cuisine you're craving.");
            return;
        }

        const allAllergies = otherAllergy.trim() ? [...allergies, otherAllergy.trim()] : allergies;

        setLoading(true);
        try {
            const res = await fetch("/api/eat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cuisine, allergies: allAllergies }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong. Please try again.");
                return;
            }

            if (!data || !data.name || !data.description) {
                setError("Received an incomplete suggestion. Please try again.");
                return;
            }

            setDish(data as DishResult);
        } catch {
            setError("Couldn't reach the server. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main
            className="min-h-screen min-w-[360px] flex flex-col items-center relative overflow-hidden"
            style={{ padding: "0 24px 120px 24px" }}
        >
            <div
                className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(200,241,53,0.07) 0%, transparent 70%)" }}
            />

            {/* Nav */}
            <nav
                className="w-full max-w-2xl flex items-center justify-between relative z-10"
                style={{ paddingTop: "36px", paddingBottom: "28px" }}
            >
                <Link href="/" style={{ fontFamily: "var(--font-space-grotesk)" }} className="text-xl font-bold tracking-tight">
                    Kudo<span style={{ color: "var(--accent)" }}>X</span>
                </Link>
                <Link
                    href="/cook"
                    className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "var(--text-secondary)",
                    }}
                >
                    <span className="group-hover:text-white transition-colors">I want to cook</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
            </nav>

            <div className="relative z-10 w-full max-w-2xl flex flex-col gap-10">
                {/* Heading */}
                <div className="mb-10">
                    <h1
                        className="font-bold"
                        style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(1.75rem, 5vw, 2.5rem)", letterSpacing: "-0.02em" }}
                    >
                        🍽️ What should I eat?
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "12px" }}>
                        Pick a cuisine you're craving and tell us your allergies — we'll suggest a dish to order or find.
                    </p>
                </div>

                {/* Cuisine picker */}
                <SectionBox title="What style of food?" icon={<span style={{ fontSize: "1.3rem" }}>🌍</span>}>
                    <div className="flex flex-wrap" style={{ gap: "0.875rem" }}>
                        {CUISINE_OPTIONS.map((item) => {
                            const active = cuisine === item.value;
                            return (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => setCuisine(item.value)}
                                    className="font-medium transition-all duration-300"
                                    style={{
                                        fontSize: "1rem",
                                        padding: "0.875rem 1.5rem",
                                        borderRadius: "9999px",
                                        background: active
                                            ? "linear-gradient(135deg, rgba(200,241,53,0.28), rgba(200,241,53,0.1))"
                                            : "rgba(255,255,255,0.04)",
                                        color: active ? "#EAFD8C" : "var(--text-secondary)",
                                        border: active ? "1.5px solid rgba(200,241,53,0.55)" : "1.5px solid rgba(255,255,255,0.09)",
                                        boxShadow: active ? "0 0 24px rgba(200,241,53,0.18)" : "none",
                                        transform: active ? "translateY(-1px)" : "none",
                                    }}
                                >
                                    <span style={{ marginRight: 8, fontSize: "1.15rem" }}>{item.emoji}</span>
                                    {item.value}
                                </button>
                            );
                        })}
                    </div>
                </SectionBox>

                {/* Allergy picker */}
                <SectionBox title="Any allergies?" icon={<span style={{ fontSize: "1.3rem" }}>⚠️</span>}>
                    <div className="flex flex-wrap" style={{ gap: "0.875rem" }}>
                        {ALLERGY_OPTIONS.map((item) => {
                            const active = allergies.includes(item.value);
                            return (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => toggleAllergy(item.value)}
                                    className="font-medium transition-all duration-300"
                                    style={{
                                        fontSize: "1rem",
                                        padding: "0.875rem 1.5rem",
                                        borderRadius: "9999px",
                                        background: active
                                            ? "linear-gradient(135deg, rgba(251,146,60,0.28), rgba(251,146,60,0.1))"
                                            : "rgba(255,255,255,0.04)",
                                        color: active ? "#fdba74" : "var(--text-secondary)",
                                        border: active ? "1.5px solid rgba(251,146,60,0.55)" : "1.5px solid rgba(255,255,255,0.09)",
                                        boxShadow: active ? "0 0 24px rgba(251,146,60,0.16)" : "none",
                                        transform: active ? "translateY(-1px)" : "none",
                                    }}
                                >
                                    <span style={{ marginRight: 8, fontSize: "1.15rem" }}>{item.emoji}</span>
                                    {item.label}
                                </button>
                            );
                        })}

                        <div
                            className="flex items-center transition-all duration-300"
                            style={{
                                padding: "0.875rem 1.5rem",
                                borderRadius: "9999px",
                                background: otherAllergy
                                    ? "linear-gradient(135deg, rgba(251,146,60,0.28), rgba(251,146,60,0.1))"
                                    : "rgba(255,255,255,0.04)",
                                border: otherAllergy
                                    ? "1.5px solid rgba(251,146,60,0.55)"
                                    : "1.5px solid rgba(255,255,255,0.09)",
                                gap: "0.5rem",
                            }}
                        >
                            <span style={{ fontSize: "1.15rem" }}>✏️</span>
                            <input
                                type="text"
                                value={otherAllergy}
                                onChange={(e) => setOtherAllergy(e.target.value)}
                                placeholder="Other allergy…"
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    outline: "none",
                                    fontSize: "1rem",
                                    color: otherAllergy ? "#fdba74" : "var(--text-secondary)",
                                    fontFamily: "inherit",
                                    width: "120px",
                                }}
                            />
                        </div>

                    </div>
                </SectionBox>

                {/* Action */}
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="font-bold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                    style={{
                        fontFamily: "var(--font-space-grotesk)",
                        fontSize: "1.1rem",
                        padding: "1.1rem 0",
                        borderRadius: "9999px",
                        background: "var(--accent)",
                        color: "#0D0D0C",
                        boxShadow: "0 0 40px rgba(200,241,53,0.28)",
                    }}
                >
                    {loading ? "Finding a dish…" : "✨ Suggest a dish"}
                </button>

                {/* Error */}
                {error ? (
                    <div
                        className="text-sm rounded-md p-3 border"
                        style={{ color: "#fca5a5", background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.25)" }}
                    >
                        {error}
                    </div>
                ) : null}

                {/* Result */}
                {(loading || dish) && (
                    <SectionBox title="Dish Suggestion" icon={<span>✨</span>} accent>
                        {loading ? (
                            <div className="py-8 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                                Finding something delicious…
                            </div>
                        ) : dish ? (
                            <DishDisplay dish={dish} />
                        ) : null}
                    </SectionBox>
                )}
            </div>
        </main>
    );
}
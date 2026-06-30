"use client";

import { useEffect, useRef, useState } from "react";
import type { RecipeResult } from "../api/recipe/route";

type RecipeDisplayProps = {
  recipe: RecipeResult;
};

function formatAmount(amount: number, servingsRatio: number): string {
  const scaled = amount * servingsRatio;
  const rounded = Math.round(scaled * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function StepTimer({ seconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) { setRunning(false); return 0; }
          return r - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, remaining]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div className="flex items-center gap-2 mt-2">
      <span
        className="text-sm font-mono px-2 py-1 rounded"
        style={{ color: "var(--text-primary)", background: "rgba(255,255,255,0.06)" }}
      >
        ⏱ {mins}:{String(secs).padStart(2, "0")}
      </span>
      {remaining > 0 ? (
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="text-xs font-medium px-3 py-1 rounded-full border transition-colors"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
        >
          {running ? "Pause" : "Start"}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setRemaining(seconds)}
          className="text-xs font-medium px-3 py-1 rounded-full border transition-colors"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
        >
          Reset
        </button>
      )}
    </div>
  );
}

export default function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  const [servings, setServings] = useState(recipe.baseServings || 2);
  const ratio = servings / (recipe.baseServings || 2);

  return (
    <div className="space-y-8">

      {/* Title & meta */}
      <div>
        <h3
          className="text-xl font-semibold"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--text-primary)" }}
        >
          {recipe.title}
        </h3>
        {recipe.cuisine ? (
          <span
            className="inline-block mt-2 text-xs font-medium px-2.5 py-0.5 rounded-full border"
            style={{ background: "rgba(200,241,53,0.1)", color: "var(--accent)", borderColor: "rgba(200,241,53,0.25)" }}
          >
            {recipe.cuisine}
          </span>
        ) : null}
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          {recipe.description}
        </p>
      </div>

      {/* Servings control */}
      <div className="flex items-center gap-3">
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Servings</span>
        <button
          type="button"
          onClick={() => setServings((s) => Math.max(1, s - 1))}
          className="w-8 h-8 rounded-full border transition-colors"
          style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          aria-label="Decrease servings"
        >−</button>
        <span className="w-8 text-center font-medium" style={{ color: "var(--text-primary)" }}>{servings}</span>
        <button
          type="button"
          onClick={() => setServings((s) => Math.min(20, s + 1))}
          className="w-8 h-8 rounded-full border transition-colors"
          style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          aria-label="Increase servings"
        >+</button>
      </div>

      {/* Ingredients table */}
      <div>
        <h4 className="font-semibold" style={{ 
            fontSize: "1.1rem", 
            color: "var(--text-primary)", 
            marginBottom: "1.25rem" 
          
          }}>
          Ingredients
        </h4>
        <div
          className="rounded-xl overflow-hidden"
          style={{ 
            border: "1px solid rgba(255,255,255,0.07)", 
            background: "rgba(255,255,255,0.02)" 
          }}
        >
          {/* Table header */}
          <div
            className="grid px-5 py-3"
            style={{
              gridTemplateColumns: "1fr auto auto",
              gap: "1rem",
              padding: "0.75rem 1.75rem",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <span className="text-xs font-medium uppercase tracking-wide" style={{ 
              color: "var(--text-muted)" 
              }}>
                Item
            </span>

            <span className="text-xs font-medium uppercase tracking-wide" style={{ 
              color: "var(--text-muted)" }}>
                Amount
            </span>

            <span className="text-xs font-medium uppercase tracking-wide w-8" style={{ 
              color: "var(--text-muted)" 
            }} 
          />
          </div>

          {/* Rows */}
          {recipe.ingredients.map((ing, i) => (
            <div
              key={i}
              className="grid items-center px-5 py-5"
              style={{
                gridTemplateColumns: "1fr auto auto",
                gap: "1rem",
                padding: "1.25rem 1.75rem",
                borderBottom: i < recipe.ingredients.length - 1
                  ? "1px solid rgba(255,255,255,0.05)"
                  : "none",
              }}
            >
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {ing.name}
              </span>
              <span className="text-sm tabular-nums" style={{ color: "var(--text-muted)" }}>
                {formatAmount(ing.amount, ratio)}{ing.unit ? ` ${ing.unit}` : ""}
              </span>
              <div className="w-10 flex justify-end">
                {!ing.haveIt ? (
                  <span
                    className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap font-medium"
                    style={{
                      color: "#fbbf24",
                      background: "rgba(251,191,36,0.1)",
                      border: "1px solid rgba(251,191,36,0.2)",
                    }}
                  >
                    buy
                  </span>
                ) : (
                  <span
                    className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap font-medium"
                    style={{
                      color: "rgba(200,241,53,0.7)",
                      background: "rgba(200,241,53,0.07)",
                      border: "1px solid rgba(200,241,53,0.15)",
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div style={{ marginTop: "2.5rem" }}>
        <h4
          className="text-sm font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Steps
        </h4>
        <ol className="space-y-7">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-4" style={{ marginBottom: "0.5rem" }}>
              <span
                className="flex-shrink-0 w-7 h-7 rounded-full text-sm font-semibold flex items-center justify-center mt-0.5"
                style={{ background: "var(--accent)", color: "#0D0D0C" }}
              >
                {i + 1}
              </span>
              <div className="flex-1 pt-0.5">
                <p className="font-medium" style={{ fontSize: "1rem", color: "var(--text-primary)" }}>
                  {step.title}
                </p>
                <p className="mt-1 leading-relaxed" style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
                  {step.content}
                </p>
                {step.timerSeconds ? <StepTimer seconds={step.timerSeconds} /> : null}
              </div>
            </li>
          ))}
        </ol>
      </div>

    </div>
  );
}
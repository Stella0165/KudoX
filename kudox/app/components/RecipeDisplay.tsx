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
    <div className="flex items-center gap-3 mt-3">
      <span
        className="text-sm font-mono rounded"
        style={{ color: "var(--text-primary)", background: "rgba(255,255,255,0.06)", padding: "6px 10px" }}
      >
        ⏱ {mins}:{String(secs).padStart(2, "0")}
      </span>
      {remaining > 0 ? (
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="text-xs font-medium rounded-full border transition-colors"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)", padding: "6px 14px" }}
        >
          {running ? "Pause" : "Start"}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setRemaining(seconds)}
          className="text-xs font-medium rounded-full border transition-colors"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)", padding: "6px 14px" }}
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
    <div className="space-y-10">

      <div>
        <h3
          className="text-xl font-semibold"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--text-primary)" }}
        >
          {recipe.title}
        </h3>
        {recipe.cuisine ? (
          <span
            className="inline-block mt-3 text-xs font-medium rounded-full border"
            style={{ background: "rgba(200,241,53,0.1)", color: "var(--accent)", borderColor: "rgba(200,241,53,0.25)", padding: "4px 12px" }}
          >
            {recipe.cuisine}
          </span>
        ) : null}
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {recipe.description}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Servings</span>
        <button
          type="button"
          onClick={() => setServings((s) => Math.max(1, s - 1))}
          className="w-9 h-9 rounded-full border transition-colors"
          style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          aria-label="Decrease servings"
        >−</button>
        <span className="w-8 text-center font-medium" style={{ color: "var(--text-primary)" }}>{servings}</span>
        <button
          type="button"
          onClick={() => setServings((s) => Math.min(20, s + 1))}
          className="w-9 h-9 rounded-full border transition-colors"
          style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          aria-label="Increase servings"
        >+</button>
      </div>

      <div>
        <h4 className="font-semibold" style={{ 
            fontSize: "1.1rem", 
            color: "var(--text-primary)", 
            marginBottom: "1.5rem" 
          
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
          <div
            className="grid"
            style={{
              gridTemplateColumns: "1fr auto auto",
              gap: "1rem",
              padding: "1rem 2rem",
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

          {recipe.ingredients.map((ing, i) => (
            <div
              key={i}
              className="grid items-center"
              style={{
                gridTemplateColumns: "1fr auto auto",
                gap: "1rem",
                padding: "1.5rem 2rem",
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
                    className="text-xs rounded-full whitespace-nowrap font-medium"
                    style={{
                      color: "#fbbf24",
                      background: "rgba(251,191,36,0.1)",
                      border: "1px solid rgba(251,191,36,0.2)",
                      padding: "4px 12px",
                    }}
                  >
                    buy
                  </span>
                ) : (
                  <span
                    className="text-xs rounded-full whitespace-nowrap font-medium"
                    style={{
                      color: "rgba(200,241,53,0.7)",
                      background: "rgba(200,241,53,0.07)",
                      border: "1px solid rgba(200,241,53,0.15)",
                      padding: "4px 12px",
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
      <div style={{ marginTop: "3rem" }}>
        <h4
          className="text-sm font-semibold"
          style={{ color: "var(--text-primary)", marginBottom: "1.25rem" }}
        >
          Steps
        </h4>
        <ol className="space-y-8">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-5">
              <span
                className="flex-shrink-0 w-8 h-8 rounded-full text-sm font-semibold flex items-center justify-center mt-0.5"
                style={{ background: "var(--accent)", color: "#0D0D0C" }}
              >
                {i + 1}
              </span>
              <div className="flex-1 pt-0.5">
                <p className="font-medium" style={{ fontSize: "1rem", color: "var(--text-primary)" }}>
                  {step.title}
                </p>
                <p className="mt-2 leading-relaxed" style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
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

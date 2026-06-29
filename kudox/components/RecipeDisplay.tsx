"use client";

import { useEffect, useRef, useState } from "react";
import type { RecipeResult } from "../api/recipe/route";

type RecipeDisplayProps = {
  recipe: RecipeResult;
};

function formatAmount(amount: number, servingsRatio: number): string {
  const scaled = amount * servingsRatio;
  // Round sensibly: whole numbers stay whole, otherwise show up to 2 decimals
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
          if (r <= 1) {
            setRunning(false);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, remaining]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const display = `${mins}:${String(secs).padStart(2, "0")}`;

  return (
    <div className="flex items-center gap-2 mt-2">
      <span
        className="text-sm font-mono px-2 py-1 rounded"
        style={{ color: "var(--text-primary)", background: "rgba(255,255,255,0.06)" }}
      >
        ⏱ {display}
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
    <div className="space-y-6">
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
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Servings
        </span>
        <button
          type="button"
          onClick={() => setServings((s) => Math.max(1, s - 1))}
          className="w-8 h-8 rounded-full border transition-colors"
          style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          aria-label="Decrease servings"
        >
          −
        </button>
        <span className="w-8 text-center font-medium" style={{ color: "var(--text-primary)" }}>
          {servings}
        </span>
        <button
          type="button"
          onClick={() => setServings((s) => Math.min(20, s + 1))}
          className="w-8 h-8 rounded-full border transition-colors"
          style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          aria-label="Increase servings"
        >
          +
        </button>
      </div>

      {/* Ingredients */}
      <div>
        <h4 className="font-semibold mb-2 text-sm" style={{ color: "var(--text-primary)" }}>
          Ingredients
        </h4>
        <ul className="space-y-1.5">
          {recipe.ingredients.map((ing, i) => (
            <li
              key={i}
              className="flex items-center justify-between text-sm pb-1.5 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <span style={{ color: "var(--text-primary)" }}>
                {ing.name}
                {!ing.haveIt && (
                  <span
                    className="ml-2 text-xs px-1.5 py-0.5 rounded"
                    style={{ color: "#fbbf24", background: "rgba(251,191,36,0.1)" }}
                  >
                    need to buy
                  </span>
                )}
              </span>
              <span className="tabular-nums" style={{ color: "var(--text-muted)" }}>
                {formatAmount(ing.amount, ratio)}
                {ing.unit ? ` ${ing.unit}` : ""}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Steps */}
      <div>
        <h4 className="font-semibold mb-3 text-sm" style={{ color: "var(--text-primary)" }}>
          Steps
        </h4>
        <ol className="space-y-4">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full text-sm font-semibold flex items-center justify-center mt-0.5"
                style={{ background: "var(--accent)", color: "#0D0D0C" }}
              >
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                  {step.title}
                </p>
                <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  {step.content}
                </p>
                {step.timerSeconds ? <StepTimer seconds={step.timerSeconds} /> : null}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Shopping list */}
      {recipe.shoppingList && recipe.shoppingList.length > 0 ? (
        <div>
          <h4 className="font-semibold mb-2 text-sm" style={{ color: "var(--text-primary)" }}>
            🛒 Shopping list
          </h4>
          <ul className="flex flex-wrap gap-2">
            {recipe.shoppingList.map((item, i) => (
              <li
                key={i}
                className="text-sm px-3 py-1 rounded-full border"
                style={{ color: "#fbbf24", background: "rgba(251,191,36,0.08)", borderColor: "rgba(251,191,36,0.25)" }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {recipe.notes ? (
        <div
          className="text-sm rounded-md p-3 border"
          style={{ color: "var(--text-secondary)", background: "rgba(255,255,255,0.03)", borderColor: "var(--border)" }}
        >
          💡 {recipe.notes}
        </div>
      ) : null}
    </div>
  );
}

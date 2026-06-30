"use client";

import type { DishResult } from "../api/eat/route";

type DishDisplayProps = {
  dish: DishResult;
};

export default function DishDisplay({ dish }: DishDisplayProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3
          className="text-xl font-semibold"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--text-primary)" }}
        >
          {dish.name}
          {dish.localName ? (
            <span className="ml-2 text-base" style={{ color: "var(--text-secondary)" }}>
              {dish.localName}
            </span>
          ) : null}
        </h3>
        <div className="flex items-center" style={{ marginTop: "12px", gap: "10px" }}>
          <span
            className="text-xs font-medium px-2.5 py-0.5 rounded-full border"
            style={{ background: "rgba(200,241,53,0.1)", color: "var(--accent)", borderColor: "rgba(200,241,53,0.25)" }}
          >
            {dish.cuisine}
          </span>
          <span
            className="text-xs font-medium px-2.5 py-0.5 rounded-full border"
            style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-secondary)", borderColor: "var(--border)" }}
          >
            {dish.priceRange}
          </span>
        </div>
        <p className="leading-relaxed" style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: "16px" }}>
          {dish.description}
        </p>
      </div>

      <div
        className="rounded-xl"
        style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", padding: "20px" }}
      >
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)", marginBottom: "10px" }}>
          Where to find it
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
          {dish.whereToFind}
        </p>
      </div>

      {dish.allergenNote ? (
        <div
          className="rounded-xl text-sm leading-relaxed"
          style={{
            color: "#fdba74",
            background: "rgba(251,146,60,0.08)",
            border: "1px solid rgba(251,146,60,0.2)",
            padding: "16px",
            marginTop: "8px",
          }}
        >
          ⚠️ {dish.allergenNote}
        </div>
      ) : null}
    </div>
  );
}
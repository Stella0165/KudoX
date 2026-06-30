"use client";

import { ReactNode } from "react";

type SectionBoxProps = {
  title: string;
  icon?: ReactNode;
  accent?: boolean;
  children: ReactNode;
};

export default function SectionBox({ title, icon, accent = false, children }: SectionBoxProps) {
  return (
    <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b"
        style={{
          background: accent ? "rgba(200,241,53,0.08)" : "transparent",
          borderColor: accent ? "rgba(200,241,53,0.2)" : "var(--border)",
        }}
      >
        <h2
          className="font-semibold flex items-center gap-2"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            color: accent ? "var(--accent)" : "var(--text-primary)",
            fontSize: "0.95rem",
          }}
        >
          {icon}
          {title}
        </h2>
      </div>
      <div style={{ padding: "0.75rem 2rem" }}>{children}</div>
    </div>
  );
}

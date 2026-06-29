"use client";

type TimeSliderProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export default function TimeSlider({ value, onChange, min = 10, max = 120 }: TimeSliderProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm w-8" style={{ color: "var(--text-muted)" }}>
        {min}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 rounded-full cursor-pointer accent-[var(--accent)]"
        style={{ background: "var(--border)" }}
        aria-label="Cooking time available in minutes"
      />
      <span className="text-sm w-10 text-right" style={{ color: "var(--text-muted)" }}>
        {max}
      </span>
      <div
        className="px-3 py-1.5 rounded-md text-sm min-w-[90px] text-center border"
        style={{ borderColor: "var(--border)", background: "var(--bg-card)", color: "var(--text-primary)" }}
      >
        {value} min
      </div>
    </div>
  );
}

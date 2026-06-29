"use client";

type ChipOption = {
  value: string;
  label: string;
  emoji?: string;
};

type ChipGroupProps = {
  options: ChipOption[];
  selected: string[];
  onToggle: (value: string) => void;
};

export default function ChipGroup({ options, selected, onToggle }: ChipGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            aria-pressed={isActive}
            className="px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150 focus:outline-none"
            style={{
              background: isActive ? "var(--accent)" : "var(--bg-card)",
              borderColor: isActive ? "var(--accent)" : "var(--border)",
              color: isActive ? "#0D0D0C" : "var(--text-secondary)",
            }}
          >
            {opt.emoji ? <span className="mr-1.5">{opt.emoji}</span> : null}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export type { ChipOption };

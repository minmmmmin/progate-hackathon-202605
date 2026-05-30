import type { ReactNode } from "react";

type Tone = "pink" | "green" | "yellow" | "red" | "gray";

type BadgeProps = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
};

const toneClass: Record<Tone, string> = {
  pink: "badge-primary",
  green: "badge-success",
  yellow: "badge-warning",
  red: "badge-error",
  gray: "badge-neutral",
};

export function Badge({ children, tone = "pink", className = "" }: BadgeProps) {
  return (
    <span
      className={`badge ${toneClass[tone]} border-none text-[11px] font-bold tracking-wide ${className}`}
    >
      {children}
    </span>
  );
}

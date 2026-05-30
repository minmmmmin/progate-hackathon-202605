import type { ReactNode } from "react";

export type StampTone = "pink" | "peach" | "mint" | "sky" | "lemon" | "lavender";

type StampCircleProps =
  | { state: "collected"; icon: ReactNode; label: string; tone: StampTone }
  | { state: "locked"; label: string };

const toneClass: Record<StampTone, string> = {
  pink: "bg-stamp-pink text-festival-pink-deep",
  peach: "bg-stamp-peach text-amber-700",
  mint: "bg-stamp-mint text-emerald-700",
  sky: "bg-stamp-sky text-sky-700",
  lemon: "bg-stamp-lemon text-yellow-700",
  lavender: "bg-stamp-lavender text-violet-700",
};

export function StampCircle(props: StampCircleProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {props.state === "collected" ? (
        <div
          className={`flex aspect-square w-full max-w-20 items-center justify-center rounded-full shadow-[inset_0_-4px_10px_rgba(0,0,0,0.06)] ${toneClass[props.tone]}`}
        >
          {props.icon}
        </div>
      ) : (
        <div className="border-base-content/25 text-base-content/30 flex aspect-square w-full max-w-20 items-center justify-center rounded-full border-2 border-dashed text-2xl font-bold">
          ?
        </div>
      )}
      <span
        className={`text-center text-[11px] leading-tight sm:text-xs ${
          props.state === "collected" ? "text-base-content" : "text-base-content/50"
        }`}
      >
        {props.label}
      </span>
    </div>
  );
}

import type { ReactNode } from "react";

export type StampTone = "pink" | "peach" | "mint" | "sky" | "lemon" | "lavender";
export type StampSize = 20 | 24 | 32;

type StampCircleProps =
  | {
      state: "collected";
      icon?: ReactNode;
      imageSrc?: string;
      label?: string;
      tone: StampTone;
    }
  | { state: "locked"; label?: string };

type Props = StampCircleProps & {
  size?: StampSize;
};

const toneClass: Record<StampTone, string> = {
  pink: "bg-pink-100 text-pink-700",
  peach: "bg-orange-100 text-amber-700",
  mint: "bg-emerald-100 text-emerald-700",
  sky: "bg-sky-100 text-sky-700",
  lemon: "bg-yellow-100 text-yellow-700",
  lavender: "bg-violet-100 text-violet-700",
};

// Tailwind がパージしないようリテラルで定義
const sizeClass: Record<StampSize, string> = {
  20: "w-full max-w-24",
  24: "w-full max-w-24",
  32: "w-full max-w-32",
};

export function StampCircle({ size = 20, ...props }: Props) {
  return (
    <div className={`flex flex-col items-center gap-2 ${sizeClass[size]}`}>
      {props.state === "collected" ? (
        <div
          className={`flex aspect-square w-full items-center justify-center rounded-full shadow-[inset_0_-4px_10px_rgba(0,0,0,0.06)] ${toneClass[props.tone]}`}
        >
          {props.imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={props.imageSrc}
              alt={props.label ?? ""}
              className="h-[100%] w-[100%] object-contain"
            />
          ) : (
            props.icon
          )}
        </div>
      ) : (
        <div className="border-base-content/25 text-base-content/30 flex aspect-square w-full items-center justify-center rounded-full border-2 border-dashed text-2xl font-bold">
          ?
        </div>
      )}
      {props.label && (
        <span
          className={`text-center text-[11px] leading-tight sm:text-xs ${
            props.state === "collected" ? "text-base-content" : "text-base-content/50"
          }`}
        >
          {props.label}
        </span>
      )}
    </div>
  );
}

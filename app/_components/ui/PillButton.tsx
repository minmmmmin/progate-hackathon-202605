import type { ReactNode } from "react";

type Variant = "outline" | "filled" | "ghost" | "soft";

type PillButtonProps = {
  children: ReactNode;
  variant?: Variant;
  leading?: ReactNode;
  trailing?: ReactNode;
  className?: string;
  size?: "sm" | "md";
  fullWidth?: boolean;
  onClick?: () => void;
};

const variantClass: Record<Variant, string> = {
  outline: "btn-outline btn-primary bg-base-100",
  filled: "btn-primary",
  ghost: "btn-ghost",
  soft: "bg-secondary text-secondary-content border-secondary hover:bg-secondary",
};

const sizeClass = {
  sm: "btn-sm",
  md: "btn-md",
};

export function PillButton({
  children,
  variant = "outline",
  leading,
  trailing,
  className = "",
  size = "md",
  fullWidth = false,
  onClick,
}: PillButtonProps) {
  return (
    <span
      className={`btn rounded-full font-semibold ${sizeClass[size]} ${variantClass[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      onClick={onClick}
    >
      {leading && <span className="inline-flex">{leading}</span>}
      <span>{children}</span>
      {trailing && <span className="inline-flex">{trailing}</span>}
    </span>
  );
}

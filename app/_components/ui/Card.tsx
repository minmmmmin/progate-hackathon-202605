import type { ReactNode } from "react";

type CardProps = {
  title?: ReactNode;
  icon?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

export function Card({
  title,
  icon,
  trailing,
  children,
  className = "",
  bodyClassName = "",
}: CardProps) {
  return (
    <section className={`card bg-base-100 shadow-sm ${className}`}>
      <div className={`card-body p-5 sm:p-6 ${bodyClassName}`}>
        {(title || trailing) && (
          <header className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
            <div className="text-base-content flex items-center gap-2 text-base font-bold sm:text-lg">
              {icon && <span className="text-primary">{icon}</span>}
              {title && <h2>{title}</h2>}
            </div>
            {trailing && <div className="text-base-content/60 text-xs sm:text-sm">{trailing}</div>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

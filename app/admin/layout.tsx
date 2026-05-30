import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="bg-base-100 text-base-content min-h-full">{children}</div>;
}

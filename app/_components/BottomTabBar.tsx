"use client";

import { BookOpenCheck, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";

type TabItem = {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
};

const tabs: TabItem[] = [
  { label: "ホーム", Icon: Home, href: "/" },
  { label: "スタンプ帳", Icon: BookOpenCheck, href: "/stamps" },
];

export function BottomTabBar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav
      className="bg-base-100 border-base-content/10 fixed inset-x-0 bottom-0 z-40 border-t shadow-[0_-4px_12px_rgba(0,0,0,0.04)] lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-[1440px] items-stretch justify-around">
        {tabs.map(({ label, Icon, href }) => {
          const active = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-bold transition-colors ${
                  active ? "text-primary" : "text-base-content/55"
                }`}
              >
                <Icon className={`h-6 w-6 ${active ? "stroke-[2.5]" : ""}`} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

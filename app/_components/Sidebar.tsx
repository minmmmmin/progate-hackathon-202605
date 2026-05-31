"use client";

import { BookOpenCheck, Home, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import { fetchBooths, fetchStamps } from "@/lib/stamps";
import { useUserId } from "@/hooks/useUserId";

type NavItem = {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
};

const navItems: NavItem[] = [
  { label: "ホーム", Icon: Home, href: "/" },
  { label: "スタンプ帳", Icon: BookOpenCheck, href: "/stamps" },
];

type SidebarProps = {
  refreshKey?: number;
};

export function Sidebar({ refreshKey = 0 }: SidebarProps) {
  const pathname = usePathname();
  const [counts, setCounts] = useState({ collected: 0, total: 0 });

  const { userId } = useUserId();

  useEffect(() => {
    if (!userId) return;
    const id = userId;
    async function init() {
      try {
        const [allBooths, myStamps] = await Promise.all([fetchBooths(), fetchStamps(id)]);
        setCounts({ collected: myStamps.length, total: allBooths.length });
      } catch (e) {
        console.error(e);
      }
    }
    init();
  }, [userId, refreshKey]);

  return (
    <aside className="bg-base-200 flex h-full w-72 max-w-[80vw] flex-col gap-5 p-5 lg:w-full lg:max-w-none lg:bg-transparent lg:p-0">
      <div className="text-primary flex items-center gap-2 lg:hidden">
        <Sparkles className="h-5 w-5" />
        <span className="text-lg font-extrabold">文化祭スタンプラリー！</span>
      </div>

      <nav className="bg-base-100 rounded-3xl p-3 shadow-sm">
        <ul className="menu menu-md w-full gap-1 p-0">
          {navItems.map(({ label, Icon, href }) => {
            const active = pathname === href;
            return (
              <li key={label}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-2xl px-4 py-3 text-sm font-bold ${
                    active ? "bg-secondary text-secondary-content" : "text-base-content"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="bg-base-100 rounded-3xl p-5 shadow-sm">
        <div className="text-base-content/60 text-xs font-semibold">スタンプ取得数</div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-base-content text-3xl font-extrabold">{counts.collected}</span>
          <span className="text-base-content/60 text-sm">/ {counts.total} 個</span>
        </div>
        <progress
          className="progress progress-primary mt-3 w-full"
          value={counts.collected}
          max={counts.total || 100}
        />
        <p className="text-base-content/60 mt-3 text-[11px] leading-relaxed">
          スタンプを集めるほど、会場の混雑状況がリアルタイムに見えるよ！
        </p>
      </div>
    </aside>
  );
}

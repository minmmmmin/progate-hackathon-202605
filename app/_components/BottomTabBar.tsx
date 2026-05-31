"use client";

import { BookOpenCheck, Home, QrCode } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import { useQrScanner } from "./QrScanner";

type NavTab = {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
};

const leftTab: NavTab = { label: "ホーム", Icon: Home, href: "/" };
const rightTab: NavTab = { label: "スタンプ帳", Icon: BookOpenCheck, href: "/stamps" };

export function BottomTabBar() {
  const pathname = usePathname();
  const { open: openScanner } = useQrScanner();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav
      className="bg-base-100 border-base-content/10 fixed inset-x-0 bottom-0 z-40 border-t shadow-[0_-4px_12px_rgba(0,0,0,0.04)] lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-[1440px] items-stretch justify-around">
        <NavItem tab={leftTab} active={pathname === leftTab.href} />

        <li className="flex-1">
          <button
            type="button"
            onClick={openScanner}
            className="text-primary flex w-full flex-col items-center gap-1 py-1.5 text-[11px] font-bold transition-transform active:scale-95"
          >
            <span className="bg-primary text-primary-content flex h-12 w-12 items-center justify-center rounded-full shadow-md">
              <QrCode className="h-6 w-6" />
            </span>
            スタンプGET
          </button>
        </li>

        <NavItem tab={rightTab} active={pathname === rightTab.href} />
      </ul>
    </nav>
  );
}

function NavItem({ tab, active }: { tab: NavTab; active: boolean }) {
  const { label, Icon, href } = tab;
  return (
    <li className="flex-1">
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
}

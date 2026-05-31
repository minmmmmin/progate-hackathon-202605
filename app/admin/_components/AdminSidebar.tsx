import { Flag, LayoutDashboard, Map, Plus, QrCode, Users } from "lucide-react";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

type NavItem = {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  active?: boolean;
};

const navItems: NavItem[] = [
  { label: "ダッシュボード", Icon: LayoutDashboard, active: true },
  { label: "スポット管理", Icon: Map },
  { label: "スタンプQR管理", Icon: QrCode },
  { label: "混雑状況管理", Icon: Users },
];

type QuickAction = {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  href?: string;
};

const quickActions: QuickAction[] = [
  { label: "スポットを追加", Icon: Plus, href: "/admin/spots/new" },
];

export function AdminSidebar() {
  return (
    <aside className="bg-base-200 flex h-full w-72 max-w-[80vw] flex-col gap-5 p-5 lg:w-full lg:max-w-none lg:bg-transparent lg:p-0">
      <div className="text-primary flex items-start gap-2 lg:items-center">
        <Flag className="mt-1 h-6 w-6 shrink-0 lg:mt-0" />
        <div className="leading-tight">
          <div className="text-lg font-extrabold">文化祭</div>
          <div className="text-lg font-extrabold">スタンプラリー</div>
          <div className="text-base-content/60 text-[11px] font-semibold">運営管理画面</div>
        </div>
      </div>

      <nav className="bg-base-100 rounded-3xl p-3 shadow-sm">
        <ul className="menu menu-md w-full gap-1 p-0">
          {navItems.map(({ label, Icon, active }) => (
            <li key={label}>
              <a
                aria-current={active ? "page" : undefined}
                className={`rounded-2xl px-4 py-3 text-sm font-bold ${
                  active ? "bg-primary text-primary-content" : "text-base-content"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="bg-base-100 rounded-3xl p-4 shadow-sm">
        <div className="text-primary mb-3 text-xs font-bold">クイックアクション</div>
        <div className="flex flex-col gap-2">
          {quickActions.map(({ label, Icon, href }) => {
            const className =
              "btn btn-sm btn-outline btn-primary bg-base-100 justify-start rounded-2xl font-semibold";
            return href ? (
              <Link key={label} href={href} className={className}>
                <Icon className="h-4 w-4" />
                <span className="text-xs">{label}</span>
              </Link>
            ) : (
              <button key={label} type="button" className={className}>
                <Icon className="h-4 w-4" />
                <span className="text-xs">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

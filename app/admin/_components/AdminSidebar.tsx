import {
  BarChart3,
  Bell,
  Flag,
  Gift,
  LayoutDashboard,
  Map,
  Plus,
  QrCode,
  RefreshCw,
  Settings,
  Send,
  Users,
} from "lucide-react";
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
  { label: "お知らせ管理", Icon: Bell },
  { label: "来場者データ", Icon: BarChart3 },
  { label: "景品管理", Icon: Gift },
  { label: "設定", Icon: Settings },
];

const quickActions = [
  { label: "スポットを追加", Icon: Plus },
  { label: "QRコードを一括生成", Icon: QrCode },
  { label: "混雑状況を一括更新", Icon: RefreshCw },
  { label: "お知らせを投稿", Icon: Send },
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
          {quickActions.map(({ label, Icon }) => (
            <button
              key={label}
              type="button"
              className="btn btn-sm btn-outline btn-primary bg-base-100 justify-start rounded-2xl font-semibold"
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

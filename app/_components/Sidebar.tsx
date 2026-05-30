import { BookOpenCheck, Home, Map, Sparkles, Star } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

type NavItem = {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  active?: boolean;
};

const navItems: NavItem[] = [
  { label: "ホーム", Icon: Home, active: true },
  { label: "マップ", Icon: Map },
  { label: "スタンプ帳", Icon: BookOpenCheck },
  { label: "おすすめ", Icon: Star },
];

export function Sidebar() {
  return (
    <aside className="bg-base-200 flex h-full w-72 max-w-[80vw] flex-col gap-5 p-5 lg:w-full lg:max-w-none lg:bg-transparent lg:p-0">
      <div className="text-primary flex items-center gap-2 lg:hidden">
        <Sparkles className="h-5 w-5" />
        <span className="text-lg font-extrabold">文化祭スタンプラリー！</span>
      </div>

      <nav className="bg-base-100 rounded-3xl p-3 shadow-sm">
        <ul className="menu menu-md w-full gap-1 p-0">
          {navItems.map(({ label, Icon, active }) => (
            <li key={label}>
              <a
                aria-current={active ? "page" : undefined}
                className={`rounded-2xl px-4 py-3 text-sm font-bold ${
                  active ? "bg-secondary text-secondary-content" : "text-base-content"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="bg-base-100 rounded-3xl p-5 shadow-sm">
        <div className="text-base-content/60 text-xs font-semibold">スタンプ取得数</div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-base-content text-3xl font-extrabold">7</span>
          <span className="text-base-content/60 text-sm">/ 20 個</span>
        </div>
        <progress className="progress progress-primary mt-3 w-full" value={7} max={20} />
        <p className="text-base-content/60 mt-3 text-[11px] leading-relaxed">
          スタンプを集めるほど、会場の混雑状況がリアルタイムに見えるよ！
        </p>
      </div>
    </aside>
  );
}

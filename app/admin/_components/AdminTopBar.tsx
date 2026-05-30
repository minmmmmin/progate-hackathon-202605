import { Bell, HelpCircle, LogOut, Menu } from "lucide-react";
import Link from "next/link";

type AdminTopBarProps = {
  drawerId: string;
  lastUpdated: string;
};

export function AdminTopBar({ drawerId, lastUpdated }: AdminTopBarProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <label
          htmlFor={drawerId}
          aria-label="メニューを開く"
          className="btn btn-ghost btn-square text-primary lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </label>
        <div>
          <h1 className="text-base-content text-xl font-extrabold sm:text-2xl">
            ようこそ！文化祭運営チームさん
          </h1>
          <p className="text-base-content/60 mt-1 text-xs sm:text-sm">最終更新: {lastUpdated}</p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="btn btn-ghost btn-sm text-base-content/70 hidden rounded-full font-semibold sm:inline-flex"
        >
          <Bell className="h-4 w-4" />
          お知らせ
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm text-base-content/70 hidden rounded-full font-semibold sm:inline-flex"
        >
          <HelpCircle className="h-4 w-4" />
          ヘルプ
        </button>
        <Link
          href="/admin/login"
          className="btn btn-outline btn-primary btn-sm bg-base-100 rounded-full font-semibold"
        >
          <LogOut className="h-4 w-4" />
          ログアウト
        </Link>
      </div>
    </header>
  );
}

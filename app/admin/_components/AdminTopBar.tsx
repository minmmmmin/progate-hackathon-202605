import { Flag, LogOut, Menu } from "lucide-react";
import { useAuth } from "../_hooks/useAuth";

type AdminTopBarProps = {
  drawerId: string;
};

export function AdminTopBar({ drawerId }: AdminTopBarProps) {
  const { logout } = useAuth();

  return (
    <header className="flex flex-col gap-3 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:items-center lg:gap-6">
      <div className="flex items-start gap-3">
        <label
          htmlFor={drawerId}
          aria-label="メニューを開く"
          className="btn btn-ghost btn-square text-primary lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </label>
        <div className="text-primary flex items-start gap-2">
          <Flag className="mt-1 h-6 w-6 shrink-0" />
          <div className="leading-tight">
            <div className="text-lg font-extrabold">文化祭</div>
            <div className="text-lg font-extrabold">スタンプラリー</div>
            <div className="text-base-content/60 text-[11px] font-semibold">運営管理画面</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-base-content text-lg font-extrabold sm:text-2xl">
          ようこそ！文化祭運営チームさん
        </h1>
        <button
          type="button"
          className="btn btn-outline btn-primary btn-sm bg-base-100 ml-auto rounded-full font-semibold"
          onClick={(e) => {
            e.preventDefault();
            logout().then(() => {
              window.location.href = "/admin/login";
            });
          }}
        >
          <LogOut className="h-4 w-4" />
          ログアウト
        </button>
      </div>
    </header>
  );
}

import { LogOut, Menu } from "lucide-react";
import { useAuth } from "../_hooks/useAuth";

type AdminTopBarProps = {
  drawerId: string;
};

export function AdminTopBar({ drawerId }: AdminTopBarProps) {
  const { logout } = useAuth();

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
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="btn btn-outline btn-primary btn-sm bg-base-100 rounded-full font-semibold"
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

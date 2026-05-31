import { PlusCircle } from "lucide-react";
import Link from "next/link";

export function AdminSidebar() {
  return (
    <aside className="bg-base-200 flex h-full w-72 max-w-[80vw] flex-col gap-5 p-5 lg:w-full lg:max-w-none lg:bg-transparent lg:p-0">
      <div className="bg-base-100 rounded-3xl p-4 shadow-sm">
        <div className="text-primary mb-3 text-xs font-bold">クイックアクション</div>
        <Link
          href="/admin/spots/new"
          className="btn btn-primary btn-lg w-full justify-start gap-3 rounded-2xl text-left font-extrabold shadow-md"
        >
          <PlusCircle className="h-6 w-6 shrink-0" />
          <span className="flex flex-col items-start leading-tight">
            <span className="text-base">スポットを追加</span>
            <span className="text-[11px] font-semibold opacity-80">新しいスポットを登録</span>
          </span>
        </Link>
      </div>
    </aside>
  );
}

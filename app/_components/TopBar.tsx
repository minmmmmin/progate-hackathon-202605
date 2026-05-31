import { HelpCircle, Menu, Sparkles } from "lucide-react";
import Link from "next/link";
import { PillButton } from "./ui/PillButton";

type TopBarProps = {
  drawerId: string;
};

export function TopBar({ drawerId }: TopBarProps) {
  return (
    <header className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <label
          htmlFor={drawerId}
          aria-label="メニューを開く"
          className="btn btn-ghost btn-square text-primary lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </label>

        <Logo />

        <div className="bg-base-100 hidden flex-1 items-center rounded-2xl px-8 py-5 shadow-sm lg:flex">
          <p className="text-base-content text-xl font-bold">Progate高校スタンプラリーです！</p>
        </div>

        <div className="mr-2 ml-auto flex items-center gap-2 lg:mr-0">
          <Link href="/help">
            <PillButton variant="outline" size="sm" leading={<HelpCircle className="h-4 w-4" />}>
              使い方
            </PillButton>
          </Link>
        </div>
      </div>

      <div className="bg-base-100 rounded-2xl px-4 py-3 shadow-sm lg:hidden">
        <p className="text-base-content flex items-center gap-2 text-sm font-bold">
          Progate高校スタンプラリーです！
          <Sparkles className="text-primary h-4 w-4" />
        </p>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="text-primary relative flex shrink-0 items-center justify-center">
      <div className="hidden text-center leading-tight lg:block">
        <div className="text-lg font-bold tracking-wide">文化祭</div>
        <div className="text-2xl font-extrabold tracking-wider">スタンプ</div>
        <div className="text-2xl font-extrabold tracking-wider">ラリー！</div>
      </div>
      <div className="flex items-center gap-1 text-base font-extrabold tracking-tight sm:text-lg lg:hidden">
        <span>文化祭スタンプラリー！</span>
      </div>
    </div>
  );
}

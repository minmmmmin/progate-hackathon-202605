"use client";

import {
  Cake,
  Camera,
  ChevronRight,
  Flag,
  Gamepad2,
  Ghost,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { Card } from "./ui/Card";
import { PillButton } from "./ui/PillButton";
import { StampCircle, type StampTone } from "./ui/StampCircle";
import QrScanner from "./QrScanner";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

type Stamp =
  | { state: "collected"; Icon: IconType; label: string; tone: StampTone }
  | { state: "locked"; label: string };

const stamps: Stamp[] = [
  { state: "collected", Icon: UtensilsCrossed, label: "やきそば屋", tone: "pink" },
  { state: "collected", Icon: Ghost, label: "お化け屋敷", tone: "lemon" },
  { state: "collected", Icon: Camera, label: "フォトスポット", tone: "mint" },
  { state: "collected", Icon: Cake, label: "スイーツカフェ", tone: "sky" },
  { state: "collected", Icon: Gamepad2, label: "ゲームコーナー", tone: "peach" },
  { state: "collected", Icon: ShoppingBag, label: "手作り雑貨店", tone: "lavender" },
  { state: "locked", label: "展示コーナー" },
  { state: "locked", label: "演劇部" },
  { state: "locked", label: "吹奏楽部" },
  { state: "locked", label: "科学実験室" },
];

export function StampBookCard() {
  return (
    <Card
      icon={<Flag className="h-5 w-5" />}
      title="スタンプ帳"
      trailing={
        <span>
          <span className="text-primary text-xl font-extrabold">7</span>
          <span className="text-base-content/60"> / 20 個</span>
        </span>
      }
    >
      <div className="grid grid-cols-4 gap-x-2 gap-y-5 py-2 sm:grid-cols-5">
        {stamps.map((stamp, idx) =>
          stamp.state === "collected" ? (
            <StampCircle
              key={idx}
              state="collected"
              icon={<stamp.Icon className="h-8 w-8" />}
              label={stamp.label}
              tone={stamp.tone}
            />
          ) : (
            <StampCircle key={idx} state="locked" label={stamp.label} />
          ),
        )}
      </div>
      <div className="mt-6 flex justify-center">
        <PillButton variant="outline" trailing={<ChevronRight className="h-4 w-4" />}>
          スタンプ帳をもっとみる！
        </PillButton>
      </div>
      <div className="mt-4">
        <QrScanner />
      </div>
    </Card>
  );
}

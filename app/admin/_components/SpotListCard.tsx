"use client";

import {
  Bookmark,
  Camera,
  Ghost,
  Joystick,
  MoreHorizontal,
  Plus,
  UtensilsCrossed,
} from "lucide-react";
import { useState, type ComponentType, type SVGProps } from "react";
import { Card } from "../../_components/ui/Card";
import { QrCodeDialog } from "./QrCodeDialog";

type Tone = "red" | "yellow" | "green";

type Spot = {
  id: string;
  name: string;
  location: string;
  congestion: { label: string; tone: Tone };
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconBg: string;
  iconColor: string;
};

const spots: Spot[] = [
  {
    id: "yakisoba",
    name: "やきそば屋",
    location: "体育館",
    congestion: { label: "混雑中", tone: "red" },
    Icon: UtensilsCrossed,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-500",
  },
  {
    id: "obake",
    name: "お化け屋敷",
    location: "教室棟1F-101",
    congestion: { label: "やや混雑", tone: "yellow" },
    Icon: Ghost,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-500",
  },
  {
    id: "photospot",
    name: "フォトスポット",
    location: "中庭",
    congestion: { label: "空いている", tone: "green" },
    Icon: Camera,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    id: "sweets",
    name: "スイーツカフェ",
    location: "特別教室棟-201",
    congestion: { label: "空いている", tone: "green" },
    Icon: Bookmark,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-500",
  },
  {
    id: "game",
    name: "ゲームコーナー",
    location: "体育館奥",
    congestion: { label: "混雑中", tone: "red" },
    Icon: Joystick,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

const tonePill: Record<Tone, string> = {
  red: "bg-error/20 text-error",
  yellow: "bg-warning/20 text-warning",
  green: "bg-success/20 text-success",
};

export function SpotListCard() {
  const [qrSpot, setQrSpot] = useState<Spot | null>(null);

  return (
    <>
      <Card
        icon={<Bookmark className="h-5 w-5" />}
        title="スポット一覧"
        trailing={
          <button
            type="button"
            className="text-primary inline-flex items-center gap-1 text-sm font-bold"
          >
            <Plus className="h-4 w-4" />
            スポットを追加
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="table-sm w-full">
            <thead>
              <tr className="text-base-content/60 text-left text-xs font-semibold">
                <th className="px-2 py-2">スポット名</th>
                <th className="px-2 py-2">場所</th>
                <th className="px-2 py-2">混雑状況</th>
                <th className="px-2 py-2">QRコード</th>
                <th className="px-2 py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {spots.map((spot) => (
                <tr key={spot.id} className="border-base-200 border-t">
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-xl ${spot.iconBg} ${spot.iconColor}`}
                      >
                        <spot.Icon className="h-4 w-4" />
                      </span>
                      <span className="text-base-content text-sm font-semibold">{spot.name}</span>
                    </div>
                  </td>
                  <td className="text-base-content/70 px-2 py-3 text-sm">{spot.location}</td>
                  <td className="px-2 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${tonePill[spot.congestion.tone]}`}
                    >
                      {spot.congestion.label}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <button
                      type="button"
                      onClick={() => setQrSpot(spot)}
                      aria-label={`${spot.name} のQRコードを表示`}
                      className="border-base-200 hover:border-primary hover:text-primary bg-base-100 inline-flex h-8 w-8 items-center justify-center rounded-lg border"
                    >
                      <QrIcon />
                    </button>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="btn btn-xs btn-outline rounded-lg font-semibold"
                      >
                        編集
                      </button>
                      <button type="button" aria-label="その他" className="btn btn-xs btn-ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-center">
          <button type="button" className="text-primary text-sm font-semibold hover:underline">
            すべてのスポットを表示
          </button>
        </div>
      </Card>

      <QrCodeDialog
        open={qrSpot !== null}
        onClose={() => setQrSpot(null)}
        spotId={qrSpot?.id ?? ""}
        spotName={qrSpot?.name ?? ""}
      />
    </>
  );
}

function QrIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3z" />
      <path d="M20 14h1" />
      <path d="M14 20h3" />
      <path d="M20 17v4" />
    </svg>
  );
}

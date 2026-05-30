"use client";

import { ChevronRight, RefreshCw, Sparkles, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchStamps } from "@/lib/stamps";
import { getOrCreateUserId } from "@/lib/user";
import { Card } from "./ui/Card";

type Zone = {
  label: string;
  status: "空いている" | "やや混雑" | "混雑中";
  tone: "green" | "yellow" | "red" | "blue";
  style: string;
};

const zones: Zone[] = [
  {
    label: "体育館",
    status: "やや混雑",
    tone: "yellow",
    style: "left-[6%] top-[8%] w-[26%] h-[44%]",
  },
  {
    label: "中庭",
    status: "空いている",
    tone: "green",
    style: "left-[36%] top-[8%] w-[34%] h-[44%]",
  },
  {
    label: "教室棟1F",
    status: "混雑中",
    tone: "red",
    style: "right-[6%] top-[8%] w-[22%] h-[44%]",
  },
  {
    label: "教室棟2F",
    status: "やや混雑",
    tone: "yellow",
    style: "left-[16%] top-[56%] w-[34%] h-[34%]",
  },
  {
    label: "特別教室棟",
    status: "空いている",
    tone: "blue",
    style: "right-[10%] top-[56%] w-[28%] h-[34%]",
  },
];

const zoneBg: Record<Zone["tone"], string> = {
  green: "bg-success/20",
  yellow: "bg-warning/20",
  red: "bg-error/20",
  blue: "bg-info/20",
};

const zonePill: Record<Zone["tone"], string> = {
  green: "bg-success text-success-content",
  yellow: "bg-warning text-warning-content",
  red: "bg-error text-error-content",
  blue: "bg-info text-info-content",
};

export function CongestionCard() {
  const [stampCount, setStampCount] = useState<number>(0);

  useEffect(() => {
    async function init() {
      try {
        const userId = await getOrCreateUserId();
        const myStamps = await fetchStamps(userId);
        setStampCount(myStamps.length);
      } catch (e) {
        console.error(e);
      }
    }
    init();
  }, []);

  return (
    <Card
      icon={<Users className="h-5 w-5" />}
      title="会場の混雑状況"
      trailing={
        <span className="inline-flex items-center gap-1">
          最終更新 10:30
          <RefreshCw className="text-primary ml-1 h-3.5 w-3.5" />
        </span>
      }
    >
      <div className="bg-secondary/30 text-secondary-content mb-3 flex items-center gap-2 rounded-2xl px-3 py-2 text-[11px] font-semibold sm:text-xs">
        <Sparkles className="text-primary h-4 w-4 shrink-0" />
        <span>
          あなたが集めた
          <span className="text-primary mx-1 text-sm font-extrabold">{stampCount}</span>
          個のスタンプが、会場の混雑データに反映されています
        </span>
      </div>

      <div className="from-base-200 relative h-56 overflow-hidden rounded-2xl bg-gradient-to-br via-emerald-50 to-sky-50 sm:h-72">
        {zones.map((zone) => (
          <div
            key={zone.label}
            className={`absolute flex flex-col items-center justify-center rounded-2xl ${zoneBg[zone.tone]} ${zone.style} shadow-[inset_0_-4px_10px_rgba(0,0,0,0.04)]`}
          >
            <span className="text-base-content text-xs font-bold sm:text-sm">{zone.label}</span>
            <span
              className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold sm:text-[11px] ${zonePill[zone.tone]}`}
            >
              {zone.status}
            </span>
          </div>
        ))}

        <span className="text-base-content absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-bold">
          正門
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <LegendItem className="bg-success" label="空いている" />
          <LegendItem className="bg-warning" label="やや混雑" />
          <LegendItem className="bg-error" label="混雑中" />
          <LegendItem className="bg-neutral/40" label="満員に近い" />
        </div>
        <span className="text-primary inline-flex items-center gap-1 self-end text-sm font-semibold sm:self-auto">
          マップを大きくみる
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </Card>
  );
}

function LegendItem({ className, label }: { className: string; label: string }) {
  return (
    <span className="text-base-content inline-flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${className}`} />
      {label}
    </span>
  );
}

import { Map, RefreshCw } from "lucide-react";
import { Card } from "../../_components/ui/Card";

type Zone = {
  label: string;
  status: "空いている" | "やや混雑" | "混雑中";
  tone: "green" | "yellow" | "red" | "blue";
  style: string;
};

const zones: Zone[] = [
  { label: "体育館", status: "混雑中", tone: "red", style: "left-[6%] top-[8%] w-[26%] h-[44%]" },
  {
    label: "中庭",
    status: "やや混雑",
    tone: "yellow",
    style: "left-[36%] top-[8%] w-[34%] h-[44%]",
  },
  {
    label: "教室棟1F",
    status: "空いている",
    tone: "green",
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
    tone: "green",
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

export function CongestionMapCard() {
  return (
    <Card
      icon={<Map className="h-5 w-5" />}
      title="混雑状況マップ"
      trailing={
        <span className="inline-flex items-center gap-1">
          <RefreshCw className="text-primary h-3.5 w-3.5" />
          10:30更新
        </span>
      }
    >
      <div className="from-base-200 relative h-64 overflow-hidden rounded-2xl bg-gradient-to-br via-emerald-50 to-sky-50 sm:h-80">
        {zones.map((zone) => (
          <div
            key={zone.label}
            className={`absolute flex flex-col items-center justify-center rounded-2xl ${zoneBg[zone.tone]} ${zone.style} shadow-[inset_0_-4px_10px_rgba(0,0,0,0.04)]`}
          >
            <span className="text-base-content text-sm font-bold">{zone.label}</span>
            <span
              className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${zonePill[zone.tone]}`}
            >
              {zone.status}
            </span>
          </div>
        ))}
        <span className="text-base-content absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-bold">
          正門
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        <LegendItem className="bg-success" label="空いている" />
        <LegendItem className="bg-warning" label="やや混雑" />
        <LegendItem className="bg-error" label="混雑中" />
        <LegendItem className="bg-neutral/40" label="満員に近い" />
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

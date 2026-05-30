import { Bell, Map, Stamp, Users } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

type Stat = {
  label: string;
  value: string;
  unit: string;
  caption: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconBg: string;
  iconColor: string;
};

const stats: Stat[] = [
  {
    label: "総来場者数（本日）",
    value: "1,234",
    unit: "人",
    caption: "前日比 +256人",
    Icon: Users,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-500",
  },
  {
    label: "スタンプ取得数（本日）",
    value: "3,456",
    unit: "個",
    caption: "前日比 +789個",
    Icon: Stamp,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    label: "公開スポット数",
    value: "24",
    unit: "ヶ所",
    caption: "公開中のスポット",
    Icon: Map,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    label: "お知らせ未読数",
    value: "3",
    unit: "件",
    caption: "未読のお知らせ",
    Icon: Bell,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
  },
];

export function StatsRow() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ label, value, unit, caption, Icon, iconBg, iconColor }) => (
        <div key={label} className="card bg-base-100 shadow-sm">
          <div className="card-body flex flex-row items-center gap-3 p-4 sm:p-5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg} ${iconColor}`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="text-base-content/60 text-xs font-semibold">{label}</div>
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="text-base-content text-2xl font-extrabold">{value}</span>
                <span className="text-base-content/70 text-sm">{unit}</span>
              </div>
              <div className="text-base-content/50 mt-0.5 text-[11px] font-semibold">
                {caption.includes("+") ? (
                  <>
                    前日比 <span className="text-success">{caption.replace("前日比 ", "")} ↗</span>
                  </>
                ) : (
                  caption
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

import { useState, useMemo } from "react";
import { Signal } from "lucide-react";
import { Card } from "./ui/Card";
import { SegmentedControl } from "./ui/SegmentedControl";
import useSWR from "swr";
import { BoothWithCongestion } from "@/schemas";

type CongestionInfo = {
  label: string;
  dotClass: string;
  bgClass: string;
};

const CONGESTION_THRESHOLD_LOW = 5; // この値未満 → 空いている
const CONGESTION_THRESHOLD_HIGH = 15; // この値以上 → 混雑中

function getCongestionInfo(score: number): CongestionInfo {
  if (score < CONGESTION_THRESHOLD_LOW) {
    return {
      label: "空いている",
      dotClass: "bg-green-500",
      bgClass: "bg-green-50 text-green-700",
    };
  }
  if (score < CONGESTION_THRESHOLD_HIGH) {
    return {
      label: "やや混雑",
      dotClass: "bg-yellow-400",
      bgClass: "bg-yellow-50 text-yellow-700",
    };
  }
  return {
    label: "混雑中",
    dotClass: "bg-red-500",
    bgClass: "bg-red-50 text-red-700",
  };
}

type SortKey = "room" | "congestion";

type CongestionTableProps = {
  className?: string;
};

export function CongestionTable({ className = "" }: CongestionTableProps) {
  const [sortBy, setSortBy] = useState<SortKey>("room");

  const {
    data: booths,
    isLoading,
    error,
  } = useSWR<BoothWithCongestion[]>(
    "/api/booths",
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch booths");
      const booths = await res.json();
      return (await booths).booths;
    },
    { refreshInterval: 30000, revalidateOnFocus: true },
  );

  const sortedBooths = useMemo(() => {
    if (!booths) return null;
    const sorted = [...booths];
    if (sortBy === "room") {
      sorted.sort((a, b) => a.room.localeCompare(b.room, "ja"));
    } else {
      sorted.sort((a, b) => b.congestion_score - a.congestion_score);
    }
    return sorted;
  }, [booths, sortBy]);

  if (isLoading) {
    return (
      <Card icon={<Signal className="h-5 w-5" />} title="混雑状況" className={className}>
        <div className="flex items-center justify-center py-8 text-sm text-gray-500">
          読み込み中...
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card icon={<Signal className="h-5 w-5" />} title="混雑状況" className={className}>
        <div className="flex items-center justify-center py-8 text-sm text-red-500">
          混雑情報の取得に失敗しました
        </div>
      </Card>
    );
  }

  return (
    <Card icon={<Signal className="h-5 w-5" />} title="混雑状況" className={className}>
      {/* ソート切り替え */}
      <div className="mb-3 flex items-center justify-end">
        <SegmentedControl
          options={[
            { value: "room", label: "場所順" },
            { value: "congestion", label: "混雑順" },
          ]}
          value={sortBy}
          onChange={setSortBy}
        />
      </div>

      {sortedBooths ? (
        <div className="space-y-2">
          {sortedBooths.map((booth) => {
            const { label, dotClass, bgClass } = getCongestionInfo(booth.congestion_score);
            return (
              <div
                key={booth.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium">{booth.title}</p>
                    <p className="text-xs text-gray-500">{booth.room}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${bgClass}`}
                >
                  <span className={`h-2 w-2 rounded-full ${dotClass}`} />
                  {label}
                </span>
              </div>
            );
          })}
          {sortedBooths.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-500">表示するブースがありません</p>
          )}
        </div>
      ) : (
        <p className="py-4 text-center text-sm text-gray-500">表示するブースがありません</p>
      )}
    </Card>
  );
}

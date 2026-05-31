import { useEffect, useState } from "react";
import { Signal } from "lucide-react";
import { Card } from "./ui/Card";

type BoothWithCongestion = {
  id: string;
  title: string;
  room: string;
  stallholder: string;
  stamp_url: string;
  congestion_score: number;
};

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

type CongestionTableProps = {
  className?: string;
};

export function CongestionTable({ className = "" }: CongestionTableProps) {
  const [booths, setBooths] = useState<BoothWithCongestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/booths")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json() as Promise<{ booths: BoothWithCongestion[] }>;
      })
      .then((data) => {
        if (!cancelled) {
          setBooths(data.booths ?? []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
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
      <div className="space-y-2">
        {booths.map((booth) => {
          const { label, dotClass, bgClass } = getCongestionInfo(booth.congestion_score);
          return (
            <div
              key={booth.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
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
      </div>

      {booths.length === 0 && (
        <p className="py-4 text-center text-sm text-gray-500">表示するブースがありません</p>
      )}
    </Card>
  );
}

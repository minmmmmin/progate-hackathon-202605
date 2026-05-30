import { LineChart } from "lucide-react";
import { Card } from "../../_components/ui/Card";

type Activity = {
  time: string;
  user: string;
  spot: string;
};

const activities: Activity[] = [
  { time: "10:30", user: "山田 花子", spot: "フォトスポット" },
  { time: "10:29", user: "田中 太郎", spot: "お化け屋敷" },
  { time: "10:28", user: "佐藤 美咲", spot: "ゲームコーナー" },
  { time: "10:27", user: "鈴木 一郎", spot: "スイーツカフェ" },
  { time: "10:26", user: "伊藤 翔", spot: "体育館" },
];

export function RealtimeActivityCard() {
  return (
    <Card icon={<LineChart className="h-5 w-5" />} title="スタンプ取得のリアルタイム状況">
      <ul className="flex flex-col gap-2">
        {activities.map(({ time, user, spot }) => (
          <li key={`${time}-${user}`} className="flex items-center gap-3 text-sm">
            <span className="text-base-content/50 w-12 shrink-0 text-xs font-semibold tabular-nums">
              {time}
            </span>
            <span className="bg-base-200 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-base">
              <span aria-hidden>🙂</span>
            </span>
            <span className="text-base-content">
              <span className="font-semibold">{user}</span> さんが{" "}
              <span className="text-primary font-bold">{spot}</span> を取得！
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 text-center">
        <button type="button" className="text-primary text-sm font-semibold hover:underline">
          すべての履歴を表示
        </button>
      </div>
    </Card>
  );
}

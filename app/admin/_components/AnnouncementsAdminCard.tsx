import { Megaphone, Plus } from "lucide-react";
import { Card } from "../../_components/ui/Card";

type Announcement = {
  message: string;
  time: string;
  status: "公開中" | "下書き";
  isNew?: boolean;
};

const announcements: Announcement[] = [
  { message: "スタンプラリー開催中！", time: "10:00", status: "公開中", isNew: true },
  { message: "景品交換は15:00までだよ〜！", time: "9:50", status: "公開中" },
  { message: "中庭ステージの時間が変更になりました", time: "9:30", status: "公開中" },
];

export function AnnouncementsAdminCard() {
  return (
    <Card
      icon={<Megaphone className="h-5 w-5" />}
      title="お知らせ管理"
      trailing={
        <button
          type="button"
          className="text-primary inline-flex items-center gap-1 text-sm font-bold"
        >
          <Plus className="h-4 w-4" />
          新規投稿
        </button>
      }
    >
      <ul className="flex flex-col gap-3">
        {announcements.map(({ message, time, status, isNew }) => (
          <li key={message} className="flex items-center gap-3 text-sm">
            {isNew ? (
              <span className="bg-primary text-primary-content shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold">
                NEW
              </span>
            ) : (
              <span className="w-[34px] shrink-0" />
            )}
            <span className="text-base-content flex-1 truncate font-semibold">{message}</span>
            <span className="bg-success/20 text-success shrink-0 rounded-full px-2 py-0.5 text-xs font-bold">
              {status}
            </span>
            <span className="text-base-content/50 w-12 shrink-0 text-right text-xs tabular-nums">
              {time}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 text-center">
        <button type="button" className="text-primary text-sm font-semibold hover:underline">
          すべてのお知らせを表示
        </button>
      </div>
    </Card>
  );
}

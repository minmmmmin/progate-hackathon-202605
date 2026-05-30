"use client";

import { Users } from "lucide-react";
import { useState } from "react";
import { Card } from "../../_components/ui/Card";

type Status = "空いている" | "やや混雑" | "混雑中";

const zones = ["体育館", "教室棟1F", "教室棟2F", "特別教室棟", "中庭"];

const initialState: Record<string, Status> = {
  体育館: "混雑中",
  教室棟1F: "やや混雑",
  教室棟2F: "やや混雑",
  特別教室棟: "空いている",
  中庭: "空いている",
};

const statusOptions: Status[] = ["空いている", "やや混雑", "混雑中"];

const pillTone: Record<Status, string> = {
  空いている: "bg-success/20 text-success",
  やや混雑: "bg-warning/20 text-warning",
  混雑中: "bg-error/20 text-error",
};

export function BulkUpdateCard() {
  const [statuses, setStatuses] = useState<Record<string, Status>>(initialState);

  return (
    <Card icon={<Users className="h-5 w-5" />} title="混雑状況の一括更新">
      <ul className="flex flex-col gap-3">
        {zones.map((zone) => (
          <li key={zone} className="flex items-center gap-3 text-sm">
            <span className="text-base-content w-28 shrink-0 font-semibold">{zone}</span>
            <div className="relative flex-1">
              <select
                aria-label={`${zone} の混雑状況`}
                value={statuses[zone]}
                onChange={(e) =>
                  setStatuses((prev) => ({ ...prev, [zone]: e.target.value as Status }))
                }
                className={`w-full appearance-none rounded-full px-3 py-1.5 text-xs font-bold ${pillTone[statuses[zone]]}`}
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className="btn btn-primary mt-4 w-full rounded-full font-semibold">
        一括更新する
      </button>
    </Card>
  );
}

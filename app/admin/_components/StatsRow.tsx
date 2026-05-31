"use client";

import { Map } from "lucide-react";
import useSWR from "swr";
import type { BoothWithCongestion } from "@/schemas";

export function StatsRow() {
  const { data: spots } = useSWR<BoothWithCongestion[]>(
    "/api/booths",
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch spots");
      const json = await res.json();
      return json.booths;
    },
    { refreshInterval: 30000, revalidateOnFocus: true },
  );

  const spotCount = spots?.length ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body flex flex-row items-center gap-3 p-4 sm:p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <Map className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <div className="text-base-content/60 text-xs font-semibold">公開スポット数</div>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-base-content text-2xl font-extrabold">
                {spots === undefined ? "—" : spotCount.toLocaleString()}
              </span>
              <span className="text-base-content/70 text-sm">ヶ所</span>
            </div>
            <div className="text-base-content/50 mt-0.5 text-[11px] font-semibold">
              公開中のスポット
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

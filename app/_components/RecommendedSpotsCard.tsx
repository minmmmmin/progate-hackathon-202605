"use client";

import { useEffect, useState } from "react";
import { MapPin, Sparkles, Users } from "lucide-react";
import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";
import type { BoothWithCongestion } from "@/schemas";

type Props = {
  booths: BoothWithCongestion[];
};

function congestionLabel(score: number): { text: string; tone: "green" | "yellow" | "red" } {
  if (score < 5) return { text: "空いている", tone: "green" };
  if (score < 10) return { text: "やや混雑", tone: "yellow" };
  return { text: "混雑", tone: "red" };
}

function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

export function RecommendedSpotsCard({ booths }: Props) {
  const [displayBooths, setDisplayBooths] = useState<BoothWithCongestion[]>([]);

  useEffect(() => {
    const vacant = booths.filter((b) => b.congestion_score < 5);
    setDisplayBooths(pickRandom(vacant, 3));
  }, [booths]);

  if (displayBooths.length === 0) {
    return (
      <Card icon={<Sparkles className="h-5 w-5" />} title="いま空いているおすすめスポット！">
        <p className="text-base-content/50 py-6 text-center text-sm">
          現在空いているスポットはありません
        </p>
      </Card>
    );
  }

  return (
    <Card icon={<Sparkles className="h-5 w-5" />} title="いま空いているおすすめスポット！">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {displayBooths.map((booth) => {
          const congestion = congestionLabel(booth.congestion_score);

          return (
            <div
              key={booth.id}
              className="rounded-2xl border border-success/20 bg-success/5 p-4"
            >
              <div className="mb-2">
                <Badge tone={congestion.tone}>{congestion.text}</Badge>
              </div>
              <div className="text-base-content text-sm font-bold">{booth.title}</div>
              <div className="text-base-content/60 mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {booth.room}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {booth.stallholder}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

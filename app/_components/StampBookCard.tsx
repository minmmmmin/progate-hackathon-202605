"use client";

import { ChevronRight, Flag, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchBooths, fetchStamps } from "@/lib/stamps";

import type { Booth } from "@/schemas";
import { Card } from "./ui/Card";
import { PillButton } from "./ui/PillButton";
import { StampCircle, type StampTone } from "./ui/StampCircle";
import { useUserId } from "../_hooks/useUserId";

const tones: StampTone[] = ["pink", "peach", "mint", "sky", "lemon", "lavender"];

export function StampBookCard() {
  const [booths, setBooths] = useState<Booth[]>([]);
  const [collectedStamps, setCollectedStamps] = useState<Booth[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useUserId();

  useEffect(() => {
    if (!userId) return;
    const id = userId;
    async function init() {
      try {
        const [allBooths, myStamps] = await Promise.all([fetchBooths(), fetchStamps(id)]);
        setBooths(allBooths);
        setCollectedStamps(myStamps);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [userId]);

  const collectedIds = new Set(collectedStamps.map((s) => s.id));
  const displayBooths = booths.slice(0, 10); // トップページには最大10個表示

  return (
    <Card
      icon={<Flag className="h-5 w-5" />}
      title="スタンプ帳"
      trailing={
        loading ? (
          <Loader2 className="text-base-content/20 h-4 w-4 animate-spin" />
        ) : (
          <span>
            <span className="text-primary text-xl font-extrabold">{collectedStamps.length}</span>
            <span className="text-base-content/60"> / {booths.length} 個</span>
          </span>
        )
      }
    >
      <div className="grid grid-cols-4 gap-x-2 gap-y-5 py-2 sm:grid-cols-5">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="bg-base-content/5 aspect-square w-full max-w-24 animate-pulse rounded-full" />
                <div className="bg-base-content/5 h-3 w-12 animate-pulse rounded" />
              </div>
            ))
          : displayBooths.map((booth, idx) => {
              const isCollected = collectedIds.has(booth.id);
              return isCollected ? (
                <StampCircle
                  key={booth.id}
                  state="collected"
                  imageSrc={booth.stamp_url}
                  label={booth.title}
                  tone={tones[idx % tones.length]}
                />
              ) : (
                <StampCircle key={booth.id} state="locked" label={booth.title} />
              );
            })}
      </div>
      {!loading && (
        <div className="mt-6 flex justify-center">
          <Link href="/stamps" className="w-full sm:w-auto">
            <PillButton
              variant="outline"
              trailing={<ChevronRight className="h-4 w-4" />}
              className="w-full"
            >
              スタンプ帳をもっとみる
            </PillButton>
          </Link>
        </div>
      )}
    </Card>
  );
}

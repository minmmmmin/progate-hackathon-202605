"use client";

import { BookOpenCheck, ChevronLeft, Loader2, MapPin, User, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchBooths, fetchStamps, sortBooths, type SortMode } from "@/lib/stamps";
import type { Booth, CollectedStamp } from "@/schemas";
import { Sidebar } from "../_components/Sidebar";
import { TopBar } from "../_components/TopBar";
import { Card } from "../_components/ui/Card";
import { PillButton } from "../_components/ui/PillButton";
import { StampCircle, type StampTone } from "../_components/ui/StampCircle";
import { useUserId } from "@/hooks/useUserId";

const DRAWER_ID = "main-drawer";
const tones: StampTone[] = ["pink", "peach", "mint", "sky", "lemon", "lavender"];

export default function StampsPage() {
  const [booths, setBooths] = useState<Booth[]>([]);
  const [collectedStamps, setCollectedStamps] = useState<CollectedStamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>("class");
  const [selectedBooth, setSelectedBooth] = useState<{
    booth: Booth;
    collected?: CollectedStamp;
    tone: StampTone;
  } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { userId } = useUserId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selectedBooth && !dialog.open) {
      dialog.showModal();
    } else if (!selectedBooth && dialog.open) {
      dialog.close();
    }
  }, [selectedBooth]);

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

  const collectedMap = useMemo(
    () => new Map(collectedStamps.map((s) => [s.id, s])),
    [collectedStamps],
  );

  const sortedBooths = useMemo(
    () => sortBooths(booths, collectedMap, sortMode),
    [booths, collectedMap, sortMode],
  );

  return (
    <div className="drawer bg-base-100 text-base-content min-h-screen">
      <input id={DRAWER_ID} type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <div className="mx-auto w-full max-w-360 space-y-5 px-3 py-4 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8">
          <TopBar drawerId={DRAWER_ID} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <div className="hidden lg:block">
              <Sidebar />
            </div>

            <main className="flex flex-col gap-5 sm:gap-6">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <PillButton variant="outline" className="h-10 w-10 p-0">
                    <ChevronLeft className="h-5 w-5" />
                  </PillButton>
                </Link>
                <h1 className="text-2xl font-extrabold tracking-tight italic">STAMP BOOK</h1>
              </div>

              <Card
                icon={<BookOpenCheck className="h-5 w-5" />}
                title="あなたのスタンプ帳"
                trailing={
                  loading ? (
                    <Loader2 className="text-base-content/20 h-4 w-4 animate-spin" />
                  ) : (
                    <span>
                      <span className="text-primary text-xl font-extrabold">
                        {collectedStamps.length}
                      </span>
                      <span className="text-base-content/60"> / {booths.length} 個</span>
                    </span>
                  )
                }
              >
                <div role="tablist" className="tabs tabs-boxed bg-base-200/60 w-fit">
                  <button
                    type="button"
                    role="tab"
                    className={`tab ${sortMode === "class" ? "tab-active" : ""}`}
                    onClick={() => setSortMode("class")}
                  >
                    クラス順
                  </button>
                  <button
                    type="button"
                    role="tab"
                    className={`tab ${sortMode === "acquired" ? "tab-active" : ""}`}
                    onClick={() => setSortMode("acquired")}
                  >
                    入手順
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-x-2 gap-y-10 py-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                  {loading
                    ? Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                          <div className="bg-base-content/5 aspect-square w-full max-w-24 animate-pulse rounded-full" />
                          <div className="bg-base-content/5 h-3 w-16 animate-pulse rounded" />
                        </div>
                      ))
                    : sortedBooths.map((booth, idx) => {
                        const collected = collectedMap.get(booth.id);
                        const tone = tones[idx % tones.length];
                        return (
                          <button
                            key={booth.id}
                            type="button"
                            className="group flex flex-col items-center transition-transform active:scale-95"
                            onClick={() => setSelectedBooth({ booth, collected, tone })}
                          >
                            <StampCircle
                              state={collected ? "collected" : "locked"}
                              imageSrc={collected ? booth.stamp_url : undefined}
                              label={booth.title}
                              tone={tone}
                              size={20}
                            />
                          </button>
                        );
                      })}
                </div>
              </Card>
            </main>
          </div>
        </div>
      </div>

      <div className="drawer-side lg:hidden">
        <label htmlFor={DRAWER_ID} aria-label="メニューを閉じる" className="drawer-overlay" />
        <Sidebar />
      </div>

      {/* 詳細ダイアログ */}
      <dialog
        ref={dialogRef}
        className="modal modal-bottom sm:modal-middle"
        onClose={() => setSelectedBooth(null)}
      >
        {selectedBooth && (
          <>
            <div className="modal-box overflow-hidden rounded-t-[2.5rem] p-0 sm:rounded-4xl">
              <div
                className={`bg-liner-to-br h-32 w-full ${
                  selectedBooth.collected
                    ? "from-secondary/20 to-primary/20"
                    : "from-base-200 to-base-300"
                } relative flex items-center justify-center`}
              >
                <form method="dialog">
                  <button
                    aria-label="閉じる"
                    className="btn btn-circle btn-sm btn-ghost absolute top-4 right-4"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </form>
                <div className="mt-16 w-32 translate-y-4 transform">
                  <StampCircle
                    state={selectedBooth.collected ? "collected" : "locked"}
                    imageSrc={selectedBooth.collected ? selectedBooth.booth.stamp_url : undefined}
                    tone={selectedBooth.tone}
                    size={32}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center px-6 pt-16 pb-8 text-center">
                <h3 className="text-base-content text-2xl font-black tracking-tight italic">
                  {selectedBooth.booth.title}
                </h3>

                <div className="mt-6 w-full space-y-4">
                  <div className="bg-base-200/50 flex items-center gap-3 rounded-2xl p-4">
                    <div className="bg-base-100 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-base-content/40 text-[10px] font-bold tracking-widest uppercase">
                        Location
                      </div>
                      <div className="text-base-content font-bold">{selectedBooth.booth.room}</div>
                    </div>
                  </div>

                  <div className="bg-base-200/50 flex items-center gap-3 rounded-2xl p-4">
                    <div className="bg-base-100 text-secondary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-base-content/40 text-[10px] font-bold tracking-widest uppercase">
                        Stallholder
                      </div>
                      <div className="text-base-content font-bold">
                        {selectedBooth.booth.stallholder}
                      </div>
                    </div>
                  </div>
                </div>

                {!selectedBooth.collected && (
                  <div className="bg-base-200 text-base-content/70 mt-8 rounded-2xl px-6 py-4">
                    <p className="text-sm font-bold">まだスタンプを持っていません</p>
                    <p className="text-base-content/50 mt-1 text-xs">
                      {selectedBooth.booth.room}に行ってスタンプをゲットしよう！
                    </p>
                  </div>
                )}

                <form method="dialog" className="mt-8 w-full">
                  <button className="btn btn-block btn-primary rounded-2xl font-bold">
                    とじる
                  </button>
                </form>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button aria-label="閉じる">close</button>
            </form>
          </>
        )}
      </dialog>
    </div>
  );
}

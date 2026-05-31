"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CongestionCard } from "./_components/CongestionCard";
import { RecommendedSpotsCard } from "./_components/RecommendedSpotsCard";
import { Sidebar } from "./_components/Sidebar";
import { StampAcquiredDialog } from "./_components/StampAcquiredDialog";
import { StampBookCard } from "./_components/StampBookCard";
import { TopBar } from "./_components/TopBar";
import { useUserId } from "../hooks/useUserId";
import { useToast } from "@/hooks/useToast";
import { registerScan } from "@/lib/scanRegistration";
import { invalidateStamps } from "@/lib/stamps";
import type { Booth, BoothWithCongestion } from "@/schemas";

const DRAWER_ID = "main-drawer";

export function HomeClient() {
  const { userId } = useUserId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showError } = useToast();
  const processedBoothIdRef = useRef<string | null>(null);
  const [stampRefreshKey, setStampRefreshKey] = useState(0);
  const [acquiredStamp, setAcquiredStamp] = useState<Booth | null>(null);

  const boothId = searchParams.get("id");
  const cleanSearchParams = new URLSearchParams(searchParams.toString());
  cleanSearchParams.delete("id");
  const cleanUrl = cleanSearchParams.toString()
    ? `${pathname}?${cleanSearchParams.toString()}`
    : pathname;

  const handleStampAcquired = useCallback(
    (booth: Booth) => {
      if (!userId) return;
      invalidateStamps(userId);
      setStampRefreshKey((current) => current + 1);
      setAcquiredStamp(booth);
    },
    [userId],
  );

  const [booths, setBooths] = useState<BoothWithCongestion[]>([]);

  useEffect(() => {
    if (!boothId || !userId) return;
    if (processedBoothIdRef.current === boothId) return;

    let cancelled = false;
    processedBoothIdRef.current = boothId;

    void (async () => {
      try {
        const result = await registerScan({ userId, boothId });
        handleStampAcquired(result.booth);
        if (cancelled) return;
      } catch (err) {
        if (cancelled) return;
        showError(err instanceof Error ? err.message : "通信エラーが発生しました。");
      } finally {
        if (!cancelled) {
          router.replace(cleanUrl, { scroll: false });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [boothId, cleanUrl, handleStampAcquired, router, showError, userId]);

  // ブース一覧を取得（マウント & showError の参照が変わったとき）
  const showErrorRef = useRef(showError);
  showErrorRef.current = showError;

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const res = await fetch("/api/booths");
        if (!res.ok) throw new Error("ブース情報の取得に失敗しました");
        const data = (await res.json()) as { booths: BoothWithCongestion[] };
        if (!cancelled) setBooths(data.booths);
      } catch {
        if (!cancelled) showErrorRef.current("ブース情報の取得に失敗しました");
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="drawer bg-base-100 text-base-content min-h-screen">
      <input id={DRAWER_ID} type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <div className="mx-auto w-full max-w-360 space-y-5 px-3 py-4 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8">
          <TopBar drawerId={DRAWER_ID} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <div className="hidden lg:block">
              <Sidebar refreshKey={stampRefreshKey} />
            </div>

            <main className="grid auto-rows-min grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
              <StampBookCard refreshKey={stampRefreshKey} onStampAcquired={handleStampAcquired} />
              <CongestionCard />
              <div className="lg:col-span-2">
                <RecommendedSpotsCard booths={booths} />
              </div>
            </main>
          </div>
        </div>
      </div>

      <div className="drawer-side lg:hidden">
        <label htmlFor={DRAWER_ID} aria-label="メニューを閉じる" className="drawer-overlay" />
        <Sidebar refreshKey={stampRefreshKey} />
      </div>
      <StampAcquiredDialog
        key={acquiredStamp?.id ?? "none"}
        stamp={acquiredStamp}
        onClose={() => setAcquiredStamp(null)}
      />
    </div>
  );
}

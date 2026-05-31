"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CongestionCard } from "./_components/CongestionCard";
import { RecommendedSpotsCard } from "./_components/RecommendedSpotsCard";
import { Sidebar } from "./_components/Sidebar";
import { StampBookCard } from "./_components/StampBookCard";
import { TopBar } from "./_components/TopBar";
import { useQrScanner } from "./_components/QrScanner";
import { useUserId } from "../hooks/useUserId";
import { useToast } from "@/hooks/useToast";
import { registerScan } from "@/lib/scanRegistration";
import { invalidateStamps } from "@/lib/stamps";

const DRAWER_ID = "main-drawer";

export function HomeClient() {
  const { userId } = useUserId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showError } = useToast();
  const { notifyStampAcquired, acquiredStamp } = useQrScanner();
  const processedBoothIdRef = useRef<string | null>(null);
  const stampRefreshKey = acquiredStamp?.id ?? "";

  const boothId = searchParams.get("id");
  const cleanSearchParams = new URLSearchParams(searchParams.toString());
  cleanSearchParams.delete("id");
  const cleanUrl = cleanSearchParams.toString()
    ? `${pathname}?${cleanSearchParams.toString()}`
    : pathname;

  useEffect(() => {
    if (!acquiredStamp || !userId) return;
    invalidateStamps(userId);
  }, [acquiredStamp, userId]);

  useEffect(() => {
    if (!boothId || !userId) return;
    if (processedBoothIdRef.current === boothId) return;

    let cancelled = false;
    processedBoothIdRef.current = boothId;

    void (async () => {
      try {
        const result = await registerScan({ userId, boothId });
        if (cancelled) return;
        notifyStampAcquired(result.booth);
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
  }, [boothId, cleanUrl, notifyStampAcquired, router, showError, userId]);

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
              <StampBookCard refreshKey={stampRefreshKey} />
              <CongestionCard />
              <div className="lg:col-span-2">
                <RecommendedSpotsCard />
              </div>
            </main>
          </div>
        </div>
      </div>

      <div className="drawer-side lg:hidden">
        <label htmlFor={DRAWER_ID} aria-label="メニューを閉じる" className="drawer-overlay" />
        <Sidebar refreshKey={stampRefreshKey} />
      </div>
    </div>
  );
}

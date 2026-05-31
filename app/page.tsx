"use client";

import { CongestionCard } from "./_components/CongestionCard";
import { CongestionTable } from "./_components/CongestionTable";
import { RecommendedSpotsCard } from "./_components/RecommendedSpotsCard";
import { Sidebar } from "./_components/Sidebar";
import { StampBookCard } from "./_components/StampBookCard";
import { TopBar } from "./_components/TopBar";
import { useUserId } from "../hooks/useUserId";

const DRAWER_ID = "main-drawer";

export default function Home() {
  useUserId();

  return (
    <div className="drawer bg-base-100 text-base-content min-h-screen">
      <input id={DRAWER_ID} type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <div className="mx-auto w-full max-w-[1440px] space-y-5 px-3 py-4 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8">
          <TopBar drawerId={DRAWER_ID} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <div className="hidden lg:block">
              <Sidebar />
            </div>

            <main className="grid auto-rows-min grid-cols-1 gap-5 sm:gap-6">
              <StampBookCard />
              <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
                <CongestionCard />
                <CongestionTable />
              </div>
              <RecommendedSpotsCard />
            </main>
          </div>
        </div>
      </div>

      <div className="drawer-side lg:hidden">
        <label htmlFor={DRAWER_ID} aria-label="メニューを閉じる" className="drawer-overlay" />
        <Sidebar />
      </div>
    </div>
  );
}

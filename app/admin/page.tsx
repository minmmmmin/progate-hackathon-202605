import { AdminSidebar } from "./_components/AdminSidebar";
import { AdminTopBar } from "./_components/AdminTopBar";
import { AnnouncementsAdminCard } from "./_components/AnnouncementsAdminCard";
import { BulkUpdateCard } from "./_components/BulkUpdateCard";
import { CongestionMapCard } from "./_components/CongestionMapCard";
import { RealtimeActivityCard } from "./_components/RealtimeActivityCard";
import { SpotListCard } from "./_components/SpotListCard";
import { StatsRow } from "./_components/StatsRow";

const DRAWER_ID = "admin-drawer";

export default function AdminDashboard() {
  return (
    <div className="drawer bg-base-100 text-base-content min-h-screen">
      <input id={DRAWER_ID} type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <div className="mx-auto w-full max-w-[1440px] space-y-5 px-3 py-4 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <div className="hidden lg:block">
              <AdminSidebar />
            </div>

            <div className="space-y-5 sm:space-y-6">
              <AdminTopBar drawerId={DRAWER_ID} lastUpdated="2026/05/30 10:30" />
              <StatsRow />
              <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
                <CongestionMapCard />
                <SpotListCard />
              </div>
              <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3">
                <RealtimeActivityCard />
                <BulkUpdateCard />
                <AnnouncementsAdminCard />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="drawer-side lg:hidden">
        <label htmlFor={DRAWER_ID} aria-label="メニューを閉じる" className="drawer-overlay" />
        <AdminSidebar />
      </div>
    </div>
  );
}

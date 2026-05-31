"use client";

import { Bookmark, Download, MoreHorizontal, Plus, Printer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Card } from "../../_components/ui/Card";
import useSWR from "swr";
import Image from "next/image";
import { BoothWithCongestion } from "@/schemas";
import { QrCodeDialog } from "./QrCodeDialog";
import { downloadPostersBulk, printPostersBulk } from "./qrPosterUtils";

export const SpotListCard = () => {
  const [qrSpot, setQrSpot] = useState<BoothWithCongestion | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [printingAll, setPrintingAll] = useState(false);

  const { data: spots, isLoading } = useSWR<BoothWithCongestion[]>(
    "/api/booths",
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch spots");

      const json = await res.json();
      return json.booths;
    },
    { refreshInterval: 30000, revalidateOnFocus: true },
  );

  const bulkTargets =
    spots?.map((spot) => ({
      spotId: spot.id,
      spotName: spot.title,
      stampURL: spot.stamp_url,
    })) ?? [];

  const handleBulkDownload = async () => {
    if (bulkTargets.length === 0) return;
    setDownloadingAll(true);
    try {
      await downloadPostersBulk(bulkTargets);
    } finally {
      setDownloadingAll(false);
    }
  };

  const handleBulkPrint = async () => {
    if (bulkTargets.length === 0) return;
    setPrintingAll(true);
    try {
      await printPostersBulk(bulkTargets);
    } finally {
      setPrintingAll(false);
    }
  };

  return (
    <>
      <Card
        icon={<Bookmark className="h-5 w-5" />}
        title="スポット一覧"
        trailing={
          <Link
            href="/admin/spots/new"
            className="text-primary inline-flex items-center gap-1 text-sm font-bold"
          >
            <Plus className="h-4 w-4" />
            スポットを追加
          </Link>
        }
        loading={spots === undefined || isLoading}
      >
        <div className="overflow-x-auto">
          <table className="table-sm w-full">
            <thead>
              <tr className="text-base-content/60 text-left text-xs font-semibold">
                <th className="px-2 py-2">スポット名</th>
                <th className="px-2 py-2">場所</th>
                {/* <th className="px-2 py-2">混雑状況</th> */}
                <th className="px-2 py-2">QRコード</th>
                <th className="px-2 py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {spots?.map((spot) => (
                <tr key={spot.id} className="border-base-200 border-t">
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-xl`}>
                        <Image
                          src={spot.stamp_url}
                          alt={`${spot.title}のスタンプ`}
                          width={20}
                          height={20}
                          className="h-5 w-5 object-cover"
                        />
                      </span>
                      <span className="text-base-content text-sm font-semibold">{spot.title}</span>
                    </div>
                  </td>
                  <td className="text-base-content/70 px-2 py-3 text-sm">{spot.room}</td>
                  {/* <td className="px-2 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold`}
                      >
                        {spot.congestion}
                      </span>
                    </td> */}
                  <td className="px-2 py-3">
                    <button
                      type="button"
                      onClick={() => setQrSpot(spot)}
                      aria-label={`${spot.title} のQRコードを表示`}
                      className="border-base-200 hover:border-primary hover:text-primary bg-base-100 inline-flex h-8 w-8 items-center justify-center rounded-lg border"
                    >
                      <QrIcon />
                    </button>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="btn btn-xs btn-outline rounded-lg font-semibold"
                      >
                        編集
                      </button>
                      <button type="button" aria-label="その他" className="btn btn-xs btn-ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-center">
          <button type="button" className="text-primary text-sm font-semibold hover:underline">
            すべてのスポットを表示
          </button>
        </div>
        <div className="mt-3 flex justify-around gap-4 text-center">
          <button
            type="button"
            className="btn btn-primary flex-1 rounded-full font-semibold"
            onClick={handleBulkDownload}
            disabled={downloadingAll || printingAll || bulkTargets.length === 0}
          >
            <Download className="h-4 w-4" />
            {downloadingAll ? "一括保存中…" : "QRコード一括DL"}
          </button>
          <button
            type="button"
            className="btn btn-secondary flex-1 rounded-full font-semibold"
            onClick={handleBulkPrint}
            disabled={printingAll || downloadingAll || bulkTargets.length === 0}
          >
            <Printer className="h-4 w-4" />
            {printingAll ? "一括印刷準備中…" : "QRコード一括印刷"}
          </button>
        </div>
      </Card>

      <QrCodeDialog
        open={qrSpot !== null}
        onClose={() => setQrSpot(null)}
        spotId={qrSpot?.id || ""}
        spotName={qrSpot?.title ?? ""}
        stampURL={qrSpot?.stamp_url ?? ""}
      />
    </>
  );
};

function QrIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3z" />
      <path d="M20 14h1" />
      <path d="M14 20h3" />
      <path d="M20 17v4" />
    </svg>
  );
}

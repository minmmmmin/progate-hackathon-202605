"use client";

import type { ScanResponse } from "@/schemas";

const SCAN_ERROR_MESSAGE = "エラーが発生しました";

export const extractBoothIdFromTarget = (target: string): string | null => {
  try {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost";
    return new URL(target, baseUrl).searchParams.get("id");
  } catch {
    return null;
  }
};

type RegisterScanParams = {
  userId: string;
  boothId: string;
};

export const registerScan = async ({
  userId,
  boothId,
}: RegisterScanParams): Promise<ScanResponse> => {
  if (!userId) {
    throw new Error("ユーザーIDがありません");
  }

  if (!boothId) {
    throw new Error("無効なQRコードです");
  }

  const res = await fetch("/api/scans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, booth_id: boothId }),
  });

  const data = (await res.json()) as Partial<ScanResponse> & { message?: string };

  if (!res.ok) {
    throw new Error(data.message || SCAN_ERROR_MESSAGE);
  }

  if (!data.message || !data.booth) {
    throw new Error(SCAN_ERROR_MESSAGE);
  }

  return data as ScanResponse;
};

import type { Booth, CollectedStamp } from "@/schemas";

export async function fetchStamps(userId: string): Promise<CollectedStamp[]> {
  const res = await fetch("/api/users/me/stamps", {
    headers: { "x-user-id": userId },
  });
  if (!res.ok) throw new Error("スタンプ取得に失敗しました");
  const body = (await res.json()) as { stamps: CollectedStamp[] };
  return body.stamps;
}

export async function fetchBooths(): Promise<Booth[]> {
  const res = await fetch("/api/booths");
  if (!res.ok) throw new Error("ブース取得に失敗しました");
  const body = (await res.json()) as { booths: Booth[] };
  return body.booths;
}

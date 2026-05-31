import type { Booth, CollectedStamp } from "@/schemas";

const stampsCache = new Map<string, Promise<CollectedStamp[]>>();
let boothsCache: Promise<Booth[]> | null = null;

export async function fetchStamps(userId: string): Promise<CollectedStamp[]> {
  const cached = stampsCache.get(userId);
  if (cached) return cached;

  const promise = (async () => {
    const res = await fetch("/api/users/me/stamps", {
      headers: { "x-user-id": userId },
    });
    if (!res.ok) {
      stampsCache.delete(userId);
      throw new Error("スタンプ取得に失敗しました");
    }
    const body = (await res.json()) as { stamps: CollectedStamp[] };
    return body.stamps;
  })();

  stampsCache.set(userId, promise);
  return promise;
}

export async function fetchBooths(): Promise<Booth[]> {
  if (boothsCache) return boothsCache;

  boothsCache = (async () => {
    const res = await fetch("/api/booths");
    if (!res.ok) {
      boothsCache = null;
      throw new Error("ブース取得に失敗しました");
    }
    const body = (await res.json()) as { booths: Booth[] };
    return body.booths;
  })();

  return boothsCache;
}

export function invalidateStamps(userId?: string) {
  if (userId) stampsCache.delete(userId);
  else stampsCache.clear();
}

export function invalidateBooths() {
  boothsCache = null;
}

export type SortMode = "class" | "acquired";

export const compareByClass = (a: Booth, b: Booth) =>
  a.stallholder.localeCompare(b.stallholder, "ja", { numeric: true });

export function sortBooths(
  booths: Booth[],
  collectedMap: Map<string, CollectedStamp>,
  mode: SortMode,
): Booth[] {
  if (mode === "class") {
    return [...booths].sort(compareByClass);
  }
  const collected = booths
    .filter((b) => collectedMap.has(b.id))
    .sort((a, b) => {
      const ta = collectedMap.get(a.id)!.acquired_at;
      const tb = collectedMap.get(b.id)!.acquired_at;
      return ta.localeCompare(tb);
    });
  const locked = booths.filter((b) => !collectedMap.has(b.id)).sort(compareByClass);
  return [...collected, ...locked];
}

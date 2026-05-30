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

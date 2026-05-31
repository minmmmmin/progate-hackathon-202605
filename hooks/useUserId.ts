"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "user-id";

type UseUserIdReturn = {
  userId: string | undefined;
  isLoading: boolean;
  error: Error | undefined;
};

// 同時にマウントされた複数コンポーネントから POST /api/users が重複発火しないよう、
// モジュールスコープで in-flight Promise を共有する
let inflight: Promise<string> | null = null;

async function ensureUserId(): Promise<string> {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) {
    // 旧実装 (useLocalStorage) が JSON エンコードして保存していた値を素の文字列に正規化
    const normalized = existing.startsWith('"') ? (JSON.parse(existing) as string) : existing;
    if (normalized !== existing) {
      localStorage.setItem(STORAGE_KEY, normalized);
    }
    return normalized;
  }

  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const res = await fetch("/api/users", { method: "POST" });
      if (!res.ok) {
        throw new Error("ユーザー作成に失敗しました");
      }
      const data = (await res.json()) as { user_id: string };
      localStorage.setItem(STORAGE_KEY, data.user_id);
      return data.user_id;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

export const useUserId = (): UseUserIdReturn => {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    let cancelled = false;

    ensureUserId()
      .then((id) => {
        if (cancelled) return;
        setUserId(id);
        setIsLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e : new Error(String(e)));
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { userId, isLoading, error };
};

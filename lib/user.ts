const STORAGE_KEY = "stamp-rally:user-id";

export async function getOrCreateUserId(): Promise<string> {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const res = await fetch("/api/users", { method: "POST" });
  if (!res.ok) {
    throw new Error("ユーザー作成に失敗しました");
  }
  const body = (await res.json()) as { user_id: string };
  localStorage.setItem(STORAGE_KEY, body.user_id);
  return body.user_id;
}

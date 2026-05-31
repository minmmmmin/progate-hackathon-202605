import { OpenAPIHono } from "@hono/zod-openapi";
import { handle } from "hono/vercel";
import { Scalar } from "@scalar/hono-api-reference";
import { getSupabaseAdmin, supabase } from "@/lib/supabase";
import {
  createBoothRoute,
  deleteBoothRoute,
  getBoothsRoute,
  updateBoothRoute,
} from "@/routes/booths";
import { createScanRoute } from "@/routes/scans";
import { createUserRoute, getMyStampsRoute } from "@/routes/users";
import type { Booth, CollectedStamp } from "@/schemas";

const app = new OpenAPIHono().basePath("/api");

const STAMPS_BUCKET = "stamps";

// 混雑状況の算出に使う直近の時間範囲（分）
const CONGESTION_WINDOW_MINUTES = 120;

// ユーザー作成
app.openapi(createUserRoute, async (c) => {
  const supabaseAdmin = getSupabaseAdmin();

  const { data, error } = await supabaseAdmin.from("users").insert({}).select("id").single();

  if (error || !data) {
    console.log(error, data);
    return c.json({ message: "ユーザー作成に失敗しました" }, 500);
  }

  return c.json({ user_id: data.id }, 200);
});

// 自分のスタンプ取得
app.openapi(getMyStampsRoute, async (c) => {
  const { "x-user-id": userId } = c.req.valid("header");

  const { data, error } = await supabase
    .from("scan_logs")
    .select("scanned_at, booth:booths ( id, stamp_url, title, room, stallholder )")
    .eq("user_id", userId)
    .order("scanned_at", { ascending: true });

  if (error) {
    return c.json({ message: "スタンプ取得に失敗しました" }, 500);
  }

  const uniqueStamps = new Map<string, CollectedStamp>();
  for (const row of data ?? []) {
    const booth = Array.isArray(row.booth) ? row.booth[0] : (row.booth as Booth | null);
    if (booth && !uniqueStamps.has(booth.id)) {
      uniqueStamps.set(booth.id, { ...booth, acquired_at: row.scanned_at });
    }
  }

  return c.json({ stamps: Array.from(uniqueStamps.values()) }, 200);
});

// ブース一覧取得
app.openapi(getBoothsRoute, async (c) => {
  const { data, error } = await supabase.from("booths").select("*");

  if (error) {
    return c.json({ message: "ブース取得に失敗しました" }, 500);
  }

  // 直近のスキャン数をブースごとに集計
  const since = new Date(Date.now() - CONGESTION_WINDOW_MINUTES * 60 * 1000).toISOString();

  const { data: scanLogs, error: scanError } = await supabase
    .from("scan_logs")
    .select("booth_id")
    .gte("scanned_at", since);

  if (scanError) {
    return c.json({ message: "スキャン履歴の取得に失敗しました" }, 500);
  }

  const congestionMap = new Map<string, number>();
  for (const log of scanLogs ?? []) {
    congestionMap.set(log.booth_id, (congestionMap.get(log.booth_id) ?? 0) + 1);
  }

  const boothsWithCongestion = (data ?? []).map((booth) => ({
    ...booth,
    congestion_score: congestionMap.get(booth.id) ?? 0,
  }));

  return c.json({ booths: boothsWithCongestion }, 200);
});

// ブース登録＆スタンプ画像アップロード
app.openapi(createBoothRoute, async (c) => {
  const formData = await c.req.raw.formData();
  const file = formData.get("file");
  const title = formData.get("title");
  const room = formData.get("room");
  const stallholder = formData.get("stallholder");

  if (!(file instanceof File)) {
    return c.json({ message: "スタンプ画像が見つかりません" }, 400);
  }

  if (typeof title !== "string" || typeof room !== "string" || typeof stallholder !== "string") {
    return c.json({ message: "必須項目が不足しています" }, 400);
  }

  const extension = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : "";
  const filePath = `booths/${crypto.randomUUID()}${extension}`;

  const supabaseAdmin = getSupabaseAdmin();
  const { error: uploadError } = await supabaseAdmin.storage
    .from(STAMPS_BUCKET)
    .upload(filePath, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    return c.json({ message: "スタンプのアップロードに失敗しました" }, 500);
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from(STAMPS_BUCKET).getPublicUrl(filePath);

  const { data, error } = await supabaseAdmin
    .from("booths")
    .insert({
      stamp_url: publicUrlData.publicUrl,
      title,
      room,
      stallholder,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.log(error, data);
    return c.json({ message: "ブース登録に失敗しました" }, 500);
  }

  return c.json(data, 200);
});

// ブース更新（テキスト情報のみ。スタンプ画像は変更しない）
app.openapi(updateBoothRoute, async (c) => {
  const { id } = c.req.valid("param");
  const { title, room, stallholder } = c.req.valid("json");

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("booths")
    .update({ title, room, stallholder })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    return c.json({ message: "ブース更新に失敗しました" }, 500);
  }

  if (!data) {
    return c.json({ message: "対象ブースが見つかりません" }, 404);
  }

  return c.json(data, 200);
});

// ブース削除
app.openapi(deleteBoothRoute, async (c) => {
  const { id } = c.req.valid("param");

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("booths")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return c.json({ message: "ブース削除に失敗しました" }, 500);
  }

  if (!data) {
    return c.json({ message: "対象ブースが見つかりません" }, 404);
  }

  return c.json({ message: "ブースを削除しました" }, 200);
});

// スキャン登録＆スタンプ付与
app.openapi(createScanRoute, async (c) => {
  const supabaseAdmin = getSupabaseAdmin();

  const { user_id, booth_id } = c.req.valid("json");

  const { data: booth, error: boothError } = await supabaseAdmin
    .from("booths")
    .select("*")
    .eq("id", booth_id)
    .maybeSingle();

  if (boothError) {
    return c.json({ message: "ブース取得に失敗しました" }, 500);
  }

  if (!booth) {
    return c.json({ message: "対象ブースが見つかりません" }, 404);
  }

  const { data: latestScan, error: scanError } = await supabaseAdmin
    .from("scan_logs")
    .select("scanned_at")
    .eq("user_id", user_id)
    .eq("booth_id", booth_id)
    .order("scanned_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (scanError) {
    return c.json({ message: "スキャン履歴の取得に失敗しました" }, 500);
  }

  if (latestScan?.scanned_at) {
    const scannedAt = new Date(latestScan.scanned_at).getTime();
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - scannedAt) / 1000);

    if (elapsedSeconds < 300) {
      const remainingSeconds = 300 - elapsedSeconds;

      if (remainingSeconds < 60) {
        return c.json({ message: `あと${remainingSeconds}秒お待ちください` }, 429);
      } else {
        const remainingMinutes = Math.ceil(remainingSeconds / 60);
        return c.json({ message: `あと${remainingMinutes}分お待ちください` }, 429);
      }
    }
  }

  const { error: insertError } = await supabaseAdmin
    .from("scan_logs")
    .insert({ user_id, booth_id });

  if (insertError) {
    console.log(insertError);
    return c.json({ message: "スキャン登録に失敗しました" }, 500);
  }

  return c.json({ message: "スタンプを付与しました", booth }, 200);
});

// APIドキュメントの設定
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "文化祭スタンプラリー API",
    description: "ハッカソン用APIドキュメント",
  },
});

app.get(
  "/reference",
  Scalar({
    spec: {
      url: "/api/doc",
    },
  }),
);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

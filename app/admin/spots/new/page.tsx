"use client";

import { ArrowLeft, ImagePlus, MapPin, Store, Type } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export default function NewSpotPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [room, setRoom] = useState("");
  const [stallholder, setStallholder] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.files?.[0] ?? null;
    if (next && !next.type.startsWith("image/")) {
      setError("画像ファイルを選択してください");
      e.target.value = "";
      return;
    }
    if (next && next.size > MAX_IMAGE_BYTES) {
      setError("画像サイズは 5MB 以下にしてください");
      e.target.value = "";
      return;
    }
    setError(null);
    setFile(next);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !room.trim() || !stallholder.trim()) {
      setError("すべての項目を入力してください");
      return;
    }
    if (!file) {
      setError("スタンプ画像を選択してください");
      return;
    }

    setError(null);
    setSubmitting(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title.trim());
    formData.append("room", room.trim());
    formData.append("stallholder", stallholder.trim());

    try {
      const res = await fetch("/api/booths", { method: "POST", body: formData });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { message?: string } | null;
        setError(body?.message ?? "登録に失敗しました");
        setSubmitting(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("通信エラーが発生しました");
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-base-200 min-h-screen px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <Link
          href="/admin"
          className="text-base-content/70 hover:text-primary inline-flex items-center gap-1 text-sm font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          ダッシュボードに戻る
        </Link>

        <section className="card bg-base-100 shadow-sm">
          <div className="card-body p-5 sm:p-8">
            <header className="mb-6">
              <h1 className="text-base-content text-xl font-extrabold sm:text-2xl">
                スポットを追加
              </h1>
              <p className="text-base-content/60 mt-1 text-xs sm:text-sm">
                新規スポットを登録すると、自動で QR コードが発行されます。
              </p>
            </header>

            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <span className="text-base-content text-xs font-bold">スタンプ画像</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-base-300 hover:border-primary hover:bg-primary/5 flex aspect-square w-36 flex-col items-center justify-center gap-2 self-center overflow-hidden rounded-3xl border-2 border-dashed transition sm:w-40"
                  aria-label="スタンプ画像を選択"
                >
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="スタンプ画像プレビュー"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      <ImagePlus className="text-base-content/40 h-8 w-8" />
                      <span className="text-base-content/60 text-xs font-semibold">画像を選択</span>
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                />
                <span className="text-base-content/50 text-center text-[11px]">
                  JPEG / PNG / WebP (最大 5MB)
                </span>
              </div>

              <FieldInput
                label="タイトル"
                icon={<Type className="text-base-content/50 h-4 w-4" />}
                value={title}
                onChange={setTitle}
                placeholder="例: 1-A やきそば"
                autoComplete="off"
                maxLength={50}
              />

              <FieldInput
                label="場所"
                icon={<MapPin className="text-base-content/50 h-4 w-4" />}
                value={room}
                onChange={setRoom}
                placeholder="例: 教室棟1F-101"
                autoComplete="off"
                maxLength={50}
              />

              <FieldInput
                label="出店者"
                icon={<Store className="text-base-content/50 h-4 w-4" />}
                value={stallholder}
                onChange={setStallholder}
                placeholder="例: 1年A組"
                autoComplete="off"
                maxLength={50}
              />

              {error && (
                <p
                  role="alert"
                  className="bg-error/10 text-error rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  {error}
                </p>
              )}

              <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Link
                  href="/admin"
                  className="btn btn-ghost rounded-full font-semibold sm:w-32"
                  aria-disabled={submitting}
                >
                  キャンセル
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary rounded-full font-semibold sm:w-40"
                >
                  {submitting ? "登録中…" : "登録する"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

type FieldInputProps = {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
};

function FieldInput({
  label,
  icon,
  value,
  onChange,
  placeholder,
  autoComplete,
  maxLength,
}: FieldInputProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-base-content text-xs font-bold">{label}</span>
      <span className="bg-base-200 flex items-center gap-2 rounded-2xl px-3 py-2">
        {icon}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          className="text-base-content placeholder:text-base-content/40 w-full bg-transparent text-sm outline-none"
        />
      </span>
    </label>
  );
}

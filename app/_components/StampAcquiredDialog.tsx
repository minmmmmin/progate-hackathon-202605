"use client";

import { Sparkles, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

import type { Booth } from "@/schemas";

type StampAcquiredDialogProps = {
  stamp: Booth | null;
  onClose: () => void;
};

const AUTO_CLOSE_MS = 3800;
const EXIT_ANIMATION_MS = 700;

export function StampAcquiredDialog({ stamp, onClose }: StampAcquiredDialogProps) {
  const [isClosing, setIsClosing] = useState(false);
  const autoCloseTimerRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (autoCloseTimerRef.current !== null) {
      window.clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    if (exitTimerRef.current !== null) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
  };

  const beginClose = () => {
    if (!stamp || isClosing) return;
    setIsClosing(true);
    if (autoCloseTimerRef.current !== null) {
      window.clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    exitTimerRef.current = window.setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, EXIT_ANIMATION_MS);
  };

  useEffect(() => {
    if (!stamp) {
      clearTimers();
      return;
    }

    clearTimers();
    autoCloseTimerRef.current = window.setTimeout(beginClose, AUTO_CLOSE_MS);

    return () => {
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stamp]);

  useEffect(() => {
    if (!stamp) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [stamp]);

  if (!stamp) return null;

  return createPortal(
    <div className="fixed inset-0 z-70 flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="ダイアログを閉じる"
        className={`absolute inset-0 bg-slate-950/60 transition-opacity ease-out ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        style={{ transitionDuration: `${EXIT_ANIMATION_MS}ms` }}
        onClick={beginClose}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label="スタンプ取得ダイアログ"
        className={`relative z-10 w-full max-w-md overflow-hidden rounded-4xl border border-white/50 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.35)] transition-all ease-out ${
          isClosing ? "translate-y-4 scale-95 opacity-0" : "translate-y-0 scale-100 opacity-100"
        }`}
        style={{ transitionDuration: `${EXIT_ANIMATION_MS}ms` }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bg-linear-to-br from-amber-100 via-white to-pink-100 px-6 pt-5 pb-6 sm:px-8 sm:pt-6 sm:pb-8">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                スタンプ登録完了
              </div>
              <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                スタンプをゲット！
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-600 sm:text-base">
                {stamp.room} の {stamp.title} スタンプが登録されました。
              </p>
            </div>

            <button
              type="button"
              onClick={beginClose}
              aria-label="閉じる"
              className="text-slate-500 transition hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mx-auto flex w-full max-w-sm flex-col items-center">
            <div className="relative flex w-full items-center justify-center rounded-4xl bg-white p-6 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] sm:p-8">
              <div className="absolute inset-x-6 top-5 h-16 rounded-full bg-amber-200/40 blur-2xl" />
              <div className="relative flex aspect-square w-full max-w-56 items-center justify-center rounded-4xl border-8 border-amber-100 bg-linear-to-br from-slate-50 to-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={stamp.stamp_url}
                  alt={`${stamp.title}のスタンプ`}
                  className="h-32 w-32 object-contain sm:h-40 sm:w-40"
                />
              </div>
            </div>

            <div className="mt-5 w-full rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm">
              {stamp.room} の {stamp.title}
            </div>
            <p className="mt-3 text-center text-xs leading-relaxed font-medium text-slate-500 sm:text-sm">
              数秒後に自動で閉じます。タップでも閉じられます。
            </p>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}

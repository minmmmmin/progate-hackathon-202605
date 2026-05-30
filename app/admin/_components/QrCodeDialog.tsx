"use client";

import { Copy, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

type QrCodeDialogProps = {
  open: boolean;
  onClose: () => void;
  spotId: string;
  spotName: string;
};

export function QrCodeDialog({ open, onClose, spotId, spotName }: QrCodeDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const stampUrl = spotId
    ? `https://stamp-rally.example.com/stamp/${encodeURIComponent(spotId)}`
    : "";

  async function copyUrl() {
    if (!stampUrl) return;
    await navigator.clipboard.writeText(stampUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose} onCancel={onClose}>
      <div className="modal-box bg-base-100 max-w-sm rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-base-content/60 text-xs font-semibold">スタンプQRコード</div>
            <h3 className="text-base-content text-lg font-extrabold">{spotName}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="bg-base-200 flex flex-col items-center gap-3 rounded-2xl p-5">
          <div className="bg-base-100 rounded-2xl p-4">
            {stampUrl && <QRCode value={stampUrl} size={200} bgColor="#ffffff" fgColor="#3d2a35" />}
          </div>
          <p className="text-base-content/60 text-center text-[11px] break-all">{stampUrl}</p>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            className="btn btn-primary flex-1 rounded-full font-semibold"
            onClick={copyUrl}
          >
            <Copy className="h-4 w-4" />
            {copied ? "コピーしました" : "URLをコピー"}
          </button>
          <button
            type="button"
            className="btn btn-outline btn-primary bg-base-100 flex-1 rounded-full font-semibold"
            onClick={onClose}
          >
            閉じる
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

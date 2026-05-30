"use client";

import { Copy, Download, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

type QrCodeDialogProps = {
  open: boolean;
  onClose: () => void;
  spotId: string;
  spotName: string;
};

const EXPORT_SIZE = 1024;

export function QrCodeDialog({ open, onClose, spotId, spotName }: QrCodeDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

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

  async function saveAsImage() {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    setSaving(true);
    try {
      const blob = await svgToPngBlob(svg, EXPORT_SIZE);
      const filename = `${sanitize(spotName) || "stamp"}-qr.png`;
      const file = new File([blob], filename, { type: "image/png" });

      const canShareFiles =
        typeof navigator !== "undefined" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });

      if (canShareFiles) {
        try {
          await navigator.share({ files: [file], title: spotName || "スタンプQR" });
          return;
        } catch (err) {
          if ((err as DOMException)?.name === "AbortError") return;
        }
      }

      downloadBlob(blob, filename);
    } finally {
      setSaving(false);
    }
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
          <div ref={qrRef} className="bg-base-100 rounded-2xl p-4">
            {stampUrl && <QRCode value={stampUrl} size={200} bgColor="#ffffff" fgColor="#3d2a35" />}
          </div>
          <p className="text-base-content/60 text-center text-[11px] break-all">{stampUrl}</p>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            className="btn btn-primary flex-1 rounded-full font-semibold"
            onClick={saveAsImage}
            disabled={saving || !stampUrl}
          >
            <Download className="h-4 w-4" />
            {saving ? "保存中…" : "写真に保存"}
          </button>
          <button
            type="button"
            className="btn btn-outline btn-primary bg-base-100 flex-1 rounded-full font-semibold"
            onClick={copyUrl}
          >
            <Copy className="h-4 w-4" />
            {copied ? "コピーしました" : "URLをコピー"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

function svgToPngBlob(svg: SVGElement, size: number): Promise<Blob> {
  const clone = svg.cloneNode(true) as SVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(size));
  clone.setAttribute("height", String(size));

  const xml = new XMLSerializer().serializeToString(clone);
  const svgUrl = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(svgUrl);
        reject(new Error("Canvas 2D context unavailable"));
        return;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(svgUrl);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to encode PNG"));
      }, "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      reject(new Error("Failed to load SVG"));
    };
    img.src = svgUrl;
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function sanitize(name: string) {
  return name.replace(/[\\/:*?"<>|\s]+/g, "_");
}

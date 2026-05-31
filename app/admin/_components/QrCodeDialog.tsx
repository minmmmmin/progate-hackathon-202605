"use client";

import { Download, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { FC, useEffect, useRef, useState } from "react";

import { BASE_URL } from "../../../constants/url";

type QrCodeDialogProps = {
  open: boolean;
  onClose: () => void;
  spotId: string;
  spotName: string;
  stampURL: string;
};

const EXPORT_SIZE = 1024;

export const QrCodeDialog: FC<QrCodeDialogProps> = ({
  open,
  onClose,
  spotId,
  spotName,
  stampURL,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const params = new URLSearchParams({ id: spotId });

  const qrURL = `${BASE_URL}?${params.toString()}`;

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

  if (!open) {
    return null;
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
            {qrURL && (
              <QRCodeSVG
                value={qrURL}
                size={256}
                level="H"
                bgColor="#ffffff"
                fgColor="#3d2a35"
                imageSettings={{
                  src: stampURL,
                  height: 80,
                  width: 80,
                  excavate: true,
                }}
              />
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            className="btn btn-primary flex-1 rounded-full font-semibold"
            onClick={saveAsImage}
            disabled={saving || !qrURL}
          >
            <Download className="h-4 w-4" />
            {saving ? "保存中…" : "写真に保存"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

const svgToPngBlob = async (svg: SVGElement, size: number): Promise<Blob> => {
  const clone = svg.cloneNode(true) as SVGElement;
  const image = clone.querySelector("image");
  if (image) {
    const src = image.getAttribute("href") || image.getAttribute("xlink:href");
    if (src && !src.startsWith("data:")) {
      const base64 = await urlToBase64(src);
      image.setAttribute("href", base64);
    }
  }
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
      const padding = size * 0.1;
      ctx.drawImage(img, padding, padding, size - padding * 2, size - padding * 2);
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
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const sanitize = (name: string) => {
  return name.replace(/[\\/:*?"<>|\s]+/g, "_");
};

const urlToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

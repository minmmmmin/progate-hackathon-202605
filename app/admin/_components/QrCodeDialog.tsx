"use client";

import { Download, Printer, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { FC, useEffect, useRef, useState } from "react";

import { BASE_URL } from "../../../constants/url";
import { printPosterForSpot, savePosterForSpot } from "./qrPosterUtils";

type QrCodeDialogProps = {
  open: boolean;
  onClose: () => void;
  spotId: string;
  spotName: string;
  stampURL: string;
};

export const QrCodeDialog: FC<QrCodeDialogProps> = ({
  open,
  onClose,
  spotId,
  spotName,
  stampURL,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [saving, setSaving] = useState(false);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const params = new URLSearchParams({ id: spotId });
  const qrURL = `${BASE_URL}?${params.toString()}`;

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePosterForSpot({
        spotId,
        spotName,
        stampURL,
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = async () => {
    try {
      setPrinting(true);
      await printPosterForSpot({
        spotId,
        spotName,
        stampURL,
      });
    } finally {
      setPrinting(false);
    }
  };

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
          <div className="bg-base-100 rounded-2xl p-4">
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
            onClick={handleSave}
            disabled={saving || !qrURL}
          >
            <Download className="h-4 w-4" />
            {saving ? "保存中…" : "写真に保存"}
          </button>
          <button
            type="button"
            className="btn btn-secondary flex-1 rounded-full font-semibold"
            onClick={handlePrint}
            disabled={printing || !qrURL}
          >
            <Printer className="h-4 w-4" />
            {printing ? "処理中…" : "ポスター印刷"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

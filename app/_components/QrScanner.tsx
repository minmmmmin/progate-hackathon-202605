"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useUserId } from "@/hooks/useUserId";

type ScanStatus = "idle" | "loading";

type QrScannerContextValue = {
  open: () => void;
  close: () => void;
};

const QrScannerContext = createContext<QrScannerContextValue | null>(null);

export function useQrScanner() {
  const ctx = useContext(QrScannerContext);
  if (!ctx) throw new Error("useQrScanner must be used inside QrScannerProvider");
  return ctx;
}

export function QrScannerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <QrScannerContext.Provider
      value={{ open: () => setIsOpen(true), close: () => setIsOpen(false) }}
    >
      {children}
      {isOpen && <QrScannerModal onClose={() => setIsOpen(false)} />}
    </QrScannerContext.Provider>
  );
}

function QrScannerModal({ onClose }: { onClose: () => void }) {
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const { showSuccess, showError } = useToast();
  const { userId } = useUserId();

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef(false);

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error("カメラ停止エラー:", err);
      }
    }
    scannerRef.current = null;
  };

  const closeModal = async () => {
    await stopScanner();
    onClose();
  };

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-video-container");
    scannerRef.current = html5QrCode;
    isProcessingRef.current = false;

    const handleScanSuccess = async (decodedText: string) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.pause(true);
      }
      setScanStatus("loading");

      try {
        let boothId: string | null = null;
        try {
          const url = new URL(decodedText);
          boothId = url.searchParams.get("id");
        } catch {
          throw new Error("QRコードの読み取りに失敗しました");
        }

        if (!boothId) {
          throw new Error("無効なQRコードです");
        }

        const res = await fetch("/api/scans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, booth_id: boothId }),
        });
        const data = await res.json();

        await closeModal();
        if (res.ok) {
          showSuccess("スタンプを獲得しました！");
        } else {
          showError(data.message || "エラーが発生しました");
        }
      } catch (err) {
        await closeModal();
        showError(err instanceof Error ? err.message : "通信エラーが発生しました。");
      } finally {
        setScanStatus("idle");
      }
    };

    html5QrCode
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        handleScanSuccess,
        () => {},
      )
      .catch((err) => {
        console.error("カメラ起動エラー:", err);
        onClose();
        showError("カメラの起動に失敗しました。権限設定を確認してください。");
      });

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
      scannerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="modal modal-open modal-bottom sm:modal-middle">
      <div className="modal-box p-6 pt-10">
        <h2 className="text-center text-xl font-bold">QRコード読み取り</h2>
        <p className="mb-6 text-center text-sm opacity-70">枠内にQRコードを合わせてください</p>

        <div className="bg-base-200 relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl">
          <div
            id="qr-video-container"
            className="absolute inset-0 [&_video]:!absolute [&_video]:!inset-0 [&_video]:!h-full [&_video]:!w-full [&_video]:!object-cover"
          />
          {scanStatus === "loading" && (
            <div className="bg-base-100/90 absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="mt-4 font-bold">処理中...</p>
            </div>
          )}
        </div>

        <div className="modal-action mt-8 justify-center">
          <button onClick={closeModal} className="btn btn-circle btn-lg">
            <X size={24} />
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={closeModal}>close</button>
      </form>
    </div>
  );
}

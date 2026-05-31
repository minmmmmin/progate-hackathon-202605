"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useUserId } from "@/hooks/useUserId";
import { extractBoothIdFromTarget, registerScan } from "@/lib/scanRegistration";
import type { Booth } from "@/schemas";
import { StampAcquiredDialog } from "./StampAcquiredDialog";

type ScanStatus = "idle" | "loading";

type OpenOptions = {
  onRegistered?: (booth: Booth) => void;
};

type QrScannerContextValue = {
  open: (options?: OpenOptions) => void;
  close: () => void;
  notifyStampAcquired: (booth: Booth) => void;
  acquiredStamp: Booth | null;
};

const QrScannerContext = createContext<QrScannerContextValue | null>(null);

export function useQrScanner() {
  const ctx = useContext(QrScannerContext);
  if (!ctx) throw new Error("useQrScanner must be used inside QrScannerProvider");
  return ctx;
}

type ProviderState = {
  isOpen: boolean;
  onRegistered?: (booth: Booth) => void;
};

export function QrScannerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProviderState>({ isOpen: false });
  const [acquiredStamp, setAcquiredStamp] = useState<Booth | null>(null);

  const open = (options?: OpenOptions) => {
    setState({ isOpen: true, onRegistered: options?.onRegistered });
  };
  const close = () => {
    setState({ isOpen: false });
  };
  const notifyStampAcquired = (booth: Booth) => {
    setAcquiredStamp(booth);
  };

  const handleRegistered = (booth: Booth) => {
    state.onRegistered?.(booth);
    notifyStampAcquired(booth);
  };

  return (
    <QrScannerContext.Provider value={{ open, close, notifyStampAcquired, acquiredStamp }}>
      {children}
      {state.isOpen && <QrScannerModal onClose={close} onRegistered={handleRegistered} />}
      <StampAcquiredDialog
        key={acquiredStamp?.id ?? "none"}
        stamp={acquiredStamp}
        onClose={() => setAcquiredStamp(null)}
      />
    </QrScannerContext.Provider>
  );
}

function QrScannerModal({
  onClose,
  onRegistered,
}: {
  onClose: () => void;
  onRegistered: (booth: Booth) => void;
}) {
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const { showError } = useToast();
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
    let cancelled = false;
    let html5QrCode: Html5Qrcode | null = null;
    let startPromise: Promise<unknown> = Promise.resolve();
    isProcessingRef.current = false;

    const handleScanSuccess = async (decodedText: string) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.pause(true);
      }
      setScanStatus("loading");

      try {
        const boothId = extractBoothIdFromTarget(decodedText);
        if (!boothId) {
          throw new Error("無効なQRコードです");
        }

        if (!userId) {
          throw new Error("ユーザー情報を取得中です。少し待ってからもう一度お試しください。");
        }

        const result = await registerScan({ userId, boothId });

        await closeModal();
        onRegistered(result.booth);
      } catch (err) {
        await closeModal();
        showError(err instanceof Error ? err.message : "通信エラーが発生しました。");
      } finally {
        setScanStatus("idle");
      }
    };

    const timer = setTimeout(() => {
      if (cancelled) return;
      html5QrCode = new Html5Qrcode("qr-video-container");
      scannerRef.current = html5QrCode;

      startPromise = html5QrCode
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
        .then(async () => {
          if (cancelled && html5QrCode && html5QrCode.isScanning) {
            await html5QrCode.stop().catch(console.error);
          }
        })
        .catch((err) => {
          if (cancelled) return;
          console.error("カメラ起動エラー:", err);
          onClose();
          showError("カメラの起動に失敗しました。権限設定を確認してください。");
        });
    }, 100);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      scannerRef.current = null;
      startPromise.finally(() => {
        if (html5QrCode && html5QrCode.isScanning) {
          html5QrCode.stop().catch(console.error);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="modal modal-open modal-bottom sm:modal-middle">
      <div className="modal-box p-6 pt-10">
        <h2 className="text-center text-xl font-bold">QRコード読み取り</h2>
        <p className="mb-6 text-center text-sm opacity-70">枠内にQRコードを合わせてください</p>

        <div className="bg-base-200 relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl">
          <div id="qr-video-container" className="h-full w-full" />
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

"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X } from "lucide-react";

type ScanStatus = "idle" | "loading" | "success" | "error";

export const QrScanner = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const [message, setMessage] = useState<string>("");

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef(false);

  const startScanner = async () => {
    setIsCameraOpen(true);
    setScanStatus("idle");
    setMessage("");
    isProcessingRef.current = false;

    setTimeout(async () => {
      const html5QrCode = new Html5Qrcode("qr-video-container");
      scannerRef.current = html5QrCode;
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          onScanSuccess,
          () => {},
        );
      } catch (err) {
        console.error("カメラ起動エラー:", err);
        setIsCameraOpen(false);
        setScanStatus("error");
        setMessage("カメラの起動に失敗しました。権限設定を確認してください。");
      }
    }, 100);
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop();
    }
    scannerRef.current = null;
    setIsCameraOpen(false);
  };

  const onScanSuccess = async (decodedText: string) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.pause(true);
    }
    setScanStatus("loading");
    setMessage("スタンプを確認中...");

    try {
      const res = await fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: decodedText }),
      });
      const data = await res.json();

      await stopScanner();
      if (res.ok) {
        setScanStatus("success");
        setMessage(`🎉 スタンプを獲得しました！`);
      } else {
        setScanStatus("error");
        setMessage(`❌ ${data.message || "エラーが発生しました"}`);
      }
    } catch {
      await stopScanner();
      setScanStatus("error");
      setMessage("通信エラーが発生しました。");
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="w-full">
      {!isCameraOpen && (
        <div className="space-y-4">
          <button
            onClick={startScanner}
            className="btn btn-primary btn-lg w-full rounded-full shadow-lg"
          >
            📷 カメラを起動してスタンプGET
          </button>
          {scanStatus !== "idle" && (
            <div
              className={`alert ${scanStatus === "success" ? "alert-success" : "alert-error"} shadow-md`}
            >
              <span>{message}</span>
            </div>
          )}
        </div>
      )}

      {isCameraOpen && (
        <div className="modal modal-open modal-bottom sm:modal-middle">
          <div className="modal-box p-6 pt-10">
            <h2 className="text-center text-xl font-bold">QRコード読み取り</h2>
            <p className="mb-6 text-center text-sm opacity-70">枠内にQRコードを合わせてください</p>

            <div className="bg-base-200 relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl">
              <div id="qr-video-container" className="h-full w-full object-cover"></div>
              {scanStatus === "loading" && (
                <div className="bg-base-100/90 absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <p className="mt-4 font-bold">処理中...</p>
                </div>
              )}
            </div>

            <div className="modal-action mt-8 justify-center">
              <button onClick={stopScanner} className="btn btn-circle btn-lg">
                <X size={24} />
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={stopScanner}>close</button>
          </form>
        </div>
      )}
    </div>
  );
};

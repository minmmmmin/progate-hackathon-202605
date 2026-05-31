import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { BottomTabBar } from "./_components/BottomTabBar";
import { QrScannerProvider } from "./_components/QrScanner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "文化祭スタンプラリー",
  description: "スタンプを集めて素敵な景品をゲットしよう。",
  openGraph: {
    title: "文化祭スタンプラリー",
    description: "スタンプを集めて素敵な景品をゲットしよう。",
    images: ["/images/ogp.png"],
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "文化祭スタンプラリー",
    description: "スタンプを集めて素敵な景品をゲットしよう。",
    images: ["/images/ogp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col pb-20 lg:pb-0">
        <Toaster position="top-center" richColors />
        <QrScannerProvider>
          {children}
          <BottomTabBar />
        </QrScannerProvider>
      </body>
    </html>
  );
}

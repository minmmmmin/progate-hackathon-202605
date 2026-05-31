"use client";

import {
  BookOpenCheck,
  Camera,
  ChevronLeft,
  HelpCircle,
  MapPin,
  ScanLine,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { Sidebar } from "../_components/Sidebar";
import { TopBar } from "../_components/TopBar";
import { Card } from "../_components/ui/Card";
import { PillButton } from "../_components/ui/PillButton";

const DRAWER_ID = "main-drawer";

type Step = {
  title: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  gradient: string;
  iconColor: string;
};

const steps: Step[] = [
  {
    title: "スタンプを探す",
    description: "校内のあちこちに各クラスのブースがあるよ。気になる教室や展示を見つけてみよう！",
    Icon: MapPin,
    gradient: "from-pink-100 via-rose-100 to-orange-100",
    iconColor: "text-rose-600",
  },
  {
    title: "QRコードを読み取る",
    description:
      "ホームの「カメラを起動してスタンプGET」をタップして、ブースのQRコードに枠を合わせてね。",
    Icon: ScanLine,
    gradient: "from-sky-100 via-cyan-100 to-emerald-100",
    iconColor: "text-sky-700",
  },
  {
    title: "スタンプ帳に追加",
    description:
      "獲得したスタンプは自動でスタンプ帳に保存。タップすると教室や担当クラスもチェックできるよ。",
    Icon: BookOpenCheck,
    gradient: "from-amber-100 via-yellow-100 to-lime-100",
    iconColor: "text-amber-700",
  },
  {
    title: "おすすめスポットへ",
    description:
      "集めるほど混雑状況が見えてくる。空いているおすすめスポットを順にまわってコンプリートを目指そう！",
    Icon: Sparkles,
    gradient: "from-violet-100 via-purple-100 to-pink-100",
    iconColor: "text-violet-700",
  },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "QRコードがうまく読み取れません",
    a: "枠の中央にQRコード全体が収まるように近づけてください。暗い場所では端末を明るい方へ向けるとピントが合いやすくなります。",
  },
  {
    q: "カメラが起動しないときは？",
    a: "ブラウザのカメラ権限が許可されているか確認してください。設定アプリ → ブラウザ → カメラ から有効にできます。",
  },
  {
    q: "同じスタンプを何度でも取れる？",
    a: "1つのブースにつき1スタンプまでです。すでに獲得済みの場合は通知でお知らせします。",
  },
  {
    q: "ログインは必要？",
    a: "ブラウザごとに自動で識別IDを発行しているので、ログインなしですぐに遊べます。別の端末では別のスタンプ帳になります。",
  },
];

export default function HelpPage() {
  return (
    <div className="drawer bg-base-100 text-base-content min-h-screen">
      <input id={DRAWER_ID} type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <div className="mx-auto w-full max-w-[1440px] space-y-5 px-3 py-4 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8">
          <TopBar drawerId={DRAWER_ID} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <div className="hidden lg:block">
              <Sidebar />
            </div>

            <main className="flex flex-col gap-5 sm:gap-6">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <PillButton variant="outline" className="h-10 w-10 !p-0">
                    <ChevronLeft className="h-5 w-5" />
                  </PillButton>
                </Link>
                <h1 className="text-2xl font-extrabold tracking-tight italic">HOW TO USE</h1>
              </div>

              {/* ヒーロー */}
              <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-100 via-rose-100 to-amber-100 p-6 shadow-sm sm:p-8">
                <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/40 blur-2xl" />
                <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-pink-200/60 blur-2xl" />
                <div className="relative flex flex-col gap-3">
                  <span className="bg-base-100/80 text-primary inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold backdrop-blur">
                    <HelpCircle className="h-3.5 w-3.5" />
                    使い方ガイド
                  </span>
                  <h2 className="text-base-content text-2xl leading-snug font-extrabold sm:text-3xl">
                    スタンプを集めて、
                    <br className="sm:hidden" />
                    文化祭を遊びつくそう！
                  </h2>
                  <p className="text-base-content/70 max-w-prose text-sm leading-relaxed sm:text-base">
                    各ブースにあるQRコードを読み取ると、スタンプ帳がどんどん埋まっていきます。
                    集めた人数が見えるので、いま空いているスポットも一目でわかります。
                  </p>
                </div>
              </section>

              {/* ステップ */}
              <Card icon={<Sparkles className="h-5 w-5" />} title="4ステップで遊べる">
                <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {steps.map((step, idx) => (
                    <li
                      key={step.title}
                      className="bg-base-100 border-base-200 relative flex gap-4 rounded-2xl border p-4 sm:p-5"
                    >
                      <div
                        className={`bg-gradient-to-br ${step.gradient} flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-inner`}
                      >
                        <step.Icon className={`h-7 w-7 ${step.iconColor}`} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="text-base-content/40 text-[10px] font-bold tracking-[0.2em] uppercase">
                          Step {idx + 1}
                        </div>
                        <div className="text-base-content text-base font-extrabold">
                          {step.title}
                        </div>
                        <p className="text-base-content/70 text-xs leading-relaxed sm:text-sm">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Card>

              {/* QR スキャンのコツ */}
              <Card icon={<Camera className="h-5 w-5" />} title="QRスキャンのコツ">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="bg-base-200/50 rounded-2xl p-4">
                    <div className="text-primary text-xs font-extrabold">POINT 01</div>
                    <p className="text-base-content mt-1 text-sm font-bold">枠の中央に合わせる</p>
                    <p className="text-base-content/60 mt-1 text-xs leading-relaxed">
                      四角い枠の真ん中にQRコード全体が入るように、端末を少し離して構えてね。
                    </p>
                  </div>
                  <div className="bg-base-200/50 rounded-2xl p-4">
                    <div className="text-primary text-xs font-extrabold">POINT 02</div>
                    <p className="text-base-content mt-1 text-sm font-bold">明るい場所で</p>
                    <p className="text-base-content/60 mt-1 text-xs leading-relaxed">
                      暗いとピントが合いません。窓際や照明の下で読み取るのがおすすめ。
                    </p>
                  </div>
                  <div className="bg-base-200/50 rounded-2xl p-4">
                    <div className="text-primary text-xs font-extrabold">POINT 03</div>
                    <p className="text-base-content mt-1 text-sm font-bold">手ブレに注意</p>
                    <p className="text-base-content/60 mt-1 text-xs leading-relaxed">
                      数秒だけ端末を止めてあげると、すぐに読み取れます。
                    </p>
                  </div>
                </div>
              </Card>

              {/* FAQ */}
              <Card icon={<HelpCircle className="h-5 w-5" />} title="よくある質問">
                <div className="flex flex-col gap-2">
                  {faqs.map((faq) => (
                    <details
                      key={faq.q}
                      className="collapse-arrow bg-base-200/40 collapse rounded-2xl"
                    >
                      <summary className="collapse-title text-sm font-bold sm:text-base">
                        {faq.q}
                      </summary>
                      <div className="collapse-content">
                        <p className="text-base-content/70 text-xs leading-relaxed sm:text-sm">
                          {faq.a}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </Card>

              {/* CTA */}
              <div className="flex flex-col items-center gap-3 pb-4 sm:flex-row sm:justify-center">
                <Link href="/" className="w-full sm:w-auto">
                  <PillButton
                    variant="filled"
                    size="md"
                    leading={<Camera className="h-4 w-4" />}
                    fullWidth
                    className="sm:w-auto"
                  >
                    ホームに戻ってスタンプを集める
                  </PillButton>
                </Link>
                <Link href="/stamps" className="w-full sm:w-auto">
                  <PillButton
                    variant="outline"
                    size="md"
                    leading={<BookOpenCheck className="h-4 w-4" />}
                    fullWidth
                    className="sm:w-auto"
                  >
                    スタンプ帳をみる
                  </PillButton>
                </Link>
              </div>
            </main>
          </div>
        </div>
      </div>

      <div className="drawer-side lg:hidden">
        <label htmlFor={DRAWER_ID} aria-label="メニューを閉じる" className="drawer-overlay" />
        <Sidebar />
      </div>
    </div>
  );
}

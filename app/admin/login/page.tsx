"use client";

import { Flag, KeyRound, Mail } from "lucide-react";
import { SubmitEvent, useState } from "react";

import { useAuth } from "./../_hooks/useAuth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();

  const handleLogin = (e: SubmitEvent) => {
    e.preventDefault();

    login(email, password).catch((err) => {
      setError(err.message || "ログインに失敗しました");
    });
  };

  return (
    <div className="bg-base-200 flex min-h-screen items-center justify-center px-4 py-10">
      <div className="card bg-base-100 w-full max-w-md shadow-sm">
        <div className="card-body p-6 sm:p-8">
          <div className="text-primary mb-4 flex flex-col items-center gap-2">
            <Flag className="h-8 w-8" />
            <div className="text-center leading-tight">
              <div className="text-lg font-extrabold">文化祭スタンプラリー</div>
              <div className="text-base-content/60 text-xs font-semibold">運営管理画面ログイン</div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-base-content text-xs font-bold">メールアドレス</span>
              <span className="bg-base-200 flex items-center gap-2 rounded-2xl px-3 py-2">
                <Mail className="text-base-content/50 h-4 w-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="text-base-content placeholder:text-base-content/40 w-full bg-transparent text-sm outline-none"
                  autoComplete="email"
                />
              </span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-base-content text-xs font-bold">パスワード</span>
              <span className="bg-base-200 flex items-center gap-2 rounded-2xl px-3 py-2">
                <KeyRound className="text-base-content/50 h-4 w-4" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="text-base-content placeholder:text-base-content/40 w-full bg-transparent text-sm outline-none"
                  autoComplete="current-password"
                />
              </span>
            </label>

            {error && (
              <p className="bg-error/10 text-error rounded-xl px-3 py-2 text-xs font-semibold">
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-primary mt-2 rounded-full font-semibold">
              ログイン
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

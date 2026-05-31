"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
// import { useToast } from "@/hooks/useToast";

export const useAuth = (requireAuth = false) => {
  const router = useRouter();
  // const { showPromise, showSuccess, showError } = useToast();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        if (requireAuth) {
          router.replace("/admin/login");
        } else {
          setIsLoading(false);
        }
      } else {
        setIsAuthorized(true);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requireAuth, router]);

  const login = async (email: string, password: string) => {
    const loginRequest = supabase.auth
      .signInWithPassword({
        email,
        password,
      })
      .then(({ data, error }) => {
        if (error) throw error;
        return data;
      });

    // showPromise(loginRequest, {
    //   loading: "ログイン中...",
    //   success: "ログインしました！管理画面へ移動します",
    //   error: "メールアドレスかパスワードが間違っています",
    // });

    try {
      await loginRequest;
      setTimeout(() => router.push("/admin"), 1000);
    } catch {}
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // showSuccess("ログアウトしました");
      router.replace("/admin/login");
    } catch {
      // showError("ログアウトに失敗しました");
    }
  };

  return { login, logout, isAuthorized, isLoading };
};

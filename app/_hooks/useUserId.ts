"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "react-use";

const STORAGE_KEY = "user-id";

type UseUserIdReturn = {
    userId: string | undefined;
    isLoading: boolean;
    error: Error | undefined;
};

export function useUserId(): UseUserIdReturn {
    const [storedUserId, setStoredUserId] = useLocalStorage<string>(STORAGE_KEY);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | undefined>();
    const calledRef = useRef(false);

    const createUser = useCallback(async () => {
        const res = await fetch("/api/users", { method: "POST" });

        if (!res.ok) {
            throw new Error("ユーザー作成に失敗しました");
        }

        const data = await res.json();
        return data.user_id as string;
    }, []);

    useEffect(() => {
        // 既にユーザーIDが保存されている場合は作成不要
        if (storedUserId) {
            setIsLoading(false);
            return;
        }

        // 多重呼び出し防止（Strict Mode対策）
        if (calledRef.current) return;
        calledRef.current = true;

        createUser()
            .then((id) => {
                setStoredUserId(id);
                setIsLoading(false);
            })
            .catch((e) => {
                setError(e instanceof Error ? e : new Error(String(e)));
                setIsLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { userId: storedUserId, isLoading, error };
}

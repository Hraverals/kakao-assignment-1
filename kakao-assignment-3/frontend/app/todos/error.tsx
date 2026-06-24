"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function TodosError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          문제가 발생했습니다
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6">
          {error.message || "알 수 없는 오류가 발생했습니다."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => unstable_retry()}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            다시 시도
          </button>
          <Link
            href="/todos"
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            목록으로
          </Link>
        </div>
      </div>
    </div>
  );
}

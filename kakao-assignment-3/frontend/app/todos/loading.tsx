export default function TodosLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 스켈레톤 */}
        <div className="flex items-center justify-between mb-8">
          <div className="h-9 w-40 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          <div className="h-10 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        </div>

        {/* 목록 스켈레톤 */}
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
            >
              <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
              <div className="flex-1 h-5 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
              <div className="w-12 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
              <div className="w-12 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

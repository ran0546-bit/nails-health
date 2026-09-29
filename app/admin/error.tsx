"use client";

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-serif text-2xl font-semibold">操作沒有成功</h1>
      <p className="mt-3 text-sm text-muted">{error.message || "發生未預期的錯誤，請稍後再試。"}</p>
      <div className="mt-6 flex justify-center gap-2">
        <button onClick={reset} className="btn btn-primary">
          重試
        </button>
        <button onClick={() => history.back()} className="btn btn-outline">
          返回上一頁
        </button>
      </div>
    </div>
  );
}

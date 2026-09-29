"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/upload";

export function ImageField({
  name,
  label,
  defaultValue = "",
  folder,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  folder: string;
  hint?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      setUrl(await uploadImage(file, folder));
    } catch (err) {
      setError(err instanceof Error ? err.message : "上傳失敗");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="flex items-start gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-blush/60">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-muted">無圖片</span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            name={name}
            data-skip-compliance="1"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="貼上圖片網址，或按下方上傳"
            className="field-input text-sm"
          />
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-outline py-1.5 text-sm" disabled={busy} onClick={() => fileRef.current?.click()}>
              {busy ? "上傳中…" : "上傳圖片"}
            </button>
            {url && (
              <button type="button" className="btn btn-outline py-1.5 text-sm" onClick={() => setUrl("")}>
                移除
              </button>
            )}
          </div>
          {hint && <p className="text-xs text-muted">{hint}</p>}
          {error && <p className="text-xs text-red-700">{error}</p>}
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
    </div>
  );
}

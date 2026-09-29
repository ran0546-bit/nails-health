"use client";

import { useEffect, useRef, useState } from "react";
import { checkCompliance, type ComplianceHit } from "@/lib/compliance";

// 放在 <form> 裡：即時檢查表單內所有文字欄位是否含有醫療廣告違規字眼。
export function ComplianceWatch() {
  const ref = useRef<HTMLDivElement>(null);
  const [hits, setHits] = useState<ComplianceHit[]>([]);

  useEffect(() => {
    const form = ref.current?.closest("form");
    if (!form) return;
    const scan = () => {
      const fields = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
        'textarea, input[type="text"], input:not([type])',
      );
      const text = [...fields]
        .filter((f) => !f.dataset.skipCompliance)
        .map((f) => f.value)
        .join("\n");
      setHits(checkCompliance(text));
    };
    scan();
    form.addEventListener("input", scan);
    return () => form.removeEventListener("input", scan);
  }, []);

  return (
    <div ref={ref}>
      {hits.length > 0 ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm">
          <p className="font-medium text-amber-900">⚠ 偵測到 {hits.length} 個可能違反醫療廣告規範的用字</p>
          <ul className="mt-3 space-y-2.5 text-amber-900/90">
            {hits.map((h) => (
              <li key={h.term}>
                <span className="rounded bg-amber-200/70 px-1.5 py-0.5 font-medium">{h.term}</span>
                {h.count > 1 && <span className="ml-1 text-xs">×{h.count}</span>}
                <span className="ml-2 text-xs">{h.rule.reason}</span>
                <p className="mt-1 text-xs text-amber-800">建議：{h.rule.suggestion}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
          ✓ 未偵測到醫療廣告違規用字
        </p>
      )}
    </div>
  );
}

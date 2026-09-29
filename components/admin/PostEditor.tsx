"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { deletePost, savePost, type PostFormState } from "@/app/admin/actions";
import { Markdown } from "@/components/site/Markdown";
import type { Post } from "@/lib/types";
import { uploadImage } from "@/lib/upload";
import { ComplianceWatch } from "./ComplianceWatch";
import { ConfirmButton } from "./ConfirmButton";
import { ImageField } from "./ImageField";

const MARKDOWN_TIPS = "## 小標題　**粗體**　- 項目清單　1. 編號清單　[連結文字](網址)　![圖片說明](圖片網址)";

export function PostEditor({ post, categories }: { post: Partial<Post> & { slug: string }; categories: string[] }) {
  const [state, formAction, pending] = useActionState<PostFormState, FormData>(savePost, {});
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [content, setContent] = useState(post.content ?? "");
  const [uploading, setUploading] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const isPublished = post.status === "published";

  function insertAtCursor(snippet: string) {
    const el = contentRef.current;
    const start = el?.selectionStart ?? content.length;
    const end = el?.selectionEnd ?? content.length;
    setContent(content.slice(0, start) + snippet + content.slice(end));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + snippet.length, start + snippet.length);
    });
  }

  async function onImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "posts");
      insertAtCursor(`\n![](${url})\n`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "上傳失敗");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <input type="hidden" name="id" value={post.id ?? ""} />
      <input type="hidden" name="status" value={post.status ?? "draft"} />
      <input type="hidden" name="published_at" value={post.published_at ?? ""} />

      <div className="min-w-0 space-y-5">
        {state.error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{state.error}</div>
        )}
        <label className="block">
          <span className="field-label">文章標題 *</span>
          <input name="title" defaultValue={post.title} required className="field-input text-lg" placeholder="例如：寶寶指甲怎麼剪？" />
        </label>
        <label className="block">
          <span className="field-label">摘要</span>
          <textarea
            name="excerpt"
            defaultValue={post.excerpt}
            rows={2}
            className="field-input"
            placeholder="顯示在文章列表與分享預覽，建議 50–80 字"
          />
        </label>

        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex rounded-full border border-line bg-white p-1 text-sm">
              {(["write", "preview"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`rounded-full px-4 py-1 ${tab === t ? "bg-brand text-white" : "text-muted"}`}
                >
                  {t === "write" ? "編輯" : "預覽"}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-outline py-1.5 text-sm"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? "上傳中…" : "插入圖片"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onImage} />
          </div>
          <textarea
            ref={contentRef}
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={24}
            className={`field-input font-mono text-sm leading-relaxed ${tab === "write" ? "" : "hidden"}`}
            placeholder="在這裡撰寫文章內容…"
          />
          {tab === "preview" && (
            <div className="min-h-[28rem] rounded-xl border border-line bg-white p-6">
              {content.trim() ? <Markdown>{content}</Markdown> : <p className="text-muted">尚無內容</p>}
            </div>
          )}
          <p className="mt-2 text-xs text-muted">格式小抄：{MARKDOWN_TIPS}</p>
        </div>
      </div>

      <aside className="space-y-5">
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-sm">
            目前狀態：
            <span
              className={`ml-1 rounded-full px-2.5 py-0.5 text-xs ${
                isPublished ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-700"
              }`}
            >
              {isPublished ? "已發布" : "草稿"}
            </span>
          </p>
          <div className="mt-4 grid gap-2">
            {isPublished ? (
              <>
                <button name="intent" value="save" className="btn btn-primary" disabled={pending}>
                  更新已發布文章
                </button>
                <button name="intent" value="unpublish" className="btn btn-outline" disabled={pending}>
                  取消發布（改回草稿）
                </button>
              </>
            ) : (
              <>
                <button name="intent" value="save" className="btn btn-outline" disabled={pending}>
                  儲存草稿
                </button>
                <button name="intent" value="publish" className="btn btn-primary" disabled={pending}>
                  發布文章
                </button>
              </>
            )}
            {post.id && (
              <Link href={`/admin/preview/${post.id}`} target="_blank" className="btn btn-outline">
                預覽網站頁面 ↗
              </Link>
            )}
            {post.id && isPublished && (
              <Link href={`/articles/${post.slug}`} target="_blank" className="text-center text-xs text-brand underline">
                查看公開頁面
              </Link>
            )}
          </div>
          {post.id && <p className="mt-3 text-xs text-muted">預覽前請先儲存，才會顯示最新內容。</p>}
        </div>

        <div className="space-y-4 rounded-2xl border border-line bg-white p-5">
          <label className="block">
            <span className="field-label">分類</span>
            <input name="category" defaultValue={post.category} list="post-categories" className="field-input" placeholder="例如：居家保養" />
            <datalist id="post-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
          <label className="block">
            <span className="field-label">網址代稱 *</span>
            <input
              name="slug"
              defaultValue={post.slug}
              required
              data-skip-compliance="1"
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              className="field-input font-mono text-sm"
            />
            <span className="mt-1 block text-xs text-muted">
              文章網址：/articles/<b>代稱</b>。只能用小寫英文、數字、連字號，發布後建議不要再改。
            </span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_featured" defaultChecked={post.is_featured} className="h-4 w-4 accent-[#a62b34]" />
            精選文章（顯示在首頁）
          </label>
          <ImageField name="cover_url" label="封面圖片" defaultValue={post.cover_url} folder="covers" hint="建議橫式 16:10" />
        </div>

        <ComplianceWatch />

        {post.id && (
          <ConfirmButton message="確定要刪除這篇文章嗎？刪除後無法復原。" formAction={deletePost} className="btn btn-danger w-full">
            刪除文章
          </ConfirmButton>
        )}
      </aside>
    </form>
  );
}

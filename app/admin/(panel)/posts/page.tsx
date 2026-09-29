import Link from "next/link";
import { Notice, PageHeader } from "@/components/admin/ui";
import { formatDate } from "@/components/site/ArticleCard";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";

export default async function PostsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string; status?: string }>;
}) {
  const { deleted, status } = await searchParams;
  const sb = await createClient();
  let q = sb
    .from("posts")
    .select("id, slug, title, category, status, is_featured, published_at, updated_at")
    .order("updated_at", { ascending: false });
  if (status === "draft" || status === "published") q = q.eq("status", status);
  const { data } = await q;
  const posts = (data ?? []) as Post[];

  const filters = [
    { key: "", label: "全部" },
    { key: "published", label: "已發布" },
    { key: "draft", label: "草稿" },
  ];

  return (
    <>
      <PageHeader title="衛教文章" desc="撰寫、預覽並發布衛教文章。每篇文章都有自己的網址。">
        <Link href="/admin/posts/new" className="btn btn-primary">
          ＋ 撰寫新文章
        </Link>
      </PageHeader>
      <Notice show={!!deleted}>文章已刪除。</Notice>

      <div className="mb-4 flex gap-2 text-sm">
        {filters.map((f) => (
          <Link
            key={f.key}
            href={f.key ? `/admin/posts?status=${f.key}` : "/admin/posts"}
            className={`rounded-full border px-3.5 py-1 ${
              (status ?? "") === f.key ? "border-brand bg-brand text-white" : "border-line bg-white"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        {posts.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted">還沒有文章。</p>
        ) : (
          <ul className="divide-y divide-line">
            {posts.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/posts/${p.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 hover:bg-blush/40">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      {p.is_featured && <span className="mr-1.5 text-brand" title="精選">★</span>}
                      {p.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {p.category || "未分類"}・/articles/{p.slug}
                    </span>
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs ${
                      p.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {p.status === "published" ? "已發布" : "草稿"}
                  </span>
                  <span className="w-28 text-right text-xs text-muted">更新 {formatDate(p.updated_at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

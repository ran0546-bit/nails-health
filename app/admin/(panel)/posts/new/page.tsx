import Link from "next/link";
import { PostEditor } from "@/components/admin/PostEditor";
import { PageHeader } from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";

export default async function NewPostPage() {
  const sb = await createClient();
  const { data } = await sb.from("posts").select("category");
  const categories = [...new Set((data ?? []).map((r) => r.category as string).filter(Boolean))];

  const d = new Date();
  const slug = `post-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <>
      <Link href="/admin/posts" className="text-sm text-muted hover:text-brand">
        ← 返回文章列表
      </Link>
      <div className="mt-3">
        <PageHeader title="撰寫新文章" desc="先儲存為草稿，預覽確認後再發布。" />
      </div>
      <PostEditor post={{ slug, status: "draft", is_featured: false }} categories={categories} />
    </>
  );
}

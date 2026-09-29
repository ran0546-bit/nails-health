import Link from "next/link";
import { notFound } from "next/navigation";
import { PostEditor } from "@/components/admin/PostEditor";
import { Notice, PageHeader } from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";

const savedText: Record<string, string> = {
  save: "已儲存。",
  publish: "文章已發布！",
  unpublish: "已取消發布，文章改回草稿。",
};

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const sb = await createClient();
  const [{ data: post }, { data: cats }] = await Promise.all([
    sb.from("posts").select("*").eq("id", id).maybeSingle(),
    sb.from("posts").select("category"),
  ]);
  if (!post) notFound();
  const categories = [...new Set((cats ?? []).map((r) => r.category as string).filter(Boolean))];

  return (
    <>
      <Link href="/admin/posts" className="text-sm text-muted hover:text-brand">
        ← 返回文章列表
      </Link>
      <div className="mt-3">
        <PageHeader title="編輯文章" />
      </div>
      <Notice show={!!saved}>{savedText[saved ?? ""] ?? "已儲存。"}</Notice>
      <PostEditor key={(post as Post).updated_at} post={post as Post} categories={categories} />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArticleView } from "@/components/site/ArticleView";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { getSiteSettings } from "@/lib/content";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";

export const metadata: Metadata = { title: "文章預覽", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured) redirect("/admin");
  const { id } = await params;
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");

  const [{ data }, settings] = await Promise.all([
    sb.from("posts").select("*").eq("id", id).maybeSingle(),
    getSiteSettings(),
  ]);
  if (!data) notFound();
  const post = data as Post;

  return (
    <>
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-ink px-4 py-2 text-center text-sm text-white">
        <span>
          預覽模式・{post.status === "published" ? "已發布" : "草稿（訪客看不到）"}
        </span>
        <Link href={`/admin/posts/${post.id}`} className="underline">
          返回編輯
        </Link>
      </div>
      <Header lineUrl={settings.line_url} />
      <ArticleView post={post} settings={settings} />
      <Footer settings={settings} />
    </>
  );
}

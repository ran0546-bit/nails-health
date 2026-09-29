import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/site/ArticleCard";
import { getPublishedPosts } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "衛教專區",
  description: "護甲師整理的指甲與足趾居家保養知識：正確修剪趾甲、寶寶指甲照護、日常護甲習慣與指甲構造。",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const posts = await getPublishedPosts();
  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))];
  const filtered = category ? posts.filter((p) => p.category === category) : posts;

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm transition ${
      active ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:border-brand hover:text-brand"
    }`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-brand">Nail Care Notes</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold">衛教專區</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted">
        護甲師整理的居家保養知識，從寶寶到長輩，讓你在家也能照顧好每一片指甲。
      </p>

      {categories.length > 0 && (
        <nav className="mt-10 flex flex-wrap gap-2" aria-label="文章分類">
          <Link href="/articles" className={chip(!category)}>
            全部
          </Link>
          {categories.map((c) => (
            <Link key={c} href={`/articles?category=${encodeURIComponent(c)}`} className={chip(c === category)}>
              {c}
            </Link>
          ))}
        </nav>
      )}

      {filtered.length ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ArticleCard key={p.id} post={p} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-muted">這個分類還沒有文章。</p>
      )}
    </div>
  );
}

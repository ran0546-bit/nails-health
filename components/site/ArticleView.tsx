import Link from "next/link";
import type { Post, SiteSettings } from "@/lib/types";
import { formatDate } from "./ArticleCard";
import { Markdown } from "./Markdown";

export function ArticleView({ post, settings }: { post: Post; settings: SiteSettings }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <nav className="text-sm text-muted">
        <Link href="/articles" className="hover:text-brand">
          衛教專區
        </Link>
        {post.category && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/articles?category=${encodeURIComponent(post.category)}`} className="hover:text-brand">
              {post.category}
            </Link>
          </>
        )}
      </nav>
      <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight sm:text-4xl">{post.title}</h1>
      <p className="mt-4 text-sm text-muted">{formatDate(post.published_at ?? post.updated_at)}</p>
      {post.cover_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover_url} alt="" className="mt-8 w-full rounded-2xl border border-line object-cover" />
      )}
      {post.excerpt && <p className="mt-8 text-lg leading-relaxed text-ink/80">{post.excerpt}</p>}
      <div className="mt-8">
        <Markdown>{post.content}</Markdown>
      </div>
      <aside className="mt-14 rounded-2xl bg-blush p-6 sm:p-8">
        <h2 className="font-serif text-xl font-semibold">想了解自己的指甲狀況？</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{settings.booking_note}</p>
        <a href={settings.line_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-5">
          LINE 預約諮詢
        </a>
      </aside>
      <p className="mt-8 text-xs leading-relaxed text-muted">{settings.disclaimer}</p>
    </article>
  );
}

import Link from "next/link";
import type { Post } from "@/lib/types";
import { LogoMark } from "./Logo";

export function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Taipei",
  });
}

export function ArticleCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/articles/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgb(126_31_39/0.25)]"
    >
      <div className="aspect-[16/10] overflow-hidden bg-blush">
        {post.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_url}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <LogoMark className="h-12 w-12 text-brand/25" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-muted">
          {post.category && <span className="rounded-full bg-blush px-2.5 py-0.5 text-brand">{post.category}</span>}
          <span>{formatDate(post.published_at)}</span>
        </div>
        <h3 className="mt-3 font-serif text-lg font-semibold leading-snug text-ink group-hover:text-brand">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>
        <span className="mt-auto pt-4 text-sm font-medium text-brand">閱讀全文 →</span>
      </div>
    </Link>
  );
}

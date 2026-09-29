import Link from "next/link";
import { Card, Notice, PageHeader } from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";
import { importSeedContent } from "../actions";

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ imported?: string }> }) {
  const { imported } = await searchParams;
  const sb = await createClient();

  const count = async (table: string, filter?: [string, string]) => {
    let q = sb.from(table).select("id", { count: "exact", head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    const { count } = await q;
    return count ?? 0;
  };

  const [services, team, locations, published, drafts, settings] = await Promise.all([
    count("services"),
    count("team_members"),
    count("locations"),
    count("posts", ["status", "published"]),
    count("posts", ["status", "draft"]),
    count("site_settings"),
  ]);
  const isEmpty = !services && !team && !locations && !published && !drafts && !settings;

  const tiles = [
    { href: "/admin/home", label: "首頁內容", value: settings ? "已設定" : "使用預設", sub: "主視覺、品牌簡介、聯絡方式" },
    { href: "/admin/services", label: "服務項目", value: `${services} 項`, sub: "項目、價格、時間" },
    { href: "/admin/team", label: "服務團隊", value: `${team} 位`, sub: "照片、簡介、證照" },
    { href: "/admin/locations", label: "服務地點", value: `${locations} 處`, sub: "地址、營業時間、交通" },
    { href: "/admin/posts", label: "衛教文章", value: `${published} 篇已發布`, sub: `${drafts} 篇草稿` },
  ];

  return (
    <>
      <PageHeader title="總覽" desc="在這裡管理官網的所有內容，儲存後約 1 分鐘內會更新到網站。" />
      <Notice show={!!imported}>初始內容已匯入完成！</Notice>

      {isEmpty && (
        <Card className="mb-8 border-brand/30 bg-blush/50">
          <h2 className="font-medium">資料庫目前是空的</h2>
          <p className="mt-1.5 text-sm text-muted">
            可以一鍵匯入網站預設的服務項目、團隊、地點與 4 篇衛教文章，再依需求修改。
          </p>
          <form action={importSeedContent} className="mt-4">
            <button className="btn btn-primary">匯入初始內容</button>
          </form>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="rounded-2xl border border-line bg-white p-5 transition hover:border-brand">
            <p className="text-sm text-muted">{t.label}</p>
            <p className="mt-2 font-serif text-2xl font-semibold text-brand">{t.value}</p>
            <p className="mt-1 text-xs text-muted">{t.sub}</p>
          </Link>
        ))}
        <Link href="/admin/posts/new" className="flex items-center justify-center rounded-2xl border border-dashed border-brand/40 p-5 text-brand hover:bg-blush/50">
          ＋ 撰寫新文章
        </Link>
      </div>
    </>
  );
}

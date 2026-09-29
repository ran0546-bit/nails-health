import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoMark } from "@/components/site/Logo";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../actions";

export const metadata: Metadata = { title: "管理後台", robots: { index: false } };
export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "總覽" },
  { href: "/admin/home", label: "首頁內容" },
  { href: "/admin/services", label: "服務項目" },
  { href: "/admin/team", label: "服務團隊" },
  { href: "/admin/locations", label: "服務地點" },
  { href: "/admin/posts", label: "衛教文章" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) return <SetupNotice />;

  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: isAdmin } = await sb.rpc("is_admin");

  return (
    <div className="min-h-screen bg-[#f7f3f0] md:grid md:grid-cols-[14rem_1fr]">
      <aside className="border-b border-line bg-white md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <LogoMark className="h-7 w-7 text-brand" />
          <span className="text-sm font-medium">護甲中心 後台</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 text-sm md:flex-col md:overflow-visible">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-lg px-3 py-2 text-ink/80 hover:bg-blush hover:text-brand">
              {n.label}
            </Link>
          ))}
          <Link href="/" target="_blank" className="whitespace-nowrap rounded-lg px-3 py-2 text-muted hover:bg-blush hover:text-brand">
            查看網站 ↗
          </Link>
        </nav>
        <div className="hidden px-5 py-4 text-xs text-muted md:absolute md:bottom-0 md:block">
          <p className="truncate">{user.email}</p>
          <form action={signOut}>
            <button className="mt-2 text-brand underline">登出</button>
          </form>
        </div>
      </aside>
      <div className="min-w-0 px-4 py-8 sm:px-8 md:py-10">
        <div className="mx-auto max-w-5xl">
          {isAdmin ? (
            children
          ) : (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm leading-relaxed text-amber-900">
              <p className="font-medium">此帳號（{user.email}）尚未取得管理權限。</p>
              <p className="mt-2">
                請到 Supabase → SQL Editor 執行下列指令，把帳號加入管理員名單：
              </p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-white p-3 text-xs">
                {`insert into public.admins (user_id, email)\nselect id, email from auth.users where email = '${user.email}';`}
              </pre>
            </div>
          )}
          <form action={signOut} className="mt-10 md:hidden">
            <button className="text-sm text-brand underline">登出</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function SetupNotice() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <LogoMark className="h-10 w-10 text-brand" />
      <h1 className="mt-6 font-serif text-2xl font-semibold">後台尚未連接資料庫</h1>
      <p className="mt-3 leading-relaxed text-muted">
        目前網站使用內建的初始內容顯示。要啟用管理後台，請依照專案資料夾中的 <code>README.md</code> 完成以下步驟：
      </p>
      <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
        <li>建立 Supabase 專案，並在 SQL Editor 執行 <code>supabase/schema.sql</code></li>
        <li>
          將 <code>.env.example</code> 複製為 <code>.env.local</code>，填入 Supabase 網址與金鑰
        </li>
        <li>在 Supabase → Authentication 建立管理員帳號，並加入管理員名單</li>
        <li>重新啟動網站，到 /admin 登入，按「匯入初始內容」</li>
      </ol>
    </div>
  );
}

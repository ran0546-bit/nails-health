import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogoMark } from "@/components/site/Logo";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { signIn } from "../actions";

export const metadata: Metadata = { title: "後台登入", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (!isSupabaseConfigured) redirect("/admin");
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-blush/60 px-4">
      <form action={signIn} className="w-full max-w-sm rounded-3xl border border-line bg-white p-8 shadow-[0_20px_50px_-25px_rgb(126_31_39/0.35)]">
        <LogoMark className="h-10 w-10 text-brand" />
        <h1 className="mt-5 font-serif text-2xl font-semibold">管理後台登入</h1>
        <p className="mt-1 text-sm text-muted">全齡護甲中心 &amp; 美甲</p>
        {error && (
          <p className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">帳號或密碼錯誤，請再試一次。</p>
        )}
        <label className="mt-6 block">
          <span className="field-label">Email</span>
          <input name="email" type="email" required autoComplete="email" className="field-input" />
        </label>
        <label className="mt-4 block">
          <span className="field-label">密碼</span>
          <input name="password" type="password" required autoComplete="current-password" className="field-input" />
        </label>
        <button className="btn btn-primary mt-7 w-full py-2.5">登入</button>
      </form>
    </div>
  );
}

import { ComplianceWatch } from "@/components/admin/ComplianceWatch";
import { ImageField } from "@/components/admin/ImageField";
import { Card, Field, Notice, PageHeader } from "@/components/admin/ui";
import { seedSettings } from "@/lib/seed";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/types";
import { saveSettings } from "../../actions";

export default async function HomeContentPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const sb = await createClient();
  const { data } = await sb.from("site_settings").select("data").eq("id", 1).maybeSingle();
  const s: SiteSettings = { ...seedSettings, ...(data?.data ?? {}) };

  return (
    <>
      <PageHeader title="首頁內容" desc="主視覺、品牌簡介、聯絡方式與頁尾聲明" />
      <Notice show={!!saved}>已儲存，網站將於 1 分鐘內更新。</Notice>

      <form action={saveSettings} className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-6">
          <Card>
            <h2 className="mb-5 font-medium">主視覺</h2>
            <div className="space-y-4">
              <Field label="小標" name="hero_eyebrow" defaultValue={s.hero_eyebrow} />
              <Field label="主標題" name="hero_title" defaultValue={s.hero_title} textarea rows={2} hint="按 Enter 換行" />
              <Field label="副標題" name="hero_subtitle" defaultValue={s.hero_subtitle} textarea rows={3} />
              <ImageField name="hero_image" label="主視覺圖片" defaultValue={s.hero_image} folder="site" hint="建議直式 4:5，未設定時顯示預設插圖" />
            </div>
          </Card>

          <Card>
            <h2 className="mb-5 font-medium">品牌簡介</h2>
            <div className="space-y-4">
              <Field label="標題" name="about_title" defaultValue={s.about_title} />
              <Field label="內文" name="about_body" defaultValue={s.about_body} textarea rows={10} hint="段落之間空一行；**文字** 可加粗" />
              <ImageField name="about_image" label="簡介圖片" defaultValue={s.about_image} folder="site" hint="建議橫式 4:3，未設定時顯示特色數字" />
            </div>
          </Card>

          <Card>
            <h2 className="mb-5 font-medium">聯絡方式與預約</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="市話" name="phone" defaultValue={s.phone} />
              <Field label="手機" name="mobile" defaultValue={s.mobile} />
              <Field label="LINE ID" name="line_id" defaultValue={s.line_id} />
              <Field label="LINE 加好友連結" name="line_url" defaultValue={s.line_url} />
              <Field label="Instagram 網址" name="instagram_url" defaultValue={s.instagram_url} placeholder="https://www.instagram.com/…" />
              <Field label="Facebook 網址" name="facebook_url" defaultValue={s.facebook_url} placeholder="https://www.facebook.com/…" />
            </div>
            <div className="mt-4 space-y-4">
              <Field label="預約說明" name="booking_note" defaultValue={s.booking_note} textarea rows={2} />
              <Field label="頁尾聲明" name="disclaimer" defaultValue={s.disclaimer} textarea rows={3} hint="建議保留「非醫療行為」與「請先尋求皮膚科醫師診治」的提醒" />
            </div>
          </Card>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
          <button className="btn btn-primary w-full py-2.5">儲存首頁內容</button>
          <ComplianceWatch />
        </aside>
      </form>
    </>
  );
}

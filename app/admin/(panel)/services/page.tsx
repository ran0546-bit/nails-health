import { ComplianceWatch } from "@/components/admin/ComplianceWatch";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ImageField } from "@/components/admin/ImageField";
import { Card, Field, Notice, PageHeader } from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/lib/types";
import { deleteService, saveService } from "../../actions";

export default async function ServicesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const sb = await createClient();
  const { data } = await sb.from("services").select("*").order("sort_order");
  const services = (data ?? []) as Service[];
  const categories = [...new Set(services.map((s) => s.category))];
  const nextOrder = (services.at(-1)?.sort_order ?? 0) + 10;

  return (
    <>
      <PageHeader title="服務項目" desc="相同「分類」的項目會在首頁排在一起；排序數字越小越前面。" />
      <Notice show={!!saved}>已儲存。</Notice>
      <Notice show={!!deleted}>已刪除。</Notice>

      <datalist id="service-categories">
        {categories.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      <div className="space-y-5">
        {services.map((s) => (
          <ServiceForm key={s.id} service={s} />
        ))}
      </div>

      <h2 className="mb-4 mt-12 font-serif text-xl font-semibold">＋ 新增服務項目</h2>
      <ServiceForm service={{ sort_order: nextOrder, is_published: true, category: categories[0] ?? "護甲" }} />
    </>
  );
}

function ServiceForm({ service: s }: { service: Partial<Service> }) {
  return (
    <Card>
      <form action={saveService} className="space-y-4">
        <input type="hidden" name="id" value={s.id ?? ""} />
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_6rem]">
          <Field label="服務名稱" name="name" defaultValue={s.name} required />
          <label className="block">
            <span className="field-label">分類</span>
            <input name="category" defaultValue={s.category} list="service-categories" className="field-input" />
          </label>
          <Field label="排序" name="sort_order" type="number" defaultValue={s.sort_order} />
        </div>
        <Field label="說明" name="description" defaultValue={s.description} textarea rows={2} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="價格" name="price" defaultValue={s.price} placeholder="例如：NT$1,200 起／請洽詢" />
          <Field label="服務時間" name="duration" defaultValue={s.duration} placeholder="例如：約 60 分鐘" />
        </div>
        <ImageField name="image_url" label="圖片（選填）" defaultValue={s.image_url} folder="services" />
        <ComplianceWatch />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_published" defaultChecked={s.is_published} className="h-4 w-4 accent-[#a62b34]" />
            顯示在網站上
          </label>
          <div className="flex gap-2">
            {s.id && (
              <ConfirmButton message={`確定要刪除「${s.name}」嗎？`} formAction={deleteService}>
                刪除
              </ConfirmButton>
            )}
            <button className="btn btn-primary">{s.id ? "儲存" : "新增"}</button>
          </div>
        </div>
      </form>
    </Card>
  );
}

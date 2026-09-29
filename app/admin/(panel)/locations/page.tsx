import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Card, Field, Notice, PageHeader } from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";
import type { Location } from "@/lib/types";
import { deleteLocation, saveLocation } from "../../actions";

export default async function LocationsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const sb = await createClient();
  const { data } = await sb.from("locations").select("*").order("sort_order");
  const locations = (data ?? []) as Location[];
  const nextOrder = (locations.at(-1)?.sort_order ?? 0) + 10;

  return (
    <>
      <PageHeader title="服務地點" desc="地址會自動產生 Google 地圖，請填寫完整地址。" />
      <Notice show={!!saved}>已儲存。</Notice>
      <Notice show={!!deleted}>已刪除。</Notice>

      <div className="space-y-5">
        {locations.map((l) => (
          <LocationForm key={l.id} location={l} />
        ))}
      </div>

      <h2 className="mb-4 mt-12 font-serif text-xl font-semibold">＋ 新增地點</h2>
      <LocationForm location={{ sort_order: nextOrder }} />
    </>
  );
}

function LocationForm({ location: l }: { location: Partial<Location> }) {
  return (
    <Card>
      <form action={saveLocation} className="space-y-4">
        <input type="hidden" name="id" value={l.id ?? ""} />
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_6rem]">
          <Field label="地點名稱" name="name" defaultValue={l.name} required placeholder="例如：士林店" />
          <Field label="電話" name="phone" defaultValue={l.phone} />
          <Field label="排序" name="sort_order" type="number" defaultValue={l.sort_order} />
        </div>
        <Field label="地址" name="address" defaultValue={l.address} />
        <Field label="營業時間" name="hours" defaultValue={l.hours} textarea rows={3} hint="可換行，例如：週二至週六 10:00–19:00" />
        <Field label="交通方式" name="transit" defaultValue={l.transit} textarea rows={3} />
        <div className="flex justify-end gap-2 border-t border-line pt-4">
          {l.id && (
            <ConfirmButton message={`確定要刪除「${l.name}」嗎？`} formAction={deleteLocation}>
              刪除
            </ConfirmButton>
          )}
          <button className="btn btn-primary">{l.id ? "儲存" : "新增"}</button>
        </div>
      </form>
    </Card>
  );
}

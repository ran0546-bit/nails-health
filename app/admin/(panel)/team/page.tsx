import { ComplianceWatch } from "@/components/admin/ComplianceWatch";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ImageField } from "@/components/admin/ImageField";
import { Card, Field, Notice, PageHeader } from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";
import type { TeamMember } from "@/lib/types";
import { deleteTeamMember, saveTeamMember } from "../../actions";

export default async function TeamAdmin({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const sb = await createClient();
  const { data } = await sb.from("team_members").select("*").order("sort_order");
  const team = (data ?? []) as TeamMember[];
  const nextOrder = (team.at(-1)?.sort_order ?? 0) + 10;

  return (
    <>
      <PageHeader title="服務團隊" desc="護甲師與美甲師介紹，排序數字越小越前面。" />
      <Notice show={!!saved}>已儲存。</Notice>
      <Notice show={!!deleted}>已刪除。</Notice>

      <div className="space-y-5">
        {team.map((m) => (
          <MemberForm key={m.id} member={m} />
        ))}
      </div>

      <h2 className="mb-4 mt-12 font-serif text-xl font-semibold">＋ 新增成員</h2>
      <MemberForm member={{ sort_order: nextOrder, credentials: [] }} />
    </>
  );
}

function MemberForm({ member: m }: { member: Partial<TeamMember> }) {
  return (
    <Card>
      <form action={saveTeamMember} className="space-y-4">
        <input type="hidden" name="id" value={m.id ?? ""} />
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_6rem]">
          <Field label="姓名" name="name" defaultValue={m.name} required />
          <Field label="職稱" name="role" defaultValue={m.role} placeholder="例如：主理人・全齡護甲講師" />
          <Field label="排序" name="sort_order" type="number" defaultValue={m.sort_order} />
        </div>
        <Field label="個人簡介" name="bio" defaultValue={m.bio} textarea rows={4} />
        <Field
          label="證照與認證"
          name="credentials"
          defaultValue={m.credentials?.join("\n")}
          textarea
          rows={5}
          hint="一行一項"
        />
        <ImageField name="photo_url" label="照片" defaultValue={m.photo_url} folder="team" hint="建議正方形大頭照" />
        <ComplianceWatch />
        <div className="flex justify-end gap-2 border-t border-line pt-4">
          {m.id && (
            <ConfirmButton message={`確定要刪除「${m.name}」嗎？`} formAction={deleteTeamMember}>
              刪除
            </ConfirmButton>
          )}
          <button className="btn btn-primary">{m.id ? "儲存" : "新增"}</button>
        </div>
      </form>
    </Card>
  );
}

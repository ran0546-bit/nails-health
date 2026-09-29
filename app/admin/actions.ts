"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { seedLocations, seedPosts, seedServices, seedSettings, seedTeam } from "@/lib/seed";
import { createClient } from "@/lib/supabase/server";

async function adminClient() {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  return sb;
}

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const num = (fd: FormData, key: string) => Number(str(fd, key)) || 0;
const bool = (fd: FormData, key: string) => fd.get(key) === "on";

function refreshSite() {
  revalidatePath("/", "layout");
}

function fail(message: string): never {
  throw new Error(message);
}

// ───────── 登入／登出 ─────────

export async function signIn(fd: FormData) {
  const sb = await createClient();
  const { error } = await sb.auth.signInWithPassword({
    email: str(fd, "email"),
    password: String(fd.get("password") ?? ""),
  });
  if (error) redirect("/admin/login?error=1");
  redirect("/admin");
}

export async function signOut() {
  const sb = await createClient();
  await sb.auth.signOut();
  redirect("/admin/login");
}

// ───────── 首頁內容 ─────────

export async function saveSettings(fd: FormData) {
  const sb = await adminClient();
  const data = Object.fromEntries(Object.keys(seedSettings).map((k) => [k, str(fd, k)]));
  const { error } = await sb
    .from("site_settings")
    .upsert({ id: 1, data, updated_at: new Date().toISOString() });
  if (error) fail(`儲存失敗：${error.message}`);
  refreshSite();
  redirect("/admin/home?saved=1");
}

// ───────── 服務項目 ─────────

export async function saveService(fd: FormData) {
  const sb = await adminClient();
  const id = str(fd, "id");
  const row = {
    category: str(fd, "category") || "護甲",
    name: str(fd, "name") || fail("請填寫服務名稱"),
    description: str(fd, "description"),
    price: str(fd, "price"),
    duration: str(fd, "duration"),
    image_url: str(fd, "image_url"),
    sort_order: num(fd, "sort_order"),
    is_published: bool(fd, "is_published"),
  };
  const { error } = id
    ? await sb.from("services").update(row).eq("id", id)
    : await sb.from("services").insert(row);
  if (error) fail(`儲存失敗：${error.message}`);
  refreshSite();
  redirect("/admin/services?saved=1");
}

export async function deleteService(fd: FormData) {
  const sb = await adminClient();
  const { error } = await sb.from("services").delete().eq("id", str(fd, "id"));
  if (error) fail(`刪除失敗：${error.message}`);
  refreshSite();
  redirect("/admin/services?deleted=1");
}

// ───────── 服務團隊 ─────────

export async function saveTeamMember(fd: FormData) {
  const sb = await adminClient();
  const id = str(fd, "id");
  const row = {
    name: str(fd, "name") || fail("請填寫姓名"),
    role: str(fd, "role"),
    bio: str(fd, "bio"),
    credentials: str(fd, "credentials")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    photo_url: str(fd, "photo_url"),
    sort_order: num(fd, "sort_order"),
  };
  const { error } = id
    ? await sb.from("team_members").update(row).eq("id", id)
    : await sb.from("team_members").insert(row);
  if (error) fail(`儲存失敗：${error.message}`);
  refreshSite();
  redirect("/admin/team?saved=1");
}

export async function deleteTeamMember(fd: FormData) {
  const sb = await adminClient();
  const { error } = await sb.from("team_members").delete().eq("id", str(fd, "id"));
  if (error) fail(`刪除失敗：${error.message}`);
  refreshSite();
  redirect("/admin/team?deleted=1");
}

// ───────── 服務地點 ─────────

export async function saveLocation(fd: FormData) {
  const sb = await adminClient();
  const id = str(fd, "id");
  const row = {
    name: str(fd, "name") || fail("請填寫地點名稱"),
    address: str(fd, "address"),
    hours: str(fd, "hours"),
    transit: str(fd, "transit"),
    phone: str(fd, "phone"),
    sort_order: num(fd, "sort_order"),
  };
  const { error } = id
    ? await sb.from("locations").update(row).eq("id", id)
    : await sb.from("locations").insert(row);
  if (error) fail(`儲存失敗：${error.message}`);
  refreshSite();
  redirect("/admin/locations?saved=1");
}

export async function deleteLocation(fd: FormData) {
  const sb = await adminClient();
  const { error } = await sb.from("locations").delete().eq("id", str(fd, "id"));
  if (error) fail(`刪除失敗：${error.message}`);
  refreshSite();
  redirect("/admin/locations?deleted=1");
}

// ───────── 衛教文章 ─────────

export type PostFormState = { error?: string };

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export async function savePost(_prev: PostFormState, fd: FormData): Promise<PostFormState> {
  const sb = await adminClient();
  const id = str(fd, "id");
  const intent = str(fd, "intent"); // save | publish | unpublish
  const title = str(fd, "title");
  const slug = str(fd, "slug").toLowerCase();

  if (!title) return { error: "請填寫文章標題" };
  if (!SLUG_RE.test(slug)) return { error: "網址代稱只能使用小寫英文、數字與連字號（-），例如 baby-nail-care" };

  const currentStatus = str(fd, "status") === "published" ? "published" : "draft";
  const status = intent === "publish" ? "published" : intent === "unpublish" ? "draft" : currentStatus;
  const now = new Date().toISOString();

  const row = {
    title,
    slug,
    category: str(fd, "category"),
    excerpt: str(fd, "excerpt"),
    content: String(fd.get("content") ?? ""),
    cover_url: str(fd, "cover_url"),
    is_featured: bool(fd, "is_featured"),
    status,
    published_at: status === "published" ? str(fd, "published_at") || now : str(fd, "published_at") || null,
    updated_at: now,
  };

  let postId = id;
  if (id) {
    const { error } = await sb.from("posts").update(row).eq("id", id);
    if (error) return { error: postError(error) };
  } else {
    const { data, error } = await sb.from("posts").insert(row).select("id").single();
    if (error) return { error: postError(error) };
    postId = data.id;
  }

  refreshSite();
  redirect(`/admin/posts/${postId}?saved=${intent || "save"}`);
}

function postError(error: { code?: string; message: string }) {
  if (error.code === "23505") return "這個網址代稱已經被其他文章使用，請換一個";
  return `儲存失敗：${error.message}`;
}

export async function deletePost(fd: FormData) {
  const sb = await adminClient();
  const { error } = await sb.from("posts").delete().eq("id", str(fd, "id"));
  if (error) fail(`刪除失敗：${error.message}`);
  refreshSite();
  redirect("/admin/posts?deleted=1");
}

// ───────── 匯入初始內容（只寫入空的資料表） ─────────

export async function importSeedContent() {
  const sb = await adminClient();
  const strip = <T extends { id: string }>(rows: T[]) => rows.map(({ id: _id, ...rest }) => rest);

  const isEmpty = async (table: string) => {
    const { count, error } = await sb.from(table).select("id", { count: "exact", head: true });
    if (error) fail(`讀取 ${table} 失敗：${error.message}`);
    return !count;
  };

  if (await isEmpty("site_settings")) {
    const { error } = await sb.from("site_settings").insert({ id: 1, data: seedSettings });
    if (error) fail(error.message);
  }
  const tables = [
    ["services", strip(seedServices)],
    ["team_members", strip(seedTeam)],
    ["locations", strip(seedLocations)],
    ["posts", strip(seedPosts)],
  ] as const;
  for (const [table, rows] of tables) {
    if (await isEmpty(table)) {
      const { error } = await sb.from(table).insert(rows as object[]);
      if (error) fail(`匯入 ${table} 失敗：${error.message}`);
    }
  }

  refreshSite();
  redirect("/admin?imported=1");
}

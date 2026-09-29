-- 全齡護甲中心官網 資料庫結構
-- 使用方式：Supabase 專案 → SQL Editor → 貼上整份執行一次

-- ───────── 管理員名單 ─────────
create table if not exists public.admins (
  user_id uuid primary key references auth.users on delete cascade,
  email text,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- ───────── 網站設定（首頁文字、聯絡方式） ─────────
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ───────── 服務項目 ─────────
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  category text not null default '護甲',
  name text not null,
  description text not null default '',
  price text not null default '',
  duration text not null default '',
  image_url text not null default '',
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ───────── 服務團隊 ─────────
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  bio text not null default '',
  credentials text[] not null default '{}',
  photo_url text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ───────── 服務地點 ─────────
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null default '',
  hours text not null default '',
  transit text not null default '',
  phone text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ───────── 衛教文章 ─────────
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  cover_url text not null default '',
  category text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  is_featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists posts_status_published_idx on public.posts (status, published_at desc);

-- ───────── 權限（RLS）：訪客只能讀公開內容，管理員可讀寫 ─────────
alter table public.site_settings enable row level security;
alter table public.services enable row level security;
alter table public.team_members enable row level security;
alter table public.locations enable row level security;
alter table public.posts enable row level security;

drop policy if exists "public read" on public.site_settings;
create policy "public read" on public.site_settings for select using (true);
drop policy if exists "admin write" on public.site_settings;
create policy "admin write" on public.site_settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read" on public.services;
create policy "public read" on public.services for select using (is_published or public.is_admin());
drop policy if exists "admin write" on public.services;
create policy "admin write" on public.services for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read" on public.team_members;
create policy "public read" on public.team_members for select using (true);
drop policy if exists "admin write" on public.team_members;
create policy "admin write" on public.team_members for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read" on public.locations;
create policy "public read" on public.locations for select using (true);
drop policy if exists "admin write" on public.locations;
create policy "admin write" on public.locations for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read" on public.posts;
create policy "public read" on public.posts for select using (status = 'published' or public.is_admin());
drop policy if exists "admin write" on public.posts;
create policy "admin write" on public.posts for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ───────── 圖片儲存空間 ─────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "admin upload media" on storage.objects;
create policy "admin upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin());
drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- ───────── 設定管理員（建立帳號後執行，把 email 換成你的） ─────────
-- insert into public.admins (user_id, email)
-- select id, email from auth.users where email = 'you@example.com';

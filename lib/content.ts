import { cache } from "react";
import { createPublicClient } from "./supabase/public";
import { seedLocations, seedPosts, seedServices, seedSettings, seedTeam } from "./seed";
import type { Location, Post, Service, SiteSettings, TeamMember } from "./types";

// 公開頁面的資料來源。未連接 Supabase 或讀取失敗時，回傳內建的初始內容。

const byPublishedDesc = (a: Post, b: Post) =>
  (b.published_at ?? "").localeCompare(a.published_at ?? "");

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const sb = createPublicClient();
  if (!sb) return seedSettings;
  const { data, error } = await sb.from("site_settings").select("data").eq("id", 1).maybeSingle();
  if (error) {
    console.error("getSiteSettings", error.message);
    return seedSettings;
  }
  return { ...seedSettings, ...(data?.data ?? {}) };
});

export const getServices = cache(async (): Promise<Service[]> => {
  const sb = createPublicClient();
  if (!sb) return seedServices;
  const { data, error } = await sb
    .from("services")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  if (error) {
    console.error("getServices", error.message);
    return seedServices;
  }
  return data as Service[];
});

export const getTeam = cache(async (): Promise<TeamMember[]> => {
  const sb = createPublicClient();
  if (!sb) return seedTeam;
  const { data, error } = await sb.from("team_members").select("*").order("sort_order");
  if (error) {
    console.error("getTeam", error.message);
    return seedTeam;
  }
  return data as TeamMember[];
});

export const getLocations = cache(async (): Promise<Location[]> => {
  const sb = createPublicClient();
  if (!sb) return seedLocations;
  const { data, error } = await sb.from("locations").select("*").order("sort_order");
  if (error) {
    console.error("getLocations", error.message);
    return seedLocations;
  }
  return data as Location[];
});

export const getPublishedPosts = cache(async (): Promise<Post[]> => {
  const sb = createPublicClient();
  if (!sb) return seedPosts.filter((p) => p.status === "published").sort(byPublishedDesc);
  const { data, error } = await sb
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) {
    console.error("getPublishedPosts", error.message);
    return [...seedPosts].sort(byPublishedDesc);
  }
  return data as Post[];
});

export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  const posts = await getPublishedPosts();
  const featured = posts.filter((p) => p.is_featured);
  return (featured.length ? featured : posts).slice(0, limit);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPublishedPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export function groupBy<T>(items: T[], key: (item: T) => string): [string, T[]][] {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item) || "其他";
    map.set(k, [...(map.get(k) ?? []), item]);
  }
  return [...map.entries()];
}

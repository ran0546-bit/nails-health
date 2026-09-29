"use client";

import { createClient } from "./supabase/browser";

// 上傳圖片到 Supabase Storage 的 media bucket，回傳公開網址。
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("請選擇圖片檔");
  if (file.size > 8 * 1024 * 1024) throw new Error("圖片請小於 8MB");

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const sb = createClient();
  const { error } = await sb.storage.from("media").upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
  });
  if (error) throw new Error(`上傳失敗：${error.message}`);
  return sb.storage.from("media").getPublicUrl(path).data.publicUrl;
}

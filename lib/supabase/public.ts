import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "./env";

// 公開頁面用：不讀 cookie，讓頁面可以被快取（ISR）。
export function createPublicClient() {
  if (!isSupabaseConfigured) return null;
  return createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
}

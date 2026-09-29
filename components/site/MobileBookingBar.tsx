import type { SiteSettings } from "@/lib/types";
import { telHref } from "./Footer";

export function MobileBookingBar({ settings }: { settings: SiteSettings }) {
  const tel = settings.mobile || settings.phone;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-white/95 p-3 backdrop-blur lg:hidden">
      {tel && (
        <a href={telHref(tel)} className="btn btn-outline flex-1">
          撥打電話
        </a>
      )}
      <a href={settings.line_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-[2]">
        LINE 預約諮詢
      </a>
    </div>
  );
}

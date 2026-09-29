import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { LogoMark } from "./Logo";

export const telHref = (n: string) => `tel:${n.replace(/[^0-9+]/g, "")}`;

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-line bg-white pb-24 pt-12 lg:pb-12">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-7 w-7 text-brand" />
            <span className="font-medium">全齡護甲中心 &amp; 美甲</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{settings.disclaimer}</p>
        </div>
        <div className="text-sm">
          <h3 className="font-medium text-ink">網站導覽</h3>
          <ul className="mt-3 space-y-2 text-muted">
            <li><Link href="/#services" className="hover:text-brand">服務項目</Link></li>
            <li><Link href="/#team" className="hover:text-brand">服務團隊</Link></li>
            <li><Link href="/#location" className="hover:text-brand">交通資訊</Link></li>
            <li><Link href="/articles" className="hover:text-brand">衛教專區</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <h3 className="font-medium text-ink">聯絡我們</h3>
          <ul className="mt-3 space-y-2 text-muted">
            {settings.phone && (
              <li>電話 <a href={telHref(settings.phone)} className="hover:text-brand">{settings.phone}</a></li>
            )}
            {settings.mobile && (
              <li>手機 <a href={telHref(settings.mobile)} className="hover:text-brand">{settings.mobile}</a></li>
            )}
            {settings.line_id && (
              <li>LINE <a href={settings.line_url} target="_blank" rel="noopener noreferrer" className="hover:text-brand">{settings.line_id}</a></li>
            )}
            {settings.instagram_url && (
              <li><a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-brand">Instagram</a></li>
            )}
            {settings.facebook_url && (
              <li><a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-brand">Facebook</a></li>
            )}
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl px-4 text-xs text-muted/80 sm:px-6">
        © {new Date().getFullYear()} Nails &amp; Health 全齡護甲中心
      </p>
    </footer>
  );
}

import Link from "next/link";

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g fill="currentColor">
        <rect x="0" y="0" width="46" height="56" rx="16" />
        <rect x="50" y="0" width="50" height="46" rx="16" />
        <rect x="54" y="50" width="46" height="50" rx="16" />
        <rect x="0" y="60" width="50" height="40" rx="16" />
      </g>
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="全齡護甲中心 首頁">
      <LogoMark className="h-8 w-8 text-brand" />
      <span className="leading-tight">
        <span className="block text-[1.05rem] font-medium tracking-wide text-ink">Nails &amp; Health</span>
        <span className="block text-[0.7rem] tracking-[0.2em] text-muted">全齡護甲中心 &amp; 美甲</span>
      </span>
    </Link>
  );
}

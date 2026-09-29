"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";

const nav = [
  { href: "/#about", label: "關於我們" },
  { href: "/#services", label: "服務項目" },
  { href: "/#team", label: "服務團隊" },
  { href: "/#location", label: "交通資訊" },
  { href: "/articles", label: "衛教專區" },
];

export function Header({ lineUrl }: { lineUrl: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ivory/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-7 text-[0.95rem] lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-ink/80 transition hover:text-brand">
              {item.label}
            </Link>
          ))}
          <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            預約諮詢
          </a>
        </nav>
        <button
          type="button"
          className="-mr-2 p-2 lg:hidden"
          aria-label={open ? "關閉選單" : "開啟選單"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="border-t border-line bg-ivory px-4 pb-5 pt-2 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block border-b border-line/60 py-3.5 text-ink"
            >
              {item.label}
            </Link>
          ))}
          <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-4 w-full">
            LINE 預約諮詢
          </a>
        </nav>
      )}
    </header>
  );
}

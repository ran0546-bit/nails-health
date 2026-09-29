import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans_TC({
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans",
  display: "swap",
  preload: false,
});

const serif = Noto_Serif_TC({
  weight: ["500", "600", "700"],
  variable: "--font-noto-serif",
  display: "swap",
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "全齡護甲中心 & 美甲｜Nails & Health 台北士林",
    template: "%s｜全齡護甲中心 Nails & Health",
  },
  description:
    "台北士林的全齡護甲專門店。德國與日本技術認證護甲師，提供足趾甲整護、甲片塑型、兒童與長輩指甲照護、日式美甲與護甲衛教。",
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: "全齡護甲中心 & 美甲 Nails & Health",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant-TW" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

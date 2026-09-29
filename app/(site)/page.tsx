import Link from "next/link";
import { ArticleCard } from "@/components/site/ArticleCard";
import { telHref } from "@/components/site/Footer";
import { LogoMark } from "@/components/site/Logo";
import { Markdown } from "@/components/site/Markdown";
import {
  getFeaturedPosts,
  getLocations,
  getServices,
  getSiteSettings,
  getTeam,
  groupBy,
} from "@/lib/content";

export const revalidate = 60;

function SectionTitle({ en, zh, lead }: { en: string; zh: string; lead?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-brand">{en}</p>
      <h2 className="mt-3 text-balance font-serif text-3xl font-semibold leading-tight sm:text-[2.1rem]">{zh}</h2>
      {lead && <p className="mt-4 leading-relaxed text-muted">{lead}</p>}
    </div>
  );
}

export default async function HomePage() {
  const [settings, services, team, locations, posts] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getTeam(),
    getLocations(),
    getFeaturedPosts(3),
  ]);
  const primaryLocation = locations[0];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NailSalon",
    name: "全齡護甲中心 & 美甲 Nails & Health",
    url: siteUrl,
    telephone: settings.phone || settings.mobile,
    address: primaryLocation
      ? { "@type": "PostalAddress", streetAddress: primaryLocation.address, addressCountry: "TW" }
      : undefined,
    sameAs: [settings.instagram_url, settings.facebook_url, settings.line_url].filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ───── 主視覺 ───── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pb-24 lg:pt-20">
          <div>
            <p className="text-sm tracking-[0.15em] text-brand">{settings.hero_eyebrow}</p>
            {/* 字級隨螢幕寬度縮放，讓每一行標題在手機上也不會被拆開 */}
            <h1 className="mt-5 whitespace-pre-line font-serif text-[clamp(1.25rem,6.6vw,2.6rem)] font-semibold leading-[1.35] lg:text-[clamp(2.1rem,3.3vw,2.6rem)] lg:leading-[1.3]">
              {settings.hero_title}
            </h1>
            <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-muted">{settings.hero_subtitle}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={settings.line_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary px-7 py-3 text-base">
                LINE 預約諮詢
              </a>
              <Link href="#services" className="btn btn-outline px-7 py-3 text-base">
                查看服務項目
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[16rem] sm:max-w-xs lg:max-w-md">
            <div className="aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-3xl bg-blush">
              {settings.hero_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={settings.hero_image} alt="全齡護甲中心" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-end px-8 pb-12">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/feet-line.png" alt="" className="w-full opacity-80" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-5 -left-4 flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-4 shadow-[0_12px_30px_-15px_rgb(58_53_54/0.35)] sm:-left-8">
              <LogoMark className="h-9 w-9 text-brand" />
              <div className="text-sm leading-tight">
                <p className="font-medium">德國 × 日本</p>
                <p className="text-muted">技術認證護甲師</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── 品牌簡介 ───── */}
      <section id="about" className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 md:grid-cols-[1fr_1.3fr] md:items-center">
          <div className="order-2 md:order-1">
            {settings.about_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.about_image} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover" />
            ) : (
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  ["14+", "年手足保養經驗"],
                  ["德・日", "雙系統技術認證"],
                  ["0–99", "歲全齡照護"],
                ].map(([num, label]) => (
                  <div key={label} className="rounded-2xl bg-blush px-2 py-7">
                    <p className="font-serif text-2xl font-semibold text-brand sm:text-3xl">{num}</p>
                    <p className="mt-2 text-xs leading-snug text-muted sm:text-sm">{label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="order-1 md:order-2">
            <SectionTitle en="About" zh={settings.about_title} />
            <div className="mt-6 text-muted">
              <Markdown>{settings.about_body}</Markdown>
            </div>
          </div>
        </div>
      </section>

      {/* ───── 服務介紹 ───── */}
      <section id="services" className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle
            en="Services"
            zh="服務項目"
            lead="每位客人的指甲狀況與生活習慣都不同，服務前會先了解你的需求，再建議合適的項目與居家保養方式。"
          />
          <div className="mt-12 space-y-14">
            {groupBy(services, (s) => s.category).map(([category, items]) => (
              <div key={category}>
                <h3 className="flex items-center gap-3 font-serif text-xl font-semibold">
                  <span className="h-px w-6 bg-brand" />
                  {category}
                </h3>
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((s) => (
                    <article key={s.id} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
                      {s.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.image_url} alt="" className="aspect-[16/10] w-full object-cover" />
                      )}
                      <div className="flex flex-1 flex-col p-6">
                        <h4 className="text-lg font-medium">{s.name}</h4>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.description}</p>
                        {(s.price || s.duration) && (
                          <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm">
                            <span className="font-medium text-brand">{s.price}</span>
                            {s.duration && <span className="text-muted">{s.duration}</span>}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 服務團隊 ───── */}
      <section id="team" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle en="Our Team" zh="服務團隊" />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {team.map((m) => (
              <article key={m.id} className="rounded-3xl border border-line bg-ivory p-6 sm:p-8">
                <div className="flex items-center gap-5">
                  {m.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.photo_url} alt={m.name} className="h-20 w-20 shrink-0 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blush font-serif text-2xl font-semibold text-brand">
                      {m.name.slice(0, 1)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-serif text-xl font-semibold">{m.name}</h3>
                    <p className="mt-1 text-sm text-brand">{m.role}</p>
                  </div>
                </div>
                <p className="mt-6 text-sm leading-relaxed text-muted">{m.bio}</p>
                {m.credentials.length > 0 && (
                  <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
                    {m.credentials.map((c) => (
                      <li key={c} className="flex gap-2">
                        <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 服務地點 ───── */}
      <section id="location" className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle en="Location" zh="服務地點" />
          <div className="mt-12 space-y-8">
            {locations.map((loc) => (
              <div key={loc.id} className="grid overflow-hidden rounded-3xl border border-line bg-white md:grid-cols-2">
                <dl className="space-y-6 p-6 sm:p-10">
                  <h3 className="font-serif text-2xl font-semibold">{loc.name}</h3>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-brand">地址</dt>
                    <dd className="mt-1.5">{loc.address}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-brand">營業時間</dt>
                    <dd className="mt-1.5 whitespace-pre-line">{loc.hours}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-brand">交通方式</dt>
                    <dd className="mt-1.5 whitespace-pre-line">{loc.transit}</dd>
                  </div>
                  {loc.phone && (
                    <div>
                      <dt className="text-xs uppercase tracking-[0.2em] text-brand">電話</dt>
                      <dd className="mt-1.5">
                        <a href={telHref(loc.phone)} className="hover:text-brand">{loc.phone}</a>
                      </dd>
                    </div>
                  )}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    在 Google 地圖開啟
                  </a>
                </dl>
                <iframe
                  title={`${loc.name} 地圖`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(loc.address)}&output=embed`}
                  className="h-72 w-full border-0 md:h-full md:min-h-[26rem]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 精選衛教文章 ───── */}
      {posts.length > 0 && (
        <section id="articles" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionTitle en="Nail Care Notes" zh="護甲衛教" lead="護甲師整理的居家保養知識，讓你在家也能照顧好每一片指甲。" />
              <Link href="/articles" className="btn btn-outline">
                看更多文章 →
              </Link>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <ArticleCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───── 聯絡方式＋預約 ───── */}
      <section id="contact" className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[2rem] bg-brand px-6 py-14 text-white sm:px-14">
            <LogoMark className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 text-white/10" />
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Contact</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">預約諮詢</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-white/85">{settings.booking_note}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={settings.line_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-white px-7 py-3 text-base text-brand hover:bg-blush"
              >
                LINE 預約 {settings.line_id}
              </a>
              {settings.phone && (
                <a href={telHref(settings.phone)} className="btn border border-white/40 px-7 py-3 text-base hover:bg-white/10">
                  {settings.phone}
                </a>
              )}
              {settings.mobile && (
                <a href={telHref(settings.mobile)} className="btn border border-white/40 px-7 py-3 text-base hover:bg-white/10">
                  {settings.mobile}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

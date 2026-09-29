import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { MobileBookingBar } from "@/components/site/MobileBookingBar";
import { getSiteSettings } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <>
      <Header lineUrl={settings.line_url} />
      <main>{children}</main>
      <Footer settings={settings} />
      <MobileBookingBar settings={settings} />
    </>
  );
}

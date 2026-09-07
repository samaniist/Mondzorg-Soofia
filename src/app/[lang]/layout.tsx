import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Manrope, Newsreader } from "next/font/google";
import { LiveClinicStatus, MotionDirector } from "@/components/experience";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ArrowUpRightIcon } from "@/components/ui-icons";
import { isLocale, localizedPath } from "@/i18n/config";
import { getTranslations } from "@/i18n/translations";
import "../globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

export function generateStaticParams() {
  return [{ lang: "nl" }, { lang: "en" }];
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return {
    metadataBase: new URL("https://mondzorgpraktijkveenendaal.nl"),
    title: "Mondzorgpraktijk Veenendaal",
    description: lang === "en"
      ? "Personal dental and preventive care in Veenendaal."
      : "Persoonlijke tandheelkundige en preventieve mondzorg in Veenendaal.",
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = getTranslations(lang);
  const href = (path: string) => localizedPath(lang, path);
  const footerLines = copy.footerStatement.split("\n");

  return (
    <html lang={lang} className={`${manrope.variable} ${newsreader.variable} h-full`} data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col">
        <a className="skip-link" href="#hoofdinhoud">{copy.skipToContent}</a>
        <header className="site-header" data-site-header>
          <span className="header-scroll-progress" data-scroll-progress aria-hidden="true" />
          <div className="shell header-inner">
            <Link className="site-name" href={href("/")} aria-label="Mondzorgpraktijk Veenendaal, home">
              <Image
                alt="Mondzorgpraktijk Veenendaal"
                height={60}
                priority
                src="/wp-content/uploads/2025/09/LOGO_MPV_LANG_LICHT-GOUD-1.png"
                width={347}
              />
            </Link>
            <nav className="desktop-nav" aria-label={copy.mainNavigation}>
              <ul className="nav-list">
                <li><Link data-directional href={href("/de-praktijk/")}>{copy.practice}</Link></li>
                <li><Link data-directional href={href("/behandelingen/")}>{copy.treatments}</Link></li>
                <li><Link data-directional href={href("/ons-team/")}>{copy.team}</Link></li>
                <li><Link data-directional href={href("/informatie/")}>{copy.information}</Link></li>
                <li><Link data-directional href={href("/contact/")}>{copy.contact}</Link></li>
              </ul>
            </nav>
            <div className="header-actions">
              <LanguageSwitcher locale={lang} />
              <a className="header-phone" href="tel:+31318501376" aria-label={copy.callPractice}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.1 3.4 9.3 8 7.7 9.4c.8 2.1 2.8 4.1 4.9 4.9l1.4-1.6 4.6 2.2-.5 3.2c-.2 1.2-1.2 2-2.4 2C9.2 20.1 3.9 14.8 3.9 8.3c0-1.2.8-2.2 2-2.4l1.2-2.5Z" /></svg>
                <span>0318 501376</span>
              </a>
              <Link className="button button-small" data-magnetic href={href("/maak-een-afspraak-1/")}>{copy.appointment}</Link>
            </div>
            <details className="mobile-menu">
              <summary aria-label={copy.openMenu}>
                <span>{copy.menu}</span>
                <span className="menu-lines" aria-hidden="true" />
              </summary>
              <div className="mobile-menu-panel">
                <LiveClinicStatus compact locale={lang} />
                <LanguageSwitcher className="language-switcher-mobile" locale={lang} />
                <nav aria-label={copy.mobileNavigation}>
                  <Link href={href("/de-praktijk/")}>{copy.practice}</Link>
                  <Link href={href("/behandelingen/")}>{copy.treatments}</Link>
                  <Link href={href("/ons-team/")}>{copy.team}</Link>
                  <Link href={href("/informatie/")}>{copy.information}</Link>
                  <Link href={href("/blog/")}>{copy.blog}</Link>
                  <Link href={href("/contact/")}>{copy.contact}</Link>
                </nav>
                <a href="tel:+31318501376">{copy.callNumber}</a>
              </div>
            </details>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="shell footer-heading">
            <p className="eyebrow">Living Dental Atelier</p>
            <p className="footer-statement">{footerLines[0]}<br />{footerLines[1]}</p>
            <Link className="round-link" data-magnetic href={href("/maak-een-afspraak-1/")} aria-label={copy.makeAppointment}>
              <span>{copy.makeAppointment}</span>
              <ArrowUpRightIcon />
            </Link>
          </div>
          <div className="shell footer-grid">
            <div className="footer-brand">
              <Image
                alt="Mondzorgpraktijk Veenendaal"
                height={60}
                src="/wp-content/uploads/2025/09/LOGO_MPV_LANG_LICHT-GOUD-1.png"
                width={347}
              />
              <p>{copy.footerDescription}</p>
            </div>
            <div>
              <p className="footer-label">{copy.visit}</p>
              <address>Wolweg 29<br />3901 TD Veenendaal</address>
              <p>{copy.openFiveDays}</p>
            </div>
            <div>
              <p className="footer-label">{copy.contact}</p>
              <p><a href="tel:+31318501376">0318 501376</a><br />
              <a href="mailto:info@mondzorgpraktijkveenendaal.nl">info@mondzorgpraktijkveenendaal.nl</a></p>
              <p><Link href={href("/contact/")}>{copy.routeContact}</Link></p>
            </div>
            <div>
              <p className="footer-label">{copy.emergency}</p>
              <p>Dental365 Ede<br /><a href="tel:09001515">0900 1515</a></p>
              <p><a href="https://dental365.nl" rel="noopener noreferrer">dental365.nl</a></p>
            </div>
          </div>
          <div className="shell footer-bottom">
            <span>© {new Date().getFullYear()} Mondzorgpraktijk Veenendaal</span>
            <span className="footer-meta">
              <Link href={href("/informatie/")}>{copy.patientInformation}</Link>
              <span aria-hidden="true">·</span>
              <span>
                {lang === "en"
                  ? "Crafted with care — design, development & marketing by "
                  : "Met zorg gemaakt — design, ontwikkeling & marketing door "}
                <a className="nexlytic-credit" href="https://nexlytic.de" rel="noopener noreferrer" target="_blank">
                  Nexlytic.de
                </a>
              </span>
            </span>
          </div>
        </footer>
        <div className="mobile-appointment-bar">
          <a href="tel:+31318501376" aria-label={copy.callPractice}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.1 3.4 9.3 8 7.7 9.4c.8 2.1 2.8 4.1 4.9 4.9l1.4-1.6 4.6 2.2-.5 3.2c-.2 1.2-1.2 2-2.4 2C9.2 20.1 3.9 14.8 3.9 8.3c0-1.2.8-2.2 2-2.4l1.2-2.5Z" /></svg>
            <span>{copy.callUs}</span>
          </a>
          <Link href={href("/maak-een-afspraak-1/")}>{copy.makeAppointment} <ArrowUpRightIcon /></Link>
        </div>
        <span className="cursor-follower" data-cursor-follower data-visible="false" aria-hidden="true" />
        <MotionDirector />
      </body>
    </html>
  );
}

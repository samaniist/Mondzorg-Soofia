"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localizedPath, type Locale } from "@/i18n/config";
import { getTranslations } from "@/i18n/translations";

export function LanguageSwitcher({ locale, className = "" }: { locale: Locale; className?: string }) {
  const pathname = usePathname();
  const copy = getTranslations(locale);

  return (
    <nav className={`language-switcher ${className}`.trim()} aria-label={copy.switchLanguage}>
      <Link
        aria-current={locale === "nl" ? "page" : undefined}
        href={localizedPath("nl", pathname)}
        hrefLang="nl"
        lang="nl"
      >
        NL
      </Link>
      <span aria-hidden="true" />
      <Link
        aria-current={locale === "en" ? "page" : undefined}
        href={localizedPath("en", pathname)}
        hrefLang="en"
        lang="en"
      >
        EN
      </Link>
    </nav>
  );
}

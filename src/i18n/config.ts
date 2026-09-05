export const locales = ["nl", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "nl";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localizedPath(locale: Locale, href: string) {
  if (/^(?:[a-z]+:|#)/i.test(href)) return href;

  const match = href.match(/^([^?#]*)(.*)$/);
  const rawPath = match?.[1] || "/";
  const suffix = match?.[2] || "";
  const withoutLocale = rawPath.replace(/^\/en(?=\/|$)/, "") || "/";

  if (locale === defaultLocale) return `${withoutLocale}${suffix}`;
  return `${withoutLocale === "/" ? "/en/" : `/en${withoutLocale}`}${suffix}`;
}

export function publicPathFromLocalized(pathname: string) {
  return pathname.replace(/^\/en(?=\/|$)/, "") || "/";
}

import type { Metadata } from "next";
import { SITE_URL, type ExportedPage } from "./content";
import { localizedPath, publicPathFromLocalized, type Locale } from "@/i18n/config";

const descriptionOverrides: Record<string, string> = {
  "/behandelingen/tanden-trekken-extracties/":
    "Wanneer een tand niet behouden kan worden, zorgen we voor een rustige extractie met duidelijke uitleg en persoonlijke nazorg in Veenendaal.",
  "/ons-team/cristian-zandi/":
    "Maak kennis met Cristian Zandi, geregistreerd mondhygiënist en praktijkeigenaar bij Mondzorgpraktijk Veenendaal.",
};

export function metadataForPage(page: ExportedPage, locale: Locale = "nl"): Metadata {
  const localizedPagePath = new URL(page.url).pathname;
  const path = publicPathFromLocalized(localizedPagePath);
  const index = !page.robots.toLowerCase().includes("noindex");
  const follow = !page.robots.toLowerCase().includes("nofollow");
  const description = (locale === "nl" ? descriptionOverrides[path] : undefined) || page.metaDescription || undefined;
  const image = page.images[0]?.src;
  const canonicalPath = localizedPath(locale, path);
  const canonical = `${SITE_URL}${canonicalPath === "/" ? "" : canonicalPath}`;
  const dutchUrl = `${SITE_URL}${path === "/" ? "" : path}`;
  const englishPath = localizedPath("en", path);
  const englishUrl = `${SITE_URL}${englishPath}`;

  return {
    title: page.title,
    description,
    alternates: {
      canonical,
      languages: {
        "nl-NL": dutchUrl,
        en: englishUrl,
        "x-default": dutchUrl,
      },
    },
    robots: {
      index,
      follow,
      googleBot: {
        index,
        follow,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_GB" : "nl_NL",
      alternateLocale: locale === "en" ? ["nl_NL"] : ["en_GB"],
      url: canonical,
      siteName: "Mondzorgpraktijk Veenendaal",
      title: page.title,
      description,
      images: image ? [{ url: image, alt: page.images[0]?.alt || page.title }] : [],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: page.title,
      description,
      images: image ? [image] : [],
    },
  };
}

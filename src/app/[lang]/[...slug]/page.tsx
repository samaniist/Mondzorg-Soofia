import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TreatmentPage } from "@/components/content-components";
import {
  BlogArchive,
  BookingPage,
  ContactPage,
  GenericPage,
  TeamOverview,
  TreatmentsOverview,
} from "@/components/special-pages";
import { contentForPage, getPage, pages, redirectPaths } from "@/content/content";
import { metadataForPage } from "@/content/metadata";
import { isLocale } from "@/i18n/config";

export const dynamicParams = false;

export function generateStaticParams() {
  return pages
    .filter((page) => page.path !== "/" && !redirectPaths.has(page.path))
    .flatMap((page) => ["nl", "en"].map((lang) => ({
      lang,
      slug: page.path.split("/").filter(Boolean),
    })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[...slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const page = getPage(`/${slug.join("/")}/`, lang);
  return page ? metadataForPage(page, lang) : {};
}

export default async function ContentPage({ params }: PageProps<"/[lang]/[...slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const path = `/${slug.join("/")}/`;
  const page = getPage(path, lang);
  if (!page) notFound();

  if (path === "/behandelingen/") return <TreatmentsOverview locale={lang} page={page} />;
  if (path === "/ons-team/") return <TeamOverview locale={lang} page={page} />;
  if (path === "/blog/") return <BlogArchive locale={lang} page={page} />;
  if (path === "/maak-een-afspraak-1/") return <BookingPage locale={lang} page={page} />;
  if (path === "/contact/") return <ContactPage locale={lang} page={page} />;
  if (path.startsWith("/behandelingen/")) {
    const { html, faqs } = contentForPage(path, lang);
    return <main id="hoofdinhoud"><TreatmentPage locale={lang} page={page} html={html} faqs={faqs} /></main>;
  }
  return <GenericPage locale={lang} page={page} />;
}

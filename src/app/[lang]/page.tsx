import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePage } from "../home-page";
import { getPage } from "@/content/content";
import { metadataForPage } from "@/content/metadata";
import { isLocale } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const home = getPage("/", lang);
  return home ? metadataForPage(home, lang) : {};
}

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <HomePage locale={lang} />;
}

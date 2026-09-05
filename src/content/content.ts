import exportData from "../../content-export.json";
import englishPages from "./english-pages.json";
import wordpressPages from "./wordpress-pages.json";
import wordpressPosts from "./wordpress-posts.json";
import type { Locale } from "@/i18n/config";
import { englishTitle, polishEnglish } from "./english-polish";

export const SITE_URL = "https://mondzorgpraktijkveenendaal.nl";

export type ExportedPage = {
  url: string;
  title: string;
  metaDescription: string;
  canonical: string;
  robots: string;
  text: string;
  images: { src: string; alt: string }[];
  note?: string;
};

type WordPressItem = {
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  modified: string;
};

export type FaqItem = { question: string; answer: string };

type EnglishPage = {
  title: string;
  metaDescription: string;
  text: string;
  imageAlts: string[];
};

const englishByPath = englishPages as Record<string, EnglishPage>;

export const redirectPaths = new Set([
  "/algemene-tandheelkunde/",
  "/maak-een-afspraak-2/",
  "/afspraak-maken/",
]);

export const pages = (exportData.pages as ExportedPage[]).map((page) => ({
  ...page,
  path: new URL(page.url).pathname,
}));

export const postSlugs = new Set(
  (wordpressPosts as WordPressItem[]).map((post) => post.slug),
);

const wpItems = new Map<string, WordPressItem>(
  [...(wordpressPages as WordPressItem[]), ...(wordpressPosts as WordPressItem[])].map(
    (item) => [item.slug, item],
  ),
);

export function getPage(path: string, locale: Locale = "nl") {
  const page = pages.find((candidate) => candidate.path === path);
  if (!page || locale === "nl") return page;

  const english = englishByPath[path];
  if (!english) return page;

  return {
    ...page,
    url: `${SITE_URL}/en${path === "/" ? "/" : path}`,
    canonical: `${SITE_URL}/en${path === "/" ? "/" : path}`,
    title: englishTitle(path, english.title),
    metaDescription: polishEnglish(english.metaDescription),
    text: polishEnglish(english.text),
    images: page.images.map((image, index) => ({
      ...image,
      alt: polishEnglish(english.imageAlts[index] || image.alt),
    })),
  };
}

export function getWordPressItem(path: string) {
  const slug = path === "/" ? "home" : path.split("/").filter(Boolean).at(-1);
  return slug ? wpItems.get(slug) : undefined;
}

export function localMediaPath(src: string) {
  try {
    const url = new URL(src);
    if (url.hostname === "mondzorgpraktijkveenendaal.nl") return decodeURIComponent(url.pathname);
  } catch {
    return src;
  }
  return src;
}

export function isIndexable(page: ExportedPage) {
  return !page.robots.toLowerCase().includes("noindex");
}

export function displayTitle(title: string) {
  return decodeHtml(title)
    .replace(/\s+[|–]\s+Mondzorgpraktijk Veenendaal.*$/i, "")
    .trim();
}

export function decodeHtml(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function textOnly(value: string) {
  return decodeHtml(value.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function takeBalancedElement(html: string, start: number, tag = "div") {
  const token = new RegExp(`<\\/?${tag}\\b[^>]*>`, "gi");
  token.lastIndex = start;
  let depth = 0;
  let match: RegExpExecArray | null;
  while ((match = token.exec(html))) {
    depth += match[0].startsWith("</") ? -1 : 1;
    if (depth === 0) return { block: html.slice(start, token.lastIndex), end: token.lastIndex };
  }
  return { block: html.slice(start), end: html.length };
}

function removeBalancedByMarker(html: string, marker: RegExp) {
  let output = html;
  let match = marker.exec(output);
  while (match) {
    const start = output.lastIndexOf("<div", match.index);
    if (start < 0) break;
    const { end } = takeBalancedElement(output, start);
    output = output.slice(0, start) + output.slice(end);
    marker.lastIndex = 0;
    match = marker.exec(output);
  }
  return output;
}

function extractAccordionFaqs(source: string) {
  const faqs: FaqItem[] = [];
  let html = source;
  const outerMarker = /class=["'][^"']*\bwd-accordion\b[^"']*["']/i;
  let outer = outerMarker.exec(html);

  while (outer) {
    const start = html.lastIndexOf("<div", outer.index);
    if (start < 0) break;
    const taken = takeBalancedElement(html, start);
    let block = taken.block;
    const itemMarker = /class=["'][^"']*\bwd-accordion-item\b[^"']*["']/i;
    let item = itemMarker.exec(block);

    while (item) {
      const itemStart = block.lastIndexOf("<div", item.index);
      const part = takeBalancedElement(block, itemStart);
      const question = part.block.match(
        /wd-accordion-title-text[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/i,
      );
      const answer = part.block.match(
        /wd-accordion-content[^>]*>([\s\S]*?)<\/div>/i,
      );
      if (question && answer) {
        const parsed = {
          question: textOnly(question[1]),
          answer: textOnly(answer[1]),
        };
        if (parsed.question && parsed.answer) faqs.push(parsed);
      }
      block = block.slice(0, itemStart) + block.slice(part.end);
      itemMarker.lastIndex = 0;
      item = itemMarker.exec(block);
    }

    html = html.slice(0, start) + html.slice(taken.end);
    outerMarker.lastIndex = 0;
    outer = outerMarker.exec(html);
  }

  return { html, faqs };
}

function extractYoastFaqs(source: string) {
  const faqs: FaqItem[] = [];
  const pattern = /<strong[^>]*class=["'][^"']*schema-faq-question[^"']*["'][^>]*>([\s\S]*?)<\/strong>[\s\S]*?<p[^>]*class=["'][^"']*schema-faq-answer[^"']*["'][^>]*>([\s\S]*?)<\/p>/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source))) {
    const item = { question: textOnly(match[1]), answer: textOnly(match[2]) };
    if (item.question && item.answer) faqs.push(item);
  }
  return {
    faqs,
    html: removeBalancedByMarker(
      source,
      /class=["'][^"']*\bschema-faq\b[^"']*["']/i,
    ),
  };
}

const allowedTags = new Set([
  "p", "h2", "h3", "h4", "ul", "ol", "li", "a", "strong", "em", "b", "i",
  "blockquote", "table", "thead", "tbody", "tr", "th", "td", "img", "figure",
  "figcaption", "details", "summary", "br", "hr", "section",
]);

function safeUrl(value: string) {
  const decoded = decodeHtml(value.trim());
  if (/^(javascript|data):/i.test(decoded)) return "";
  return decoded.replace(/^https?:\/\/mondzorgpraktijkveenendaal\.nl/i, "");
}

export function cleanWordPressHtml(source: string) {
  const yoast = extractYoastFaqs(source);
  const accordion = extractAccordionFaqs(yoast.html);
  let html = removeBalancedByMarker(
    accordion.html,
    /id=["']ez-toc-container["']/i,
  )
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(style|script|noscript|iframe|svg|form)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/<h1\b/gi, "<h2")
    .replace(/<\/h1>/gi, "</h2>");

  html = html.replace(/<\/?([a-z][a-z0-9]*)\b([^>]*)>/gi, (full, rawTag, rawAttrs) => {
    const tag = rawTag.toLowerCase();
    const closing = full.startsWith("</");
    if (!allowedTags.has(tag)) return "";
    if (closing) return `</${tag}>`;
    if (tag === "br" || tag === "hr") return `<${tag}>`;

    const attr = (name: string) => {
      const match = rawAttrs.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i"));
      return match?.[1] ?? "";
    };

    if (tag === "a") {
      const href = safeUrl(attr("href"));
      if (!href) return "<span>";
      const external = /^https?:\/\//i.test(href);
      return `<a href="${href.replace(/"/g, "&quot;")}"${external ? ' rel="noopener noreferrer"' : ""}>`;
    }
    if (tag === "img") {
      const src = safeUrl(attr("src"));
      if (!src) return "";
      const alt = decodeHtml(attr("alt")).replace(/"/g, "&quot;");
      return `<img src="${src.replace(/"/g, "&quot;")}" alt="${alt}" loading="lazy">`;
    }
    if (/^h[2-4]$/.test(tag)) {
      const id = attr("id").replace(/[^a-z0-9_-]/gi, "");
      return `<${tag}${id ? ` id="${id}"` : ""}>`;
    }
    return `<${tag}>`;
  });

  html = html
    .replace(/<span>/g, "")
    .replace(/<\/span>/g, "")
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/\s{3,}/g, "\n\n")
    .trim();

  const heading = [...html.matchAll(/<h2[^>]*>[\s\S]*?<\/h2>/gi)].find((match) =>
    /Veelgestelde vragen|FAQ/i.test(textOnly(match[0])),
  );
  const extractedFaqs = [...accordion.faqs, ...yoast.faqs];
  if (!heading) return { html, faqs: extractedFaqs };

  const sectionStart = heading.index;
  const afterHeading = sectionStart + heading[0].length;
  const nextHeading = /<h2\b/i.exec(html.slice(afterHeading));
  const sectionEnd = nextHeading ? afterHeading + nextHeading.index : html.length;
  const faqSection = html.slice(afterHeading, sectionEnd);
  const h3 = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3\b|$)/gi;
  let match: RegExpExecArray | null;
  const headingFaqs: FaqItem[] = [];
  while ((match = h3.exec(faqSection))) {
    const question = textOnly(match[1]);
    const answer = textOnly(match[2]);
    if (question && answer && question.includes("?")) headingFaqs.push({ question, answer });
  }

  if (!headingFaqs.length && !extractedFaqs.length) return { html, faqs: [] };
  return {
    html: (html.slice(0, sectionStart) + html.slice(sectionEnd)).trim(),
    faqs: [...extractedFaqs, ...headingFaqs],
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function richTextHtml(value: string) {
  return value
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => `<p>${escapeHtml(part).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function contentForPage(path: string, locale: Locale = "nl") {
  if (locale === "en") {
    return { html: richTextHtml(polishEnglish(englishByPath[path]?.text ?? "")), faqs: [] as FaqItem[] };
  }
  const item = getWordPressItem(path);
  if (!item?.content.rendered) return { html: "", faqs: [] as FaqItem[] };
  return cleanWordPressHtml(item.content.rendered);
}

export function reviewFlag(page: ExportedPage) {
  const note = page.note ?? "";
  if (/Condensed|Full-length blog/i.test(note)) {
    return "De volledige huidige WordPress-tekst is overgenomen. Controleer deze conceptmigratie inhoudelijk en medisch vóór publicatie.";
  }
  if (/generic auto-generated boilerplate/i.test(note)) {
    return "Beslissing nodig: deze vermoedelijk generieke beleidstekst behouden, herschrijven of verwijderen.";
  }
  if (/Elmira Eslami/i.test(note)) {
    return "Teamcontrole nodig: Elmira Eslami heeft nog geen eigen biografiepagina.";
  }
  if (/Very thin page/i.test(note)) {
    return "De ontbrekende huisregels, verzekerings- en betaalinformatie is aangevuld vanuit de live WordPress-pagina; graag inhoudelijk controleren.";
  }
  if (/landing page content/i.test(note)) {
    return "De live WordPress-inhoud is overgenomen omdat de oorspronkelijke export leeg was; graag controleren vóór publicatie.";
  }
  return "";
}

export function modifiedForPath(path: string) {
  return getWordPressItem(path)?.modified;
}

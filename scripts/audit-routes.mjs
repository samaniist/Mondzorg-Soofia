import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("..", import.meta.url);
const projectRoot = fileURLToPath(root);
const data = JSON.parse(await readFile(new URL("content-export.json", root), "utf8"));
const wordpressPages = JSON.parse(await readFile(new URL("src/content/wordpress-pages.json", root), "utf8"));
const wordpressPosts = JSON.parse(await readFile(new URL("src/content/wordpress-posts.json", root), "utf8"));
const englishPages = JSON.parse(await readFile(new URL("src/content/english-pages.json", root), "utf8"));
const origin = process.env.AUDIT_ORIGIN || "http://localhost:3000";
const redirects = new Map([
  ["/algemene-tandheelkunde/", "/behandelingen/"],
  ["/maak-een-afspraak-2/", "/maak-een-afspraak-1/"],
  ["/afspraak-maken/", "/maak-een-afspraak-1/"],
]);

const errors = [];
const results = [];
const decode = (value) => value
  .replace(/&amp;/g, "&")
  .replace(/&#x27;|&#39;/g, "'")
  .replace(/&quot;/g, '"');

for (const page of data.pages) {
  const path = new URL(page.url).pathname;
  const response = await fetch(`${origin}${path}`, { redirect: "manual" });
  const expectedRedirect = redirects.get(path);
  if (expectedRedirect) {
    const location = response.headers.get("location");
    if (response.status !== 301 || !location?.endsWith(expectedRedirect)) {
      errors.push(`${path}: expected 301 to ${expectedRedirect}, got ${response.status} ${location}`);
    }
    results.push({ path, status: response.status, kind: "redirect" });
    continue;
  }

  const html = await response.text();
  if (response.status !== 200) errors.push(`${path}: expected 200, got ${response.status}`);
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  if (title !== page.title) errors.push(`${path}: title mismatch (${JSON.stringify(title)})`);
  const robots = html.match(/<meta name="robots" content="([^"]*)"/i)?.[1] ?? "";
  const shouldNoIndex = page.robots.toLowerCase().includes("noindex");
  if (shouldNoIndex !== robots.includes("noindex")) errors.push(`${path}: robots mismatch (${robots})`);
  if (!html.includes('<link rel="canonical"')) errors.push(`${path}: canonical missing`);
  results.push({ path, status: response.status, kind: shouldNoIndex ? "noindex" : "index" });

  const englishResponse = await fetch(`${origin}/en${path}`, { redirect: "manual" });
  const englishHtml = await englishResponse.text();
  if (englishResponse.status !== 200) errors.push(`/en${path}: expected 200, got ${englishResponse.status}`);
  if (!englishHtml.includes('<html lang="en"')) errors.push(`/en${path}: document language is not English`);
  if (!englishPages[path]?.title) errors.push(`/en${path}: English content is missing`);
}

const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
const sitemap = await sitemapResponse.text();
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]));
const expectedSitemap = new Set(data.pages
  .filter((page) => !page.robots.toLowerCase().includes("noindex") && !redirects.has(new URL(page.url).pathname))
  .flatMap((page) => {
    const path = new URL(page.url).pathname;
    return [page.url, `${new URL(page.url).origin}/en${path}`];
  }));
for (const url of expectedSitemap) if (!sitemapUrls.has(url)) errors.push(`sitemap missing ${url}`);
for (const url of sitemapUrls) if (!expectedSitemap.has(url)) errors.push(`sitemap has unexpected ${url}`);

for (const path of ["/", "/hoe-vaak-tanden-bleken/", "/behandelingen/angst-tandartsangst/"]) {
  const html = await fetch(`${origin}${path}`).then((response) => response.text());
  if (!html.includes('"@type":"FAQPage"')) errors.push(`${path}: FAQ schema missing`);
}

for (const post of wordpressPosts) {
  const path = `/${post.slug}/`;
  const html = await fetch(`${origin}${path}`).then((response) => response.text());
  const article = html.match(/<article\b[^>]*article-layout[^>]*>([\s\S]*?)<\/article>/i)?.[1] ?? "";
  const textLength = article.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length;
  const outlineLength = data.pages.find((page) => new URL(page.url).pathname === path)?.text.length ?? 0;
  if (textLength < Math.max(2500, outlineLength * 1.35)) {
    errors.push(`${path}: migrated article is unexpectedly short (${textLength})`);
  }
  if (/schema-faq|wd-accordion|Veelgestelde vragen/i.test(post.content.rendered) && !html.includes('"@type":"FAQPage"')) {
    errors.push(`${path}: source FAQ exists but FAQ schema is missing`);
  }
}

const referencedMedia = new Set(data.pages.flatMap((page) => page.images.map((image) => image.src)));
for (const items of [wordpressPages, wordpressPosts]) {
  for (const item of items) {
    for (const match of item.content.rendered.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)) {
      referencedMedia.add(match[1]);
    }
  }
}
let localMediaCount = 0;
for (const url of referencedMedia) {
  if (!url.startsWith("https://mondzorgpraktijkveenendaal.nl/wp-content/uploads/")) continue;
  const path = decodeURIComponent(new URL(url).pathname).replace(/^\/+/, "");
  try {
    const file = await stat(`${projectRoot}/public/${path}`);
    if (!file.size) errors.push(`${path}: local media file is empty`);
    localMediaCount += 1;
  } catch {
    errors.push(`${path}: referenced media is missing locally`);
  }
}

console.log(`Audited ${results.length} exported URLs: ${results.filter((item) => item.status === 200).length} pages and ${results.filter((item) => item.kind === "redirect").length} redirects.`);
console.log(`Sitemap contains ${sitemapUrls.size} indexable URLs.`);
console.log(`Verified ${localMediaCount} locally mirrored media files.`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Metadata, robots, canonicals, FAQ schema and all long-form content checks passed.");
}

import type { MetadataRoute } from "next";
import { isIndexable, modifiedForPath, pages, redirectPaths, SITE_URL } from "@/content/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return pages
    .filter((page) => {
      const path = new URL(page.url).pathname;
      return isIndexable(page) && !redirectPaths.has(path);
    })
    .flatMap((page) => {
      const path = new URL(page.url).pathname;
      const shared = {
        lastModified: modifiedForPath(path),
        changeFrequency: path === "/" ? "weekly" as const : "monthly" as const,
        priority: path === "/" ? 1 : path.startsWith("/behandelingen/") ? 0.8 : 0.6,
        images: page.images.map((image) => image.src),
      };
      return [{
        url: page.url,
        ...shared,
      }, {
        url: `${SITE_URL}/en${path === "/" ? "/" : path}`,
        ...shared,
      }];
    });
}

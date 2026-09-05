import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const readJson = async (path) => JSON.parse(await readFile(join(projectRoot, path), "utf8"));
const exportData = await readJson("content-export.json");
const wordpressPages = await readJson("src/content/wordpress-pages.json");
const wordpressPosts = await readJson("src/content/wordpress-posts.json");
const mediaOrigin = "https://mondzorgpraktijkveenendaal.nl/wp-content/uploads/";
const urls = new Set(exportData.pages.flatMap((page) => page.images.map((image) => image.src)));

for (const item of [...wordpressPages, ...wordpressPosts]) {
  for (const match of item.content.rendered.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)) {
    urls.add(match[1]);
  }
}

const queue = [...urls].filter((url) => url.startsWith(mediaOrigin));
const total = queue.length;
const failures = [];
let completed = 0;

async function download(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const pathname = decodeURIComponent(new URL(url).pathname).replace(/^\/+/, "");
    if (!pathname.startsWith("wp-content/uploads/")) throw new Error("unexpected path");
    const destination = join(projectRoot, "public", pathname);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, Buffer.from(await response.arrayBuffer()));
    completed += 1;
    if (completed % 20 === 0 || completed === total) {
      console.log(`Downloaded ${completed}/${total} media files.`);
    }
  } catch (error) {
    failures.push(`${url}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const workers = Array.from({ length: 6 }, async () => {
  while (queue.length) {
    const url = queue.shift();
    if (url) await download(url);
  }
});

await Promise.all(workers);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All referenced WordPress media is available locally.");
}

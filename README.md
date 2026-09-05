# Mondzorgpraktijk Veenendaal

Local Next.js replacement for `mondzorgpraktijkveenendaal.nl`, built with the App Router, TypeScript and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Nothing in this project deploys automatically.

## Validate

```bash
npm run lint
npm run build
npm start
npm run audit:routes
```

The route audit expects the production server on port 3000. It verifies all 57 exported URL outcomes, redirects, titles, canonicals, robots directives, sitemap membership, source FAQ schema, all long-form article migrations and the local media mirror.

## Content architecture

- `content-export.json`: original 57-entry content and SEO export.
- `src/content/wordpress-pages.json`: complete public WordPress page bodies captured for the migration.
- `src/content/wordpress-posts.json`: complete bodies for all 22 posts; these replace the condensed export outlines.
- `src/content/content.ts`: content lookup, safe WordPress markup cleanup and FAQ extraction.
- `src/content/metadata.ts`: per-page metadata, canonical and robots handling.
- `src/components/`: reusable treatment, article, team, FAQ and generic content components.
- `src/app/[...slug]/page.tsx`: statically generated preserved URL paths.
- `CONTENT_REVIEW.md`: decisions and editorial checks needed before launch.

## Updating imported media

The migration mirrors referenced WordPress images under the same paths in `public/wp-content/uploads/`. If content changes during review, refresh them with:

```bash
npm run sync:media
```

Do not deploy until the items in `CONTENT_REVIEW.md` have been resolved.

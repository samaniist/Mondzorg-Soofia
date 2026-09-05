# Content review before publication

This file records decisions that still need practice-owner input. The local site surfaces the most important flags inline as well.

## Blocking decisions

- `/maak-een-afspraak-1/`: choose and connect the definitive booking/form provider. `/maak-een-afspraak-2/` and `/afspraak-maken/` now redirect here.
- `/diversity-policy/`, `/ethics-policy/`, `/actionable-feedback-policy/`: decide whether these generic-looking policy pages are genuine practice policies. They are preserved with their current `index,follow` behavior until that decision is made.
- `/ons-team/`: provide an Elmira Eslami biography if she should have a detail page like Cristian Zandi and Huusder Barmer.

## Editorial and clinical review

- All 22 blog posts use the complete current WordPress body rather than the condensed attachment outlines. They are marked for final editorial and clinical review.
- Re-check time-sensitive prices, reimbursements, opening hours, review counts, provider names and emergency contact details immediately before launch.
- Review medical claims and scientific references, especially pregnancy, periodontal treatment, bleaching and children's fluoride guidance.
- Confirm whether the noindex campaign page `/tandarts-veenendaal-maak-direct-een-afspraak/` should remain separate from the main booking page.

## Resolved migration notes

- `/behandelingen/tanden-trekken-extracties/` uses corrected extraction-specific metadata instead of the stale prothesis metadata visible on the old site.
- `/ons-team/cristian-zandi/` now has a Dutch meta description.
- `/informatie/` includes the fuller live house rules, insurance and payment text missing from the condensed export.
- `/algemene-tandheelkunde/` redirects to `/behandelingen/` instead of retaining duplicate content.
- `/blog/` and the campaign landing page remain `noindex,follow` and are omitted from the sitemap.

## Assets

- Referenced WordPress media is mirrored under `public/wp-content/uploads/`, preserving the existing paths and alt text. Run `npm run sync:media` again immediately before launch if editors add or replace images in WordPress during the review period.

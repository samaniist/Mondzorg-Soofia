import type { ExportedPage, FaqItem } from "@/content/content";
import { displayTitle, localMediaPath, SITE_URL } from "@/content/content";
import Image from "next/image";
import Link from "next/link";
import { localizedPath, type Locale } from "@/i18n/config";

export function EditorialFlag(props: { page: ExportedPage }) {
  void props.page;
  return null;
}

export function PageHeader({
  page,
  eyebrow,
  intro,
}: {
  page: ExportedPage;
  eyebrow?: string;
  intro?: string;
}) {
  return (
    <header className="page-header" data-reveal>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1>{displayTitle(page.title)}</h1>
      {intro ? <p className="lead">{intro}</p> : null}
      <span className="page-header-line" aria-hidden="true" />
    </header>
  );
}

export function RichContent({ html, locale = "nl" }: { html: string; locale?: Locale }) {
  if (!html) {
    return (
      <div className="content-placeholder">
        <strong>{locale === "en" ? "Content is not available yet" : "Inhoud nog te koppelen"}</strong>
        <p>{locale === "en" ? "This page does not yet have usable source content." : "Voor deze route ontbreekt bruikbare brontekst. Vul deze pagina aan vóór publicatie."}</p>
      </div>
    );
  }
  return <div className="rich-content" dangerouslySetInnerHTML={{ __html: html }} />;
}

export function FaqBlock({ items, locale = "nl" }: { items: FaqItem[]; locale?: Locale }) {
  if (!items.length) return null;
  const unique = items.filter(
    (item, index) => items.findIndex((candidate) => candidate.question === item.question) === index,
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: unique.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  return (
    <section className="faq-block" aria-labelledby="faq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <h2 id="faq-title">{locale === "en" ? "Frequently asked questions" : "Veelgestelde vragen"}</h2>
      <div className="faq-list">
        {unique.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function TreatmentPage({
  page,
  html,
  faqs,
  locale,
}: {
  page: ExportedPage;
  html: string;
  faqs: FaqItem[];
  locale: Locale;
}) {
  const image = page.images[0];
  return (
    <article className="page-layout treatment-detail">
      <div className="shell treatment-hero">
        <PageHeader page={page} eyebrow={locale === "en" ? "Treatment · Mondzorgpraktijk Veenendaal" : "Behandeling · Mondzorgpraktijk Veenendaal"} />
        {image ? (
          <figure className="treatment-hero-image" data-reveal="mask" data-pointer-reactive data-tilt>
            <Image
              alt={image.alt || displayTitle(page.title)}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 46vw"
              src={localMediaPath(image.src)}
            />
          </figure>
        ) : (
          <div className="treatment-hero-object" data-tilt aria-hidden="true"><span /></div>
        )}
      </div>
      <div className="shell article-content-grid">
        <aside className="article-side" data-reveal>
          <p className="eyebrow">{locale === "en" ? "Calm & clear" : "Rust & duidelijkheid"}</p>
          <p>{locale === "en" ? "We take the time to explain your treatment and tailor your care to your situation." : "We nemen de tijd om de behandeling uit te leggen en stemmen de zorg af op uw situatie."}</p>
          <a className="arrow-link" href="tel:+31318501376">{locale === "en" ? "Discuss your question" : "Bespreek uw vraag"} <span aria-hidden="true">↗</span></a>
        </aside>
        <div>
          <EditorialFlag page={page} />
          <RichContent html={html} locale={locale} />
          <FaqBlock items={faqs} locale={locale} />
          <CallToAction locale={locale} />
        </div>
      </div>
    </article>
  );
}

export function BlogPost({
  page,
  html,
  faqs,
  date,
  locale,
}: {
  page: ExportedPage;
  html: string;
  faqs: FaqItem[];
  date?: string;
  locale: Locale;
}) {
  const image = page.images[0];
  return (
    <article className="page-layout article-layout">
      <div className="shell article-hero">
        <div>
          <PageHeader page={page} eyebrow={locale === "en" ? "Journal · Oral health" : "Journal · Mondgezondheid"} />
          <p className="byline">
            {locale === "en" ? "By" : "Door"} Cristian Zandi{date ? ` · ${new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "nl-NL", { dateStyle: "long" }).format(new Date(date))}` : ""}
          </p>
        </div>
        {image ? (
          <figure data-reveal>
            <Image alt={image.alt || displayTitle(page.title)} fill priority sizes="(max-width: 768px) 100vw, 46vw" src={localMediaPath(image.src)} />
          </figure>
        ) : null}
      </div>
      <div className="shell article-content-grid">
        <aside className="article-side" data-reveal>
          <p className="eyebrow">{locale === "en" ? "Reading guide" : "Leeswijzer"}</p>
          <p>{locale === "en" ? "Clear information about oral health, treatment and prevention." : "Heldere uitleg over mondgezondheid, behandeling en preventie."}</p>
          <Link className="arrow-link" href={localizedPath(locale, "/blog/")}>{locale === "en" ? "Back to the journal" : "Terug naar het journal"} <span aria-hidden="true">↗</span></Link>
        </aside>
        <div>
          <EditorialFlag page={page} />
          <RichContent html={html} locale={locale} />
          <FaqBlock items={faqs} locale={locale} />
          <CallToAction locale={locale} />
        </div>
      </div>
    </article>
  );
}

export type TeamMemberCardProps = {
  name: string;
  role: string;
  treatments: string[];
  href?: string;
  big?: string;
  image?: string;
  imageAlt?: string;
};

export function TeamMemberCard({ name, role, treatments, href, big, image, imageAlt, locale = "nl" }: TeamMemberCardProps & { locale?: Locale }) {
  const content = (
    <>
      {image ? (
        <figure className="team-card-image">
          <Image alt={imageAlt || name} fill sizes="(max-width: 768px) 100vw, 32vw" src={image} />
        </figure>
      ) : null}
      <div className="team-card-copy">
        <p className="eyebrow">{role}</p>
        <h3>{name}</h3>
        <ul>{treatments.map((treatment) => <li key={treatment}>{treatment}</li>)}</ul>
        {big ? <p className="big-number">BIG-nummer: {big}</p> : null}
        <span className="arrow-link">{href ? (locale === "en" ? `Read more about ${name}` : `Lees meer over ${name}`) : (locale === "en" ? "View team information" : "Bekijk teaminformatie")} <span aria-hidden="true">↗</span></span>
      </div>
    </>
  );
  return (
    <article className="team-card" data-reveal="mask" data-pointer-reactive data-tilt>
      {href ? <Link data-directional href={localizedPath(locale, href)}>{content}</Link> : <div>{content}</div>}
    </article>
  );
}

export function CallToAction({ locale = "nl" }: { locale?: Locale }) {
  return (
    <aside className="call-to-action" data-reveal>
      <p className="eyebrow">{locale === "en" ? "Personal contact" : "Persoonlijk contact"}</p>
      <h2>{locale === "en" ? "Would you like to make an appointment?" : "Een afspraak maken?"}</h2>
      <p>{locale === "en" ? "Contact us if you have a question or would like to plan a visit." : "Neem contact op als u een vraag heeft of een bezoek wilt plannen."}</p>
      <div className="actions">
        <Link className="button" data-magnetic href={localizedPath(locale, "/maak-een-afspraak-1/")}>{locale === "en" ? "Make an appointment" : "Maak een afspraak"} <span aria-hidden="true">↗</span></Link>
        <a className="button button-secondary" href="tel:+31318501376">{locale === "en" ? "Call 0318 501376" : "Bel 0318 501376"}</a>
      </div>
    </aside>
  );
}

export function DentalPracticeSchema({ locale = "nl" }: { locale?: Locale }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: "Mondzorgpraktijk Veenendaal",
    url: `${SITE_URL}${localizedPath(locale, "/") === "/" ? "" : localizedPath(locale, "/")}`,
    telephone: "+31 318 501376",
    email: "info@mondzorgpraktijkveenendaal.nl",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Wolweg 29",
      postalCode: "3901 TD",
      addressLocality: "Veenendaal",
      addressCountry: "NL",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}

import Image from "next/image";
import Link from "next/link";
import {
  BlogPost,
  CallToAction,
  EditorialFlag,
  FaqBlock,
  PageHeader,
  RichContent,
  TeamMemberCard,
} from "@/components/content-components";
import { BookingChoice, TreatmentIndex, type TreatmentPreview } from "@/components/experience";
import { ArrowUpRightIcon } from "@/components/ui-icons";
import {
  contentForPage,
  displayTitle,
  getPage,
  getWordPressItem,
  localMediaPath,
  pages,
  postSlugs,
  richTextHtml,
  type ExportedPage,
} from "@/content/content";
import { localizedPath, type Locale } from "@/i18n/config";

const treatmentsNl = [
  ["Periodieke controles", "/behandelingen/periodieke-controles/", "Regelmatige controles om problemen vroeg op te sporen.", "/wp-content/uploads/2025/10/Periodieke-Controle.jpg"],
  ["Vullingen", "/behandelingen/vullingen-gaatjes-vullen/", "Een gaatje zorgvuldig herstellen met een passend materiaal.", "/wp-content/uploads/2025/12/Alles-wat-je-moet-weten-over-het-vullen-van-tanden5.jpg"],
  ["Wortelkanaalbehandeling", "/behandelingen/wortelkanaalbehandeling/", "Geïnfecteerd weefsel behandelen om de tand te behouden.", "/wp-content/uploads/2025/10/Wortelkanaalbehandeling.jpg"],
  ["Kronen en bruggen", "/behandelingen/kronen-en-bruggen/", "Duurzame oplossingen voor beschadigde of ontbrekende tanden.", "/wp-content/uploads/2025/11/banner03.jpg"],
  ["Prothese (kunstgebit)", "/behandelingen/prothese-kunstgebit/", "Een verwijderbare vervanging om goed te kauwen en spreken.", "/wp-content/uploads/2025/11/banner04.jpg"],
  ["Tanden trekken", "/behandelingen/tanden-trekken-extracties/", "Het verwijderen van een tand die niet behouden kan worden.", "/wp-content/uploads/2025/11/banner05.jpg"],
  ["Aligner (doorzichtige beugel)", "/behandelingen/aligner-doorzichtige-beugel/", "Een bijna onzichtbare beugel die tanden geleidelijk rechtzet.", "/wp-content/uploads/2025/10/Doorzichtige-Beugel​.jpg"],
  ["Facings", "/behandelingen/facings-voor-een-stralende-glimlach/", "Dunne schalen op de voorkant van tanden.", "/wp-content/uploads/2025/10/Hoe-verloopt-een-behandeling-voor-facings.jpg"],
  ["Tanden bleken", "/behandelingen/tandenbleken/", "Een cosmetische behandeling om verkleuringen te verminderen.", "/wp-content/uploads/2025/10/Tanden-Bleken​.jpg"],
  ["Preventie & mondhygiënist", "/behandelingen/preventie-mondhygienist/", "Advies en behandeling om uw mondgezondheid te behouden.", "/wp-content/uploads/2025/10/Mondzorg.jpg"],
  ["Kindertandheelkunde", "/kindertandheelkunde/", "Tandzorg voor kinderen met aandacht voor comfort.", "/wp-content/uploads/2025/10/Kindertandheelkunde.jpg"],
  ["Tandvleesbehandeling", "/behandelingen/tandvleesbehandeling-parodontitis/", "Behandeling van tandvleesproblemen en ontsteking.", "/wp-content/uploads/2025/11/banner07.jpg"],
  ["Pijnloze gebitsreiniging (GBT)", "/behandelingen/pijnloze-gebitsreiniging-gbt/", "Comfortabele reiniging van tanden en tandvlees.", "/wp-content/uploads/2025/11/banner08.jpg"],
  ["White spots verwijderen", "/behandelingen/white-spots-verwijderen-witte-vlekken/", "Witte vlekken of verkleuringen verminderen.", "/wp-content/uploads/2025/11/banner09.jpg"],
  ["Angstvrije tandheelkunde", "/behandelingen/angst-tandartsangst/", "Zorg afgestemd op angstige patiënten.", "/wp-content/uploads/2026/01/Bang-voor-de-tandarts2.jpg"],
] as const;

const treatmentsEn = [
  ["Periodic check-ups", "/behandelingen/periodieke-controles/", "Regular examinations to detect problems early.", "/wp-content/uploads/2025/10/Periodieke-Controle.jpg"],
  ["Fillings", "/behandelingen/vullingen-gaatjes-vullen/", "Careful restoration of a cavity with a suitable material.", "/wp-content/uploads/2025/12/Alles-wat-je-moet-weten-over-het-vullen-van-tanden5.jpg"],
  ["Root canal treatment", "/behandelingen/wortelkanaalbehandeling/", "Treatment of infected tissue to preserve the tooth.", "/wp-content/uploads/2025/10/Wortelkanaalbehandeling.jpg"],
  ["Crowns and bridges", "/behandelingen/kronen-en-bruggen/", "Durable solutions for damaged or missing teeth.", "/wp-content/uploads/2025/11/banner03.jpg"],
  ["Dentures", "/behandelingen/prothese-kunstgebit/", "A removable replacement that helps you chew and speak comfortably.", "/wp-content/uploads/2025/11/banner04.jpg"],
  ["Tooth extraction", "/behandelingen/tanden-trekken-extracties/", "Removal of a tooth that cannot be preserved.", "/wp-content/uploads/2025/11/banner05.jpg"],
  ["Clear aligners", "/behandelingen/aligner-doorzichtige-beugel/", "A nearly invisible aligner that gradually straightens teeth.", "/wp-content/uploads/2025/10/Doorzichtige-Beugel​.jpg"],
  ["Veneers", "/behandelingen/facings-voor-een-stralende-glimlach/", "Thin shells placed on the front of teeth.", "/wp-content/uploads/2025/10/Hoe-verloopt-een-behandeling-voor-facings.jpg"],
  ["Teeth whitening", "/behandelingen/tandenbleken/", "A cosmetic treatment to reduce discolouration.", "/wp-content/uploads/2025/10/Tanden-Bleken​.jpg"],
  ["Prevention & dental hygiene", "/behandelingen/preventie-mondhygienist/", "Advice and treatment to maintain your oral health.", "/wp-content/uploads/2025/10/Mondzorg.jpg"],
  ["Paediatric dentistry", "/kindertandheelkunde/", "Dental care for children with attention to comfort.", "/wp-content/uploads/2025/10/Kindertandheelkunde.jpg"],
  ["Gum treatment", "/behandelingen/tandvleesbehandeling-parodontitis/", "Treatment of gum disease and inflammation.", "/wp-content/uploads/2025/11/banner07.jpg"],
  ["Comfortable dental cleaning (GBT)", "/behandelingen/pijnloze-gebitsreiniging-gbt/", "Comfortable cleaning of teeth and gums.", "/wp-content/uploads/2025/11/banner08.jpg"],
  ["White spot treatment", "/behandelingen/white-spots-verwijderen-witte-vlekken/", "Reducing white spots or discolouration.", "/wp-content/uploads/2025/11/banner09.jpg"],
  ["Dental anxiety care", "/behandelingen/angst-tandartsangst/", "Care tailored to patients with dental anxiety.", "/wp-content/uploads/2026/01/Bang-voor-de-tandarts2.jpg"],
] as const;

function getTreatmentPreviews(locale: Locale): TreatmentPreview[] {
  const treatments = locale === "en" ? treatmentsEn : treatmentsNl;
  return treatments.map(([name, path, description, fallback]) => {
  const treatmentPage = getPage(path, locale);
  return {
    name,
    href: localizedPath(locale, path),
    description,
    image: treatmentPage?.images[0]?.src ? localMediaPath(treatmentPage.images[0].src) : fallback,
    imageAlt: treatmentPage?.images[0]?.alt || (locale === "en" ? `${name} at Mondzorgpraktijk Veenendaal` : `${name} bij Mondzorgpraktijk Veenendaal`),
  };
  });
}

export function TreatmentsOverview({ page, locale }: { page: ExportedPage; locale: Locale }) {
  const treatmentPreviews = getTreatmentPreviews(locale);
  const en = locale === "en";
  return (
    <main id="hoofdinhoud" className="page-layout overview-page">
      <div className="shell overview-hero">
        <PageHeader page={page} eyebrow={en ? "From prevention to restoration" : "Van preventie tot herstel"} intro={en ? "Explore our preventive, restorative and cosmetic treatments for a healthy smile." : "Bekijk onze behandelingen voor preventie, herstel en een gezonde glimlach."} />
        <figure data-reveal>
          <Image alt={en ? "Cristian Zandi of Mondzorgpraktijk Veenendaal" : "Cristian Zandi van Mondzorgpraktijk Veenendaal"} fill priority sizes="(max-width: 768px) 100vw, 42vw" src="/wp-content/uploads/2025/11/banner10-768x768.jpg" />
        </figure>
      </div>
      <section className="shell overview-index" data-reveal aria-labelledby="treatment-index-title">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">{en ? "Treatment index" : "Behandelindex"}</p><h2 id="treatment-index-title">{en ? <>Dental care at <em>your pace.</em></> : <>Mondzorg in uw <em>tempo.</em></>}</h2></div>
          <p>{en ? "Select a treatment for clear information about our approach, the process and common questions." : "Open een behandeling voor heldere uitleg over de aanpak, het verloop en veelgestelde vragen."}</p>
        </div>
        <TreatmentIndex locale={locale} treatments={treatmentPreviews} />
      </section>
      <div className="shell"><CallToAction locale={locale} /></div>
    </main>
  );
}

const teamNl = [
  {
    name: "Cristian Zandi",
    role: "Geregistreerd mondhygiënist, praktijkeigenaar",
    treatments: ["Gebitsreiniging, GBT gecertificeerd", "Tandvleesbehandeling (parodontitis)", "Kindertandheelkunde, GewoonGaaf methode gecertificeerd", "Angstbegeleiding"],
    href: "/ons-team/cristian-zandi/",
    image: "/wp-content/uploads/2025/10/Cristian-Zandi.jpg",
  },
  {
    name: "Huusder Barmer",
    role: "Tandarts",
    treatments: ["Periodieke controle", "Vullingen", "Wortelkanaalbehandeling", "Kroon en brug", "Prothese (kunstgebit)", "Aligner (doorzichtige beugel)"],
    href: "/ons-team/huusder-barmer-2/",
    big: "49051467902",
    image: "/wp-content/uploads/2025/11/Huusder-Barmer.jpg",
  },
  {
    name: "Elmira Eslami",
    role: "Tandarts",
    treatments: ["Periodieke controle", "Vullingen", "Wortelkanaalbehandeling", "Kroon en brug", "Prothese (kunstgebit)", "Aligner (doorzichtige beugel)"],
    big: "69934497602",
    image: "/wp-content/uploads/2026/08/Elmira-eslami.webp",
  },
  {
    name: "Narjis",
    role: "Allround assistente",
    treatments: ["Baliewerkzaamheden", "Behandelkamer gereed maken", "Assistentie bij behandelingen", "Patiënt- en behandelregistratie"],
    image: "/wp-content/uploads/2026/05/mondzorgpraktijk-veenendaal-dental-assistant-3.jpg",
  },
  {
    name: "Mahsa",
    role: "Allround assistente / preventieassistente",
    treatments: ["Baliewerkzaamheden", "Behandelkamer gereed maken", "Assistentie bij behandelingen", "Patiënt- en behandelregistratie", "Preventieve behandelingen en gebitsreiniging"],
    image: "/wp-content/uploads/2026/05/mondzorgpraktijk-veenendaal-dental-assistant-4.jpg",
  },
];

const teamEn = [
  {
    name: "Cristian Zandi",
    role: "Registered dental hygienist, practice owner",
    treatments: ["Dental cleaning, GBT certified", "Gum treatment (periodontitis)", "Paediatric dentistry, certified in the Gewoon Gaaf method", "Dental anxiety support"],
    href: "/ons-team/cristian-zandi/",
    image: "/wp-content/uploads/2025/10/Cristian-Zandi.jpg",
  },
  {
    name: "Huusder Barmer",
    role: "Dentist",
    treatments: ["Periodic check-ups", "Fillings", "Root canal treatment", "Crowns and bridges", "Dentures", "Clear aligners"],
    href: "/ons-team/huusder-barmer-2/",
    big: "49051467902",
    image: "/wp-content/uploads/2025/11/Huusder-Barmer.jpg",
  },
  {
    name: "Elmira Eslami",
    role: "Dentist",
    treatments: ["Periodic check-ups", "Fillings", "Root canal treatment", "Crowns and bridges", "Dentures", "Clear aligners"],
    big: "69934497602",
    image: "/wp-content/uploads/2026/08/Elmira-eslami.webp",
  },
  {
    name: "Narjis",
    role: "All-round dental assistant",
    treatments: ["Reception duties", "Preparing the treatment room", "Assisting during treatments", "Patient and treatment records"],
    image: "/wp-content/uploads/2026/05/mondzorgpraktijk-veenendaal-dental-assistant-3.jpg",
  },
  {
    name: "Mahsa",
    role: "All-round dental and prevention assistant",
    treatments: ["Reception duties", "Preparing the treatment room", "Assisting during treatments", "Patient and treatment records", "Preventive treatments and dental cleaning"],
    image: "/wp-content/uploads/2026/05/mondzorgpraktijk-veenendaal-dental-assistant-4.jpg",
  },
];

export function TeamOverview({ page, locale }: { page: ExportedPage; locale: Locale }) {
  const en = locale === "en";
  const team = en ? teamEn : teamNl;
  return (
    <main id="hoofdinhoud" className="page-layout team-overview">
      <div className="shell team-overview-header">
        <PageHeader page={page} eyebrow={en ? "People caring for people" : "Mensen voor mensen"} intro={en ? "A skilled and committed team that makes time for your story." : "Een deskundig en betrokken team, met aandacht voor uw verhaal."} />
        <p className="team-intro-note" data-reveal>{en ? "Trust grows when you know who is there for you." : "Vertrouwen groeit wanneer u weet wie er voor u klaarstaat."}</p>
      </div>
      <EditorialFlag page={page} />
      <section className="shell team-page-grid" aria-label={en ? "Team members" : "Teamleden"}>
        {team.map((member) => <TeamMemberCard key={member.name} {...member} locale={locale} />)}
      </section>
      <section className="shell team-values" data-reveal>
        <p className="eyebrow">{en ? "How we work" : "Onze manier van werken"}</p>
        <p>{en ? "Listen calmly. Explain clearly. Treat carefully." : "Rustig luisteren. Helder uitleggen. Zorgvuldig behandelen."}</p>
      </section>
    </main>
  );
}

export function BlogArchive({ page, locale }: { page: ExportedPage; locale: Locale }) {
  const en = locale === "en";
  const posts = pages
    .filter((candidate) => postSlugs.has(candidate.path.split("/").filter(Boolean).at(-1) ?? ""))
    .map((candidate) => getPage(candidate.path, locale) ?? candidate);
  return (
    <main id="hoofdinhoud" className="page-layout blog-archive">
      <div className="shell blog-archive-heading">
        <PageHeader page={page} eyebrow="Journal" intro={en ? "Practical information and advice about oral health." : "Praktische uitleg en advies over mondgezondheid."} />
        <p data-reveal>{en ? "Information to help you make confident choices about your own and your family's oral health." : "Informatie om met vertrouwen keuzes te maken voor uw mondgezondheid en die van uw gezin."}</p>
      </div>
      <section className="shell editorial-post-grid" aria-label={en ? "Articles" : "Artikelen"}>
        {posts.map((post, index) => {
          const href = new URL(post.url).pathname;
          const image = post.images[0];
          const item = getWordPressItem(href);
          return (
            <article className={index === 0 ? "post-card post-card-featured" : "post-card"} data-reveal key={post.url}>
              <Link data-directional href={localizedPath(locale, href)}>
                {image ? (
                  <figure><Image alt={image.alt || displayTitle(post.title)} fill sizes={index === 0 ? "(max-width: 768px) 100vw, 62vw" : "(max-width: 768px) 100vw, 31vw"} src={localMediaPath(image.src)} /></figure>
                ) : null}
                <div>
                  <p className="eyebrow">{item?.date ? new Intl.DateTimeFormat(en ? "en-GB" : "nl-NL", { dateStyle: "long" }).format(new Date(item.date)) : (en ? "Oral health" : "Mondgezondheid")}</p>
                  <h2>{displayTitle(post.title)}</h2>
                  {post.metaDescription ? <p>{post.metaDescription}</p> : null}
                  <span className="arrow-link">{en ? "Read article" : "Lees artikel"} <ArrowUpRightIcon /></span>
                </div>
              </Link>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export function BookingPage({ page, locale }: { page: ExportedPage; locale: Locale }) {
  const en = locale === "en";
  return (
    <main id="hoofdinhoud" className="page-layout booking-page">
      <div className="shell booking-intro">
        <PageHeader page={page} eyebrow={en ? "Welcome" : "Welkom"} intro={en ? "Choose below whether you are already a patient or would like to register with our practice." : "Kies hieronder of u al patiënt bent of zich bij onze praktijk wilt inschrijven."} />
        <aside data-reveal>
          <p className="eyebrow">{en ? "Prefer personal contact?" : "Liever persoonlijk contact?"}</p>
          <p>{en ? "Call" : "Bel"} <a href="tel:+31318501376">0318 501376</a> {en ? "or email" : "of mail naar"} <a href="mailto:info@mondzorgpraktijkveenendaal.nl">info@mondzorgpraktijkveenendaal.nl</a>.</p>
        </aside>
      </div>
      <div className="shell" data-reveal><BookingChoice locale={locale} /></div>
    </main>
  );
}

export function ContactPage({ page, locale }: { page: ExportedPage; locale: Locale }) {
  const en = locale === "en";
  return (
    <main id="hoofdinhoud" className="page-layout contact-page">
      <div className="shell contact-heading">
        <PageHeader page={page} eyebrow={en ? "We are here to help" : "Wij zijn klaar om u te helpen"} intro={en ? "Have a question, need an appointment or prefer to talk things through? Contact us." : "Een vraag, een afspraak of behoefte aan rustig overleg? Neem contact met ons op."} />
      </div>
      <section className="shell contact-grid">
        <div className="contact-details" data-reveal>
          <p className="eyebrow">{en ? "Contact details" : "Contactmogelijkheden"}</p>
          <address>
            <p><span>{en ? "Visit" : "Bezoek"}</span><strong>Wolweg 29<br />3901 TD Veenendaal</strong></p>
            <p><span>{en ? "Phone" : "Telefoon"}</span><a href="tel:+31318501376">0318 501376</a></p>
            <p><span>Email</span><a href="mailto:info@mondzorgpraktijkveenendaal.nl">info@mondzorgpraktijkveenendaal.nl</a></p>
          </address>
          <p className="contact-note">{en ? "Open five days a week. Call for our current opening hours." : "5 dagen per week geopend. Bel voor de actuele openingstijden."}</p>
          <Link className="button" data-magnetic href={localizedPath(locale, "/maak-een-afspraak-1/")}>{en ? "Make an appointment" : "Maak een afspraak"} <ArrowUpRightIcon /></Link>
        </div>
        <div className="map-frame" data-reveal>
          <iframe
            allowFullScreen
            aria-label={en ? "Map showing the location of Mondzorgpraktijk Veenendaal" : "Kaart met de locatie van Mondzorgpraktijk Veenendaal"}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d19640.262026440534!2d5.558256!3d52.024501!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c65315268335cd%3A0xaa9096af0d79435b!2sMondzorgpraktijk%20Veenendaal!5e0!3m2!1snl!2snl!4v1758538760195!5m2!1snl!2snl"
            title={en ? "Mondzorgpraktijk Veenendaal on Google Maps" : "Mondzorgpraktijk Veenendaal op Google Maps"}
          />
        </div>
      </section>
      <section className="shell contact-emergency" data-reveal>
        <p className="eyebrow">{en ? "Emergency care outside our opening hours" : "Spoed buiten onze openingstijden"}</p>
        <h2>Dental365 Ede</h2>
        <p>Telefoonweg 46, 6712 GD Ede · <a href="tel:09001515">0900 1515</a></p>
      </section>
    </main>
  );
}

export function GenericPage({ page, locale }: { page: ExportedPage; locale: Locale }) {
  const path = new URL(page.url).pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  const en = locale === "en";
  const { html, faqs } = contentForPage(path, locale);
  const item = getWordPressItem(path);
  if (postSlugs.has(item?.slug ?? "")) {
    return <BlogPost locale={locale} page={page} html={html} faqs={faqs} date={item?.date} />;
  }
  const image = page.images[0];
  return (
    <main id="hoofdinhoud" className="page-layout generic-page">
      <div className="shell generic-page-hero">
        <PageHeader page={page} eyebrow="Mondzorgpraktijk Veenendaal" />
        {image ? <figure data-reveal><Image alt={image.alt || displayTitle(page.title)} fill priority sizes="(max-width: 768px) 100vw, 44vw" src={localMediaPath(image.src)} /></figure> : null}
      </div>
      <div className="shell article-content-grid">
        <aside className="article-side" data-reveal>
          <p className="eyebrow">{en ? "Personal care" : "Persoonlijke zorg"}</p>
          <p>{en ? "Do you have questions about this information? Our team will be happy to help." : "Heeft u vragen over deze informatie? Ons team denkt graag met u mee."}</p>
          <a className="arrow-link" href="tel:+31318501376">{en ? "Call 0318 501376" : "Bel 0318 501376"} <ArrowUpRightIcon /></a>
        </aside>
        <div>
          <EditorialFlag page={page} />
          <RichContent html={html || richTextHtml(page.text)} locale={locale} />
          <FaqBlock items={faqs} locale={locale} />
        </div>
      </div>
    </main>
  );
}

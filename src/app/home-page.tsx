import Image from "next/image";
import Link from "next/link";
import { DentalPracticeSchema, FaqBlock } from "@/components/content-components";
import { LiveClinicStatus, TestimonialsCarousel, TreatmentIndex, type TreatmentPreview } from "@/components/experience";
import { InteractiveHeroTooth } from "@/components/interactive-hero-tooth";
import { ScrollVideoSequence } from "@/components/scroll-video-sequence";
import { displayTitle, getPage, getWordPressItem, localMediaPath } from "@/content/content";
import { localizedPath, type Locale } from "@/i18n/config";

const faqsNl = [
  {
    question: "Welke regio's bedient uw tandartspraktijk in Veenendaal?",
    answer: "Onze praktijk ligt centraal in Veenendaal en is goed bereikbaar vanuit onder meer Veenendaal-Oost, Groenpoort, Rhenen, Ede, Leersum, Amerongen, Kesteren, Renswoude, Lunteren, Wageningen, Bennekom, Scherpenzeel en Woudenberg.",
  },
  {
    question: "Worden nieuwe patiënten aangenomen?",
    answer: "Ja, Mondzorgpraktijk Veenendaal neemt nieuwe patiënten aan. Bel ons of gebruik de afspraakpagina om uw aanmelding te bespreken.",
  },
  {
    question: "Wordt mijn tandartsbehandeling vergoed?",
    answer: "De vergoeding hangt af van uw leeftijd, behandeling en polis. Mondzorg voor kinderen tot 18 jaar valt meestal onder de basisverzekering. Controleer voor andere behandelingen uw polisvoorwaarden of neem contact op met uw verzekeraar.",
  },
  {
    question: "Welke behandelingen biedt Mondzorgpraktijk Veenendaal aan?",
    answer: "U kunt bij ons terecht voor controles, vullingen, wortelkanaalbehandelingen, kronen en bruggen, protheses, extracties, aligners, facings, tanden bleken, preventieve mondzorg, kindertandheelkunde, tandvleesbehandeling, GBT en begeleiding bij tandartsangst.",
  },
];

const faqsEn = [
  {
    question: "Which areas does your dental practice in Veenendaal serve?",
    answer: "Our practice is centrally located in Veenendaal and is easily accessible from Veenendaal-Oost, Groenpoort, Rhenen, Ede, Leersum, Amerongen, Kesteren, Renswoude, Lunteren, Wageningen, Bennekom, Scherpenzeel and Woudenberg.",
  },
  {
    question: "Are you accepting new patients?",
    answer: "Yes, Mondzorgpraktijk Veenendaal is accepting new patients. Call us or use the appointment page to discuss your registration.",
  },
  {
    question: "Will my dental treatment be reimbursed?",
    answer: "Reimbursement depends on your age, treatment and insurance policy. Dental care for children under 18 is generally covered by basic Dutch health insurance. For other treatments, check your policy or contact your insurer.",
  },
  {
    question: "Which treatments does Mondzorgpraktijk Veenendaal offer?",
    answer: "We provide check-ups, fillings, root canal treatments, crowns and bridges, dentures, extractions, clear aligners, veneers, teeth whitening, preventive care, paediatric dentistry, gum treatment, Guided Biofilm Therapy and support for dental anxiety.",
  },
];

const treatmentSources = [
  ["/behandelingen/periodieke-controles/", "Regelmatige controles om de gezondheid van uw tanden en tandvlees te bewaken.", "/wp-content/uploads/2025/10/Periodieke-Controle.jpg"],
  ["/behandelingen/vullingen-gaatjes-vullen/", "Herstel van een gaatje met een passend materiaal zoals composiet.", "/wp-content/uploads/2025/12/Alles-wat-je-moet-weten-over-het-vullen-van-tanden5.jpg"],
  ["/behandelingen/wortelkanaalbehandeling/", "Geïnfecteerd weefsel behandelen om de tand waar mogelijk te behouden.", "/wp-content/uploads/2025/10/Wortelkanaalbehandeling.jpg"],
  ["/behandelingen/kronen-en-bruggen/", "Duurzame oplossingen voor beschadigde of ontbrekende tanden.", "/wp-content/uploads/2025/11/banner03.jpg"],
  ["/behandelingen/prothese-kunstgebit/", "Een verwijderbare tandvervanging om weer goed te kauwen en spreken.", "/wp-content/uploads/2025/11/banner04.jpg"],
  ["/behandelingen/tanden-trekken-extracties/", "Het zorgvuldig verwijderen van een tand die niet behouden kan worden.", "/wp-content/uploads/2025/11/banner05.jpg"],
  ["/behandelingen/aligner-doorzichtige-beugel/", "Een bijna onzichtbare beugel die uw tanden geleidelijk rechtzet.", "/wp-content/uploads/2025/10/Doorzichtige-Beugel​.jpg"],
  ["/behandelingen/facings-voor-een-stralende-glimlach/", "Dunne schalen op de voorkant van tanden voor een verzorgd resultaat.", "/wp-content/uploads/2025/10/Hoe-verloopt-een-behandeling-voor-facings.jpg"],
  ["/behandelingen/tandenbleken/", "Een cosmetische behandeling om verkleuringen te verminderen.", "/wp-content/uploads/2025/10/Tanden-Bleken​.jpg"],
  ["/behandelingen/preventie-mondhygienist/", "Persoonlijk advies en behandeling om uw mondgezondheid te behouden.", "/wp-content/uploads/2025/10/Mondzorg.jpg"],
  ["/kindertandheelkunde/", "Tandzorg voor kinderen, met aandacht voor hun behoeften en comfort.", "/wp-content/uploads/2025/10/Kindertandheelkunde.jpg"],
  ["/behandelingen/tandvleesbehandeling-parodontitis/", "Behandeling van ontstoken tandvlees en parodontitis.", "/wp-content/uploads/2025/11/banner07.jpg"],
  ["/behandelingen/pijnloze-gebitsreiniging-gbt/", "Technologie voor een comfortabele reiniging van tanden en tandvlees.", "/wp-content/uploads/2025/11/banner08.jpg"],
  ["/behandelingen/white-spots-verwijderen-witte-vlekken/", "Behandeling om witte vlekken of verkleuringen te verminderen.", "/wp-content/uploads/2025/11/banner09.jpg"],
  ["/behandelingen/angst-tandartsangst/", "Rustige begeleiding en zorg afgestemd op angstige patiënten.", "/wp-content/uploads/2026/01/Bang-voor-de-tandarts2.jpg"],
] as const;

const treatmentDescriptionsEn: Record<string, string> = {
  "/behandelingen/periodieke-controles/": "Regular check-ups to monitor the health of your teeth and gums.",
  "/behandelingen/vullingen-gaatjes-vullen/": "Restoring a cavity with a suitable material such as composite.",
  "/behandelingen/wortelkanaalbehandeling/": "Treating infected tissue to preserve the tooth whenever possible.",
  "/behandelingen/kronen-en-bruggen/": "Durable solutions for damaged or missing teeth.",
  "/behandelingen/prothese-kunstgebit/": "A removable tooth replacement to help you chew and speak comfortably again.",
  "/behandelingen/tanden-trekken-extracties/": "Careful removal of a tooth that cannot be preserved.",
  "/behandelingen/aligner-doorzichtige-beugel/": "A nearly invisible aligner that gradually straightens your teeth.",
  "/behandelingen/facings-voor-een-stralende-glimlach/": "Thin veneers placed on the front of teeth for a natural-looking result.",
  "/behandelingen/tandenbleken/": "A cosmetic treatment to reduce discolouration.",
  "/behandelingen/preventie-mondhygienist/": "Personal advice and treatment to maintain your oral health.",
  "/kindertandheelkunde/": "Dental care for children, with attention to their needs and comfort.",
  "/behandelingen/tandvleesbehandeling-parodontitis/": "Treatment for inflamed gums and periodontitis.",
  "/behandelingen/pijnloze-gebitsreiniging-gbt/": "Technology for comfortable cleaning of teeth and gums.",
  "/behandelingen/white-spots-verwijderen-witte-vlekken/": "Treatment to reduce white spots or discolouration.",
  "/behandelingen/angst-tandartsangst/": "Calm guidance and care tailored to patients with dental anxiety.",
};

function treatmentPreviews(locale: Locale): TreatmentPreview[] {
  return treatmentSources.flatMap(([href, description, fallback]) => {
    const page = getPage(href, locale);
    if (!page) return [];
    const item = getWordPressItem(href);
    return [{
      name: item ? displayTitle(item.title.rendered) : displayTitle(page.title),
      description: locale === "en" ? treatmentDescriptionsEn[href] : description,
      href: localizedPath(locale, href),
      image: page.images[0]?.src ? localMediaPath(page.images[0].src) : fallback,
      imageAlt: page.images[0]?.alt || (locale === "en" ? `${displayTitle(page.title)} at Mondzorgpraktijk Veenendaal` : `${displayTitle(page.title)} bij Mondzorgpraktijk Veenendaal`),
    }];
  });
}

const reviewsNl = [
  {
    quote: "Professionele behandeling, erg klantvriendelijk en prettig qua afspraken.",
    author: "Ellen Waalewijn",
  },
  {
    quote: "Hele fijne praktijk met veel aandacht voor de mens en totaal niet commercieel. Vriendelijke en deskundige tandartsen en mondhygiënist. Warme ontvangst altijd en luisteren goed naar je wensen.",
    author: "Amir Karimi",
  },
  {
    quote: "Deskundigheid en rust was mijn eerste indruk en bij vertrek had ik een hele grote bevestiging voor mijn eerste indruk.",
    author: "Aria Tehrani",
  },
];

const reviewsEn = [
  { quote: "Professional treatment, very patient-friendly and easy appointment scheduling.", author: "Ellen Waalewijn" },
  { quote: "A wonderful practice with genuine attention for people and no commercial pressure. Friendly, knowledgeable dentists and dental hygienist, always a warm welcome, and they listen carefully to your wishes.", author: "Amir Karimi" },
  { quote: "Expertise and calm were my first impression, and by the time I left that impression had been completely confirmed.", author: "Aria Tehrani" },
];

const teamNl = [
  { name: "Cristian Zandi", role: "Geregistreerd mondhygiënist, praktijkeigenaar", image: "/wp-content/uploads/2025/10/Cristian-Zandi.jpg", href: "/ons-team/cristian-zandi/" },
  { name: "Huusder Barmer", role: "Tandarts", image: "/wp-content/uploads/2025/11/Huusder-Barmer.jpg", href: "/ons-team/huusder-barmer-2/" },
  { name: "Elmira Eslami", role: "Tandarts", image: "/wp-content/uploads/2026/08/Elmira-eslami.webp", href: "/ons-team/" },
];

const teamEn = [
  { name: "Cristian Zandi", role: "Registered dental hygienist, practice owner", image: "/wp-content/uploads/2025/10/Cristian-Zandi.jpg", href: "/ons-team/cristian-zandi/" },
  { name: "Huusder Barmer", role: "Dentist", image: "/wp-content/uploads/2025/11/Huusder-Barmer.jpg", href: "/ons-team/huusder-barmer-2/" },
  { name: "Elmira Eslami", role: "Dentist", image: "/wp-content/uploads/2026/08/Elmira-eslami.webp", href: "/ons-team/" },
];

export function HomePage({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const href = (path: string) => localizedPath(locale, path);
  const treatments = treatmentPreviews(locale);
  const latestPost = getPage("/kind-wil-niet-tandenpoetsen/", locale);
  const reviews = en ? reviewsEn : reviewsNl;
  const team = en ? teamEn : teamNl;
  const faqs = en ? faqsEn : faqsNl;

  return (
    <main id="hoofdinhoud">
      <DentalPracticeSchema locale={locale} />

      <section className="home-hero" data-hero-scroll data-pointer-reactive>
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="shell home-hero-grid">
          <div className="hero-copy" data-reveal="hero">
            <p className="eyebrow"><span>Veenendaal</span> · Living Dental Atelier</p>
            <h1 aria-label={en ? "Dental care that feels calm." : "Mondzorg die rustig voelt."}>
              <span className="hero-line hero-line-one" aria-hidden="true">{en ? "Dental care that" : "Mondzorg die"}</span>
              <span className="hero-line hero-line-two" aria-hidden="true">{en ? <>feels <em>calm.</em></> : <><em>rustig</em> voelt.</>}</span>
            </h1>
            <p className="hero-lead">{en ? "Personal dental care in a calm, welcoming practice for adults, children and patients with dental anxiety." : "Persoonlijke tandheelkundige zorg in een rustige, huiselijke praktijk voor volwassenen, kinderen en angstige patiënten."}</p>
            <div className="actions hero-actions">
              <Link className="button" data-magnetic href={href("/maak-een-afspraak-1/#afspraak")}>{en ? "Make an appointment" : "Maak een afspraak"} <span aria-hidden="true">↗</span></Link>
              <Link className="text-link" href={href("/maak-een-afspraak-1/#inschrijven")}>{en ? "New patient? Register here" : "Nieuwe patiënt? Schrijf u in"}</Link>
            </div>
            <div className="hero-proof" data-reveal-stagger>
              <div className="rating-block" aria-label={en ? "Google rating 4.6 out of 5, based on 47 reviews" : "Google-beoordeling 4,6 van 5, gebaseerd op 47 reviews"}>
                <span className="stars" aria-hidden="true">★★★★★</span>
                <strong>4,6/5</strong>
                <span>{en ? "47 Google reviews" : "47 Google-reviews"}</span>
              </div>
              <span className="vertical-rule" aria-hidden="true" />
              <p><span className="status-check" aria-hidden="true">✓</span> {en ? "We are accepting new patients" : "Wij nemen nieuwe patiënten aan"}</p>
            </div>
          </div>

          <div className="hero-visual" data-reveal="scale">
            <InteractiveHeroTooth locale={locale} />
            <figure className="hero-photo">
              <Image
                alt={en ? "Warm reception area at Mondzorgpraktijk Veenendaal" : "Warme ontvangstruimte van Mondzorgpraktijk Veenendaal"}
                fill
                priority
                sizes="(max-width: 768px) 38vw, 18vw"
                src="/wp-content/uploads/2025/09/banner01.jpg"
              />
            </figure>
          </div>

          <div className="hero-status"><LiveClinicStatus locale={locale} /></div>
          <a className="hero-phone" href="tel:+31318501376">{en ? "Call now" : "Bel direct"} <strong>0318 501376</strong></a>
        </div>
        <div className="hero-scroll-cue" aria-hidden="true">
          <span>{en ? "Scroll to explore" : "Scroll om te ontdekken"}</span>
          <i><b /></i>
          <svg viewBox="0 0 16 16"><path d="m3 6 5 5 5-5" /></svg>
        </div>
      </section>

      <ScrollVideoSequence locale={locale} />

      <section className="trust-strip" aria-label={en ? "Why patients choose us" : "Waarom patiënten voor ons kiezen"} data-reveal="wipe">
        <div className="shell trust-strip-grid">
          <p><span>01</span><strong>{en ? "New patients welcome" : "Nieuwe patiënten welkom"}</strong></p>
          <p><span>02</span><strong>{en ? "No waiting list" : "Geen wachtlijst"}</strong></p>
          <p><span>03</span><strong>{en ? "Open five days a week" : "5 dagen per week geopend"}</strong></p>
          <p><span>04</span><strong>{en ? "Small-scale & personal" : "Kleinschalig & persoonlijk"}</strong></p>
        </div>
      </section>

      <section className="practice-story section-space" data-pointer-reactive data-story-root>
        <div className="shell story-heading" data-reveal="split">
          <p className="eyebrow">{en ? "Our practice · built on trust" : "Onze praktijk · sinds vertrouwen"}</p>
          <h2>{en ? <>We put the <em>person</em> before the patient.</> : <>De mens achter de patiënt staat hier <em>centraal.</em></>}</h2>
        </div>
        <div className="shell story-composition">
          <figure className="story-image story-image-main">
            <div className="story-image-media" data-reveal="mask" data-tilt>
              <Image
                alt={en ? "The green, welcoming interior of the practice" : "De groene, huiselijke inrichting van de praktijk"}
                className="story-layer story-layer-0"
                fill
                sizes="(max-width: 768px) 100vw, 58vw"
                src="/wp-content/uploads/2025/10/mondzorgpraktijkveenendaal14.jpg"
              />
              <Image
                alt=""
                className="story-layer story-layer-1"
                fill
                sizes="(max-width: 768px) 100vw, 58vw"
                src="/wp-content/uploads/2025/10/mondzorgpraktijkveenendaal15.jpg"
              />
              <Image
                alt=""
                className="story-layer story-layer-2"
                fill
                sizes="(max-width: 768px) 100vw, 58vw"
                src="/wp-content/uploads/2025/11/banner10-768x768.jpg"
              />
            </div>
            <span className="story-image-index" aria-hidden="true"><i>01</i><i>02</i><i>03</i></span>
          </figure>
          <div className="story-narrative">
            <div className="story-copy" data-reveal="split">
              <p className="lead">{en ? "Welcome to our practice, where quality, attentiveness and humanity come first." : "Welkom bij onze praktijk, waar kwaliteit, aandacht en menselijkheid centraal staan."}</p>
              <p>{en ? "No conveyor-belt dentistry and no commercial pressure—just personal attention, calm and time for every individual." : "Geen lopende band-mentaliteit en geen commerciële druk — maar persoonlijke aandacht, rust en tijd voor ieder individu."}</p>
              <Link className="arrow-link" data-directional href={href("/de-praktijk/")}>{en ? "Discover our practice" : "Ontdek onze praktijk"} <span aria-hidden="true">↗</span></Link>
            </div>
            <ol className="story-pillars" data-reveal="stagger">
              <li data-story-step><span>01</span><strong>{en ? "Personal attention" : "Persoonlijke aandacht"}</strong><p>{en ? "Care tailored to your pace, understanding and comfort." : "Zorg afgestemd op uw tempo, begrip en comfort."}</p></li>
              <li data-story-step><span>02</span><strong>{en ? "Modern equipment" : "Moderne apparatuur"}</strong><p>{en ? "Accurate and comfortable treatments." : "Nauwkeurige en comfortabele behandelingen."}</p></li>
              <li data-story-step><span>03</span><strong>{en ? "For every age" : "Voor alle leeftijden"}</strong><p>{en ? "Children, adults and people with disabilities are all welcome." : "Kinderen, volwassenen en mensen met een beperking zijn welkom."}</p></li>
            </ol>
          </div>
        </div>
      </section>

      <section className="treatments-section section-space">
        <div className="shell section-heading split-heading" data-reveal="split">
          <div>
            <p className="eyebrow">{en ? "Treatments" : "Behandelingen"}</p>
            <h2>{en ? <>Care for a<br /><em>healthy mouth.</em></> : <>Zorg voor een<br /><em>gezonde mond.</em></>}</h2>
          </div>
          <p>{en ? "From prevention and check-ups to restorative and cosmetic care. Always with clear information and attention to what you need." : "Van preventie en controle tot herstel en esthetiek. Altijd met heldere uitleg en aandacht voor wat u nodig heeft."}</p>
        </div>
        <div className="shell" data-reveal="mask">
          <TreatmentIndex locale={locale} treatments={treatments} />
        </div>
      </section>

      <section className="anxiety-section section-space" data-pointer-reactive>
        <div className="anxiety-orbit" aria-hidden="true"><span /></div>
        <div className="shell anxiety-grid">
          <div data-reveal="split">
            <p className="eyebrow">{en ? "Anxiety-aware dentistry" : "Angstvrije tandheelkunde"}</p>
            <h2>{en ? <><span>Afraid of the dentist?</span><br /><em>You can take your time here.</em></> : <><span>Bang voor de tandarts?</span><br /><em>Hier mag u rustig binnenkomen.</em></>}</h2>
          </div>
          <div className="anxiety-copy" data-reveal="mask">
            <p className="lead">{en ? "Our years of experience, calm approach and personal attention help patients with dental anxiety feel at ease in our green practice." : "Door jarenlange ervaring, een rustige aanpak en persoonlijke aandacht zijn ook angstige patiënten goed op hun plek bij onze groene praktijk."}</p>
            <p>{en ? "We take the time to listen to your wishes and adapt treatment to your pace." : "We nemen de tijd, luisteren naar uw wensen en passen de behandeling aan uw tempo aan."}</p>
            <div className="actions">
              <Link className="button button-light" data-magnetic href={href("/behandelingen/angst-tandartsangst/")}>{en ? "Read about our approach" : "Lees over onze aanpak"}</Link>
              <a className="text-link text-link-light" href="tel:+31318501376">{en ? "Talk to us about your concerns" : "Bespreek uw zorgen met ons"}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section section-space">
        <div className="shell section-heading team-heading" data-reveal="split">
          <p className="eyebrow">{en ? "Our team" : "Ons team"}</p>
          <h2>{en ? <>Skilled hands.<br /><em>Familiar faces.</em></> : <>Bekwame handen.<br /><em>Bekende gezichten.</em></>}</h2>
          <Link className="arrow-link" href={href("/ons-team/")}>{en ? "Meet the entire team" : "Ontmoet het hele team"} <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="shell team-editorial-grid">
          {team.map((member, index) => (
            <article className={`team-preview team-preview-${index + 1}`} data-reveal="mask" data-pointer-reactive key={member.name}>
              <Link data-directional href={href(member.href)} aria-label={en ? `Read more about ${member.name}` : `Lees meer over ${member.name}`}>
                <figure data-tilt>
                  <Image alt={member.name} fill sizes="(max-width: 768px) 84vw, 30vw" src={member.image} />
                </figure>
                <div><span>{String(index + 1).padStart(2, "0")}</span><h3>{member.name}</h3><p>{member.role}</p></div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="children-section section-space" data-pointer-reactive>
        <div className="shell children-grid">
          <div className="children-copy" data-reveal="split">
            <p className="eyebrow">{en ? "Paediatric dentistry" : "Kindertandheelkunde"}</p>
          <h2>{en ? <>A positive start for a <em>healthy smile.</em></> : <>Een fijne start voor een <em>gezonde glimlach.</em></>}</h2>
            <p className="lead">{en ? "We make dental visits positive and educational, with guidance on brushing, healthy food and child-friendly treatment." : "We maken tandartsbezoeken leuk en leerzaam, met voorlichting over tandenpoetsen, gezonde voeding en een kindvriendelijke behandeling."}</p>
            <Link className="button button-dark" data-magnetic href={href("/kindertandheelkunde/")}>{en ? "Dental care for children" : "Mondzorg voor kinderen"}</Link>
          </div>
          <figure className="children-image" data-reveal="mask" data-tilt>
            <Image
              alt={en ? "Child after a visit to Mondzorgpraktijk Veenendaal" : "Kind na een bezoek aan Mondzorgpraktijk Veenendaal"}
              fill
              sizes="(max-width: 768px) 100vw, 48vw"
              src="/wp-content/uploads/2025/10/Kindertandheelkunde.jpg"
            />
            <span aria-hidden="true">{en ? "Calm · positive · familiar" : "Rustig · positief · vertrouwd"}</span>
          </figure>
        </div>
      </section>

      <section className="reviews-section section-space">
        <div className="shell reviews-heading" data-reveal="split">
          <p className="eyebrow">{en ? "Patient stories" : "Ervaringen"}</p>
          <div className="review-score"><span className="stars" aria-hidden="true">★★★★★</span><strong>4,6</strong><span>{en ? "47 Google reviews" : "47 Google-reviews"}</span></div>
        </div>
        <div className="shell" data-reveal="mask"><TestimonialsCarousel locale={locale} reviews={reviews} /></div>
      </section>

      {latestPost ? (
        <section className="journal-feature section-space">
          <div className="shell journal-grid">
            <figure data-reveal="mask" data-directional data-tilt>
              <Image
                alt={latestPost.images[0]?.alt || displayTitle(latestPost.title)}
                fill
                sizes="(max-width: 768px) 100vw, 52vw"
                src={localMediaPath(latestPost.images[0]?.src || "/wp-content/uploads/2026/06/Kind-wil-niet-tandenpoetsen.webp")}
              />
            </figure>
            <div data-reveal="split">
              <p className="eyebrow">{en ? "From our journal" : "Uit ons journal"}</p>
              <h2>{displayTitle(latestPost.title)}</h2>
              <p>{latestPost.metaDescription}</p>
              <Link className="arrow-link" href={href("/kind-wil-niet-tandenpoetsen/")}>{en ? "Read the article" : "Lees het artikel"} <span aria-hidden="true">↗</span></Link>
              <Link className="text-link" href={href("/blog/")}>{en ? "View all articles" : "Bekijk alle artikelen"}</Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="home-faq section-space">
        <div className="shell faq-home-grid">
          <div data-reveal>
            <p className="eyebrow">{en ? "Good to know" : "Goed om te weten"}</p>
            <h2>{en ? <>Questions are<br /><em>always welcome.</em></> : <>Vragen mogen<br /><em>altijd.</em></>}</h2>
            <p>{en ? "Cannot find your question? Feel free to call us on" : "Staat uw vraag er niet bij? Bel ons gerust op"} <a href="tel:+31318501376">0318 501376</a>.</p>
          </div>
          <div data-reveal><FaqBlock items={faqs} locale={locale} /></div>
        </div>
      </section>

      <section className="final-invitation section-space" data-pointer-reactive>
        <div className="shell" data-reveal>
          <p className="eyebrow">{en ? "Welcome to Veenendaal" : "Welkom in Veenendaal"}</p>
          <h2>{en ? <>Ready for dental care<br />that <em>suits you?</em></> : <>Klaar voor mondzorg <br />die bij u <em>past?</em></>}</h2>
          <div className="actions">
            <Link className="button button-light" data-magnetic href={href("/maak-een-afspraak-1/")}>{en ? "Make an appointment" : "Maak een afspraak"} <span aria-hidden="true">↗</span></Link>
            <a className="text-link text-link-light" href="tel:+31318501376">{en ? "Or call 0318 501376" : "Of bel 0318 501376"}</a>
          </div>
        </div>
      </section>
    </main>
  );
}

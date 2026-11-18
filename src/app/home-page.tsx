import { treatmentImages } from "@/content/treatment-images";
import { teamNl, teamEn } from "@/content/team";
import Image from "next/image";
import Link from "next/link";
import { DentalPracticeSchema, FaqBlock } from "@/components/content-components";
import { CalmMode, LiveClinicStatus, TestimonialsCarousel, TreatmentIndex, type TreatmentPreview } from "@/components/experience";
import { ScrollVideoSequence } from "@/components/scroll-video-sequence";
import { ArrowUpRightIcon } from "@/components/ui-icons";
import { displayTitle, getPage, getWordPressItem, localMediaPath } from "@/content/content";
import { localizedPath, type Locale } from "@/i18n/config";

const googleReviewRating = "4,7";
const googleReviewCount = 55;

const faqsNl = [
  {
    question: "Welke regio's bedient uw tandartspraktijk in Veenendaal?",
    answer: "Onze praktijk ligt centraal in Veenendaal en is goed bereikbaar vanuit onder meer Veenendaal-Oost, Groenpoort, Rhenen, Ede, Leersum, Amerongen, Kesteren, Renswoude, Lunteren, Wageningen, Bennekom, Scherpenzeel en Woudenberg.",
  },
  {
    question: "Worden nieuwe patiënten aangenomen?",
    answer: "Ja, Tandartspraktijk Corridor neemt nieuwe patiënten aan. Bel ons of gebruik de afspraakpagina om uw aanmelding te bespreken.",
  },
  {
    question: "Wordt mijn tandartsbehandeling vergoed?",
    answer: "De vergoeding hangt af van uw leeftijd, behandeling en polis. Mondzorg voor kinderen tot 18 jaar valt meestal onder de basisverzekering. Controleer voor andere behandelingen uw polisvoorwaarden of neem contact op met uw verzekeraar.",
  },
  {
    question: "Welke behandelingen biedt Tandartspraktijk Corridor aan?",
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
    answer: "Yes, Tandartspraktijk Corridor is accepting new patients. Call us or use the appointment page to discuss your registration.",
  },
  {
    question: "Will my dental treatment be reimbursed?",
    answer: "Reimbursement depends on your age, treatment and insurance policy. Dental care for children under 18 is generally covered by basic Dutch health insurance. For other treatments, check your policy or contact your insurer.",
  },
  {
    question: "Which treatments does Tandartspraktijk Corridor offer?",
    answer: "We provide check-ups, fillings, root canal treatments, crowns and bridges, dentures, extractions, clear aligners, veneers, teeth whitening, preventive care, paediatric dentistry, gum treatment, Guided Biofilm Therapy and support for dental anxiety.",
  },
];

const treatmentSources = [
  ["/behandelingen/periodieke-controles/", "Regelmatige controles om de gezondheid van uw tanden en tandvlees te bewaken.", "/wp-content/uploads/2025/12/Wanneer-vullingen-vervangen-Zo-herken-je-het-juiste-moment5.jpg"],
  ["/behandelingen/vullingen-gaatjes-vullen/", "Herstel van een gaatje met een passend materiaal zoals composiet.", "/wp-content/uploads/2025/12/Alles-wat-je-moet-weten-over-het-vullen-van-tanden2.jpg"],
  ["/behandelingen/wortelkanaalbehandeling/", "Geïnfecteerd weefsel behandelen om de tand waar mogelijk te behouden.", "/wp-content/uploads/2025/12/Wanneer-vullingen-vervangen-Zo-herken-je-het-juiste-moment3.jpg"],
  ["/behandelingen/kronen-en-bruggen/", "Duurzame oplossingen voor beschadigde of ontbrekende tanden.", "/wp-content/uploads/2026/04/Vrouwelijke-tandarts-met-dentuurmal-in-de-hand-1024x687.jpg"],
  ["/behandelingen/prothese-kunstgebit/", "Een verwijderbare tandvervanging om weer goed te kauwen en spreken.", "/wp-content/uploads/2026/04/Dentuurmal-op-doek-met-oudere-persoon-op-de-achtergrond.jpg"],
  ["/behandelingen/tanden-trekken-extracties/", "Het zorgvuldig verwijderen van een tand die niet behouden kan worden.", "/wp-content/uploads/2025/12/Wanneer-vullingen-vervangen-Zo-herken-je-het-juiste-moment6.jpg"],
  ["/behandelingen/aligner-doorzichtige-beugel/", "Een bijna onzichtbare beugel die uw tanden geleidelijk rechtzet.", "/wp-content/uploads/2026/05/mondhygiene-comfort-doorzichtige-aligners-1024x574.jpg"],
  ["/behandelingen/facings-voor-een-stralende-glimlach/", "Dunne schalen op de voorkant van tanden voor een verzorgd resultaat.", "/wp-content/uploads/2026/04/European-Woman-Smiling-in-Handheld-Mirror-1024x574.jpg"],
  ["/behandelingen/tandenbleken/", "Een cosmetische behandeling om verkleuringen te verminderen.", "/wp-content/uploads/2025/11/Tanden-bleken-Vanaf-welke-leeftijd-en-belangrijke-tips-1.png"],
  ["/behandelingen/preventie-mondhygienist/", "Persoonlijk advies en behandeling om uw mondgezondheid te behouden.", "/wp-content/uploads/2026/04/DentalCare_Essentials-2-1024x687.jpeg"],
  ["/kindertandheelkunde/", "Tandzorg voor kinderen, met aandacht voor hun behoeften en comfort.", "/wp-content/uploads/2026/02/kindertandarts-veenendaal-poetsen.jpg"],
  ["/behandelingen/tandvleesbehandeling-parodontitis/", "Behandeling van ontstoken tandvlees en parodontitis.", "/wp-content/uploads/2026/01/ontstoken-tandvlees-behandeling.jpg.jpg"],
  ["/behandelingen/pijnloze-gebitsreiniging-gbt/", "Technologie voor een comfortabele reiniging van tanden en tandvlees.", "/wp-content/uploads/2025/12/Wanneer-vullingen-vervangen-Zo-herken-je-het-juiste-moment3.jpg"],
  ["/behandelingen/white-spots-verwijderen-witte-vlekken/", "Behandeling om witte vlekken of verkleuringen te verminderen.", "/wp-content/uploads/2026/04/European-Woman-Smiling-in-Handheld-Mirror-1024x574.jpg"],
  ["/behandelingen/angst-tandartsangst/", "Rustige begeleiding en zorg afgestemd op angstige patiënten.", "/wp-content/uploads/2026/01/Bang-voor-de-tandarts.jpg"],
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
  return treatmentSources.flatMap(([href, description]) => {
    const page = getPage(href, locale);
    if (!page) return [];
    const item = getWordPressItem(href);
    return [{
      name: item ? displayTitle(item.title.rendered) : displayTitle(page.title),
      description: locale === "en" ? treatmentDescriptionsEn[href] : description,
      href: localizedPath(locale, href),
      image: treatmentImages[href],
      imageAlt: locale === "en" ? treatmentDescriptionsEn[href] : description,
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

export function HomePage({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const href = (path: string) => localizedPath(locale, path);
  const allTreatments = treatmentPreviews(locale);
  const treatments = [0, 9, 10, 14, 1, 6].map(index => allTreatments[index]).filter(Boolean);
  const latestPost = getPage("/kind-wil-niet-tandenpoetsen/", locale);
  const reviews = en ? reviewsEn : reviewsNl;
  const team = en ? teamEn : teamNl;
  const faqs = en ? faqsEn : faqsNl;

  return (
    <main id="hoofdinhoud">
      <DentalPracticeSchema locale={locale} />

      <ScrollVideoSequence locale={locale}>
        <div>
          <p className="eyebrow"><span>01</span> Veenendaal · {en ? "Welcome" : "Welkom"}</p>
          <h1>{en ? <>Dental care that<br /><em>feels calm.</em></> : <>Mondzorg die<br /><em>rustig voelt.</em></>}</h1>
          <div data-story-detail>
            <p className="story-description">{en ? "Personal dental care. A place where you can feel at ease." : "Persoonlijke mondzorg. Een plek waar u zich op uw gemak mag voelen."}</p>
            <div className="story-actions"><Link className="button" href={href("/maak-een-afspraak-1/#afspraak")}>{en ? "Make an appointment" : "Maak een afspraak"} <ArrowUpRightIcon /></Link></div>
            <p className="story-note">{en ? "New patients welcome" : "Nieuwe patiënten welkom"}</p>
          </div>
        </div>
        <div>
          <p className="eyebrow"><span>02</span> {en ? "Come inside" : "Kom binnen"}</p>
          <h2>{en ? <>See the calm.<br /><em>Feel the care.</em></> : <>Rust ziet u.<br /><em>Aandacht voelt u.</em></>}</h2>
          <p className="story-description" data-story-detail>{en ? "A calm, welcoming practice. Take a moment to settle in." : "Een rustige, huiselijke praktijk. Neem even de tijd om te landen."}</p>
        </div>
        <div>
          <p className="eyebrow"><span>03</span> {en ? "The treatment room" : "De behandelkamer"}</p>
          <h2>{en ? <>Modern equipment.<br />Thoughtful care.</> : <>Moderne apparatuur.<br />Zorg met aandacht.</>}</h2>
          <p className="story-description" data-story-detail>{en ? "Accurate and comfortable treatments, with clear explanations." : "Nauwkeurige en comfortabele behandelingen, met heldere uitleg."}</p>
        </div>
        <div>
          <p className="eyebrow"><span>04</span> {en ? "Our practice · built on trust" : "Onze praktijk · sinds vertrouwen"}</p>
          <h2>{en ? <>We put the <em>person</em><br />before the patient.</> : <>De mens achter de patiënt<br />staat hier <em>centraal.</em></>}</h2>
          <div data-story-detail>
            <p className="story-description">{en ? "Welcome to our practice, where quality, attentiveness and humanity come first." : "Welkom bij onze praktijk, waar kwaliteit, aandacht en menselijkheid centraal staan."}</p>
            <Link className="text-link" href={href("/de-praktijk/")}>{en ? "Discover our practice" : "Ontdek onze praktijk"} <ArrowUpRightIcon /></Link>
          </div>
        </div>
        <div>
          <p className="eyebrow"><span>05</span> {en ? "Personal attention" : "Persoonlijke aandacht"}</p>
          <h2>{en ? <>Your pace.<br /><em>Our attention.</em></> : <>Uw tempo.<br /><em>Onze aandacht.</em></>}</h2>
          <div data-story-detail>
            <p className="story-description">{en ? "Care tailored to your pace, understanding and comfort." : "Zorg afgestemd op uw tempo, begrip en comfort."}</p>
            <p className="story-description story-description-small">{en ? "No conveyor-belt dentistry and no commercial pressure—just personal attention, calm and time for every individual." : "Geen lopende band-mentaliteit en geen commerciële druk — maar persoonlijke aandacht, rust en tijd voor ieder individu."}</p>
          </div>
        </div>
        <div>
          <p className="eyebrow"><span>06</span> {en ? "For every age" : "Voor alle leeftijden"}</p>
          <h2>{en ? <>You are<br /><em>welcome here.</em></> : <>U bent<br /><em>welkom.</em></>}</h2>
          <div data-story-detail>
            <p className="story-description story-description-small">{en ? "Children, adults and people with disabilities are all welcome. Personal care, also when a dental visit feels daunting." : "Kinderen, volwassenen en mensen met een beperking zijn welkom. Persoonlijke zorg, ook als u een tandartsbezoek spannend vindt."}</p>
            <ul className="story-welcome"><li>{en ? "New patients welcome" : "Nieuwe patiënten welkom"}</li><li>{en ? "No waiting list" : "Geen wachtlijst"}</li><li>{en ? "Open five days a week" : "5 dagen per week geopend"}</li><li>{en ? "Small-scale & personal" : "Kleinschalig & persoonlijk"}</li></ul>
            <div className="story-actions"><Link className="button" href={href("/maak-een-afspraak-1/#afspraak")}>{en ? "Make an appointment" : "Maak een afspraak"} <ArrowUpRightIcon /></Link><Link className="text-link" href={href("/maak-een-afspraak-1/#inschrijven")}>{en ? "Register as a patient" : "Schrijf u in"}</Link></div>
            <div className="story-status"><LiveClinicStatus locale={locale} /></div>
            <a className="text-link" href="tel:+31318501376">0318 501376</a>
          </div>
        </div>
      </ScrollVideoSequence>


      <section id="treatments" className="treatments-section section-space">
        <div className="shell section-heading split-heading" data-reveal="split">
          <div>
            <p className="eyebrow">{en ? "Treatments" : "Behandelingen"}</p>
            <h2>{en ? <>Care for a<br /><em>healthy mouth.</em></> : <>Zorg voor een<br /><em>gezonde mond.</em></>}</h2>
          </div>
          <p>{en ? "From prevention and check-ups to restorative and cosmetic care. Always with clear information and attention to what you need." : "Van preventie en controle tot herstel en esthetiek. Altijd met heldere uitleg en aandacht voor wat u nodig heeft."}</p>
        </div>
        <div className="shell" data-reveal="mask">
          <TreatmentIndex locale={locale} treatments={treatments} />
          <div className="home-all-treatments"><Link className="button button-dark" href={href("/behandelingen/")}>{en ? "Explore all 15 treatments" : "Bekijk alle 15 behandelingen"} <ArrowUpRightIcon /></Link></div>
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
            <CalmMode locale={locale} />
            <p className="lead">{en ? "Our years of experience, calm approach and personal attention help patients with dental anxiety feel at ease in our green practice." : "Door jarenlange ervaring, een rustige aanpak en persoonlijke aandacht zijn ook angstige patiënten goed op hun plek bij onze groene praktijk."}</p>
            <p>{en ? "We take the time to listen to your wishes and adapt treatment to your pace." : "We nemen de tijd, luisteren naar uw wensen en passen de behandeling aan uw tempo aan."}</p>
            <div className="actions">
              <Link className="button button-light" data-magnetic href={href("/behandelingen/angst-tandartsangst/")}>{en ? "Read about our approach" : "Lees over onze aanpak"}</Link>
              <a className="text-link text-link-light" href="tel:+31318501376">{en ? "Talk to us about your concerns" : "Bespreek uw zorgen met ons"}</a>
            </div>
          </div>
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
              alt={en ? "A dentist explains toothbrushing to a child using a dinosaur model" : "Een tandarts legt tandenpoetsen uit aan een kind met een dinosaurusmodel"}
              fill
              sizes="(max-width: 768px) 100vw, 48vw"
              src="/wp-content/uploads/2026/02/kindertandarts-veenendaal-poetsen.jpg"
            />
            <span aria-hidden="true">{en ? "Calm · positive · familiar" : "Rustig · positief · vertrouwd"}</span>
          </figure>
        </div>
      </section>

      <section className="team-section section-space">
        <div className="shell section-heading team-heading" data-reveal="split">
          <p className="eyebrow">{en ? "Our team" : "Ons team"}</p>
          <h2>{en ? <>Skilled hands.<br /><em>Familiar faces.</em></> : <>Bekwame handen.<br /><em>Bekende gezichten.</em></>}</h2>
          <Link className="arrow-link" href={href("/ons-team/")}>{en ? "Meet the entire team" : "Ontmoet het hele team"} <ArrowUpRightIcon /></Link>
        </div>
        <div className="shell team-editorial-grid">
          {team.map((member, index) => (
            <article className={`team-preview team-preview-${index + 1}`} data-reveal="mask" data-pointer-reactive key={member.name}>
              <Link data-directional href={href(member.href ?? "/ons-team/")} aria-label={en ? `Read more about ${member.name}` : `Lees meer over ${member.name}`}>
                <figure data-tilt>
                  <Image alt={member.name} fill sizes="(max-width: 768px) 48vw, 30vw" src={member.image} />
                  <figcaption className="team-introduction"><span>{member.role}</span><strong>{en ? "Meet the team" : "Maak kennis"} <ArrowUpRightIcon /></strong></figcaption>
                </figure>
                <div><span>{String(index + 1).padStart(2, "0")}</span><h3>{member.name}</h3><p>{member.role}</p></div>
              </Link>
            </article>
          ))}
        </div>
      </section>



      <section className="reviews-section section-space" aria-labelledby="reviews-title">
        <div className="shell reviews-layout">
          <div className="reviews-heading" data-reveal="split">
            <p className="eyebrow">{en ? "Patient stories" : "Ervaringen"}</p>
            <h2 id="reviews-title">{en ? <>Care you<br />can <em>feel.</em></> : <>Aandacht die<br />u <em>voelt.</em></>}</h2>
            <p className="reviews-intro">{en ? "Our patients share what personal care means to them." : "Onze patiënten vertellen wat persoonlijke zorg voor hen betekent."}</p>
            <div className="review-score"><strong>{googleReviewRating}<small> / 5</small></strong><span className="stars" aria-hidden="true">★★★★★</span><span>{googleReviewCount} {en ? "Google reviews" : "Google-reviews"}</span></div>
          </div>
          <div className="reviews-feature" data-reveal="mask"><TestimonialsCarousel locale={locale} reviews={reviews} /></div>
        </div>
      </section>

      <section className="first-visit section-space" aria-labelledby="first-visit-title">
        <div className="shell">
          <div className="first-visit-heading">
            <div><p className="eyebrow">{en ? "Your first visit" : "Uw eerste bezoek"}</p><h2 id="first-visit-title">{en ? <>A calm start.<br /><em>Step by step.</em></> : <>Een rustige start.<br /><em>Stap voor stap.</em></>}</h2></div>
            <Link className="button button-dark" href={href("/maak-een-afspraak-1/#inschrijven")}>{en ? "Register as a new patient" : "Inschrijven als nieuwe patiënt"} <ArrowUpRightIcon /></Link>
          </div>
          <ol className="first-visit-steps">
            <li><span aria-hidden="true">01</span><h3>{en ? "Send your request" : "Stuur uw aanvraag"}</h3><p>{en ? "Use the registration form or call us. Let us know what you need help with." : "Gebruik het inschrijfformulier of bel ons. Vertel waarvoor u bij ons terecht wilt."}</p></li>
            <li><span aria-hidden="true">02</span><h3>{en ? "We contact you" : "Wij nemen contact op"}</h3><p>{en ? "We discuss your request and arrange an appointment with you. Your online request is not yet a confirmed appointment." : "We bespreken uw aanvraag en plannen samen een afspraak. Uw online aanvraag is nog geen bevestigde afspraak."}</p></li>
            <li><span aria-hidden="true">03</span><h3>{en ? "Meet your care team" : "Maak kennis met ons"}</h3><p>{en ? "Tell us about your wishes and any concerns. Together, we discuss the next steps for your dental care." : "Vertel ons uw wensen en eventuele zorgen. Samen bespreken we de vervolgstappen voor uw mondzorg."}</p></li>
          </ol>
        </div>
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
              <Link className="arrow-link" href={href("/kind-wil-niet-tandenpoetsen/")}>{en ? "Read the article" : "Lees het artikel"} <ArrowUpRightIcon /></Link>
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
        <div className="shell visit-finale" data-reveal>
          <div>
            <p className="eyebrow">{en ? "Welcome to Veenendaal" : "Welkom in Veenendaal"}</p>
            <h2>{en ? <>Your next step?<br /><em>We are here.</em></> : <>Uw volgende stap?<br /><em>Wij staan klaar.</em></>}</h2>
            <div className="actions">
              <Link className="button button-light" href={href("/maak-een-afspraak-1/#afspraak")}>{en ? "Request an appointment" : "Vraag een afspraak aan"} <ArrowUpRightIcon /></Link>
              <a className="text-link text-link-light" href="tel:+31318501376">0318 501376</a>
            </div>
          </div>
          <div className="visit-details">
            <div><p className="eyebrow">{en ? "Find us" : "U vindt ons hier"}</p><address>Wolweg 29<br />3901 TD Veenendaal</address><a className="arrow-link" href="https://www.google.com/maps/dir/?api=1&destination=Wolweg%2029%2C%203901%20TD%20Veenendaal" target="_blank" rel="noopener noreferrer">{en ? "Get directions" : "Plan uw route"} <ArrowUpRightIcon /></a></div>
            <div><p className="eyebrow">{en ? "Opening hours" : "Openingstijden"}</p><p>{en ? "Monday – Friday" : "Maandag – vrijdag"}<br />08:30 – 17:00</p><p className="visit-hours-note">{en ? "Saturday: dental hygienist by appointment." : "Zaterdag: mondhygiënist op afspraak."}</p><Link className="text-link" href={href("/contact/")}>{en ? "All contact details" : "Alle contactgegevens"}</Link></div>
          </div>
        </div>
      </section>
    </main>
  );
}

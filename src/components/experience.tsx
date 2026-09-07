"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent, type RefObject } from "react";
import { localizedPath, type Locale } from "@/i18n/config";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon, ChevronDownIcon } from "@/components/ui-icons";

const EnamelCanvas = dynamic(() => import("./enamel-canvas"), {
  ssr: false,
  loading: () => <div className="enamel-fallback" aria-hidden="true" />,
});

export function MotionDirector() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.motion = "ready";
    return () => { delete root.dataset.motion; };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    document.querySelectorAll<HTMLDetailsElement>("details.mobile-menu[open]").forEach((menu) => menu.removeAttribute("open"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const shouldReduceMotion = () => reducedMotion.matches || (
      process.env.NODE_ENV !== "production" && new URLSearchParams(window.location.search).get("motion") === "reduce"
    );
    const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const cleanups: Array<() => void> = [];
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    const progress = document.querySelector<HTMLElement>("[data-scroll-progress]");
    const hero = document.querySelector<HTMLElement>("[data-hero-scroll]");
    const cursor = document.querySelector<HTMLElement>("[data-cursor-follower]");

    document.querySelectorAll<HTMLAnchorElement>(".desktop-nav a, .mobile-menu-panel nav a").forEach((link) => {
      const linkPath = new URL(link.href).pathname;
      const active = linkPath === "/" ? pathname === "/" : pathname.startsWith(linkPath);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    const revealAll = () => reveals.forEach((element) => { element.dataset.revealed = "true"; });
    root.dataset.reducedMotion = String(shouldReduceMotion());
    if (shouldReduceMotion()) {
      revealAll();
    } else {
      const observer = new IntersectionObserver(
        (entries) => entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealed = "true";
            observer.unobserve(entry.target);
          }
        }),
        { rootMargin: "0px 0px -10%", threshold: 0.08 },
      );
      reveals.forEach((element) => observer.observe(element));
      cleanups.push(() => observer.disconnect());
    }

    const visibilityObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) (entry.target as HTMLElement).dataset.motionVisible = "true";
        else delete (entry.target as HTMLElement).dataset.motionVisible;
      }),
      { rootMargin: "120px" },
    );
    document.querySelectorAll<HTMLElement>("[data-pointer-reactive], [data-tilt]").forEach((element) => visibilityObserver.observe(element));
    cleanups.push(() => visibilityObserver.disconnect());

    const storyRoot = document.querySelector<HTMLElement>("[data-story-root]");
    const storySteps = Array.from(document.querySelectorAll<HTMLElement>("[data-story-step]"));
    if (storyRoot && storySteps.length) {
      const storyObserver = new IntersectionObserver(
        (entries) => entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = storySteps.indexOf(entry.target as HTMLElement);
          storyRoot.dataset.storyActive = String(index);
          storySteps.forEach((step, stepIndex) => step.dataset.active = String(stepIndex === index));
        }),
        { rootMargin: "-32% 0px -46%", threshold: 0.05 },
      );
      storySteps.forEach((step) => storyObserver.observe(step));
      storyRoot.dataset.storyActive = "0";
      storySteps[0].dataset.active = "true";
      cleanups.push(() => storyObserver.disconnect());
    }

    if (finePointer.matches) {
      let pointerFrame = 0;
      let pointerX = window.innerWidth / 2;
      let pointerY = window.innerHeight / 2;
      let reactiveTarget: HTMLElement | null = null;
      let magneticTarget: HTMLElement | null = null;
      let tiltTarget: HTMLElement | null = null;
      let directionalTarget: HTMLElement | null = null;

      const resetTarget = (target: HTMLElement | null, properties: string[]) => {
        if (!target) return;
        properties.forEach((property) => target.style.removeProperty(property));
        delete target.dataset.pointerActive;
      };

      const paintPointer = () => {
        root.style.setProperty("--cursor-x", `${pointerX}px`);
        root.style.setProperty("--cursor-y", `${pointerY}px`);

        if (reactiveTarget?.dataset.motionVisible === "true") {
          const bounds = reactiveTarget.getBoundingClientRect();
          const x = Math.max(0, Math.min(1, (pointerX - bounds.left) / bounds.width));
          const y = Math.max(0, Math.min(1, (pointerY - bounds.top) / bounds.height));
          reactiveTarget.style.setProperty("--pointer-x", `${x * 100}%`);
          reactiveTarget.style.setProperty("--pointer-y", `${y * 100}%`);
          reactiveTarget.style.setProperty("--pointer-nx", `${x * 2 - 1}`);
          reactiveTarget.style.setProperty("--pointer-ny", `${y * 2 - 1}`);
          reactiveTarget.style.setProperty("--pointer-depth-x", `${(x * 2 - 1) * 14}px`);
          reactiveTarget.style.setProperty("--pointer-depth-y", `${(y * 2 - 1) * 11}px`);
          reactiveTarget.style.setProperty("--pointer-depth-x-soft", `${(x * 2 - 1) * -6}px`);
          reactiveTarget.style.setProperty("--pointer-depth-y-soft", `${(y * 2 - 1) * -5}px`);
        }

        if (magneticTarget) {
          const bounds = magneticTarget.getBoundingClientRect();
          magneticTarget.style.setProperty("--magnetic-x", `${(pointerX - bounds.left - bounds.width / 2) * 0.12}px`);
          magneticTarget.style.setProperty("--magnetic-y", `${(pointerY - bounds.top - bounds.height / 2) * 0.12}px`);
        }

        if (tiltTarget?.dataset.motionVisible === "true") {
          const bounds = tiltTarget.getBoundingClientRect();
          const x = Math.max(-1, Math.min(1, ((pointerX - bounds.left) / bounds.width) * 2 - 1));
          const y = Math.max(-1, Math.min(1, ((pointerY - bounds.top) / bounds.height) * 2 - 1));
          tiltTarget.style.setProperty("--tilt-x", `${y * -3}deg`);
          tiltTarget.style.setProperty("--tilt-y", `${x * 4}deg`);
          tiltTarget.style.setProperty("--tilt-shift-x", `${x * 6}px`);
          tiltTarget.style.setProperty("--tilt-shift-y", `${y * 5}px`);
        }
        if (directionalTarget) {
          const bounds = directionalTarget.getBoundingClientRect();
          directionalTarget.style.setProperty("--direction-x", `${Math.max(0, Math.min(100, ((pointerX - bounds.left) / bounds.width) * 100))}%`);
          directionalTarget.style.setProperty("--direction-y", `${Math.max(0, Math.min(100, ((pointerY - bounds.top) / bounds.height) * 100))}%`);
        }
        pointerFrame = 0;
      };

      const move = (event: globalThis.PointerEvent) => {
        if (shouldReduceMotion() || event.pointerType === "touch") return;
        pointerX = event.clientX;
        pointerY = event.clientY;
        const target = event.target instanceof Element ? event.target : null;
        const nextReactive = target?.closest<HTMLElement>("[data-pointer-reactive]") ?? null;
        const nextMagnetic = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
        const nextTilt = target?.closest<HTMLElement>("[data-tilt]") ?? null;
        const nextDirectional = target?.closest<HTMLElement>("[data-directional]") ?? null;

        if (reactiveTarget !== nextReactive) resetTarget(reactiveTarget, ["--pointer-x", "--pointer-y", "--pointer-nx", "--pointer-ny", "--pointer-depth-x", "--pointer-depth-y", "--pointer-depth-x-soft", "--pointer-depth-y-soft"]);
        if (magneticTarget !== nextMagnetic) resetTarget(magneticTarget, ["--magnetic-x", "--magnetic-y"]);
        if (tiltTarget !== nextTilt) resetTarget(tiltTarget, ["--tilt-x", "--tilt-y", "--tilt-shift-x", "--tilt-shift-y"]);
        if (directionalTarget !== nextDirectional) resetTarget(directionalTarget, ["--direction-x", "--direction-y"]);
        reactiveTarget = nextReactive;
        magneticTarget = nextMagnetic;
        tiltTarget = nextTilt;
        directionalTarget = nextDirectional;
        reactiveTarget?.setAttribute("data-pointer-active", "true");
        magneticTarget?.setAttribute("data-pointer-active", "true");
        tiltTarget?.setAttribute("data-pointer-active", "true");
        directionalTarget?.setAttribute("data-pointer-active", "true");
        if (cursor) cursor.dataset.overInteractive = String(Boolean(target?.closest("a, button, summary, [data-tilt]")));
        if (!pointerFrame) pointerFrame = requestAnimationFrame(paintPointer);
      };

      const leave = () => {
        resetTarget(reactiveTarget, ["--pointer-x", "--pointer-y", "--pointer-nx", "--pointer-ny", "--pointer-depth-x", "--pointer-depth-y", "--pointer-depth-x-soft", "--pointer-depth-y-soft"]);
        resetTarget(magneticTarget, ["--magnetic-x", "--magnetic-y"]);
        resetTarget(tiltTarget, ["--tilt-x", "--tilt-y", "--tilt-shift-x", "--tilt-shift-y"]);
        resetTarget(directionalTarget, ["--direction-x", "--direction-y"]);
        reactiveTarget = null;
        magneticTarget = null;
        tiltTarget = null;
        directionalTarget = null;
        if (cursor) cursor.dataset.visible = "false";
      };
      const enter = () => { if (cursor) cursor.dataset.visible = "true"; };
      const updatePointerMotion = () => {
        const shouldReduce = shouldReduceMotion();
        root.dataset.reducedMotion = String(shouldReduce);
        if (shouldReduce) {
          leave();
          revealAll();
        }
      };

      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerenter", enter);
      window.addEventListener("blur", leave);
      document.documentElement.addEventListener("pointerleave", leave);
      reducedMotion.addEventListener("change", updatePointerMotion);
      cleanups.push(() => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("blur", leave);
        document.documentElement.removeEventListener("pointerenter", enter);
        document.documentElement.removeEventListener("pointerleave", leave);
        reducedMotion.removeEventListener("change", updatePointerMotion);
        if (pointerFrame) cancelAnimationFrame(pointerFrame);
      });
    }

    let scrollFrame = 0;
    let previousY = window.scrollY;
    const paintScroll = () => {
      const currentY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress?.style.setProperty("--scroll-progress", String(currentY / maxScroll));
      if (header) {
        header.dataset.scrolled = String(currentY > 18);
        if (Math.abs(currentY - previousY) > 7) header.dataset.scrollDirection = currentY > previousY && currentY > 160 ? "down" : "up";
      }
      if (hero && !shouldReduceMotion()) {
        const bounds = hero.getBoundingClientRect();
        const heroProgress = Math.max(0, Math.min(1, -bounds.top / Math.max(1, bounds.height * 0.82)));
        hero.style.setProperty("--hero-depth-y", `${heroProgress * 78}px`);
        hero.style.setProperty("--hero-copy-y", `${heroProgress * -32}px`);
        hero.style.setProperty("--hero-line-shift", `${heroProgress * 48}px`);
        hero.style.setProperty("--hero-opacity", `${1 - heroProgress * 0.42}`);
        hero.style.setProperty("--hero-scale", `${1 - heroProgress * 0.055}`);
        hero.style.setProperty("--tooth-scroll-y", `${heroProgress * -8}px`);
        hero.style.setProperty("--tooth-scroll-rotate", `${heroProgress * 1.4}deg`);
      }
      previousY = currentY;
      scrollFrame = 0;
    };
    const onScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(paintScroll); };
    window.addEventListener("scroll", onScroll, { passive: true });
    paintScroll();
    cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
    });

    return () => {
      root.style.removeProperty("--cursor-x");
      root.style.removeProperty("--cursor-y");
      delete root.dataset.reducedMotion;
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [pathname]);

  return null;
}

export function EnamelStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [webglSupported, setWebglSupported] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    updateMotion();
    motionQuery.addEventListener("change", updateMotion);

    const webglFrame = window.requestAnimationFrame(() => {
      try {
        const testCanvas = document.createElement("canvas");
        setWebglSupported(Boolean(testCanvas.getContext("webgl2") || testCanvas.getContext("webgl")));
      } catch {
        setWebglSupported(false);
      }
    });

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "180px" },
    );
    observer.observe(stage);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(webglFrame);
      motionQuery.removeEventListener("change", updateMotion);
    };
  }, []);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerRef.current.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointerRef.current.y = -(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
  };

  const onPointerLeave = () => {
    pointerRef.current.x = 0;
    pointerRef.current.y = 0;
  };

  return (
    <div
      ref={stageRef}
      className="enamel-stage"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-label="Abstracte porseleinen sculptuur, geïnspireerd op een glimlach"
      role="img"
    >
      {webglSupported ? (
        <EnamelCanvas
          active={active}
          pointerRef={pointerRef as RefObject<{ x: number; y: number }>}
          reducedMotion={reducedMotion}
        />
      ) : <div className="enamel-fallback" aria-hidden="true" />}
      <div className="enamel-stage-note" aria-hidden="true">
        <span>01</span>
        <span>Precisie met een zachte hand</span>
      </div>
    </div>
  );
}

const weekdayNames = {
  nl: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

type ClinicStatus = {
  day: string;
  isOpen: boolean;
  time: string;
  todayHours: string;
  nextOpen: string;
};

function getClinicStatus(locale: Locale): ClinicStatus {
  const names = weekdayNames[locale];
  const parts = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "nl-NL", {
    timeZone: "Europe/Amsterdam",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  const day = value("weekday");
  const dayIndex = Math.max(0, names.findIndex((name) => name.toLowerCase() === day.toLowerCase()));
  const minutes = Number(value("hour")) * 60 + Number(value("minute"));
  const isWeekday = dayIndex >= 1 && dayIndex <= 5;
  const isOpen = isWeekday && minutes >= 8 * 60 + 30 && minutes < 17 * 60;
  const todayHours = isWeekday ? "08:30–17:00" : dayIndex === 6 ? (locale === "en" ? "By appointment only" : "Alleen op afspraak") : (locale === "en" ? "Closed" : "Gesloten");

  let nextOpen = "";
  if (!isOpen) {
    if (isWeekday && minutes < 8 * 60 + 30) nextOpen = locale === "en" ? "Today at 08:30" : "Vandaag om 08:30";
    else {
      for (let offset = 1; offset <= 7; offset += 1) {
        const candidate = (dayIndex + offset) % 7;
        if (candidate >= 1 && candidate <= 5) {
          nextOpen = `${offset === 1 ? (locale === "en" ? "Tomorrow" : "Morgen") : names[candidate]} ${locale === "en" ? "at" : "om"} 08:30`;
          break;
        }
      }
    }
  }

  return {
    day,
    isOpen,
    time: `${value("hour")}:${value("minute")}`,
    todayHours,
    nextOpen,
  };
}

export function LiveClinicStatus({ compact = false, locale = "nl" }: { compact?: boolean; locale?: Locale }) {
  const [status, setStatus] = useState<ClinicStatus | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const update = () => setStatus(getClinicStatus(locale));
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, [locale]);

  return (
    <div className={compact ? "live-status live-status-compact" : "live-status"} data-open={String(status?.isOpen ?? false)}>
      <button
        aria-expanded={expanded}
        className="live-status-trigger"
        onClick={() => setExpanded((value) => !value)}
        type="button"
      >
        <span className="live-status-dot" aria-hidden="true" />
        <span aria-live="polite">
          <strong>{status ? (status.isOpen ? (locale === "en" ? "Open now" : "Nu geopend") : (locale === "en" ? "Closed" : "Gesloten")) : (locale === "en" ? "Practice status" : "Praktijkstatus")}</strong>
          <small>{status ? `${status.time} · ${locale === "en" ? "Today" : "Vandaag"} ${status.todayHours}` : (locale === "en" ? "Loading local time" : "Lokale tijd wordt geladen")}</small>
        </span>
        <ChevronDownIcon className="live-status-chevron" />
      </button>
      <div className="live-status-detail" hidden={!expanded}>
        <p><strong>{status ? `${locale === "en" ? "Today" : "Vandaag"}, ${status.day}` : (locale === "en" ? "Today" : "Vandaag")}</strong><span>{status?.todayHours ?? "—"}</span></p>
        {!status?.isOpen && status?.nextOpen ? <p><span>{locale === "en" ? "Reopens" : "Weer geopend"}</span><strong>{status.nextOpen}</strong></p> : null}
        <div>
          <a href="tel:+31318501376">{locale === "en" ? "Call 0318 501376" : "Bel 0318 501376"}</a>
          <Link href={localizedPath(locale, "/maak-een-afspraak-1/")}>{locale === "en" ? "Appointment" : "Afspraak"} <ArrowUpRightIcon /></Link>
        </div>
      </div>
    </div>
  );
}

export type TreatmentPreview = {
  name: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
};

export function TreatmentIndex({ treatments, locale = "nl" }: { treatments: TreatmentPreview[]; locale?: Locale }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = treatments[activeIndex] ?? treatments[0];
  const previewRef = useRef<HTMLDivElement>(null);
  const pointerFrameRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (pointerFrameRef.current !== null) window.cancelAnimationFrame(pointerFrameRef.current);
  }, []);

  const movePreview = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || document.documentElement.dataset.reducedMotion === "true" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const preview = previewRef.current;
    if (!preview) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1));
    const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1));
    if (pointerFrameRef.current !== null) window.cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = window.requestAnimationFrame(() => {
      preview.style.setProperty("--preview-shift-x", `${x * 11}px`);
      preview.style.setProperty("--preview-shift-y", `${y * 8.5}px`);
      pointerFrameRef.current = null;
    });
  };

  return (
    <div className="treatment-index" onPointerLeave={() => {
      previewRef.current?.style.removeProperty("--preview-shift-x");
      previewRef.current?.style.removeProperty("--preview-shift-y");
    }} onPointerMove={movePreview}>
      <div className="treatment-index-list" role="list">
        {treatments.map((treatment, index) => (
          <Link
            className={index === activeIndex ? "treatment-row is-active" : "treatment-row"}
            data-directional
            href={treatment.href}
            key={treatment.href}
            onClick={(event) => {
              if (window.matchMedia("(hover: none), (pointer: coarse)").matches && activeIndex !== index) {
                event.preventDefault();
                setActiveIndex(index);
              }
            }}
            onFocus={() => setActiveIndex(index)}
            onMouseEnter={() => setActiveIndex(index)}
            role="listitem"
          >
            <span className="treatment-number">{String(index + 1).padStart(2, "0")}</span>
            <span>
              <strong>{treatment.name}</strong>
              <small>{treatment.description}</small>
            </span>
            <span className="arrow-mark" aria-hidden="true"><span>{locale === "en" ? "View" : "Bekijk"}</span><ArrowUpRightIcon /></span>
          </Link>
        ))}
      </div>
      {active ? (
        <div className="treatment-preview" data-pointer-reactive ref={previewRef}>
          {/* A plain img avoids coupling this frequently changing preview to the image loader. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={active.imageAlt}
            className="treatment-preview-image"
            decoding="async"
            key={active.href}
            loading="lazy"
            src={active.image}
          />
          <span aria-live="polite">{active.name}</span>
        </div>
      ) : null}
    </div>
  );
}

export type Testimonial = { quote: string; author: string };

export function TestimonialsCarousel({ reviews, locale = "nl" }: { reviews: Testimonial[]; locale?: Locale }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);
  const dragOffset = useRef(0);

  const select = (index: number) => {
    const next = (index + reviews.length) % reviews.length;
    setActiveIndex(next);
    dragOffset.current = 0;
    trackRef.current?.style.removeProperty("--review-drag");
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest("button, a")) return;
    dragStart.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = "true";
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    dragOffset.current = Math.max(-120, Math.min(120, event.clientX - dragStart.current));
    trackRef.current?.style.setProperty("--review-drag", `${dragOffset.current}px`);
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    if (Math.abs(dragOffset.current) > 42) select(activeIndex + (dragOffset.current < 0 ? 1 : -1));
    else trackRef.current?.style.removeProperty("--review-drag");
    dragStart.current = null;
    dragOffset.current = 0;
    delete event.currentTarget.dataset.dragging;
  };

  return (
    <div
      aria-label={locale === "en" ? "Patient stories" : "Patiëntervaringen"}
      className="reviews-carousel"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          select(activeIndex - 1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          select(activeIndex + 1);
        }
      }}
      onPointerCancel={finishDrag}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishDrag}
      role="region"
      tabIndex={0}
    >
      <div className="reviews-viewport">
        <div className="reviews-track" ref={trackRef} style={{ "--review-offset": `${activeIndex * -100}%` } as CSSProperties}>
          {reviews.map((review, index) => (
            <blockquote aria-hidden={index !== activeIndex} key={review.author}>
              <span className="quote-mark" aria-hidden="true">“</span>
              <p>{review.quote}</p>
              <footer><span>{String(index + 1).padStart(2, "0")}</span>{review.author}</footer>
            </blockquote>
          ))}
        </div>
      </div>
      <div className="reviews-controls">
        <p aria-live="polite"><span>{String(activeIndex + 1).padStart(2, "0")}</span> / {String(reviews.length).padStart(2, "0")}</p>
        <div>
          <button aria-label={locale === "en" ? "Previous story" : "Vorige ervaring"} onClick={() => select(activeIndex - 1)} type="button"><ArrowLeftIcon /></button>
          <button aria-label={locale === "en" ? "Next story" : "Volgende ervaring"} onClick={() => select(activeIndex + 1)} type="button"><ArrowRightIcon /></button>
        </div>
      </div>
    </div>
  );
}

export function BookingChoice({ locale = "nl" }: { locale?: Locale }) {
  const choices = [
    {
      id: "afspraak",
      label: locale === "en" ? "Existing patient" : "Bestaande patiënt",
      title: locale === "en" ? "Make an appointment" : "Maak een afspraak",
      src: "https://internetagenda.vertimart.nl/?id=20619",
    },
    {
      id: "inschrijven",
      label: locale === "en" ? "New patient" : "Nieuwe patiënt",
      title: locale === "en" ? "Register with us" : "Schrijf u in",
      src: "https://internetagenda.vertimart.nl/inschrijven?id=20619",
    },
  ];
  const [active, setActive] = useState(choices[0]);

  useEffect(() => {
    const syncHash = () => {
      if (window.location.hash === "#inschrijven") setActive(choices[1]);
      if (window.location.hash === "#afspraak") setActive(choices[0]);
    };
    const frame = window.requestAnimationFrame(syncHash);
    window.addEventListener("hashchange", syncHash);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", syncHash);
    };
  // The source choices are constant presentation data.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="booking-panel" id={active.id} aria-labelledby="booking-title">
      <div className="booking-tabs" role="tablist" aria-label={locale === "en" ? "Choose your appointment type" : "Kies uw afspraaktype"}>
        {choices.map((choice) => (
          <button
            aria-controls="booking-frame"
            aria-selected={active.id === choice.id}
            className={active.id === choice.id ? "is-active" : ""}
            id={`tab-${choice.id}`}
            key={choice.id}
            onClick={() => {
              setActive(choice);
              window.history.replaceState(null, "", `#${choice.id}`);
            }}
            role="tab"
            type="button"
          >
            {choice.label}
          </button>
        ))}
      </div>
      <div className="booking-frame-wrap">
        <div className="booking-frame-heading" key={active.id}>
          <p className="eyebrow">{locale === "en" ? "Secure online calendar" : "Veilige online agenda"}</p>
          <h2 id="booking-title">{active.title}</h2>
        </div>
        <iframe
          aria-label={active.title}
          id="booking-frame"
          key={active.src}
          loading="lazy"
          src={active.src}
          title={active.title}
        />
      </div>
    </section>
  );
}

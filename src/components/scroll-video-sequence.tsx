"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";

const clamp = (value: number, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));
const mix = (from: number, to: number, progress: number) => from + (to - from) * clamp(progress);
const phaseProgress = (progress: number, start: number, end: number) => clamp((progress - start) / (end - start));

export function ScrollVideoSequence({ locale = "nl" }: { locale?: Locale }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressNumberRef = useRef<HTMLSpanElement>(null);
  const userPausedRef = useRef(false);
  const activeRef = useRef(false);
  const reducedMotionRef = useRef(true);
  const loadRequestedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const video = videoRef.current;
    if (!section || !sticky || !video) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let renderedProgress = 0;
    let currentPhase = "anticipation";
    let disposed = false;
    const shouldReduceMotion = () => motionQuery.matches || (
      process.env.NODE_ENV !== "production" && new URLSearchParams(window.location.search).get("motion") === "reduce"
    );

    const ensureVideoLoaded = () => {
      if (loadRequestedRef.current) return;
      loadRequestedRef.current = true;
      section.dataset.videoLoading = "true";
      video.load();
    };

    const playSafely = () => {
      if (reducedMotionRef.current || userPausedRef.current || !activeRef.current || document.hidden) return;
      ensureVideoLoaded();
      const playPromise = video.play();
      if (playPromise) playPromise.catch(() => setIsPlaying(false));
    };

    const applyProgress = (progress: number) => {
      let x = 116;
      let scale = 0.86;
      let rotation = 2.4;
      let opacity = 0.58;
      let radius = 1.45;
      let depthY = 8;
      let mediaScale = 1.018;
      let phase = "anticipation";

      if (progress < 0.12) {
        const local = phaseProgress(progress, 0, 0.12);
        x = mix(116, 98, local);
        scale = mix(0.86, 0.88, local);
        rotation = mix(2.4, 1.9, local);
        opacity = mix(0.58, 0.76, local);
        depthY = mix(8, 5, local);
        mediaScale = mix(1.018, 1.016, local);
      } else if (progress < 0.35) {
        const local = phaseProgress(progress, 0.12, 0.35);
        phase = "entrance";
        x = mix(98, 0, local);
        scale = mix(0.88, 1, local);
        rotation = mix(1.9, 0, local);
        opacity = mix(0.76, 1, local);
        radius = mix(1.45, 0.8, local);
        depthY = mix(5, 0, local);
        mediaScale = mix(1.016, 1.014, local);
      } else if (progress < 0.68) {
        const local = phaseProgress(progress, 0.35, 0.68);
        phase = "center";
        x = 0;
        scale = mix(1, 1.03, local);
        rotation = 0;
        opacity = 1;
        radius = mix(0.8, 0.28, local);
        depthY = mix(0, -4, local);
        mediaScale = mix(1.014, 1.022, local);
      } else if (progress < 0.92) {
        const local = phaseProgress(progress, 0.68, 0.92);
        phase = "exit";
        x = mix(0, -122, local);
        scale = mix(1.03, 0.92, local);
        rotation = mix(0, -2.4, local);
        opacity = local < 0.72 ? 1 : mix(1, 0.18, phaseProgress(local, 0.72, 1));
        radius = mix(0.28, 1.2, local);
        depthY = mix(-4, -10, local);
        mediaScale = mix(1.022, 1.015, local);
      } else {
        const local = phaseProgress(progress, 0.92, 1);
        phase = "release";
        x = mix(-122, -130, local);
        scale = 0.92;
        rotation = -2.4;
        opacity = mix(0.18, 0, local);
        radius = 1.2;
        depthY = mix(-10, -12, local);
        mediaScale = 1.015;
      }

      const copyOpacity = Math.min(phaseProgress(progress, 0.27, 0.39), 1 - phaseProgress(progress, 0.7, 0.82));
      const cueOpacity = 1 - phaseProgress(progress, 0.14, 0.3);
      const nextOpacity = phaseProgress(progress, 0.75, 0.88);
      const anticipationOpacity = 1 - phaseProgress(progress, 0.22, 0.42);

      sticky.style.setProperty("--sequence-x", `${x}%`);
      sticky.style.setProperty("--sequence-scale", String(scale));
      sticky.style.setProperty("--sequence-rotate", `${rotation}deg`);
      sticky.style.setProperty("--sequence-opacity", String(opacity));
      sticky.style.setProperty("--sequence-radius", `${radius}rem`);
      sticky.style.setProperty("--sequence-depth-y", `${depthY}px`);
      sticky.style.setProperty("--sequence-media-scale", String(mediaScale));
      sticky.style.setProperty("--sequence-progress", String(progress));
      sticky.style.setProperty("--sequence-copy-opacity", String(Math.max(0, copyOpacity)));
      sticky.style.setProperty("--sequence-cue-opacity", String(cueOpacity));
      sticky.style.setProperty("--sequence-next-opacity", String(nextOpacity));
      sticky.style.setProperty("--sequence-anticipation-opacity", String(anticipationOpacity));

      if (progressNumberRef.current) progressNumberRef.current.textContent = String(Math.round(progress * 100)).padStart(2, "0");
      if (phase !== currentPhase) {
        section.dataset.sequencePhase = phase;
        currentPhase = phase;
      }
    };

    const getTargetProgress = () => {
      if (reducedMotionRef.current) return 0;
      const bounds = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      return clamp(-bounds.top / travel);
    };

    const render = () => {
      const targetProgress = getTargetProgress();
      const difference = targetProgress - renderedProgress;
      renderedProgress = Math.abs(difference) < 0.0006 ? targetProgress : renderedProgress + difference * 0.11;
      applyProgress(renderedProgress);
      animationFrame = Math.abs(targetProgress - renderedProgress) > 0.0006 ? requestAnimationFrame(render) : 0;
    };

    const scheduleRender = () => {
      if (disposed) return;
      if (!animationFrame) animationFrame = requestAnimationFrame(render);
    };

    const updateMotionPreference = () => {
      const shouldReduce = shouldReduceMotion();
      reducedMotionRef.current = shouldReduce;
      section.dataset.reducedMotion = String(shouldReduce);
      if (shouldReduce) {
        video.pause();
        renderedProgress = 0;
        applyProgress(0);
      } else {
        scheduleRender();
        playSafely();
      }
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        activeRef.current = entry.isIntersecting;
        section.dataset.sequenceActive = String(entry.isIntersecting);
        if (entry.isIntersecting) playSafely();
        else video.pause();
      },
      { rootMargin: "35% 0px", threshold: 0.01 },
    );

    const resizeObserver = new ResizeObserver(scheduleRender);
    const onVisibilityChange = () => {
      if (document.hidden) video.pause();
      else playSafely();
    };
    const onReady = () => {
      section.dataset.videoReady = "true";
      delete section.dataset.videoLoading;
      scheduleRender();
      playSafely();
    };

    motionQuery.addEventListener("change", updateMotionPreference);
    window.addEventListener("scroll", scheduleRender, { passive: true });
    window.addEventListener("resize", scheduleRender, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    video.addEventListener("canplay", onReady);
    visibilityObserver.observe(section);
    resizeObserver.observe(section);
    resizeObserver.observe(sticky);
    document.fonts.ready.then(scheduleRender).catch(() => undefined);
    updateMotionPreference();
    scheduleRender();

    return () => {
      disposed = true;
      motionQuery.removeEventListener("change", updateMotionPreference);
      window.removeEventListener("scroll", scheduleRender);
      window.removeEventListener("resize", scheduleRender);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      video.removeEventListener("canplay", onReady);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      if (animationFrame) cancelAnimationFrame(animationFrame);
      video.pause();
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPausedRef.current = false;
      if (!loadRequestedRef.current) {
        loadRequestedRef.current = true;
        sectionRef.current?.setAttribute("data-video-loading", "true");
        video.load();
      }
      const playPromise = video.play();
      if (playPromise) playPromise.catch(() => setIsPlaying(false));
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  };

  return (
    <section
      aria-labelledby="clinic-sequence-title"
      className="scroll-video-sequence"
      data-pointer-reactive
      data-sequence-phase="anticipation"
      ref={sectionRef}
    >
      <div className="scroll-video-sticky" ref={stickyRef}>
        <div className="sequence-grid" aria-hidden="true" />
        <div className="sequence-anticipation" aria-hidden="true" />

        <div className="sequence-frame">
          <div className="sequence-media">
            <video
              aria-describedby="clinic-sequence-description"
              aria-label={locale === "en" ? "Video impression of Mondzorgpraktijk Veenendaal" : "Video-impressie van Mondzorgpraktijk Veenendaal"}
              loop
              muted
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              playsInline
              poster="/videos/clinic-experience-poster.jpg"
              preload="none"
              ref={videoRef}
            >
              <source media="(max-width: 767px)" src="/videos/clinic-experience-mobile.mp4" type="video/mp4" />
              <source src="/videos/clinic-experience.mp4" type="video/mp4" />
              {locale === "en" ? "Your browser does not support this video." : "Uw browser ondersteunt deze video niet."}
            </video>
          </div>
        </div>

        <div className="sequence-editorial">
          <p className="eyebrow">{locale === "en" ? "Inside our practice" : "Binnen bij Mondzorg"}</p>
          <h2 id="clinic-sequence-title">{locale === "en" ? <>See the calm.<br /><em>Feel the care.</em></> : <>Rust ziet u.<br /><em>Aandacht voelt u.</em></>}</h2>
          <p id="clinic-sequence-description">{locale === "en" ? "A continuous impression of our calm, welcoming practice in Veenendaal." : "Een doorlopende impressie van onze rustige, huiselijke praktijk in Veenendaal."}</p>
        </div>

        <button
          aria-label={isPlaying ? (locale === "en" ? "Pause video" : "Video pauzeren") : (locale === "en" ? "Play video" : "Video afspelen")}
          className="sequence-play-toggle"
          data-playing={isPlaying}
          onClick={togglePlayback}
          type="button"
        >
          <span className="sequence-control-icon" aria-hidden="true"><i /><i /></span>
          <span>{isPlaying ? (locale === "en" ? "Pause" : "Pauzeer") : (locale === "en" ? "Play" : "Afspelen")}</span>
        </button>

        <div className="sequence-cue" aria-hidden="true">
          <span>{locale === "en" ? "Keep scrolling" : "Scroll verder"}</span>
          <i className="sequence-cue-line"><b /></i>
          <svg viewBox="0 0 16 16"><path d="m3 6 5 5 5-5" /></svg>
        </div>

        <div className="sequence-progress" aria-hidden="true">
          <span ref={progressNumberRef}>00</span>
          <i><b /></i>
          <small>100</small>
        </div>

        <p className="sequence-next-hint" aria-hidden="true"><span>{locale === "en" ? "Up next" : "Hierna"}</span> {locale === "en" ? "Personal care, step by step." : "Persoonlijke zorg, stap voor stap."}</p>
      </div>
    </section>
  );
}

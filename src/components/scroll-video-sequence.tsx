"use client";

import { Children, useEffect, useRef, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import styles from "./scroll-video-sequence.module.css";

// Scene windows follow the existing 52-second clinic film: entrance, lounge,
// treatment room, patient arrival, consultation, and the closing invitation.
// Gaps deliberately leave the picture alone; all timing is reversible by scroll.
const chapters = [
  { start: 0, end: .12, direction: 0 },
  { start: .15, end: .25, direction: -1 },
  { start: .28, end: .36, direction: 1 },
  { start: .39, end: .56, direction: 0 },
  { start: .60, end: .74, direction: 1 },
  { start: .84, end: 1, direction: 0 },
];

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function ScrollVideoSequence({ locale = "nl", children }: { locale?: Locale; children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;
    const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-video-panel]"));
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let disposed = false;
    let reduced = false;
    let priming = false;
    let unlocked = false;
    const touchDevice = window.matchMedia("(pointer: coarse)").matches;
    const startButton = root.querySelector<HTMLButtonElement>("[data-video-start]");

    // Seeking stays paused: scrolling is the only video clock, in either direction.
    const paint = () => {
      frame = 0;
      if (disposed || reduced) return;
      const sticky = root.firstElementChild as HTMLElement;
      const travel = Math.max(1, root.offsetHeight - sticky.offsetHeight);
      const stickyTop = parseFloat(getComputedStyle(sticky).top) || 0;
      const scrollProgress = clamp((stickyTop - root.getBoundingClientRect().top) / travel);
      const duration = Number.isFinite(video.duration) && video.duration > 0
        ? Math.max(0, video.duration - .04) : 0;
      const calm = document.documentElement.dataset.calm === "true";
      // Scroll owns the story clock. A delayed mobile decoder must never freeze
      // the copy or navigation. Only one seek is in flight; seeked picks up the
      // latest scroll position instead of replaying a backlog of stale targets.
      const progress = scrollProgress;
      root.style.setProperty("--film-progress", String(progress));
      root.style.setProperty("--film-exit", String(clamp((progress - .94) / .06)));
      let visibleOpacity = 0;
      panels.forEach((panel, index) => {
        const chapter = chapters[index];
        if (!chapter) return;
        const local = (progress - chapter.start) / (chapter.end - chapter.start);
        const inside = local >= 0 && local <= 1;
        const enter = index === 0 ? 1 : clamp(local / .22);
        const leave = index === panels.length - 1 ? 1 : 1 - clamp((local - .78) / .22);
        const opacity = inside ? Math.min(enter, leave) : 0;
        panel.style.setProperty("--panel-opacity", String(opacity));
        panel.style.setProperty("--panel-y", `${(1 - enter) * 16 - (1 - leave) * 12}px`);
        panel.style.setProperty("--panel-x", `${chapter.direction * (1 - enter) * 22}px`);
        const detail = index === 0 ? 1 : clamp((local - .12) / .22);
        panel.style.setProperty("--detail-opacity", String(detail));
        panel.style.setProperty("--detail-y", `${(1 - detail) * 10}px`);
        panel.inert = opacity < .1;
        panel.setAttribute("aria-hidden", String(opacity < .1));
        if (inside) root.dataset.scene = String(index);
        visibleOpacity = Math.max(visibleOpacity, opacity);
      });
      root.style.setProperty("--story-shade", String(.18 + visibleOpacity * .64));
      if (!priming) video.pause();
      if (!priming && duration > 0 && !video.seeking && !calm && root.dataset.videoError !== "true") {
        const time = scrollProgress * duration;
        const delta = time - video.currentTime;
        // Short mobile seeks avoid a single large jump after a touch fling.
        // The next seeked event continues toward the latest target, including
        // reverse scrolling, and stops as soon as that target is reached.
        const mobile = window.matchMedia("(max-width: 767px)").matches;
        const step = mobile ? Math.sign(delta) * Math.min(Math.abs(delta), .5) : delta;
        if (Math.abs(delta) > .035) video.currentTime += step;
      }
    };
    const schedule = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(paint);
    };
    const preference = () => {
      reduced = motion.matches || (process.env.NODE_ENV !== "production" && new URLSearchParams(location.search).get("motion") === "reduce");
      root.dataset.enhanced = String(!reduced);
      video.pause();
      if (reduced) {
        panels.forEach(panel => { panel.inert = false; panel.removeAttribute("aria-hidden"); });
      } else schedule();
    };
    // iPhone Safari may expose metadata yet refuse to decode a paused video
    // until playback has been activated by a real touch. Prime once during that
    // gesture, then immediately pause; scroll remains the playback clock.
    const unlock = () => {
      if (!touchDevice || unlocked || priming || reduced || disposed) return;
      priming = true;
      video.muted = true;
      video.play().then(() => {
        video.pause();
        priming = false;
        if (disposed) return;
        unlocked = true;
        root.dataset.videoActivation = "ready";
        schedule();
      }).catch(() => {
        priming = false;
        if (!disposed) root.dataset.videoActivation = "needed";
      });
    };
    root.addEventListener("touchstart", unlock, { passive: true });
    root.addEventListener("touchend", unlock, { passive: true });
    startButton?.addEventListener("click", unlock);
    const onError = () => { root.dataset.videoError = "true"; schedule(); };
    const resize = new ResizeObserver(schedule);
    resize.observe(root);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("clinic-motion-change", schedule);
    video.addEventListener("loadedmetadata", schedule);
    video.addEventListener("loadeddata", schedule);
    video.addEventListener("seeked", schedule);
    video.addEventListener("error", onError);
    motion.addEventListener("change", preference);
    preference();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      root.removeEventListener("touchstart", unlock);
      root.removeEventListener("touchend", unlock);
      startButton?.removeEventListener("click", unlock);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("clinic-motion-change", schedule);
      video.removeEventListener("loadedmetadata", schedule);
      video.removeEventListener("loadeddata", schedule);
      video.removeEventListener("seeked", schedule);
      video.removeEventListener("error", onError);
      motion.removeEventListener("change", preference);
      video.pause();
    };
  }, []);

  return (
    <section className={styles.hero} ref={rootRef} aria-label={locale === "en" ? "Welcome to our practice" : "Welkom in onze praktijk"}>
      <div className={styles.sticky}>
        <div className={styles.backdrop} aria-hidden="true">
          <video ref={videoRef} muted playsInline preload="auto" poster="/videos/clinic-experience-poster.webp" tabIndex={-1}>
            <source media="(max-width: 767px)" src="/videos/clinic-experience-scrub-mobile-v2.mp4" type="video/mp4" />
            <source src="/videos/clinic-experience-scrub.mp4" type="video/mp4" />
          </video>
        </div>
        <div className={styles.panels}>
          {Children.toArray(children).map((child, index) => (
            <div className={styles.panel} data-video-panel key={index}>{child}</div>
          ))}
        </div>
        <button className={styles.activate} data-video-start type="button">
          {locale === "en" ? "Enable scroll video" : "Activeer scrollvideo"}
        </button>
        <div className={styles.footer}>
          <span>{locale === "en" ? "Scroll to explore · scroll back to rewind" : "Scroll om te ontdekken · terug om terug te spoelen"}</span>
          <span aria-hidden="true" className={styles.progress}><i /></span>
          <a href="#treatments">{locale === "en" ? "Explore treatments ↓" : "Ontdek de behandelingen ↓"}</a>
        </div>
      </div>
    </section>
  );
}

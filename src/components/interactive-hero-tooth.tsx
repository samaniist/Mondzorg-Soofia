"use client";

import Image from "next/image";
import { useEffect, useRef, type PointerEvent } from "react";
import type { Locale } from "@/i18n/config";

export function InteractiveHeroTooth({ locale = "nl" }: { locale?: Locale }) {
  const figureRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const nextPose = useRef({
    rotateX: -0.8,
    rotateY: -1.2,
    moveX: 0,
    moveY: 0,
    glowX: 42,
    glowY: 30,
    orbitX: 0,
    orbitY: 0,
    shadowX: -2,
    shadowY: 13,
    perspectiveX: 50,
    perspectiveY: 46,
  });

  const paint = () => {
    const figure = figureRef.current;
    if (!figure) return;

    const pose = nextPose.current;
    figure.style.setProperty("--tooth-rotate-x", `${pose.rotateX}deg`);
    figure.style.setProperty("--tooth-rotate-y", `${pose.rotateY}deg`);
    figure.style.setProperty("--tooth-move-x", `${pose.moveX}px`);
    figure.style.setProperty("--tooth-move-y", `${pose.moveY}px`);
    figure.style.setProperty("--tooth-glow-x", `${pose.glowX}%`);
    figure.style.setProperty("--tooth-glow-y", `${pose.glowY}%`);
    figure.style.setProperty("--tooth-orbit-x", `${pose.orbitX}px`);
    figure.style.setProperty("--tooth-orbit-y", `${pose.orbitY}px`);
    figure.style.setProperty("--tooth-shadow-x", `${pose.shadowX}px`);
    figure.style.setProperty("--tooth-shadow-y", `${pose.shadowY}px`);
    figure.style.setProperty("--tooth-perspective-x", `${pose.perspectiveX}%`);
    figure.style.setProperty("--tooth-perspective-y", `${pose.perspectiveY}%`);
    frameRef.current = null;
  };

  const schedulePaint = () => {
    if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(paint);
  };

  const resetPose = () => {
    nextPose.current = {
      rotateX: -0.8,
      rotateY: -1.2,
      moveX: 0,
      moveY: 0,
      glowX: 42,
      glowY: 30,
      orbitX: 0,
      orbitY: 0,
      shadowX: -2,
      shadowY: 13,
      perspectiveX: 50,
      perspectiveY: 46,
    };
    schedulePaint();
  };

  useEffect(() => () => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
  }, []);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch" || document.documentElement.dataset.reducedMotion === "true" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1));
    const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1));

    nextPose.current = {
      rotateX: -0.8 + y * -4.8,
      rotateY: -1.2 + x * 4.8,
      moveX: x * 8.5,
      moveY: y * 6,
      glowX: 50 + x * 32,
      glowY: 42 + y * 28,
      orbitX: x * -10.5,
      orbitY: y * -8.5,
      shadowX: -2 + x * -11,
      shadowY: 13 + y * -7,
      perspectiveX: 50 + x * 14,
      perspectiveY: 46 + y * 11,
    };
    event.currentTarget.dataset.active = "true";
    schedulePaint();
  };

  const onPointerLeave = (event: PointerEvent<HTMLElement>) => {
    delete event.currentTarget.dataset.active;
    delete event.currentTarget.dataset.pressed;
    resetPose();
  };

  return (
    <figure
      ref={figureRef}
      className="hero-tooth-image"
      onPointerDown={(event) => { event.currentTarget.dataset.pressed = "true"; }}
      onPointerCancel={onPointerLeave}
      onPointerLeave={onPointerLeave}
      onPointerMove={onPointerMove}
      onPointerUp={(event) => { delete event.currentTarget.dataset.pressed; }}
    >
      <div className="hero-tooth-image-frame">
        <Image
          alt={locale === "en" ? "Glossy silver-and-gold dental sculpture" : "Glanzende zilver-gouden dentaalsculptuur"}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 46vw"
          src="/images/hero-tooth-floral.png"
        />
      </div>
      <span className="hero-tooth-glow" aria-hidden="true" />
      <span className="hero-tooth-orbit hero-tooth-orbit-one" aria-hidden="true" />
      <span className="hero-tooth-orbit hero-tooth-orbit-two" aria-hidden="true" />
    </figure>
  );
}

"use client";

import { useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/context/MotionPreferenceContext";

type AnimationDirection = "up" | "down" | "left" | "right" | "none";

type RevealOptions = {
  direction?: AnimationDirection;
  duration?: number;
  delay?: number;
  trigger?: RefObject<HTMLElement> | string;
  start?: string;
};

type StaggerRevealOptions = RevealOptions & {
  stagger?: number;
};

gsap.registerPlugin(ScrollTrigger);

type RefElement<T extends HTMLElement> = RefObject<T>;

function resolveTrigger(trigger: RevealOptions["trigger"], fallback: HTMLElement | null) {
  if (!trigger) {
    return fallback ?? undefined;
  }

  if (typeof trigger === "string") {
    return trigger;
  }

  return trigger.current ?? fallback ?? undefined;
}

function buildOffsets(direction: AnimationDirection) {
  switch (direction) {
    case "up":
      return { y: 50 };
    case "down":
      return { y: -50 };
    case "left":
      return { x: 50 };
    case "right":
      return { x: -50 };
    default:
      return {};
  }
}

export function useSectionReveal<T extends HTMLElement>(options: RevealOptions = {}) {
  const elementRef = useRef<T>(null);
  const shouldReduceMotion = useReducedMotion();
  const { direction = "up", duration = 1, delay = 0, trigger, start = "top 85%" } = options;

  // When animations are disabled, make sure the element is visible immediately
  useGSAP(() => {
    if (!elementRef.current) return;
    if (shouldReduceMotion) {
      // Kill any existing triggers on this element
      try {
        ScrollTrigger.getAll().forEach((t) => {
          if (t.vars?.trigger === elementRef.current) t.kill();
        });
      } catch {}
      gsap.set(elementRef.current, { clearProps: "all", autoAlpha: 1, x: 0, y: 0 });
    }
  }, { scope: elementRef, dependencies: [shouldReduceMotion] });

  useGSAP(
    () => {
      if (shouldReduceMotion) return;
      if (!elementRef.current) return;

      const offsets = buildOffsets(direction);
      const scrollerEl =
        (typeof document !== 'undefined' && document.getElementById('smooth-scroll-container')) || undefined;

      gsap.fromTo(
        elementRef.current,
        { autoAlpha: 0, ...offsets },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: resolveTrigger(trigger, elementRef.current),
            start,
            scroller: scrollerEl,
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: elementRef, dependencies: [shouldReduceMotion] },
  );

  return elementRef as RefElement<T>;
}

export function useStaggerReveal<T extends HTMLElement>(
  selector: string,
  options: StaggerRevealOptions = {},
) {
  const containerRef = useRef<T>(null);
  const shouldReduceMotion = useReducedMotion();
  const {
    direction = "up",
    duration = 0.8,
    delay = 0,
    stagger = 0.15,
    trigger,
    start = "top 80%",
  } = options;

  // When animations are disabled, make sure the items are visible immediately
  useGSAP(() => {
    if (!containerRef.current) return;
    if (shouldReduceMotion) {
      try {
        ScrollTrigger.getAll().forEach((t) => {
          if (t.vars?.trigger === containerRef.current) t.kill();
        });
      } catch {}
      const elements = gsap.utils.toArray<HTMLElement>(selector, containerRef.current);
      if (elements.length) gsap.set(elements, { clearProps: "all", autoAlpha: 1, x: 0, y: 0 });
    }
  }, { scope: containerRef, dependencies: [shouldReduceMotion] });

  useGSAP(
    () => {
      if (shouldReduceMotion) return;
      if (!containerRef.current) return;

      const offsets = buildOffsets(direction);
      const elements = gsap.utils.toArray<HTMLElement>(selector, containerRef.current);
      if (!elements.length) return;
      const scrollerEl =
        (typeof document !== 'undefined' && document.getElementById('smooth-scroll-container')) || undefined;

      gsap.fromTo(
        elements,
        { autoAlpha: 0, ...offsets },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration,
          delay,
          ease: "power2.out",
          stagger,
          immediateRender: false,
          scrollTrigger: {
            trigger: resolveTrigger(trigger, containerRef.current),
            start,
            scroller: scrollerEl,
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: containerRef, dependencies: [shouldReduceMotion] },
  );

  return containerRef as RefElement<T>;
}

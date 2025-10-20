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

  useGSAP(
    () => {
      if (shouldReduceMotion) return;
      if (!elementRef.current) return;

      const offsets = buildOffsets(direction);

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
          scrollTrigger: {
            trigger: resolveTrigger(trigger, elementRef.current),
            start,
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

  useGSAP(
    () => {
      if (shouldReduceMotion) return;
      if (!containerRef.current) return;

      const offsets = buildOffsets(direction);
      const elements = gsap.utils.toArray<HTMLElement>(selector, containerRef.current);
      if (!elements.length) return;

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
          scrollTrigger: {
            trigger: resolveTrigger(trigger, containerRef.current),
            start,
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: containerRef, dependencies: [shouldReduceMotion] },
  );

  return containerRef as RefElement<T>;
}

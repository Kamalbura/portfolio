"use client";

import { useLayoutEffect, type RefObject } from "react";
import SplitType from "split-type";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/context/MotionPreferenceContext";

gsap.registerPlugin(ScrollTrigger);

type HeroStoryboardRefs = {
  sectionRef: RefObject<HTMLElement | null>;
  headingRef: RefObject<HTMLElement | null>;
  subCopyRef: RefObject<HTMLDivElement | null>;
  badgesRef: RefObject<HTMLDivElement | null>;
  ctaRef: RefObject<HTMLDivElement | null>;
  gradientRef: RefObject<HTMLDivElement | null>;
  indicatorRef?: RefObject<HTMLDivElement | null>;
};

function collectChildren(node?: HTMLElement | null) {
  if (!node) return [] as HTMLElement[];
  return Array.from(node.children) as HTMLElement[];
}

export function useHeroStoryboard(refs: HeroStoryboardRefs) {
  const shouldReduceMotion = useReducedMotion();
  const {
    sectionRef,
    headingRef,
    subCopyRef,
    badgesRef,
    ctaRef,
    gradientRef,
    indicatorRef,
  } = refs;

  useLayoutEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const split = headingRef.current
      ? new SplitType(headingRef.current, { types: ["lines"] })
      : null;
    const headingTargets = (split?.lines ?? []) as HTMLElement[];

    const makeElementsVisible = () => {
      const immediateTargets: HTMLElement[] = [];
      immediateTargets.push(...headingTargets);
      immediateTargets.push(...collectChildren(subCopyRef.current));
      immediateTargets.push(...collectChildren(badgesRef.current));
      immediateTargets.push(...collectChildren(ctaRef.current));
      if (indicatorRef?.current) immediateTargets.push(indicatorRef.current);
      if (gradientRef.current) immediateTargets.push(gradientRef.current);

      immediateTargets.forEach((el) => {
        gsap.set(el, { clearProps: "all", opacity: 1, autoAlpha: 1, x: 0, y: 0, scale: 1 });
      });
    };

    if (shouldReduceMotion) {
      makeElementsVisible();
      return () => split?.revert();
    }

    const scroller =
      typeof document !== "undefined"
        ? document.getElementById("smooth-scroll-container") || undefined
        : undefined;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: sectionEl,
          start: "top top",
          end: "+=140%",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          scroller,
        },
      });

      timeline.add("intro", 0);

      if (gradientRef.current) {
        timeline.fromTo(
          gradientRef.current,
          { opacity: 0.35, yPercent: -10, filter: "blur(0px)" },
          { opacity: 1, yPercent: 15, filter: "blur(12px)", duration: 1.6 },
          "intro",
        );
      }

      if (headingTargets.length) {
        timeline.fromTo(
          headingTargets,
          { yPercent: 48, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 1.2, stagger: 0.08 },
          "intro+=0.1",
        );
      }

      const subCopyEls = collectChildren(subCopyRef.current);
      if (subCopyEls.length) {
        timeline.fromTo(
          subCopyEls,
          { y: 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.85, stagger: 0.12 },
          "intro+=0.4",
        );
      }

      const badgeEls = collectChildren(badgesRef.current);
      if (badgeEls.length) {
        timeline.fromTo(
          badgeEls,
          { y: 24, autoAlpha: 0, scale: 0.9 },
          { y: 0, autoAlpha: 1, scale: 1, duration: 0.6, stagger: 0.05 },
          "intro+=0.6",
        );
      }

      const ctaEls = collectChildren(ctaRef.current);
      if (ctaEls.length) {
        timeline.fromTo(
          ctaEls,
          { y: 20, autoAlpha: 0, scale: 0.94 },
          { y: 0, autoAlpha: 1, scale: 1, duration: 0.75, stagger: 0.08 },
          "intro+=0.8",
        );
      }

      if (indicatorRef?.current) {
        timeline.fromTo(
          indicatorRef.current,
          { y: 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8 },
          "intro+=1.1",
        );
      }
    }, sectionEl);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [shouldReduceMotion, sectionRef, headingRef, subCopyRef, badgesRef, ctaRef, gradientRef, indicatorRef]);
}

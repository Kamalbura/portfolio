'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Options = {
  start?: string;
  end?: string;
  stagger?: number;
  scrub?: boolean | number;
};

export function useScrollReveal(opts: Options = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: container,
          start: opts.start ?? 'top 80%',
          end: opts.end ?? 'top 20%',
          scrub: opts.scrub ?? true,
        },
      });

      tl.fromTo(
        lineRefs.current,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: opts.stagger ?? 0.08 },
      );
    }, container);

    return () => ctx.revert();
  }, [opts.start, opts.end, opts.stagger, opts.scrub]);

  const setLineRef = (el: HTMLSpanElement | null) => {
    if (el && !lineRefs.current.includes(el)) {
      lineRefs.current.push(el);
    }
  };

  return { containerRef, setLineRef };
}

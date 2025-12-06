import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/context/MotionPreferenceContext';

type LenisInternalScrollState = {
  scroll?: {
    y?: number;
    instance?: {
      scroll?: {
        y?: number;
      };
    };
  };
};

type LenisWithInternals = Lenis & LenisInternalScrollState;

type ScrollToOptions = Parameters<Lenis['scrollTo']>[1];

gsap.registerPlugin(ScrollTrigger);

export const useSmoothScroll = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const container = document.getElementById('smooth-scroll-container');
    if (container) {
      container.style.scrollBehavior = shouldReduceMotion ? 'auto' : '';
    }

    if (shouldReduceMotion) {
      // Ensure native scroll path and clear any ScrollTriggers
      try {
        ScrollTrigger.getAll().forEach((t) => t.kill());
        ScrollTrigger.defaults({ scroller: undefined as unknown as Element });
        ScrollTrigger.refresh(true);
      } catch {}
      document.documentElement.classList.remove('lenis-active');
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      wrapper: document.getElementById('smooth-scroll-container') ?? undefined,
      content: document.getElementById('smooth-scroll-content') ?? undefined,
      // Tuned for a slightly snappier yet smooth feel
      lerp: 0.12,
      wheelMultiplier: 1.25,
      smoothWheel: true,
      touchMultiplier: 1.8,
    });

  lenisRef.current = lenis;
  // Signal that Lenis is managing the scroll
  document.documentElement.classList.add('lenis-active');

    // Initialize Lenis smooth scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Tell ScrollTrigger to use the Lenis scroller container so pinning and scrubbed
    // timelines work correctly. We prefer the element with id `smooth-scroll-container`.
    const scrollerEl = document.getElementById('smooth-scroll-container');
    const contentEl = document.getElementById('smooth-scroll-content');
    if (scrollerEl && ScrollTrigger) {
      const lenisWithInternals = lenis as LenisWithInternals;

      const getLenisScrollY = () => {
        const { scroll } = lenisWithInternals;
        if (!scroll) return 0;
        if (typeof scroll.y === 'number') {
          return scroll.y;
        }
        const nestedY = scroll.instance?.scroll?.y;
        return typeof nestedY === 'number' ? nestedY : 0;
      };

      ScrollTrigger.scrollerProxy(scrollerEl, {
        // ScrollTrigger expects the getter/setter signature where the value may be undefined when used as a getter
        scrollTop(value?: number) {
          if (typeof value === 'number') {
            // When ScrollTrigger asks to scroll, delegate to Lenis
            try {
              lenis.scrollTo(value, { immediate: false });
            } catch {
              // ignore
            }
          }

          // Return the current virtual scroll position from Lenis
          return getLenisScrollY();
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        // Pinning strategy depends on how the content is transformed by Lenis
        pinType: (contentEl && getComputedStyle(contentEl).transform !== 'none') ? 'transform' : 'fixed',
      });

      // Default ScrollTrigger scroller for convenience when creating triggers
      ScrollTrigger.defaults({ scroller: scrollerEl });
      // Refresh measurements after Lenis initializes
      ScrollTrigger.addEventListener('refreshInit', () => lenis.raf(performance.now()));
      ScrollTrigger.refresh();
    }

    // Drive Lenis from the GSAP ticker to keep ScrollTrigger in sync
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(tickerCallback);
      try {
        // clean up ScrollTrigger proxies if we registered one
        const scrollerEl = document.getElementById('smooth-scroll-container');
        if (scrollerEl && ScrollTrigger) {
          // clear defaults to avoid leaking the element reference
          ScrollTrigger.defaults({ scroller: undefined as unknown as Element });
          ScrollTrigger.getAll().forEach((t) => t.kill());
        }
      } catch {
        // ignore cleanup errors
      }

      lenis.destroy();
      document.documentElement.classList.remove('lenis-active');
      if (lenisRef.current === lenis) {
        lenisRef.current = null;
      }
    };
  }, [shouldReduceMotion]);

  const scrollTo = (target: string | number, options?: ScrollToOptions) => {
    lenisRef.current?.scrollTo(target, options);
  };

  return { scrollTo };
};

export function useNativeSmoothScroll() {
  useEffect(() => {
    const el = document.getElementById('smooth-scroll-container');
    if (el) {
      el.style.scrollBehavior = 'smooth';
    }
  }, []);
}

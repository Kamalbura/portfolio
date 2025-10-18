import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useSmoothScroll = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (motionQuery.matches) {
      const container = document.getElementById('smooth-scroll-container');
      if (container) {
        container.style.scrollBehavior = 'auto';
      }
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;

    // Initialize Lenis smooth scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from the GSAP ticker to keep ScrollTrigger in sync
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        lenis.stop();
        lenis.off('scroll', ScrollTrigger.update);
        gsap.ticker.remove(tickerCallback);
        lenis.destroy();
        if (lenisRef.current === lenis) {
          lenisRef.current = null;
        }
      }
    };

    motionQuery.addEventListener('change', handleMotionPreferenceChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionPreferenceChange);
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      if (lenisRef.current === lenis) {
        lenisRef.current = null;
      }
    };
  }, []);

  const scrollTo = (target: string | number, options?: Record<string, unknown>) => {
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

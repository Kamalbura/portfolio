'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useReducedMotion } from '@/context/MotionPreferenceContext';

const SESSION_KEY = 'kb_preloader_seen';

export default function Preloader() {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !sessionStorage.getItem(SESSION_KEY);
  });

  const displayDuration = useMemo(() => (shouldReduceMotion ? 120 : 750), [shouldReduceMotion]);

  useEffect(() => {
    if (!isActive || typeof window === 'undefined') return;
    sessionStorage.setItem(SESSION_KEY, '1');
  }, [isActive]);

  useGSAP(
    () => {
      if (!isActive) return;

      if (shouldReduceMotion) {
        const timer = window.setTimeout(() => setIsActive(false), displayDuration);
        return () => window.clearTimeout(timer);
      }

      const overlay = containerRef.current;
      if (!overlay) return;

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.fromTo(
        '.preloader-logo',
        {
          autoAlpha: 0,
          y: 24,
          scale: 0.94,
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
        },
      )
        .to('.preloader-accent', { scaleX: 1, duration: 0.4 }, '-=0.25')
        .to(overlay, {
          autoAlpha: 0,
          duration: 0.35,
          delay: 0.15,
          onComplete: () => setIsActive(false),
        });

      return () => {
        tl.kill();
        gsap.set(overlay, { clearProps: 'all' });
      };
    },
    { dependencies: [isActive, shouldReduceMotion, displayDuration], scope: containerRef },
  );

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#0f172acc] to-[#020617] text-white"
      role="presentation"
      aria-hidden="true"
    >
      <div className="relative flex flex-col items-center gap-6">
        <div className="preloader-logo text-2xl font-semibold tracking-[0.6em] uppercase text-white/90">
          KB
        </div>
        <div className="preloader-accent h-[3px] w-32 origin-left scale-x-0 rounded-full bg-gradient-to-r from-[#fde047] via-[#fbbf24] to-[#f59e0b]" />
      </div>
    </div>
  );
}

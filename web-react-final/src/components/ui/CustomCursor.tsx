'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '@/context/MotionPreferenceContext';

const POINTER_QUERY = '(hover: hover) and (pointer: fine)';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const supportsPointer = window.matchMedia(POINTER_QUERY).matches;
    const prefersReducedMotion = shouldReduceMotion;

    if (!supportsPointer || prefersReducedMotion) {
      setActive(false);
      return;
    }

    setActive(true);
    document.body.classList.add('cursor-hidden');

    return () => {
      document.body.classList.remove('cursor-hidden');
    };
  }, [shouldReduceMotion]);

  useGSAP(
    () => {
      if (!active) return;

      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!dot || !ring) return;

      const move = (event: MouseEvent) => {
        const { clientX, clientY } = event;

        gsap.to(dot, { duration: 0.18, ease: 'power2.out', x: clientX, y: clientY });
        gsap.to(ring, { duration: 0.45, ease: 'power3.out', x: clientX, y: clientY });
      };

      const activate = () => {
        gsap.to(ring, { duration: 0.3, ease: 'power2.out', scale: 1.6, borderWidth: 1 });
        gsap.to(dot, { duration: 0.3, ease: 'power2.out', scale: 0.8 });
      };

      const deactivate = () => {
        gsap.to(ring, { duration: 0.4, ease: 'power3.out', scale: 1, borderWidth: 2 });
        gsap.to(dot, { duration: 0.4, ease: 'power3.out', scale: 1 });
      };

      window.addEventListener('mousemove', move);

      const interactiveElements = Array.from(
        document.querySelectorAll<HTMLElement>('a, button, .hover-target'),
      );

      interactiveElements.forEach((element) => {
        element.addEventListener('mouseenter', activate);
        element.addEventListener('mouseleave', deactivate);
      });

      return () => {
        window.removeEventListener('mousemove', move);
        interactiveElements.forEach((element) => {
          element.removeEventListener('mouseenter', activate);
          element.removeEventListener('mouseleave', deactivate);
        });
      };
    },
    { dependencies: [active] },
  );

  if (!active) {
    return null;
  }

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-yellow-300/80 bg-white/10 backdrop-blur-sm"
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300 shadow-[0_0_18px_rgba(255,235,167,0.45)]"
      />
    </>
  );
}

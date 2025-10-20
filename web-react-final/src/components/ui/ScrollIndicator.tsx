"use client";

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/context/MotionPreferenceContext';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollIndicator() {
  const barRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useGSAP(
    () => {
      if (shouldReduceMotion) return;

      const scroller = document.getElementById('smooth-scroll-container') || undefined;

      const st = ScrollTrigger.create({
        trigger: '#smooth-scroll-content',
        start: 'top top',
        end: 'bottom bottom',
        scroller,
        onUpdate: (self) => {
          if (!barRef.current) return;
          const progress = Math.min(Math.max(self.progress, 0), 1);
          barRef.current.style.transform = `scaleX(${progress})`;
        },
      });

      return () => st.kill();
    },
    { dependencies: [shouldReduceMotion] },
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 transition-transform duration-75 ease-out"
        aria-hidden="true"
      />
    </div>
  );
}

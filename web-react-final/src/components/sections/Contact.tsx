'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useReducedMotion } from '@/context/MotionPreferenceContext';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const copyRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useGSAP(
    () => {
      if (shouldReduceMotion) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'bottom center',
          scrub: true,
        },
      });

      tl.to(sectionRef.current, {
        duration: 1.2,
        ease: 'none',
        backgroundColor: '#ffeba7',
        color: '#111827',
      })
        .fromTo(
          headingRef.current,
          { autoAlpha: 0, scale: 0.92, yPercent: 10 },
          { autoAlpha: 1, scale: 1, yPercent: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.8',
        )
        .fromTo(
          copyRef.current,
          { autoAlpha: 0, yPercent: 12 },
          { autoAlpha: 1, yPercent: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.4',
        )
        .fromTo(
          ctaRef.current,
          { autoAlpha: 0, yPercent: 12 },
          { autoAlpha: 1, yPercent: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.4',
        );
    },
    { scope: sectionRef, dependencies: [shouldReduceMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden bg-gray-950 py-28 text-white transition-colors duration-700 md:py-40"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-4 text-center sm:px-6">
        <span className="text-xs uppercase tracking-[0.35em] text-yellow-300/80">The Coda</span>
        <h2
          ref={headingRef}
          id="contact-heading"
          className="text-4xl font-light tracking-tight sm:text-5xl md:text-6xl"
        >
          Let’s build the next breakthrough together.
        </h2>
        <p
          ref={copyRef}
          className="max-w-3xl text-base text-gray-300 md:text-lg"
        >
          Whether you need a research-grade interface, a production-ready IoT dashboard, or a partner to prototype impossible ideas, Kamal is ready to collaborate. Reach out—let’s turn intent into impact.
        </p>
        <div
          ref={ctaRef}
          className="flex flex-col items-center gap-8 md:flex-row md:gap-10"
        >
          <MagneticButton
            as="a"
            href="mailto:burakamal13@gmail.com?subject=Let%E2%80%99s%20Collaborate&body=Hi%20Kamal,"
            className="rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(17,17,23,0.18)] ring-2 ring-transparent transition hover:scale-105 hover:bg-gray-800 hover:text-yellow-200 focus-visible:outline-none focus-visible:ring-yellow-400"
          >
            Start a conversation
          </MagneticButton>
          <div className="flex items-center gap-6">
            <a
              href="https://linkedin.com/in/kamal-bura"
              target="_blank"
              rel="noreferrer"
              className="hover-target text-sm font-medium uppercase tracking-[0.28em] text-gray-300 transition hover:text-gray-900"
            >
              LinkedIn
            </a>
            <span className="h-px w-8 bg-current opacity-50" aria-hidden="true" />
            <a
              href="https://github.com/kamalbura"
              target="_blank"
              rel="noreferrer"
              className="hover-target text-sm font-medium uppercase tracking-[0.28em] text-gray-300 transition hover:text-gray-900"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

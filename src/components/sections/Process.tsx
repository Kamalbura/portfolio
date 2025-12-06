'use client';

import { useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '@/context/MotionPreferenceContext';

gsap.registerPlugin(ScrollTrigger);

type ProcessStep = {
  id: string;
  title: string;
  description: string;
};

const STEPS: ProcessStep[] = [
  {
    id: 'discovery',
    title: '01 · Discovery & Strategy',
    description:
      'Every build starts with clarity. I map problem constraints, stakeholders, and success metrics before writing a line of code.',
  },
  {
    id: 'design',
    title: '02 · Design & Prototyping',
    description:
      'Translate strategy into journeys, wireflows, and interactive prototypes that validate assumptions fast.',
  },
  {
    id: 'development',
    title: '03 · Development & Iteration',
    description:
      'Build the solution with modern stacks, obsessive component design, and automated checks to keep shipping velocity high.',
  },
  {
    id: 'launch',
    title: '04 · Deployment & Impact',
    description:
      'Release with confidence, measure adoption, and iterate with stakeholders until the solution is indispensable.',
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!sectionRef.current || !wrapperRef.current) return;
      if (typeof window === 'undefined') return;

      const steps = gsap.utils.toArray<HTMLElement>('.process-step', wrapperRef.current);
      if (!steps.length) return;

      if (shouldReduceMotion) {
        gsap.set(steps, { clearProps: 'all' });
        return;
      }

      // Initial hidden state with slight recede
      gsap.set(steps, { autoAlpha: 0, y: 80, scale: 0.95 });

      // Prefer Lenis scroller when active
      const scrollerEl = document.getElementById('smooth-scroll-container') || undefined;

      const timeline = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: wrapperRef.current,
          start: 'top top',
          // Slightly shorter total distance so it doesn't feel too slow
          end: `+=${steps.length * 85}%`,
          scrub: true,
          scroller: scrollerEl,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      steps.forEach((step, index) => {
        // Reveal with pop-forward
        timeline.to(
          step,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1.05,
            duration: 0.8,
          },
          index,
        );

        if (index < steps.length - 1) {
          // Hide with recede
          timeline.to(
            step,
            {
              autoAlpha: 0,
              y: -80,
              scale: 0.95,
              duration: 0.8,
            },
            index + 0.6,
          );
        }
      });
    },
    { scope: sectionRef, dependencies: [shouldReduceMotion] },
  );

  const renderSteps = useMemo(
    () =>
      STEPS.map((step) => (
        <div
          key={step.id}
          className="process-step absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          aria-hidden="true"
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
            {step.title}
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl">
            {step.description}
          </p>
        </div>
      )),
    [],
  );

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative bg-gray-950/70 backdrop-blur-[2px] py-24 sm:py-32 text-white overflow-hidden transition-colors"
      aria-labelledby="process-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,235,167,0.08),_transparent_55%)]" aria-hidden="true" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 md:mb-12 text-center sticky top-0 pt-4 pb-4 backdrop-blur-[1px] bg-transparent">
          <span className="text-xs uppercase tracking-[0.3em] text-yellow-300/70">Process</span>
          <h2 id="process-heading" className="mt-4 text-3xl sm:text-4xl md:text-5xl font-light text-white">
            Bringing ideas to field-ready products
          </h2>
          <p className="mt-6 text-base sm:text-lg text-gray-400 max-w-3xl mx-auto">
            A scroll-guided vignette of how I convert requirements into IoT and ML interfaces that teams can deploy quickly.
          </p>
        </div>
      </div>

      <div
        ref={wrapperRef}
        className={
          shouldReduceMotion
            ? 'relative py-12 sm:py-14'
            : 'relative min-h-[75vh] sm:min-h-[80vh] md:min-h-screen flex items-center justify-center'
        }
      >
        {shouldReduceMotion ? (
          <ol className="relative z-10 mx-auto grid max-w-4xl gap-6 sm:gap-8 text-left">
            {STEPS.map((step) => (
              <li
                key={step.id}
                className="rounded-3xl border border-white/10 bg-white/5 px-6 py-6 sm:px-8 sm:py-8 backdrop-blur-md"
              >
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-base sm:text-lg text-gray-300">{step.description}</p>
              </li>
            ))}
          </ol>
        ) : (
          <div className="relative w-full max-w-5xl h-[320px] sm:h-[360px] md:h-[420px] mx-auto">
            <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md" aria-hidden="true" />
            {renderSteps}
          </div>
        )}
      </div>
    </section>
  );
}

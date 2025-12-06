"use client";

import { useRef, useState, MouseEvent } from 'react';
import type { RefObject } from 'react';
import { useScroll } from '@/context/ScrollContext';
import ResumeViewer from '@/components/resume/ResumeViewer';
// Removed duplicate canvas import; using global HeroScene canvas
import { useHeroStoryboard } from '@/hooks/useHeroStoryboard';


const SKILLS = ['React', 'Node.js', 'Python', 'IoT', 'Edge ML', 'Firebase'];
const MANTRA = ['Kamal', 'Bura'];

export default function Hero() {
  const { scrollTo } = useScroll();
  const [showResume, setShowResume] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subCopyRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const mantraRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useHeroStoryboard({
    sectionRef,
    headingRef: headingRef as unknown as RefObject<HTMLElement>,
    subCopyRef,
    badgesRef,
    ctaRef,
    gradientRef,
    indicatorRef,
    mantraRef,
  });

  const handleResumeClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowResume(true);
  };

  const closeResume = () => setShowResume(false);

  const handleScrollTarget = (target: string) => {
    try {
      scrollTo(target);
    } catch {
      if (target.startsWith('#')) {
        window.location.hash = target.slice(1);
      } else {
        window.location.href = target;
      }
    }
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="hero-section relative min-h-screen overflow-hidden bg-transparent text-white"
      aria-labelledby="hero-heading"
    >
      <div ref={gradientRef} className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_rgba(255,235,167,0.12),_transparent_55%)]" aria-hidden="true" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-10 text-center">
        <div className="max-w-4xl space-y-8 sm:space-y-10 py-2">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.35em] text-yellow-300/80">Kamal Bura</span>
            <h1
              id="hero-heading"
              ref={headingRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-white leading-tight md:leading-[1.06] overflow-hidden"
            >
              Architecting connected experiences for classrooms and labs
            </h1>
          </div>

          <div ref={subCopyRef} className="space-y-2 sm:space-y-3">
            <p className="text-sm sm:text-base md:text-lg text-gray-300">
              Final-year Computer Science Engineering · Vasavi College of Engineering (2022 – 2026)
            </p>
            <p className="text-base sm:text-lg md:text-xl text-gray-300/90 leading-relaxed max-w-3xl mx-auto">
              I build IoT ecosystems and ML-backed interfaces that help teams measure conditions, act faster, and iterate with
              confidence.
            </p>
          </div>

          <div
            ref={mantraRef}
            className="relative flex items-center justify-center gap-8 pt-2 text-[0.65rem] sm:text-xs tracking-[0.5em] uppercase text-yellow-200/80"
            aria-hidden="true"
          >
            {MANTRA.map((word) => (
              <span key={word} data-word className="opacity-0">
                {word}
              </span>
            ))}
          </div>
          <span className="sr-only">Kamal Bura</span>

          <div ref={badgesRef} className="flex flex-wrap justify-center gap-1.5 sm:gap-2.5 md:gap-3.5">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-white/10 px-3 py-1 text-xs sm:text-sm font-medium uppercase tracking-wide text-gray-100"
              >
                {skill}
              </span>
            ))}
          </div>

            <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5 pt-2">
            <button
              onClick={() => handleScrollTarget('#projects')}
              className="rounded-full bg-yellow-300/95 px-6 py-3 text-sm sm:text-base font-semibold text-gray-900 transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-200 shadow-[0_12px_40px_rgba(250,220,100,0.12)] hover:shadow-[0_20px_60px_rgba(250,220,100,0.18)]"
            >
              View Projects
            </button>
            <button
              onClick={handleResumeClick}
              className="rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm sm:text-base font-medium text-white backdrop-blur transition-colors duration-200 hover:border-white/60"
            >
              View Resume
            </button>
            <button
              onClick={() => handleScrollTarget('#contact')}
              className="rounded-full px-6 py-3 text-sm sm:text-base font-medium text-white transition-colors duration-200 hover:text-yellow-200"
            >
              Get in Touch
            </button>
          </div>

          <div
            ref={indicatorRef}
            className="hidden sm:flex flex-col items-center gap-2 pt-8 text-xs tracking-[0.3em] text-gray-400"
          >
            <span>SCROLL TO EXPLORE</span>
            <span className="block h-10 w-px bg-gradient-to-b from-transparent via-gray-400 to-transparent" />
          </div>
        </div>
      </div>

      {showResume && <ResumeViewer onCloseAction={closeResume} />}
    </section>
  );
}

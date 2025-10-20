"use client";

import { useRef, useState, useEffect, MouseEvent } from 'react';
import { useScroll } from '@/context/ScrollContext';
import ResumeViewer from '@/components/resume/ResumeViewer';
// Removed duplicate canvas import; using global HeroScene canvas
import { useSplitText } from '@/hooks/useSplitText';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/context/MotionPreferenceContext';


const SKILLS = ['React', 'Node.js', 'Python', 'IoT', 'Edge ML', 'Firebase'];

export default function Hero() {
  const { scrollTo } = useScroll();
  const [showResume, setShowResume] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subCopyRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    setHasEntered(true);
  }, []);

  useSplitText(headingRef as unknown as React.RefObject<HTMLElement>, ['lines', 'words'], (els) => {
    if (shouldReduceMotion) return;
    const tl = gsap.timeline();
    tl.fromTo(
      els,
      { yPercent: 100, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.05 },
    );
    return tl;
  });

  useGSAP(
    () => {
      if (shouldReduceMotion) return;
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      if (subCopyRef.current) {
        tl.fromTo(
          subCopyRef.current.children,
          { y: 12, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08 },
          '-=0.4',
        );
      }
      if (badgesRef.current) {
        tl.fromTo(
          badgesRef.current.children,
          { y: 10, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.05 },
          '-=0.3',
        );
      }

      // Subtle parallax of gradient background on scroll
      if (gradientRef.current) {
        gsap.to(gradientRef.current, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: '#home',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            scroller: document.getElementById('smooth-scroll-container') || undefined,
          },
        });
      }
    },
    { dependencies: [shouldReduceMotion] },
  );

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
      className="hero-section relative min-h-screen overflow-hidden bg-gray-950 text-white"
      aria-labelledby="hero-heading"
    >
      <div ref={gradientRef} className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_rgba(255,235,167,0.12),_transparent_55%)]" aria-hidden="true" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-10 text-center">
        <div
          className={`max-w-4xl space-y-8 sm:space-y-10 transition-all duration-1000 ${
            hasEntered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ paddingTop: 10, paddingBottom: 10 }}
        >
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

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5 pt-2">
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

          <div className="hidden sm:flex flex-col items-center gap-2 pt-8 text-xs tracking-[0.3em] text-gray-400">
            <span>SCROLL TO EXPLORE</span>
            <span className="block h-10 w-px bg-gradient-to-b from-transparent via-gray-400 to-transparent" />
          </div>
        </div>
      </div>

      {showResume && <ResumeViewer onCloseAction={closeResume} />}
    </section>
  );
}

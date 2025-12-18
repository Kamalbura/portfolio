"use client";

import { useCallback, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import type { ProjectConfig } from '@/config/siteConfig';
import { useCardTilt } from '@/hooks/useCardTilt';
import { useCardGlare } from '@/hooks/useCardGlare';
import { useSectionReveal } from '@/hooks/useSectionReveal';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/context/MotionPreferenceContext';

export type ProjectsClientProject = ProjectConfig & {
  overview: string;
  repoUrl: string;
  liveUrl?: string;
};

interface ProjectsClientProps {
  projects: ProjectsClientProject[];
}

const categories = [
  { id: 'all', label: 'All Projects', shortLabel: 'All' },
  { id: 'web', label: 'Web Development', shortLabel: 'Web Dev' },
  { id: 'iot', label: 'IoT Systems', shortLabel: 'IoT' },
  { id: 'ml', label: 'Machine Learning', shortLabel: 'ML' },
] as const;

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof categories)[number]['id']>('all');
  const headerRef = useSectionReveal<HTMLDivElement>({ direction: 'up' });
  const filterRef = useSectionReveal<HTMLDivElement>({ direction: 'up', delay: 0.08 });
  const accentRef = useRef<HTMLDivElement>(null);
  // Refs for horizontal pin scroll
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  gsap.registerPlugin(ScrollTrigger);
  const shouldReduceMotion = useReducedMotion();

  // Compute filtered projects FIRST before using in useGSAP
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') return projects;
    return projects.filter((project) => project.category === selectedCategory);
  }, [projects, selectedCategory]);

  // FIX #1: Refresh ScrollTrigger when filtered projects change to recalculate scroll distance
  useGSAP(() => {
    if (shouldReduceMotion) return;
    ScrollTrigger.refresh();
  }, { dependencies: [filteredProjects] });

  // Pin and scrub horizontal scroll of project cards (responsive to resize)
  // FIX #2: Disable pinning on mobile devices for better UX
  useGSAP(
    () => {
      if (!sectionRef.current || !trackRef.current || shouldReduceMotion) return;
      const scrollerEl = document.getElementById('smooth-scroll-container') || undefined;

      const computeDistance = () => {
        if (!trackRef.current) return 0;
        return Math.max(0, trackRef.current.scrollWidth - window.innerWidth);
      };

      // Use matchMedia for responsive behavior
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        // Desktop: Pin and horizontal scroll
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: sectionRef.current,
            scrub: true,
            start: 'top top',
            end: () => `+=${Math.round(computeDistance() * 0.85)}`,
            scroller: scrollerEl,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(trackRef.current, { x: () => -Math.round(computeDistance() * 0.85), ease: 'power1.out' });

        return () => {
          tl.kill();
          ScrollTrigger.getAll()
            .filter((st) => st.trigger === sectionRef.current)
            .forEach((st) => st.kill());
        };
      });

      mm.add('(max-width: 767px)', () => {
        // Mobile: No pinning, natural scroll flow
        // Kill any existing ScrollTriggers on this section
        ScrollTrigger.getAll()
          .filter((st) => st.trigger === sectionRef.current)
          .forEach((st) => st.kill());
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [shouldReduceMotion, filteredProjects] },
  );

  useGSAP(
    () => {
      if (shouldReduceMotion) return;
      if (accentRef.current) {
        gsap.to(accentRef.current, {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: '#projects',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            scroller: document.getElementById('smooth-scroll-container') || undefined,
          },
        });
      }
    },
    { dependencies: [shouldReduceMotion] },
  );

  return (
    <section ref={sectionRef}
      id="projects"
      className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-[2px] py-16 transition-colors sm:py-20 overflow-hidden"
      aria-labelledby="projects-heading"
    >
      <div
        ref={accentRef}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_90%_10%,rgba(255,235,167,0.08),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="mb-12 text-center sm:mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-yellow-300/80">Portfolio</span>
          <h2
            id="projects-heading"
            className="mt-4 text-2xl font-light text-gray-900 dark:text-white sm:text-3xl md:text-4xl"
          >
            Experiments and interfaces that shipped outcomes
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base text-gray-600 dark:text-gray-300 sm:text-lg">
            From connected labs to ML-assisted dashboards, these builds pair resilient engineering with crafted experiences so teams can measure, decide, and deploy faster.
          </p>
        </div>

        <div ref={filterRef} className="mb-12 sm:mb-14">
          <div className="grid grid-cols-2 gap-3 sm:hidden">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === category.id
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                aria-pressed={selectedCategory === category.id}
              >
                {category.shortLabel}
              </button>
            ))}
          </div>

          <div className="hidden justify-center gap-3 sm:flex">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`hover-target rounded-full px-5 py-2 text-sm font-medium uppercase tracking-[0.24em] transition ${
                  selectedCategory === category.id
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                aria-pressed={selectedCategory === category.id}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal track of project cards - vertically centered */}
        <div ref={trackRef} className="flex gap-6 px-4 lg:px-8 items-center min-h-[280px] sm:min-h-[320px] pr-[10vw]">
          {filteredProjects.length === 0 && (
            <div className="flex-shrink-0 w-full rounded-3xl border border-dashed border-gray-300/60 p-12 text-center text-gray-500 dark:border-gray-700/60 dark:text-gray-300">
              New experiments are brewing. Check back soon.
            </div>
          )}
          {filteredProjects.map((project, index) => (
            <div key={project.id} className="flex-shrink-0 w-80 sm:w-96">
              <ProjectCard project={project} featured={project.featured} priority={index < 2} />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center sm:mt-16">
          <a
            href="https://github.com/kamalbura"
            target="_blank"
            rel="noreferrer"
            className="hover-target inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-gray-600 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            View full archive
            <span aria-hidden="true" className="text-lg leading-none">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

type ProjectCardProps = {
  project: ProjectsClientProject;
  featured?: boolean;
  priority?: boolean;
};

function ProjectCard({ project, featured, priority }: ProjectCardProps) {
  const tiltRef = useCardTilt<HTMLDivElement>({ maxRotation: 8, scale: 1.02 });
  const glareRef = useCardGlare<HTMLDivElement>();
  const combineRef = useCallback(
    (instance: HTMLDivElement | null) => {
      tiltRef.current = instance;
      glareRef.current = instance;
    },
    [tiltRef, glareRef],
  );

  return (
    <article
      ref={combineRef}
      className={`project-card project-card-glare hover-target relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 text-left shadow-sm transition-all duration-500 dark:border-gray-700 dark:bg-gray-800 ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      <div className="relative h-52 bg-gray-200 dark:bg-gray-700">
        <Image
          src={project.image}
          alt={`${project.title} hero visual`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
          priority={priority}
        />
      </div>

      <div className="flex flex-col gap-5 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{project.title}</h3>
            {project.timeframe && (
              <p className="text-xs uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">
                {project.timeframe}
              </p>
            )}
          </div>
          {project.status && (
            <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white dark:bg-white dark:text-gray-900">
              {project.status.replace('-', ' ')}
            </span>
          )}
        </div>

        {project.overview && (
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{project.overview}</p>
        )}

        {project.outcome && (
          <div className="rounded-2xl border border-gray-200 bg-white/70 p-4 text-sm text-gray-700 backdrop-blur dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-200">
            <span className="font-medium text-gray-900 dark:text-white">Outcome:&nbsp;</span>
            {project.outcome}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={`${project.id}-${tech}`}
              className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-gray-600 dark:border-gray-600 dark:text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold uppercase tracking-[0.28em] text-gray-600 dark:text-gray-300">
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="hover-target inline-flex items-center gap-2 transition hover:text-gray-900 dark:hover:text-white"
            aria-label={`Open repository for ${project.title}`}
          >
            Code
            <span aria-hidden="true">↗</span>
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="hover-target inline-flex items-center gap-2 transition hover:text-gray-900 dark:hover:text-white"
              aria-label={`Open live experience for ${project.title}`}
            >
              Live
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

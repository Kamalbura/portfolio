'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import type { ProjectConfig } from '@/config/siteConfig';

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
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]['id']>('all');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const filteredProjects =
    selectedCategory === 'all'
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-16 sm:py-20 bg-white dark:bg-gray-900 transition-colors"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-10 sm:mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2
            id="projects-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-4 sm:mb-6"
          >
            Featured Projects
          </h2>
          <div className="w-20 h-px bg-gray-900 dark:bg-white mx-auto mb-4 sm:mb-6"></div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A mix of IoT pilots, ML prototypes, and production web dashboards that show how I connect devices with
            usable interfaces.
          </p>
        </div>

        <div
          className={`mb-8 sm:mb-12 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-2 gap-3 sm:hidden">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`relative px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 shadow-sm'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <span className="relative z-10">{category.shortLabel}</span>
              </button>
            ))}
          </div>

          <div className="hidden sm:flex justify-center flex-wrap gap-4" role="tablist" aria-label="Project categories">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                role="tab"
                aria-selected={selectedCategory === category.id}
                className={`relative px-8 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 shadow-sm'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <span className="relative z-10">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className={`bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 ${
                project.featured ? 'md:col-span-2' : ''
              } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                <Image
                  src={project.image}
                  alt={`${project.title} visual placeholder`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority={project.featured}
                />
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                    {project.timeframe && (
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{project.timeframe}</p>
                    )}
                  </div>
                  {project.status && (
                    <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium rounded">
                      {project.status.replace('-', ' ')}
                    </span>
                  )}
                </div>

                {project.overview && (
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                    {project.overview}
                  </p>
                )}

                {project.outcome && (
                  <div className="rounded-md border border-gray-200 dark:border-gray-600 bg-white/60 dark:bg-gray-900/40 p-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium text-gray-900 dark:text-white">Outcome:</span> {project.outcome}
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={`${project.id}-${tech}`}
                      className="px-2 sm:px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs sm:text-sm border border-gray-200 dark:border-gray-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Code
                  </a>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div
          className={`text-center mt-10 sm:mt-12 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <a
            href="https://github.com/kamalbura"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 sm:px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            View All Projects on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef, useState } from 'react';
import { useSectionReveal, useStaggerReveal } from '@/hooks/useSectionReveal';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/context/MotionPreferenceContext';
import { skillsConfig, toolsConfig } from '@/config/contentConfig';

export default function Skills() {
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useSectionReveal<HTMLElement>({ direction: 'up' });
  const headerRef = useSectionReveal<HTMLDivElement>({ direction: 'up', delay: 0.05 });
  const controlsRef = useSectionReveal<HTMLDivElement>({ direction: 'up', delay: 0.15 });
  const gridRef = useStaggerReveal<HTMLDivElement>('.skill-card', {
    direction: 'up',
    stagger: 0.12,
    start: 'top 75%',
  });
  const toolsRef = useStaggerReveal<HTMLDivElement>('.tool-card', {
    direction: 'up',
    stagger: 0.1,
    delay: 0.2,
  });
  const accentRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  gsap.registerPlugin(ScrollTrigger);

  useGSAP(
    () => {
      if (shouldReduceMotion) return;
      if (accentRef.current) {
        gsap.to(accentRef.current, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: '#skills',
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

  const skills = skillsConfig;
  const tools = toolsConfig;

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="skills-section relative py-12 sm:py-16 md:py-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-[2px] transition-colors overflow-hidden"
    >
      <div ref={accentRef} className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_20%_10%,rgba(255,235,167,0.07),transparent_60%)]" aria-hidden="true" />
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-8 sm:mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-4 sm:mb-6 md:mb-8">
            Technical Skills
          </h2>
          <div className="w-16 sm:w-20 h-px bg-gray-900 dark:bg-white mx-auto mb-4 sm:mb-6 md:mb-8"></div>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A comprehensive toolkit of modern technologies and frameworks that I use to build scalable, 
            efficient, and innovative solutions.
          </p>
        </div>

        {/* Skills Tabs - Further optimized for mobile */}
        <div ref={controlsRef} className="mb-6 sm:mb-8">
          <div className="flex justify-center">
            <div
              className="flex overflow-x-auto max-w-full pb-2 hide-scrollbar"
              role="tablist"
              aria-label="Skill categories"
            >
              {skills.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(index)}
                  role="tab"
                  aria-selected={activeTab === index}
                  aria-controls={`${category.id}-panel`}
                  id={`${category.id}-tab`}
                  className={`flex items-center px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 md:py-1.5 text-[8px] sm:text-[10px] md:text-xs rounded-md font-medium whitespace-nowrap mr-1 sm:mr-1.5 md:mr-2 transition-colors ${
                    activeTab === index
                      ? 'bg-gray-800/80 dark:bg-gray-200/80 text-white dark:text-gray-900 backdrop-blur'
                      : 'bg-gray-200/70 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 hover:bg-gray-300/80 dark:hover:bg-gray-600/80 backdrop-blur'
                  }`}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Content - Improved grid spacing for mobile */}
        <div ref={gridRef}>
          {skills.map((category, index) => (
            <div
              key={category.id}
              role="tabpanel"
              id={`${category.id}-panel`}
              aria-labelledby={`${category.id}-tab`}
              aria-hidden={activeTab === index ? 'false' : 'true'}
              className={`${activeTab === index ? 'block' : 'hidden'}`}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                {category.items.map((skill) => (
                  <div
                    key={skill.name}
                    className="skill-card flex flex-col items-center p-2 sm:p-3 md:p-4 bg-white/80 dark:bg-gray-700/80 backdrop-blur rounded-lg border border-gray-200/70 dark:border-gray-600/70 hover:shadow-md transition-all duration-300"
                  >
                    <div className="text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3">
                      {skill.icon}
                    </div>
                    <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mt-1 sm:mt-2">{skill.name}</span>
                    <p className="text-[8px] sm:text-[10px] md:text-xs text-center text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 md:mt-3">{skill.description}</p>
                  </div>
                ))}
              </div>

              {/* Mobile-friendly card view of skills */}
              <div className="mt-6 sm:mt-8 md:mt-12 lg:hidden">
                {/* Commented out Frontend Development Overview card as requested */}
              </div>
            </div>
          ))}
        </div>

        {/* Tools & Technologies Grid - Improved for mobile */}
        <div ref={toolsRef} className="mt-10 sm:mt-14 md:mt-20">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white text-center mb-6 sm:mb-8 md:mb-10">Tools & Technologies</h3>
          
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-5">
            {tools.map((tool) => (
              <div
                key={tool.name}
                  className="tool-card flex flex-col items-center p-2 sm:p-3 md:p-5 bg-white/80 dark:bg-gray-700/80 backdrop-blur rounded-lg border border-gray-200/70 dark:border-gray-600/70 hover:shadow-md transition-all duration-300"
              >
                <div className="text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3 md:mb-4">{tool.icon}</div>
                <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mt-1 sm:mt-2">{tool.name}</span>
                <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 md:mt-3 text-center">{tool.description}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

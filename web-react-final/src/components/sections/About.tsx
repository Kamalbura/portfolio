'use client';

import { useState, useEffect, useRef } from 'react';

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const highlights = [
    {
      title: 'IoT systems in the wild',
      description:
        'Delivered sensor networks for classrooms, labs, and freelance clients with ESP32, Firebase, and lightweight dashboards.',
    },
    {
      title: 'Edge ML experimentation',
      description:
        'Deploy anomaly detection and vision models on microcontrollers to keep latency and power low for field devices.',
    },
    {
      title: 'Rapid iteration mindset',
      description:
        'Pair hardware prototypes with Next.js interfaces so stakeholders can test, measure, and request changes in days—not months.',
    },
  ];

  const timeline = [
    {
      period: '2022',
      title: 'Began CSE (AIML) at Vasavi College',
      detail: 'Built first connected classroom monitor and started documenting IoT learnings.',
    },
    {
      period: '2023',
      title: 'First freelance IoT engagement',
      detail: 'Delivered an air-quality tracker for a co-working space with real-time dashboards for facilities teams.',
    },
    {
      period: '2024',
      title: 'Edge ML + automation focus',
      detail: 'Experimented with ESP32-S3 vision, TensorFlow Lite, and automated alerting workflows for safety projects.',
    },
    {
      period: '2025',
      title: 'Portfolio refresh & mentorship',
      detail: 'Documenting projects, mentoring juniors on IoT basics, and opening up availability for new collaborations.',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-800 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          
          {/* Content */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-4 sm:mb-6">
                About Me
              </h2>
              <div className="w-20 h-px bg-gray-900 dark:bg-white"></div>
            </div>
            
            <div className="space-y-4 sm:space-y-6 text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              <p>
                I&apos;m a final-year Computer Science Engineering student at Vasavi College of Engineering. My work sits where
                connected hardware meets modern web interfaces—building prototypes that teams can trial quickly, measure in the
                field, and refine with confidence.
              </p>

              <p>
                Over the last few semesters I&apos;ve been shipping IoT monitoring stacks, classroom automation pilots, and ML-driven
                alerts for clients and campus labs. The goal is always the same: give stakeholders dependable insights without
                overwhelming them with tooling or maintenance.
              </p>

              <p>
                Outside project work, you&apos;ll find me documenting build logs, mentoring juniors through robotics clubs, and
                exploring how edge ML can live comfortably on low-power hardware.
              </p>
            </div>

            {/* Current Focus */}
            <div className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 sm:pl-6">
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-3">Currently Exploring</h3>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'TypeScript', 'Machine Learning', 'Cloud Architecture', 'System Design'].map((item) => (
                  <span 
                    key={item}
                    className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-gray-600"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats/Timeline */}
          <div className="space-y-6 sm:space-y-8 mt-6 lg:mt-0">
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-5 sm:p-6 shadow-sm">
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-4">Highlights</h3>
                <ul className="space-y-4">
                  {highlights.map((item) => (
                    <li key={item.title}>
                      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {item.title}
                      </p>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
                        {item.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-lg p-5 sm:p-6 shadow-sm">
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-4">Timeline</h3>
                <ol className="space-y-4">
                  {timeline.map((entry) => (
                    <li key={entry.period} className="relative pl-6">
                      <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500"></span>
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {entry.period} · {entry.title}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{entry.detail}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

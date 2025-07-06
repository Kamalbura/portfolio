'use client';

import { useState, useEffect, useRef } from 'react';

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
                I&apos;m a final-year Computer Science Engineering student at Vasavi College of Engineering, 
                passionate about building technology that makes a difference. My journey spans from developing 
                intelligent IoT systems to creating scalable web applications.
              </p>
              
              <p>
                Currently focused on full-stack development and machine learning, I&apos;ve led projects in 
                smart classroom monitoring, forest fire detection systems, and AI-powered content generation. 
                I believe in writing clean, efficient code and designing user-centric solutions.
              </p>
              
              <p>
                When I&apos;m not coding, you&apos;ll find me exploring emerging technologies, participating in hackathons, 
                or mentoring fellow students. I&apos;m always excited about opportunities to learn and contribute to 
                meaningful projects.
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
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="text-center p-4 sm:p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                <div className="text-2xl sm:text-3xl font-light text-gray-900 dark:text-white mb-2">15+</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide">Projects Completed</div>
              </div>
              <div className="text-center p-4 sm:p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                <div className="text-2xl sm:text-3xl font-light text-gray-900 dark:text-white mb-2">3+</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide">Years Coding</div>
              </div>
              <div className="text-center p-4 sm:p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                <div className="text-2xl sm:text-3xl font-light text-gray-900 dark:text-white mb-2">5+</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide">Technologies</div>
              </div>
              <div className="text-center p-4 sm:p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                <div className="text-2xl sm:text-3xl font-light text-gray-900 dark:text-white mb-2">B.E(B.Tech)</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide">CSE-AIML 2026</div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-white dark:bg-gray-700 rounded-lg p-5 sm:p-6 shadow-sm">
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-4">Education</h3>
              <div className="space-y-4">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">B.E in Computer Science Engineering</div>
                  <div className="text-gray-600 dark:text-gray-300">Vasavi College of Engineering</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">2022 - 2026 • Hyderabad, India</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

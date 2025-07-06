'use client';

import { useState, useEffect, MouseEvent } from 'react';
import Link from 'next/link';
import ResumeViewer from '@/components/resume/ResumeViewer';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Adjust handleResumeClick to accept MouseEvent for generic HTMLElement
  const handleResumeClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setShowResume(true);
  };

  const closeResume = () => {
    setShowResume(false);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Content */}
        <div className={`space-y-5 sm:space-y-6 md:space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Name */}
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-light text-gray-900 dark:text-white tracking-tight">
            Kamal Bura
          </h1>
          
          {/* Title & Institution */}
          <div className="space-y-1 sm:space-y-2 md:space-y-3">
            <h2 className="text-base sm:text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300">
              Software Engineer & IoT Developer
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
              Computer Science Engineering • Vasavi College of Engineering • Class of 2025
            </p>
          </div>
          
          {/* Brief Description */}
          <p className="text-sm sm:text-base md:text-xl leading-relaxed text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light">
            Building scalable web applications and intelligent IoT systems. 
            Passionate about creating technology that solves real-world problems.
          </p>
          
          {/* Skills Tags - Reduced size for mobile */}
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 md:gap-3 mt-4 sm:mt-6 md:mt-8">
            {['React', 'Node.js', 'Python', 'IoT', 'Machine Learning', 'Firebase'].map((skill) => (
              <span 
                key={skill}
                className="px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 md:py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-[10px] sm:text-xs md:text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
          
          {/* CTA Buttons - Optimized for mobile to fit side-by-side */}
          <div className="flex flex-row flex-wrap gap-2 justify-center items-center mt-5 sm:mt-8 md:mt-12">
            <Link 
              href="#projects"
              className="text-[10px] xs:text-xs sm:text-sm py-1 px-2 xs:px-3 sm:py-1.5 sm:px-3 md:py-2 md:px-4 rounded-md bg-gray-800 dark:bg-gray-700 text-white transition-colors hover:bg-gray-700 dark:hover:bg-gray-600"
            >
              View Projects
            </Link>
            
            <button 
              onClick={handleResumeClick}
              className="text-[10px] xs:text-xs sm:text-sm py-1 px-2 xs:px-3 sm:py-1.5 sm:px-3 md:py-2 md:px-4 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 transition-colors hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              View Resume
            </button>
            
            <Link 
              href="#contact"
              className="text-xs sm:text-sm md:text-base py-1 px-3 sm:py-2 sm:px-4 md:py-2.5 md:px-5 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
          
          {/* Scroll Indicator - Hidden on small mobile */}
          <div className="mt-8 sm:mt-12 md:mt-16 hidden sm:block">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">SCROLL TO EXPLORE</span>
              <div className="w-px h-6 sm:h-8 bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Modal */}
      {showResume && <ResumeViewer onCloseAction={closeResume} />}
    </section>
  );
}

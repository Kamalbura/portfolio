'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Content */}
        <div className={`space-y-6 sm:space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Name */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-light text-gray-900 dark:text-white tracking-tight">
            Kamal Bura
          </h1>
          
          {/* Title & Institution */}
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300">
              Software Engineer & IoT Developer
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              Computer Science Engineering • Vasavi College of Engineering • Class of 2025
            </p>
          </div>
          
          {/* Brief Description */}
          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light">
            Building scalable web applications and intelligent IoT systems. 
            Passionate about creating technology that solves real-world problems.
          </p>
          
          {/* Skills Tags */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
            {['React', 'Node.js', 'Python', 'IoT', 'Machine Learning', 'Firebase'].map((skill) => (
              <span 
                key={skill}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 sm:mt-12">
            <Link 
              href="#projects"
              className="w-full sm:w-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center"
            >
              View Projects
            </Link>
            <a 
              href="/resume.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center"
            >
              Download Resume
            </a>
            <Link 
              href="#contact"
              className="w-full sm:w-auto text-gray-600 dark:text-gray-400 px-6 sm:px-8 py-3 rounded-lg font-medium hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center"
            >
              Get in Touch
            </Link>
          </div>
          
          {/* Scroll Indicator */}
          <div className="mt-12 sm:mt-16 hidden sm:block">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">SCROLL TO EXPLORE</span>
              <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

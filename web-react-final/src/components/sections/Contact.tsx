'use client';

import { useState, useEffect, useRef } from 'react';

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className="py-16 sm:py-20 bg-white dark:bg-gray-900 transition-colors"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Header */}
        <div className={`mb-10 sm:mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-4 sm:mb-6">
            Let&apos;s Connect
          </h2>
          <div className="w-20 h-px bg-gray-900 dark:bg-white mx-auto mb-4 sm:mb-6"></div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            I&apos;m always open to discussing new opportunities, interesting projects, or just having a chat about technology.
          </p>
        </div>

        {/* Contact Options */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12 transition-all duration-700 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          
          {/* Email */}
          <a
            href="mailto:burakamal13@gmail.com"
            className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-lg hover:shadow-lg transition-all duration-300 group"
          >
            <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">📧</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">Email</h3>
            <p className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm sm:text-base">
              burakamal13@gmail.com
            </p>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/kamal-bura"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-lg hover:shadow-lg transition-all duration-300 group"
          >
            <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">💼</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">LinkedIn</h3>
            <p className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm sm:text-base">
              Connect professionally
            </p>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/kamalbura"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-lg hover:shadow-lg transition-all duration-300 group sm:col-span-2 md:col-span-1"
          >
            <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">💻</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">GitHub</h3>
            <p className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm sm:text-base">
              View my code
            </p>
          </a>
        </div>

        {/* Call to Action */}
        <div className={`bg-gray-50 dark:bg-gray-800 p-6 sm:p-8 rounded-lg transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Ready to build something amazing together?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-5 sm:mb-6 text-sm sm:text-base">
            Whether you have a project in mind, want to discuss opportunities, or just want to say hello, I&apos;d love to hear from you.
          </p>
          <a
            href="mailto:burakamal13@gmail.com?subject=Let's%20Connect&body=Hi%20Kamal,%0A%0AI%20found%20your%20portfolio%20and%20would%20like%20to%20connect..."
            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            Send Message
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Footer */}
        <div className={`mt-10 sm:mt-16 text-gray-500 dark:text-gray-400 text-sm transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <p>© {new Date().getFullYear()} Kamal Bura. All rights reserved.</p>
        </div>
      </div>
    </section>
  );
}

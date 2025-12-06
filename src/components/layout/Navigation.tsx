'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScroll } from '@/context/ScrollContext';
import dynamic from 'next/dynamic';

gsap.registerPlugin(ScrollTrigger);

const MotionToggle = dynamic(() => import('@/components/ui/MotionToggle'), { ssr: false });

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('home');
  const menuRef = useRef<HTMLDivElement>(null);
  const { scrollTo } = useScroll();

  useEffect(() => {
    // Initialize dark mode from preference or system setting
    const darkModePreference = localStorage.getItem('darkMode');
    if (
      darkModePreference === 'true' ||
      (darkModePreference === null && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Header scrolled state tied to ScrollTrigger (works with Lenis transforms)
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        setIsScrolled(y > 20);
      },
    });
    return () => st.kill();
  }, []);

  // ScrollTrigger-based scrollspy (works with Lenis scrollerProxy)
  useEffect(() => {
    const ids = ['home', 'about', 'process', 'projects', 'skills', 'contact'];
    const triggers: ScrollTrigger[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const t = ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveId(id),
        onEnterBack: () => setActiveId(id),
      });
      triggers.push(t);
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  useEffect(() => {
    // Close mobile menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    // Prevent scrolling when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const navItems = [
    { label: 'Home', href: '/#home' },
    { label: 'About', href: '/#about' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Contact', href: '/#contact' },
    { label: 'Pages', href: '/pages' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-xl font-semibold text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            KB
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => {
              const isAnchor = item.href.startsWith('/#');
              const id = isAnchor ? item.href.replace('/#', '') : '';
              const isActive = id && id === activeId;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    if (isAnchor) {
                      e.preventDefault();
                      scrollTo(`#${id}`, { offset: -80 });
                    }
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors relative group ${
                    item.label === 'Pages' ? 'pages-link' : ''
                  } ${isActive ? 'text-gray-900 dark:text-white' : ''}`}
                >
                  {item.label}
                  {item.label === 'Pages' && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-sm text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 pointer-events-none z-10 before:content-[''] before:absolute before:left-1/2 before:-top-2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-white dark:before:border-b-gray-800 pages-tooltip">
                      <p className="font-medium text-center">✨ Discover My Other Websites! </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">Click to explore my other sites</p>
                    </div>
                  )}
                  <span className={`absolute inset-x-0 -bottom-px h-px bg-gray-900 dark:bg-white transition-transform ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></span>
                </Link>
              );
            })}
          </div>

          {/* Dark Mode Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            <MotionToggle />
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        ref={menuRef}
        className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 translate-x-full pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="absolute right-0 top-0 bottom-0 w-64 sm:w-80 bg-white dark:bg-gray-900 shadow-xl flex flex-col">
          {/* Menu Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <Link href="/" className="text-xl font-semibold text-gray-900 dark:text-white">KB</Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4 px-6">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <div key={item.label} className="relative">
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      const isAnchor = item.href.startsWith('/#');
                      const id = isAnchor ? item.href.replace('/#', '') : '';
                      if (isAnchor) {
                        e.preventDefault();
                        scrollTo(`#${id}`, { offset: -80 });
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className="py-3 text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white border-b border-gray-100 dark:border-gray-800 block"
                  >
                    {item.label}
                  </Link>
                {item.label === 'Pages' && (
                    <div className="text-sm bg-blue-50 dark:bg-blue-900/20 rounded-md p-2 text-gray-700 dark:text-gray-300 mt-1 mb-2 pl-3">
                      <span className="font-medium">Discover My Other Websites ! </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Menu Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">© 2025 Kamal Bura</div>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';

export default function Skills() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  // Remove unused scrollPosition
  // const [scrollPosition, setScrollPosition] = useState(0);

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

    // Remove scroll position tracking as it's not used
    // const handleScroll = () => {
    //   setScrollPosition(window.scrollY);
    // };

    // window.addEventListener('scroll', handleScroll);
    return () => {
      observer.disconnect();
      // window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const skills = [
    {
      id: 'frontend',
      title: 'Frontend',
      icon: '🎨',
      color: 'from-blue-400 to-cyan-400',
      items: [
        { name: 'React', icon: '⚛️', description: 'Component Architecture' },
        { name: 'Next.js', icon: '▲', description: 'Full-Stack Framework' },
        { name: 'TypeScript', icon: 'TS', description: 'Type Safety' },
        { name: 'JavaScript', icon: 'JS', description: 'Core Language' },
        { name: 'Tailwind CSS', icon: '🎨', description: 'Utility Styling' },
        { name: 'HTML/CSS', icon: '🌐', description: 'Web Fundamentals' }
      ]
    },
    {
      id: 'backend',
      title: 'Backend',
      icon: '⚙️',
      color: 'from-green-400 to-emerald-500',
      items: [
        { name: 'Node.js', icon: '🟢', description: 'Server Runtime' },
        { name: 'Express', icon: '⚡', description: 'Web Framework' },
        { name: 'Python', icon: '🐍', description: 'AI & Backend' },
        { name: 'MongoDB', icon: '🍃', description: 'NoSQL Database' },
        { name: 'Firebase', icon: '🔥', description: 'Backend as a Service' },
        { name: 'REST APIs', icon: '📡', description: 'API Design' }
      ]
    },
    {
      id: 'other',
      title: 'Other Technologies',
      icon: '🔧',
      color: 'from-purple-400 to-pink-500',
      items: [
        { name: 'Git/GitHub', icon: '📋', description: 'Version Control' },
        { name: 'Docker', icon: '🐳', description: 'Containerization' },
        { name: 'AWS', icon: '☁️', description: 'Cloud Platform' },
        { name: 'IoT', icon: '🔌', description: 'Internet of Things' },
        { name: 'Machine Learning', icon: '🧠', description: 'AI Models' },
        { name: 'Embedded Systems', icon: '💻', description: 'Hardware Programming' }
      ]
    }
  ];

  const tools = [
    { name: 'VS Code', icon: '📝', description: 'Code Editor' },
    { name: 'Git', icon: '📋', description: 'Version Control' },
    { name: 'GitHub', icon: '🐙', description: 'Code Repository' },
    { name: 'npm', icon: '📦', description: 'Package Manager' },
    { name: 'Webpack', icon: '📦', description: 'Module Bundler' },
    { name: 'Vercel', icon: '▲', description: 'Deployment' },
    { name: 'Figma', icon: '🎨', description: 'UI Design' },
    { name: 'Jest', icon: '🧪', description: 'Testing' },
    { name: 'ESLint', icon: '🔍', description: 'Code Linting' },
    { name: 'Firebase', icon: '🔥', description: 'Backend Services' },
    { name: 'Docker', icon: '🐳', description: 'Containerization' },
    { name: 'AWS', icon: '☁️', description: 'Cloud Services' }
  ];

  return (
    <section 
      id="skills" 
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-800 transition-colors overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-8 sm:mb-10 md:mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
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
        <div className={`mb-6 sm:mb-8 transition-all duration-700 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex justify-center">
            <div className="flex overflow-x-auto max-w-full pb-2 hide-scrollbar">
              {skills.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(index)}
                  className={`flex items-center px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 md:py-1.5 text-[8px] sm:text-[10px] md:text-xs rounded-md font-medium whitespace-nowrap mr-1 sm:mr-1.5 md:mr-2 transition-colors ${
                    activeTab === index
                      ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
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
        <div className={`transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {skills.map((category, index) => (
            <div
              key={category.id}
              className={`${activeTab === index ? 'block' : 'hidden'}`}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                {category.items.map((skill) => (
                  <div 
                    key={skill.name}
                    className="flex flex-col items-center p-2 sm:p-3 md:p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300"
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
        <div className={`mt-10 sm:mt-14 md:mt-20 transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white text-center mb-6 sm:mb-8 md:mb-10">Tools & Technologies</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-5">
            {tools.map((tool) => (
              <div 
                key={tool.name}
                className="flex flex-col items-center p-2 sm:p-3 md:p-5 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300"
              >
                <div className="text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3 md:mb-4">{tool.icon}</div>
                <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mt-1 sm:mt-2">{tool.name}</span>
                <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 md:mt-3 text-center">{tool.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Learning & Growth - Made more prominent and readable */}
        <div className={`mt-14 sm:mt-20 md:mt-32 text-center transition-all duration-700 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/60 dark:border-blue-700/60 shadow-sm">
            <span className="text-gray-800 dark:text-gray-200 font-semibold text-base sm:text-lg md:text-xl flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">🚀</span>
              Always learning and exploring new technologies
            </span>
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

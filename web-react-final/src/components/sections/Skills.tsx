'use client';

import { useState, useEffect, useRef } from 'react';

export default function Skills() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

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

    // Add smooth scrolling effect for skills
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const skills = [
    {
      id: 'frontend',
      title: 'Frontend Development',
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
      title: 'Backend Development',
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
      className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-800 transition-colors overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-10 sm:mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-6 sm:mb-8">
            Technical Skills
          </h2>
          <div className="w-20 h-px bg-gray-900 dark:bg-white mx-auto mb-6 sm:mb-8"></div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A comprehensive toolkit of modern technologies and frameworks that I use to build scalable, 
            efficient, and innovative solutions.
          </p>
        </div>

        {/* Skills Tabs - Mobile Friendly */}
        <div className={`mb-8 transition-all duration-700 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex overflow-x-auto pb-3 sm:justify-center hide-scrollbar">
            {skills.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(index)}
                className={`flex items-center px-4 sm:px-6 py-2.5 rounded-lg font-medium whitespace-nowrap mr-2 sm:mr-4 transition-colors ${
                  activeTab === index
                    ? 'bg-gradient-to-r bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.title}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Content */}
        <div className={`transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {skills.map((category, index) => (
            <div
              key={category.id}
              className={`${activeTab === index ? 'block' : 'hidden'}`}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 smooth-scroll">
                {category.items.map((skill, skillIndex) => (
                  <div 
                    key={skill.name}
                    className="flex flex-col items-center p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md hover:scale-105 transition-all duration-300 float-animation"
                    style={{ animationDelay: `${skillIndex * 0.1}s` }}
                  >
                    <div className="text-2xl mb-4">
                      {skill.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">{skill.name}</span>
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">{skill.description}</p>
                  </div>
                ))}
              </div>

              {/* Mobile-friendly card view of skills */}
              <div className="mt-8 sm:mt-12 lg:hidden">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-5 sm:p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center text-xl mr-4`}>
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{category.title} Overview</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {index === 0 && "Creating responsive and interactive user interfaces with modern frameworks and technologies."}
                    {index === 1 && "Building robust server-side applications with scalable APIs and database integrations."}
                    {index === 2 && "Leveraging additional tools and technologies to enhance development workflow and product capabilities."}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {category.items.map((skill) => (
                      <div key={skill.name} className="flex items-center p-2 bg-gray-50 dark:bg-gray-600 rounded-lg">
                        <div className="w-6 h-6 flex items-center justify-center mr-2">
                          {skill.icon}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tools & Technologies Grid */}
        <div className={`mt-20 transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-10">Tools & Technologies</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 smooth-scroll">
            {tools.map((tool, toolIndex) => (
              <div 
                key={tool.name}
                className="flex flex-col items-center p-5 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md hover:scale-105 transition-all duration-300 float-animation"
                style={{ 
                  animationDelay: `${toolIndex * 0.1}s`,
                  animationDuration: `${3 + toolIndex * 0.5}s` 
                }}
              >
                <div className="text-3xl mb-4">{tool.icon}</div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">{tool.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">{tool.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Learning & Growth */}
        <div className={`mt-12 sm:mt-16 text-center transition-all duration-700 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <span className="text-blue-700 dark:text-blue-300 font-medium text-sm sm:text-base">
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
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeInSlide {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .smooth-scroll {
          transform: translateY(calc(${scrollPosition * 0.02}px));
          transition: transform 0.8s ease-out;
        }
        .float-animation {
          animation: floatUpDown 3s ease-in-out infinite;
        }
        .fade-in-slide {
          animation: fadeInSlide 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

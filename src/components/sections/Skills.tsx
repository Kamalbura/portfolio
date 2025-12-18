'use client';

import { useState, useEffect, useRef } from 'react';

export default function Skills() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeOrbit, setActiveOrbit] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Tech stacks with modern logos and colors
  const techOrbits = [
    {
      name: 'Frontend Mastery',
      center: { icon: '⚡', color: 'from-blue-400 to-purple-600' },
      satellites: [
        { name: 'React', icon: '⚛️', color: '#61DAFB', description: 'Component Architecture' },
        { name: 'Next.js', icon: '▲', color: '#000000', description: 'Full-Stack Framework' },
        { name: 'TypeScript', icon: 'TS', color: '#3178C6', description: 'Type Safety' },
        { name: 'Tailwind', icon: '🎨', color: '#06B6D4', description: 'Utility Styling' },
        { name: 'JavaScript', icon: 'JS', color: '#F7DF1E', description: 'Core Language' }
      ]
    },
    {
      name: 'Backend Excellence',
      center: { icon: '🚀', color: 'from-green-400 to-blue-500' },
      satellites: [
        { name: 'Node.js', icon: '🟢', color: '#339933', description: 'Server Runtime' },
        { name: 'Python', icon: '🐍', color: '#3776AB', description: 'AI & Backend' },
        { name: 'Express', icon: '⚡', color: '#000000', description: 'Web Framework' },
        { name: 'FastAPI', icon: '⚡', color: '#009688', description: 'Modern APIs' },
        { name: 'MongoDB', icon: '🍃', color: '#47A248', description: 'Database' }
      ]
    },
    {
      name: 'IoT Innovation',
      center: { icon: '🔌', color: 'from-orange-400 to-red-500' },
      satellites: [
        { name: 'ESP32', icon: '📡', color: '#FF6B35', description: 'Microcontroller' },
        { name: 'Arduino', icon: '🔧', color: '#00979D', description: 'Hardware Dev' },
        { name: 'MQTT', icon: '📊', color: '#660066', description: 'IoT Protocol' },
        { name: 'Sensors', icon: '📈', color: '#FF4081', description: 'Data Collection' },
        { name: 'Firebase', icon: '🔥', color: '#FFCA28', description: 'Real-time DB' }
      ]
    },
    {
      name: 'Cloud & DevOps',
      center: { icon: '☁️', color: 'from-cyan-400 to-blue-600' },
      satellites: [
        { name: 'AWS', icon: '☁️', color: '#FF9900', description: 'Cloud Platform' },
        { name: 'Vercel', icon: '▲', color: '#000000', description: 'Deployment' },
        { name: 'Docker', icon: '🐳', color: '#2496ED', description: 'Containerization' },
        { name: 'Git', icon: '📋', color: '#F05032', description: 'Version Control' },
        { name: 'Linux', icon: '🐧', color: '#FCC624', description: 'Operating System' }
      ]
    }
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

  // Removed interval-based rotation to avoid unnecessary re-renders; users can click to explore orbits.

  return (
    <section 
      id="skills" 
      ref={sectionRef}
      className="min-h-screen py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5 animate-pulse"></div>
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-5xl md:text-6xl font-light text-white mb-6 tracking-tight">
              Tech <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">Universe</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Exploring the interconnected world of modern technology through hands-on experience and continuous learning
            </p>
          </div>
        </div>

        {/* Orbiting Skills Display */}
        <div className="relative">
          {/* Central Hub */}
          <div className="flex justify-center mb-16">
            <div className="relative w-96 h-96 mx-auto">
              {/* Main orbital ring */}
              <div className="absolute inset-0 border border-gray-600 rounded-full opacity-30 animate-spin-slow"></div>
              <div className="absolute inset-4 border border-gray-500 rounded-full opacity-20 animate-spin-reverse"></div>
              
              {/* Center hub */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${techOrbits[activeOrbit].center.color} flex items-center justify-center text-4xl shadow-2xl transition-all duration-1000`}>
                  {techOrbits[activeOrbit].center.icon}
                </div>
              </div>

              {/* Orbiting tech logos */}
              {techOrbits[activeOrbit].satellites.map((tech, index) => {
                const angle = (index * 72) * (Math.PI / 180); // 360/5 = 72 degrees
                const radius = 140;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <div
                    key={tech.name}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 hover:scale-125 group"
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      animationDelay: `${index * 0.2}s`
                    }}
                  >
                    <div className="relative">
                      {/* Tech icon/logo */}
                      <div 
                        className="w-16 h-16 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center text-2xl font-bold shadow-xl hover:bg-white/20 transition-all duration-300"
                        style={{ 
                          color: tech.color,
                          boxShadow: `0 0 20px ${tech.color}30`
                        }}
                      >
                        {tech.icon}
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap border border-gray-700">
                          <div className="font-semibold">{tech.name}</div>
                          <div className="text-gray-300 text-xs mt-1">{tech.description}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tech Stack Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {techOrbits.map((orbit, index) => (
              <div
                key={orbit.name}
                className={`relative p-6 rounded-2xl backdrop-blur-md border transition-all duration-500 cursor-pointer hover:scale-105 ${
                  activeOrbit === index
                    ? 'bg-white/10 border-white/30 shadow-2xl'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                onClick={() => setActiveOrbit(index)}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${orbit.center.color} flex items-center justify-center text-2xl mb-5 shadow-lg`}>
                  {orbit.center.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-5">{orbit.name}</h3>
                <div className="space-y-3.5">
                  {orbit.satellites.map((tech) => (
                    <div key={tech.name} className="flex items-center text-gray-300 text-sm">
                      <span className="w-2 h-2 rounded-full bg-blue-400 mr-3"></span>
                      {tech.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Level Indicator */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-8 bg-white/5 backdrop-blur-md rounded-full px-8 py-4 border border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">3+</div>
              <div className="text-sm text-gray-400">Years</div>
            </div>
            <div className="w-px h-8 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">15+</div>
              <div className="text-sm text-gray-400">Projects</div>
            </div>
            <div className="w-px h-8 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">20+</div>
              <div className="text-sm text-gray-400">Technologies</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite; /* Slower spin */
        }
        .animate-spin-reverse {
          animation: spin-reverse 40s linear infinite; /* Slower reverse spin */
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

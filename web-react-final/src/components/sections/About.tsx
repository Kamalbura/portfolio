'use client';

export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-6">
                About Me
              </h2>
              <div className="w-20 h-px bg-gray-900 dark:bg-white"></div>
            </div>
            
            <div className="space-y-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
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
            <div className="border-l-4 border-gray-300 dark:border-gray-600 pl-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Currently Exploring</h3>
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
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                <div className="text-3xl font-light text-gray-900 dark:text-white mb-2">15+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide">Projects Completed</div>
              </div>
              <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                <div className="text-3xl font-light text-gray-900 dark:text-white mb-2">3+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide">Years Coding</div>
              </div>
              <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                <div className="text-3xl font-light text-gray-900 dark:text-white mb-2">5+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide">Technologies</div>
              </div>
              <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                <div className="text-3xl font-light text-gray-900 dark:text-white mb-2">B.Tech</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide">CSE 2025</div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Education</h3>
              <div className="space-y-4">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">B.Tech in Computer Science Engineering</div>
                  <div className="text-gray-600 dark:text-gray-300">Vasavi College of Engineering</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">2021 - 2025 • Hyderabad, India</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

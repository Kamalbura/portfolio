export type ProjectConfig = {
  id: string;
  title: string;
  repoOwner: string;
  repoName: string;
  category: 'iot' | 'ml' | 'web';
  tech: string[];
  featured?: boolean;
  image: string;
  timeframe?: string;
  outcome?: string;
  status?: 'pilot' | 'in-production' | 'case-study';
  demoUrl?: string;
};

export type SiteConfig = {
  resumeUrl: string;
  projects: ProjectConfig[];
};

export const siteConfig: SiteConfig = {
  resumeUrl:
    'https://raw.githubusercontent.com/Kamalbura/portfolio/main/web-react-final/public/Kamal-bura-resume-jun-2025.pdf',
  projects: [
    {
      id: 'air-quality-monitoring',
      title: 'Air Quality Monitoring',
      repoOwner: 'Kamalbura',
      repoName: 'air-quality-monitering',
      category: 'iot',
      tech: ['ESP32', 'MQTT', 'Firebase', 'Next.js', 'Tailwind'],
      featured: true,
      image: '/images/placeholders/project-default.svg',
      timeframe: '2024 • Indoor pilot',
      outcome: 'Tracks CO₂, PM, and humidity data to alert classrooms before comfort drops.',
      status: 'pilot',
      demoUrl: 'https://github.com/Kamalbura/air-quality-monitering',
    },
    {
      id: 'cyber-truck',
      title: 'Cyber Truck Showcase',
      repoOwner: 'Kamalbura',
      repoName: 'cyber-truck',
      category: 'web',
      tech: ['Next.js', 'Three.js', 'GSAP', 'Tailwind'],
      image: 'https://github.com/Kamalbura/cyber-truck/blob/main/images/test-ride-thumb.jpg?raw=true',
      timeframe: '2023 • Concept build',
      outcome: 'Immersive Tesla Cybertruck microsite with interactive 3D scenes and scroll choreography.',
      status: 'case-study',
      demoUrl: 'https://github.com/Kamalbura/cyber-truck',
    },
  ],
};

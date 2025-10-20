export type SkillItem = {
  name: string;
  icon: string;
  description: string;
};

export type SkillCategory = {
  id: string;
  title: string;
  icon: string;
  color: string;
  items: SkillItem[];
};

export type ToolItem = SkillItem;

export const skillsConfig: SkillCategory[] = [
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
      { name: 'HTML/CSS', icon: '🌐', description: 'Web Fundamentals' },
    ],
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
      { name: 'REST APIs', icon: '📡', description: 'API Design' },
    ],
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
      { name: 'Embedded Systems', icon: '💻', description: 'Hardware Programming' },
    ],
  },
];

export const toolsConfig: ToolItem[] = [
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
  { name: 'AWS', icon: '☁️', description: 'Cloud Services' },
];
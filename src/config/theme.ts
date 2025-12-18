/**
 * Centralized theme configuration for consistent colors across CSS and 3D elements.
 * Ensures that dark mode toggles sync between Tailwind CSS and Three.js/WebGL components.
 */

export const THEME = {
  colors: {
    // Background colors
    background: {
      dark: '#0b0f1a',
      light: '#f8f5f0',
    },
    // Text colors
    text: {
      primary: '#ffffff', // Light mode: dark, Dark mode: white
      muted: '#94a3b8',
    },
    // Accent colors
    accent: {
      primary: '#fde047', // yellow-300
      secondary: '#3b82f6', // blue-500
      tertiary: '#a996ff', // purple (used in 3D)
    },
    // 3D scene specific
    scene: {
      meshColor: '#ffffff',
      meshWireframe: true,
      particleColor: '#ffffff',
      bloomIntensity: 0.15,
      ambientLightIntensity: 0.3,
      directionalLightIntensity: 0.5,
    },
    // Plexus animation colors (dots to name)
    plexus: {
      letterColor: '#ffffff', // Bright white for formed letters
      backgroundColor: '#030508', // Nearly black for scattered dots
      accentColor: '#c7d2fe', // Soft blue for subtle depth
    },
  },
  timing: {
    // Animation durations
    plexus: {
      pinDuration: '100vh', // Scroll distance for morph animation
      scrubDelay: 0.3, // Scrub responsiveness
    },
    preloader: {
      displayDuration: 750, // ms
      reducedMotionDuration: 120, // ms
    },
    sectionReveal: {
      staggerDelay: 0.06, // ms between lines
    },
  },
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
  },
} as const;

// NOTE: Access theme tokens directly via THEME.colors.* to avoid implicit any indexing.

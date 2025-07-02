// Professional modern theme with refined color scheme
const modernTheme = {
  colors: {
    primary: '#22223b', // Deep blue-black
    secondary: '#4a4e69', // Muted purple
    accent: '#9a8c98', // Elegant gold/bronze
    bgLight: '#f8f9fa',
    bgDark: '#18181b', // True black for immersive sections
    bgDarker: '#101014',
    bgCard: '#232336',
    textDark: '#22223b',
    textMedium: '#4a4e69',
    textLight: '#bfc0c0',
    borderColor: '#2a2a40',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
    info: '#3498db',
  },
  
  fonts: {
    header: "'Poppins', 'Montserrat', 'Segoe UI', sans-serif",
    body: "'Inter', 'Open Sans', 'Segoe UI', sans-serif",
    mono: "'Fira Code', 'Roboto Mono', monospace",
  },
  
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  breakpoints: {
    xs: '480px',
    sm: '768px',
    md: '992px',
    lg: '1200px',
    xl: '1400px',
  },
  
  borderRadius: {
    small: '6px',
    medium: '12px',
    large: '24px',
    pill: '50px',
    circle: '50%',
  },

  spacing: {
    xs: '4px',
    sm: '12px',
    md: '24px',
    lg: '36px',
    xl: '48px',
    xxl: '64px',
    xxxl: '96px',
  },
  
  transitions: {
    fast: '0.2s',
    medium: '0.3s',
    slow: '0.5s',
  },
  
  zIndex: {
    navbar: 1000,
    modal: 1100,
    tooltip: 1200,
  },
    boxShadows: {
    soft: '0 2px 8px rgba(34, 34, 59, 0.08)',
    medium: '0 8px 24px rgba(34, 34, 59, 0.12)',
    hard: '0 16px 32px rgba(34, 34, 59, 0.18)',
    button: '0 2px 8px rgba(154, 140, 152, 0.08)',
    buttonHover: '0 4px 16px rgba(154, 140, 152, 0.16)',
    input: 'inset 0 2px 4px 0 rgba(34, 34, 59, 0.06)',
    glowPrimary: '0 0 24px 2px #4a4e69',
    glowAccent: '0 0 24px 2px #9a8c98',
    card: '0 8px 32px rgba(34, 34, 59, 0.16)',
    cardHover: '0 24px 48px rgba(34, 34, 59, 0.22)',
    innerGlow: 'inset 0 0 24px #4a4e6933',
  },
  
  gradients: {
    heroBackground: 'radial-gradient(circle at 60% 40%, #232336 0%, #18181b 100%)',
    primaryToSecondary: 'linear-gradient(90deg, #22223b 0%, #4a4e69 100%)',
    accent: 'linear-gradient(90deg, #9a8c98 0%, #f8f9fa 100%)',
    cardOverlay: 'linear-gradient(135deg, rgba(34,34,59,0.85) 0%, rgba(74,78,105,0.85) 100%)',
    buttonGlow: 'linear-gradient(90deg, #9a8c98 0%, #4a4e69 100%)',
  },
  
  effects: {
    auraPrimary: '0 0 24px #4a4e6999',
    auraAccent: '0 0 24px #9a8c9899',
    glassLight: 'backdrop-filter: blur(12px); background-color: rgba(255,255,255,0.7)',
    glassDark: 'backdrop-filter: blur(12px); background-color: rgba(34,34,59,0.7)',
  },
};

export default modernTheme;

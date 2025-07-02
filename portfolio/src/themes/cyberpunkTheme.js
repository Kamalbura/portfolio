// Professional modern theme with refined color scheme
const modernTheme = {
  colors: {
    primary: '#3a86ff',      // Primary blue
    secondary: '#8338ec',    // Purple accent
    accent: '#fb5607',       // Orange accent for CTAs
    bgLight: '#ffffff',      // Light background
    bgDark: '#f8f9fa',       // Slightly darker background
    bgDarker: '#f0f0f5',     // Even darker background for cards
    bgCard: '#ffffff',       // Card background
    textDark: '#212529',     // Main text color
    textMedium: '#495057',   // Medium emphasis text
    textLight: '#6c757d',    // Light emphasis text
    borderColor: '#e9ecef',  // Border color for cards and dividers
    success: '#2ecc71',      // Success state
    warning: '#f39c12',      // Warning state
    error: '#e74c3c',        // Error state
    info: '#3498db',         // Info state
  },
  
  fonts: {
    header: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'Fira Code', monospace",
  },
  
  breakpoints: {
    xs: '480px',
    sm: '768px',
    md: '1024px',
    lg: '1200px',
    xl: '1440px',
  },
  
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    pill: '50px',
    circle: '50%',
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
    soft: '0 2px 10px rgba(0, 0, 0, 0.05)',
    medium: '0 5px 15px rgba(0, 0, 0, 0.08)',
    large: '0 10px 25px rgba(0, 0, 0, 0.1)',
    hover: '0 10px 20px rgba(0, 0, 0, 0.12)',
    button: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },
};

export default modernTheme;

// This theme is deprecated. Please use modernTheme.js for all theming purposes.
// All references to cyberpunkTheme should be removed from the codebase.

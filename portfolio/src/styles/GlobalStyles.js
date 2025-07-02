import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`  /* Import Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap');

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.primary} ${({ theme }) => theme.colors.bgDarker};
  }
  body {
    font-family: ${({ theme }) => theme.fonts.body};
    background-color: ${({ theme }) => theme.colors.bgLight};
    color: ${({ theme }) => theme.colors.textDark};
    line-height: 1.7;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease;
    letter-spacing: 0.01em;
  }
  /* Custom scrollbar for webkit browsers */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bgDarker};
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 20px;
    border: 3px solid ${({ theme }) => theme.colors.bgDarker};
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.header};
    font-weight: 700;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.textDark};
    line-height: 1.2;
    letter-spacing: -0.5px;
  }

  h1 {
    font-size: 3.5rem;
    letter-spacing: -1px;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 2.2rem;
    }
  }
  h2 {
    font-size: 2.5rem;
    letter-spacing: -0.3px;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 2rem;
    }
  }

  h3 {
    font-size: 1.8rem;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 1.5rem;
    }
  }

  p {
    margin-bottom: 1.5rem;
    color: ${({ theme }) => theme.colors.textMedium};
    font-size: 1.1rem;
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.accent};
    font-weight: 500;
    transition: color 0.2s;
    
    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }

  button, .button {
    font-family: ${({ theme }) => theme.fonts.body};
    background: ${({ theme }) => theme.gradients.buttonGlow};
    color: #fff;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.pill};
    padding: 0.75rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: ${({ theme }) => theme.boxShadows.button};
    transition: all 0.3s;
    
    &:hover {
      background: ${({ theme }) => theme.gradients.accent};
      color: ${({ theme }) => theme.colors.primary};
      box-shadow: ${({ theme }) => theme.boxShadows.buttonHover};
      transform: translateY(-2px);
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.accent};
    }
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
    transition: opacity 0.3s ease;
  }

  section {
    padding: 120px 0;
    background: none;
    position: relative;
    overflow: hidden;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      padding: 80px 0;
    }
    
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      padding: 60px 0;
    }
  }
  
  /* Animation classes */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }
  
  /* Utility classes */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
  }
  
  .text-center {
    text-align: center;
  }
  
  .flex {
    display: flex;
  }
  
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .section-title {
    text-align: center;
    margin-bottom: 50px;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
    }
  }
`;

export default GlobalStyles;

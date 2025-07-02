import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import { scrollToElement } from '../../utils/scrollUtils';
import useActiveSection from '../../hooks/useActiveSection';

// Styled Components
const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: ${({ theme }) => theme.zIndex.navbar};
  padding: 15px 0;
  transition: all ${({ theme }) => theme.transitions.medium} ease;
  background-color: rgba(8, 8, 20, 0.85);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &.scrolled {
    padding: 10px 0;
    background-color: rgba(8, 8, 20, 0.95);
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
  }
`;

const NavInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
`;

const LogoText = styled.div`
  font-family: ${({ theme }) => theme.fonts.header};
  font-weight: 700;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.textLight};
  letter-spacing: 2px;
  position: relative;
  padding: 5px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.accent} 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    position: fixed;
    top: 0;
    right: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
    flex-direction: column;
    background-color: rgba(8, 8, 20, 0.95);
    width: 80%;
    height: 100vh;
    padding-top: 80px;
    transition: right ${({ theme }) => theme.transitions.medium} ease;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: ${({ isOpen }) => (isOpen ? '-5px 0 20px rgba(0, 0, 0, 0.5)' : 'none')};
    z-index: ${({ theme }) => theme.zIndex.navbar - 1};
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme, $isActive }) => ($isActive ? theme.colors.textLight : theme.colors.textDim)};
  position: relative;
  padding: 8px 12px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.3s ease;
  background: ${({ theme, $isActive }) => ($isActive ? `rgba(0, 153, 204, 0.15)` : 'transparent')};
  
  &::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.accent};
    opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
    transition: all 0.3s ease;
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.textLight};
    background: rgba(0, 153, 204, 0.1);
    transform: translateY(-2px);
    
    &::after {
      opacity: 0.5;
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    padding: 15px 20px;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ThemeToggle = styled.button`
  position: relative;
  overflow: hidden;
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.medium} ease;
  
  &:hover {
    background-color: rgba(0, 153, 204, 0.1);
  }
  
  svg {
    font-size: 1.2rem;
    transition: transform 0.5s ease;
  }
  
  &:hover svg {
    transform: rotate(180deg);
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  z-index: ${({ theme }) => theme.zIndex.navbar + 1};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: block;
  }
`;

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const location = useLocation();
  
  // Track active section when scrolling
  const activeSection = useActiveSection(
    ['home', 'projects', 'experience', 'skills', 'tools', 'contact'], 
    { offset: 100 }
  );
  
  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile nav when changing routes
  useEffect(() => {
    setIsNavOpen(false);
  }, [location]);
  
  // Toggle body scroll when mobile nav is open
  useEffect(() => {
    if (isNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isNavOpen]);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Theme switching logic will be added later
  };
  
  return (
    <NavbarContainer className={isScrolled ? 'scrolled' : ''}>
      <NavInner>
        <Logo to="/">
          <LogoIcon>
            <LogoText>K<span>B</span></LogoText>
          </LogoIcon>
        </Logo>
        
        <HamburgerButton onClick={() => setIsNavOpen(!isNavOpen)}>
          {isNavOpen ? <FaTimes /> : <FaBars />}
        </HamburgerButton>
          <NavLinks isOpen={isNavOpen}>
          <NavLink 
            to="/" 
            $isActive={(location.pathname === '/' && !location.hash) || activeSection === 'home'}
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                setIsNavOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <span>Home</span>
          </NavLink>
          
          <NavLink 
            to="/#projects" 
            $isActive={location.hash === '#projects' || activeSection === 'projects'}
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                setIsNavOpen(false);
                scrollToElement('projects', 80, 800);
              }
            }}
          >
            <span>Projects</span>
          </NavLink>
          
          <NavLink 
            to="/#experience" 
            $isActive={location.hash === '#experience' || activeSection === 'experience'}
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                setIsNavOpen(false);
                scrollToElement('experience', 80, 800);
              }
            }}
          >
            <span>Experience</span>
          </NavLink>
          
          <NavLink 
            to="/#skills" 
            $isActive={location.hash === '#skills' || activeSection === 'skills'}
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                setIsNavOpen(false);
                scrollToElement('skills', 80, 800);
              }
            }}
          >
            <span>Skills</span>
          </NavLink>
          
          <NavLink 
            to="/#tools" 
            $isActive={location.hash === '#tools' || activeSection === 'tools'}
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                setIsNavOpen(false);
                scrollToElement('tools', 80, 800);
              }
            }}
          >
            <span>Tools</span>
          </NavLink>
          
          <NavLink 
            to="/#contact" 
            $isActive={location.hash === '#contact' || activeSection === 'contact'}
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                setIsNavOpen(false);
                scrollToElement('contact', 80, 800);
              }
            }}
          >
            <span>Contact</span>
          </NavLink>
          
          <NavLink to="/personal" $isActive={location.pathname === '/personal'}>
            <span>Personal</span>
          </NavLink>
        </NavLinks>
        
        <NavActions>
          <ThemeToggle onClick={toggleTheme}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </ThemeToggle>
        </NavActions>
      </NavInner>
    </NavbarContainer>
  );
};

export default Navbar;

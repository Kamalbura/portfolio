import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.bgDarker};
  padding: 70px 0 30px;
  position: relative;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent, 
      ${({ theme }) => theme.colors.primary}, 
      ${({ theme }) => theme.colors.secondary}, 
      transparent
    );
    opacity: 0.4;
  }
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 2rem;
  align-items: start;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const FooterLogo = styled.div`
  margin-bottom: 20px;
  
  a {
    font-family: ${({ theme }) => theme.fonts.header};
    font-size: 1.8rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textLight};
    letter-spacing: 2px;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.accent} 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const FooterAbout = styled.div`
  p {
    color: ${({ theme }) => theme.colors.textDim};
    max-width: 300px;
    margin-bottom: 20px;
    line-height: 1.7;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      margin: 0 auto 20px;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    justify-content: center;
  }
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.colors.primary};
  transition: all ${({ theme }) => theme.transitions.medium} ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.bgDarker};
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.effects.auraPrimary};
  }
`;

const FooterNav = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterTitle = styled.h4`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.2rem;
  margin-bottom: 20px;
`;

const FooterMenu = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  width: 100%;
  
  li {
    margin-bottom: 12px;
  }
  
  a {
    color: ${({ theme }) => theme.colors.textDim};
    transition: all ${({ theme }) => theme.transitions.medium} ease;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 2px;
      background-color: ${({ theme }) => theme.colors.primary};
      transition: width ${({ theme }) => theme.transitions.medium} ease;
    }
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
      
      &::after {
        width: 100%;
      }
    }
  }
`;

const ContactInfo = styled.div`
  text-align: right;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    text-align: center;
  }
`;

const ContactItem = styled.div`
  margin-bottom: 15px;
  color: ${({ theme }) => theme.colors.textDim};
  
  a {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: flex-end;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      justify-content: center;
    }
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const CopyrightBar = styled.div`
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 20px;
  padding-right: 20px;
  
  p {
    color: ${({ theme }) => theme.colors.textDim};
    font-size: 0.9rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterAbout>
          <FooterLogo>
            <Link to="/">KB</Link>
          </FooterLogo>
          <p>Professional portfolio showcasing IoT solutions, ML projects and software engineering work.</p>
          <SocialLinks>
            <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </SocialLink>
            <SocialLink href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub />
            </SocialLink>
            <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </SocialLink>
          </SocialLinks>
        </FooterAbout>
        
        <FooterNav>
          <FooterTitle>Navigation</FooterTitle>
          <FooterMenu>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/personal">Personal</Link></li>
          </FooterMenu>
        </FooterNav>
        
        <ContactInfo>
          <FooterTitle>Contact</FooterTitle>
          <ContactItem>
            <a href="mailto:contact@kamalbura.com">
              <span>contact@kamalbura.com</span>
              <FaEnvelope />
            </a>
          </ContactItem>
        </ContactInfo>
      </FooterContent>
      
      <CopyrightBar>
        <p>&copy; {currentYear} Kamal Bura. All rights reserved.</p>
        <p>IoT Developer & ML Enthusiast</p>
      </CopyrightBar>
    </FooterContainer>
  );
};

export default Footer;

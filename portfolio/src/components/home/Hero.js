import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaGithub, FaLinkedin } from 'react-icons/fa';

// Styled components for a professional yet distinctive hero section
const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.gradients.heroBackground}, ${({ theme }) => theme.colors.bgLight};
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 2;
  width: 100%;
`;

const HeroContent = styled(motion.div)`
  max-width: 700px;
  z-index: 2;
  text-align: left;
  padding: 60px 40px 60px 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 40px 0;
    text-align: center;
  }
`;

const HeroText = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    text-align: center;
  }
`;

const PreTitle = styled(motion.span)`
  display: inline-block;
  font-size: 1.1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 15px;
  position: relative;
  padding-left: 30px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 20px;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-50%);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-left: 0;
    padding-bottom: 10px;
    
    &::before {
      width: 40px;
      left: 50%;
      top: auto;
      bottom: 0;
      transform: translateX(-50%);
    }
  }
`;

const HeroTitle = styled(motion.h1)`
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 3.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -1px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2.2rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.textMedium};
  margin-bottom: 36px;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const TechBadges = styled(motion.div)`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
  }
`;

const TechBadge = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: rgba(0, 153, 204, 0.1);
  border: 1px solid rgba(0, 153, 204, 0.2);
  border-radius: 30px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.primary};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    background: rgba(0, 153, 204, 0.15);
    box-shadow: ${({ theme }) => theme.effects.auraPrimary};
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 15px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    width: 100%;
  }
`;

const PrimaryButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  padding: 12px 28px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: translateX(-100%);
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.effects.auraPrimary};
    
    &::before {
      transform: translateX(100%);
      transition: transform 0.8s ease;
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const SecondaryButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  padding: 12px 28px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  
  &:hover {
    transform: translateY(-3px);
    background: rgba(0, 153, 204, 0.1);
    box-shadow: ${({ theme }) => theme.boxShadows.soft};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const HeroImageWrapper = styled(motion.div)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const HeroImage = styled.img`
  width: 420px;
  max-width: 90vw;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.boxShadows.card};
  background: ${({ theme }) => theme.gradients.primaryToAccent};
  object-fit: cover;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 260px;
  }
`;

const SocialProof = styled(motion.div)`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 30px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    position: relative;
    bottom: auto;
    left: auto;
    transform: none;
    margin-top: 40px;
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 153, 204, 0.1);
  color: ${({ theme }) => theme.colors.primary};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px) rotate(8deg);
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    box-shadow: ${({ theme }) => theme.effects.auraPrimary};
  }
`;

const ScrollPrompt = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.textDim};
  
  span {
    font-size: 0.9rem;
  }
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
    animation: bounce 2s infinite;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
`;

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerItems = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Hero = () => {
  let heroImage;
  try {
    heroImage = require('../../assets/images/hero-illustration.png');
  } catch (e) {
    heroImage = 'https://via.placeholder.com/600x400/4361ee/ffffff?text=Professional+Portfolio';
  }

  return (
    <HeroSection id="home">
      <ContentWrapper>
        <HeroContent
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <HeroText>
            <PreTitle
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              IoT Developer & ML Specialist
            </PreTitle>
            
            <HeroTitle
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Inspiring Digital Experiences<br />
              <span style={{ color: '#3f37c9' }}>for the Modern World</span>
            </HeroTitle>
            
            <HeroSubtitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              I build beautiful, robust, and high-performance web solutions that make an impact.
            </HeroSubtitle>
            
            <TechBadges
              variants={staggerItems}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeInUp}>
                <TechBadge>IoT Development</TechBadge>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <TechBadge>Machine Learning</TechBadge>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <TechBadge>Embedded Systems</TechBadge>
              </motion.div>
            </TechBadges>
            
            <ButtonGroup
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <PrimaryButton to="/projects">
                View Projects <FaArrowRight />
              </PrimaryButton>
              <SecondaryButton to="/contact">
                Get In Touch
              </SecondaryButton>
            </ButtonGroup>
          </HeroText>
          
          <HeroImageWrapper
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <HeroImage src={heroImage} alt="Professional Portfolio Hero" />
          </HeroImageWrapper>
        </HeroContent>
        
        <SocialProof
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <SocialLinks>
            <SocialLink href="https://github.com/username" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub size={20} />
            </SocialLink>
            <SocialLink href="https://linkedin.com/in/username" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin size={20} />
            </SocialLink>
          </SocialLinks>
          
          <ScrollPrompt>
            <span>Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FaArrowRight />
            </motion.div>
          </ScrollPrompt>
        </SocialProof>
      </ContentWrapper>
    </HeroSection>
  );
};

export default Hero;

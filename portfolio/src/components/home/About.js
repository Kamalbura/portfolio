import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AboutSection = styled.section`
  min-height: 80vh;
  background: ${({ theme }) => theme.colors.bgDarker};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 20px;
  display: flex;
  align-items: center;
  gap: 60px;
  flex-wrap: wrap;
  z-index: 2;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: 30px;
    text-align: center;
  }
`;

const AboutImage = styled(motion.img)`
  width: 320px;
  max-width: 90vw;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.boxShadows.card};
  object-fit: cover;
  background: ${({ theme }) => theme.gradients.primaryToAccent};
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 180px;
  }
`;

const AboutText = styled(motion.div)`
  flex: 1;
  color: ${({ theme }) => theme.colors.textLight};
`;

const AboutTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-family: ${({ theme }) => theme.fonts.header};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 18px;
`;

const AboutDescription = styled(motion.p)`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textDim};
  line-height: 1.7;
  margin-bottom: 18px;
`;

const About = () => {
  let profileImage;
  try {
    profileImage = require('../../assets/images/profile.jpg');
  } catch (e) {
    profileImage = 'https://via.placeholder.com/320x320/232336/bfc0c0?text=Profile+Photo';
  }

  return (
    <AboutSection id="about">
      <ContentWrapper>
        <AboutImage
          src={profileImage}
          alt="Profile"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        />
        <AboutText
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <AboutTitle>About Me</AboutTitle>
          <AboutDescription>
            I am a passionate developer focused on building inspiring digital experiences. My expertise spans IoT, machine learning, and full-stack web development. I love solving real-world problems with elegant, scalable solutions and collaborating with creative teams to bring ideas to life.
          </AboutDescription>
          <AboutDescription>
            Driven by curiosity and a love for technology, I strive to deliver work that is not only functional but also beautiful and meaningful. Let's create something amazing together.
          </AboutDescription>
        </AboutText>
      </ContentWrapper>
    </AboutSection>
  );
};

export default About;

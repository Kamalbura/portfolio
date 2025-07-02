import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(0.98); opacity: 0.8; }
  50% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.98); opacity: 0.8; }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled Components
const PreloaderContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.bgLight};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.bgCard};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.boxShadows.medium};
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid ${({ theme }) => `${theme.colors.primary}30`};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  animation: ${rotate} 1s infinite linear;
`;

const Logo = styled.div`
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 2.2rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textDark};
  animation: ${pulse} 2.5s infinite ease-in-out;
  letter-spacing: 1px;
  
  span {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const LoadingText = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMedium};
  font-family: ${({ theme }) => theme.fonts.body};
`;

const ProgressBar = styled.div`
  width: 240px;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.bgDark};
  margin-top: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  width: ${({ progress }) => `${progress}%`};
  background-color: ${({ theme }) => theme.colors.primary};
  transition: width 0.3s ease;
`;

const Preloader = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    // Simple simulation of loading progress
    let timer = 0;
    let interval = setInterval(() => {
      timer += 1;
      const newProgress = Math.min(100, timer * 5);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsComplete(true);
          if (onLoadComplete) onLoadComplete();
        }, 500);
      }
    }, 100);
    
    // Safety timeout
    const fallbackTimer = setTimeout(() => {
      clearInterval(interval);
      setIsComplete(true);
      if (onLoadComplete) onLoadComplete();
    }, 5000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(fallbackTimer);
    };
  }, [onLoadComplete]);
      // No need for a separate complete loading function
  
  if (isComplete) return null;
    return (
    <PreloaderContainer
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <LoaderWrapper>
        <Logo>
          K<span>B</span>
        </Logo>
        <Spinner />
        <LoadingText>Loading {progress}%</LoadingText>
        <ProgressBar>
          <Progress progress={progress} />
        </ProgressBar>
      </LoaderWrapper>
    </PreloaderContainer>
  );
};

export default Preloader;

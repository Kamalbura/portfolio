import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Projects from '../components/home/Projects';
import Experience from '../components/home/Experience';
import Skills from '../components/home/Skills';
import Tools from '../components/home/Tools';
import Contact from '../components/home/Contact';
import { scrollToTopButton } from '../utils/scrollUtils';

const HomeContainer = styled.main`
  width: 100%;
  min-height: 100vh;
`;

const Home = () => {
  useEffect(() => {
    // Initialize scroll-to-top button
    const scrollButton = scrollToTopButton(350);
    scrollButton.init();
    
    // Clean up on component unmount
    return () => {
      scrollButton.destroy();
    };
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <HomeContainer>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Skills />
        <Tools />
        <Contact />
      </HomeContainer>
    </motion.div>
  );
};

export default Home;

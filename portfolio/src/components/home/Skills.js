import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaCode, FaServer, FaDatabase,
  FaCloud, FaMicrochip
} from 'react-icons/fa';

// Sample skills data - would come from an API or data file in production
const skillsData = {
  frontend: [
    { name: 'React', level: 90 },
    { name: 'TypeScript', level: 85 },
    { name: 'JavaScript', level: 95 },
    { name: 'HTML/CSS', level: 90 },
    { name: 'Redux', level: 80 },
    { name: 'Next.js', level: 75 },
  ],
  backend: [
    { name: 'Node.js', level: 85 },
    { name: 'Express', level: 80 },
    { name: 'Python', level: 75 },
    { name: 'GraphQL', level: 70 },
    { name: 'Django', level: 65 },
  ],
  database: [
    { name: 'MongoDB', level: 85 },
    { name: 'PostgreSQL', level: 80 },
    { name: 'MySQL', level: 75 },
    { name: 'Firebase', level: 70 },
  ],
  devops: [
    { name: 'Docker', level: 80 },
    { name: 'AWS', level: 75 },
    { name: 'CI/CD', level: 70 },
    { name: 'Linux', level: 75 },
  ],
  embedded: [
    { name: 'ESP32/8266', level: 80 },
    { name: 'Arduino', level: 85 },
    { name: 'Raspberry Pi', level: 75 },
    { name: 'C/C++', level: 70 },
  ],
};

// Styled components
const SkillsSection = styled.section`
  padding: 100px 0;
  background-color: ${({ theme }) => theme.colors.bgDark};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      ellipse at bottom left,
      rgba(106, 90, 205, 0.03),
      transparent 70%
    );
    pointer-events: none;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const Subtitle = styled(motion.span)`
  display: inline-block;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 15px;
  position: relative;
  padding-bottom: 10px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 2px;
    background: linear-gradient(
      to right,
      transparent,
      ${({ theme }) => theme.colors.secondary},
      transparent
    );
  }
`;

const Title = styled(motion.h2)`
  font-size: clamp(2rem, 4vw, 2.5rem);
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 20px;
  
  span {
    color: ${({ theme }) => theme.colors.primary};
    position: relative;
  }
`;

const Description = styled(motion.p)`
  color: ${({ theme }) => theme.colors.textDim};
  max-width: 700px;
  margin: 0 auto;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const SkillsTabs = styled.div`
  display: flex;
  justify-content: center;
  margin: 40px 0 30px;
  flex-wrap: wrap;
  gap: 10px;
`;

const SkillTab = styled.button`
  background: ${({ active, theme }) => 
    active ? theme.colors.primary : 'rgba(0, 153, 204, 0.1)'};
  color: ${({ active, theme }) => 
    active ? theme.colors.textLight : theme.colors.primary};
  border: 1px solid ${({ active, theme }) => 
    active ? theme.colors.primary : 'rgba(0, 153, 204, 0.2)'};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 10px 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: ${({ active, theme }) => 
    active ? theme.effects.auraPrimary : 'none'};
  
  &:hover {
    background: ${({ active, theme }) => 
      active ? theme.colors.primary : 'rgba(0, 153, 204, 0.2)'};
    transform: translateY(-2px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 8px 15px;
    font-size: 0.85rem;
  }
`;

const SkillsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 40px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const SkillCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bgCard};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 25px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(106, 90, 205, 0.1);
  box-shadow: ${({ theme }) => theme.boxShadows.soft};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.boxShadows.glowPrimary};
  }
`;

const SkillName = styled.h3`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.1rem;
  margin-bottom: 15px;
`;

const ProgressContainer = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
  position: relative;
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  width: ${({ level }) => level}%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
  border-radius: 4px;
`;

const ProgressLabels = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.textDim};
  font-size: 0.85rem;
`;

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('frontend');
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const animationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.1,
        ease: "easeOut",
        duration: 0.3
      }
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.08,
        duration: 0.3,
        ease: "easeOut"
      }
    }),
  };

  // Map category to icon
  const categoryIcons = {
    frontend: <FaCode />,
    backend: <FaServer />,
    database: <FaDatabase />,
    devops: <FaCloud />,
    embedded: <FaMicrochip />
  };

  return (
    <SkillsSection id="skills" ref={ref}>
      <ContentWrapper>
        <SectionHeader>
          <Subtitle
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={animationVariants}
          >
            Expertise
          </Subtitle>
          <Title
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={animationVariants}
          >
            Professional <span>Skills</span>
          </Title>
          <Description
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={animationVariants}
          >
            A showcase of my technical abilities and specialized expertise across various domains
          </Description>
        </SectionHeader>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={tabVariants}
        >
          <SkillsTabs>
            {Object.keys(skillsData).map((category) => (
              <SkillTab
                key={category}
                active={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {categoryIcons[category]}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SkillTab>
            ))}
          </SkillsTabs>
        </motion.div>

        <SkillsGrid>
          {skillsData[activeCategory].map((skill, index) => (
            <SkillCard
              key={skill.name}
              custom={index}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={cardVariants}
            >
              <SkillName>{skill.name}</SkillName>
              <ProgressContainer>
                <ProgressBar
                  level={skill.level}
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                />
              </ProgressContainer>
              <ProgressLabels>
                <span>Beginner</span>
                <span>Expert</span>
              </ProgressLabels>
            </SkillCard>
          ))}
        </SkillsGrid>
      </ContentWrapper>
    </SkillsSection>
  );
};

export default Skills;

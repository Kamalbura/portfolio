import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Sample tools data - would come from a data file or API in production
const toolsData = [
  {
    category: 'Development',
    tools: [
      { name: 'VS Code', icon: 'https://cdn.worldvectorlogo.com/logos/visual-studio-code-1.svg', level: 'Expert' },
      { name: 'Git & GitHub', icon: 'https://cdn.worldvectorlogo.com/logos/github-icon-1.svg', level: 'Expert' },
      { name: 'Docker', icon: 'https://cdn.worldvectorlogo.com/logos/docker.svg', level: 'Advanced' },
      { name: 'Webpack', icon: 'https://cdn.worldvectorlogo.com/logos/webpack-icon.svg', level: 'Advanced' },
      { name: 'NPM', icon: 'https://cdn.worldvectorlogo.com/logos/npm.svg', level: 'Expert' },
      { name: 'Postman', icon: 'https://cdn.worldvectorlogo.com/logos/postman.svg', level: 'Advanced' },
    ]
  },
  {
    category: 'Design',
    tools: [
      { name: 'Figma', icon: 'https://cdn.worldvectorlogo.com/logos/figma-1.svg', level: 'Advanced' },
      { name: 'Adobe XD', icon: 'https://cdn.worldvectorlogo.com/logos/adobe-xd-1.svg', level: 'Intermediate' },
      { name: 'Photoshop', icon: 'https://cdn.worldvectorlogo.com/logos/adobe-photoshop-2.svg', level: 'Intermediate' },
      { name: 'Illustrator', icon: 'https://cdn.worldvectorlogo.com/logos/adobe-illustrator-cc-icon.svg', level: 'Basic' },
    ]
  },
  {
    category: 'Cloud & DevOps',
    tools: [
      { name: 'AWS', icon: 'https://cdn.worldvectorlogo.com/logos/aws-2.svg', level: 'Advanced' },
      { name: 'Firebase', icon: 'https://cdn.worldvectorlogo.com/logos/firebase-1.svg', level: 'Advanced' },
      { name: 'GitHub Actions', icon: 'https://cdn.worldvectorlogo.com/logos/github-actions-1.svg', level: 'Intermediate' },
      { name: 'Netlify', icon: 'https://cdn.worldvectorlogo.com/logos/netlify.svg', level: 'Advanced' },
      { name: 'Vercel', icon: 'https://cdn.worldvectorlogo.com/logos/vercel.svg', level: 'Advanced' },
    ]
  },
  {
    category: 'Analytics & Testing',
    tools: [
      { name: 'Jest', icon: 'https://cdn.worldvectorlogo.com/logos/jest-2.svg', level: 'Advanced' },
      { name: 'Cypress', icon: 'https://cdn.worldvectorlogo.com/logos/cypress.svg', level: 'Intermediate' },
      { name: 'Google Analytics', icon: 'https://cdn.worldvectorlogo.com/logos/google-analytics-4.svg', level: 'Advanced' },
      { name: 'Sentry', icon: 'https://cdn.worldvectorlogo.com/logos/sentry-3.svg', level: 'Intermediate' },
    ]
  }
];

// Level color mapping
const levelColorMap = {
  'Expert': '#0099cc',     // Primary color
  'Advanced': '#6a5acd',   // Secondary color
  'Intermediate': '#4da6ff',
  'Basic': '#8793a8'
};

// Styled components
const ToolsSection = styled.section`
  padding: 100px 0;
  background-color: ${({ theme }) => theme.colors.bgDarker};
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
      ellipse at top right,
      rgba(0, 153, 204, 0.02),
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
  color: ${({ theme }) => theme.colors.primary};
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
      ${({ theme }) => theme.colors.primary},
      transparent
    );
  }
`;

const Title = styled(motion.h2)`
  font-size: clamp(2rem, 4vw, 2.5rem);
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 20px;
  
  span {
    color: ${({ theme }) => theme.colors.secondary};
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

const CategorySection = styled(motion.div)`
  margin-top: 60px;
`;

const CategoryTitle = styled(motion.h3)`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.5rem;
  margin-bottom: 25px;
  position: relative;
  padding-left: 15px;
  display: inline-block;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 5px;
    height: 85%;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 5px;
  }
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 20px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const ToolCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bgCard};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: ${({ theme }) => theme.boxShadows.soft};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.7s ease;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.effects.auraPrimary};
    border-color: rgba(67, 97, 238, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const ToolIcon = styled.div`
  width: 55px;
  height: 55px;
  margin-bottom: 15px;
  position: relative;
  padding: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    box-shadow: ${({ theme }) => theme.effects.auraPrimary};
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  ${ToolCard}:hover &::after {
    opacity: 0.5;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s ease;
    filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.1));
    
    ${ToolCard}:hover & {
      transform: scale(1.15) rotate(5deg);
    }
  }
`;

const ToolName = styled.h4`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 8px;
  font-size: 1rem;
  font-weight: 600;
  transition: color 0.3s ease;
  
  ${ToolCard}:hover & {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ToolLevel = styled.span`
  color: ${({ level }) => levelColorMap[level]};
  font-size: 0.85rem;
  font-weight: 500;
  padding: 4px 12px;
  margin-top: 5px;
  border-radius: 12px;
  background: ${({ theme, level }) => `rgba(${level === 'Expert' ? '67, 97, 238' : level === 'Advanced' ? '76, 201, 240' : '63, 55, 201'}, 0.15)`};
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  ${ToolCard}:hover & {
    box-shadow: ${({ theme, level }) => level === 'Expert' ? theme.effects.auraPrimary : level === 'Advanced' ? theme.effects.auraSecondary : 'none'};
    transform: translateY(-2px) scale(1.05);
    background: ${({ theme, level }) => `rgba(${level === 'Expert' ? '67, 97, 238' : level === 'Advanced' ? '76, 201, 240' : '63, 55, 201'}, 0.25)`};
  }
  
  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${({ level }) => levelColorMap[level]};
    margin-right: 5px;
  }
`;

const Tools = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: "easeOut" 
      }
    }
  };

  const toolVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: Math.min(i * 0.03, 0.6), // Cap the delay at 0.6s for better performance with many items
        duration: 0.3,
        ease: "easeOut"
      }
    }),
  };

  return (
    <ToolsSection id="tools">
      <ContentWrapper>
        <SectionHeader>
          <Subtitle
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={itemVariants}
          >
            My Toolkit
          </Subtitle>
          <Title
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={itemVariants}
          >
            Software & <span>Tools</span>
          </Title>
          <Description
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={itemVariants}
          >
            Applications and platforms I leverage to streamline development and maximize productivity
          </Description>
        </SectionHeader>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={sectionVariants}
        >
          {toolsData.map((category, catIndex) => (
            <CategorySection 
              key={category.category}
              variants={itemVariants}
            >
              <CategoryTitle variants={itemVariants}>
                {category.category}
              </CategoryTitle>
              <ToolsGrid>
                {category.tools.map((tool, toolIndex) => (                  <ToolCard
                    key={tool.name}
                    custom={(catIndex * 6) + toolIndex}
                    variants={toolVariants}
                    tabIndex={0}
                    role="article"
                    aria-label={`${tool.name} - ${tool.level}`}
                  >
                    <ToolIcon>
                      <img src={tool.icon} alt={`${tool.name} icon`} />
                    </ToolIcon>
                    <ToolName>{tool.name}</ToolName>
                    <ToolLevel level={tool.level}>{tool.level}</ToolLevel>
                  </ToolCard>
                ))}
              </ToolsGrid>
            </CategorySection>
          ))}
        </motion.div>
      </ContentWrapper>
    </ToolsSection>
  );
};

export default Tools;

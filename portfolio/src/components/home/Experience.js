import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaCode, FaCogs, FaServer } from 'react-icons/fa';

// Styled components for a professional experience section
const ExperienceSection = styled.section`
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
      rgba(0, 153, 204, 0.03),
      transparent 70%
    );
    pointer-events: none;
  }
`;

const SectionContainer = styled.div`
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

// Timeline component
const Timeline = styled.div`
  position: relative;
  max-width: 1000px;
  margin: 60px auto 0;
  padding: 20px 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 2px;
    background: linear-gradient(
      to bottom,
      ${({ theme }) => theme.colors.primary},
      ${({ theme }) => theme.colors.secondary}
    );
    transform: translateX(-50%);
    z-index: 0;
    box-shadow: ${({ theme }) => theme.effects.auraPrimary};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      left: 30px;
    }
    
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      left: 20px;
    }
  }
`;

const TimelineItem = styled(motion.div)`
  position: relative;
  margin-bottom: 60px;
  width: 100%;
  transition: all 0.3s ease;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: 50px;
  }
`;

const TimelineDot = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  width: 20px;
  height: 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow: ${({ theme }) => theme.effects.auraPrimary};
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    top: 5px;
    left: 5px;
    background-color: ${({ theme }) => theme.colors.bgDarker};
    border-radius: 50%;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    left: 30px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    left: 20px;
    width: 16px;
    height: 16px;
    
    &::after {
      width: 8px;
      height: 8px;
      top: 4px;
      left: 4px;
    }
  }
`;

const TimelineContent = styled(motion.div)`
  position: relative;
  width: 45%;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 25px;
  transition: all ${({ theme }) => theme.transitions.medium} ease;
  margin-left: ${({ position }) => (position === 'right' ? 'auto' : '0')};
  margin-right: ${({ position }) => (position === 'left' ? 'auto' : '0')};
  box-shadow: ${({ theme }) => theme.boxShadows.soft};
  backdrop-filter: blur(5px);
  z-index: 2;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.boxShadows.medium};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: calc(100% - 80px);
    margin-left: 60px !important;
    margin-right: 0 !important;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: calc(100% - 50px);
    margin-left: 40px !important;
    padding: 15px;
  }
`;

const TimelineHeader = styled.div`
  margin-bottom: 15px;
`;

const TimelineTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.4rem;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    font-size: 1.2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.2rem;
  }
`;

const TimelineCompany = styled.span`
  display: block;
  font-weight: 500;
  margin-bottom: 5px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const TimelineDate = styled.span`
  display: inline-block;
  padding: 4px 10px;
  background-color: rgba(0, 153, 204, 0.1);
  border-radius: 15px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const TimelineBody = styled.div`
  color: ${({ theme }) => theme.colors.textDim};
`;

const TimelineAchievements = styled.ul`
  margin-top: 15px;
  padding-left: 20px;
  
  li {
    margin-bottom: 8px;
    position: relative;
    color: ${({ theme }) => theme.colors.textDim};
    
    &::before {
      content: '•';
      color: ${({ theme }) => theme.colors.primary};
      position: absolute;
      left: -15px;
      font-size: 1.2rem;
    }
  }
`;

// Animation variants

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Experience data
const experienceData = [
  {
    id: 1,
    title: 'Senior IoT Developer',
    company: 'Tech Solutions Inc.',
    date: '2022 - Present',
    description: 'Leading the development of IoT-based solutions for industrial automation and smart environments. Managing a team of 3 developers and overseeing project deployment.',
    achievements: [
      'Developed an end-to-end monitoring system resulting in 30% efficiency improvement',
      'Implemented machine learning models for predictive maintenance',
      'Designed scalable cloud architecture using AWS IoT Core'
    ],
    icon: <FaCogs />
  },
  {
    id: 2,
    title: 'IoT Developer',
    company: 'InnovateX Labs',
    date: '2020 - 2022',
    description: 'Worked on developing IoT solutions for smart home and agricultural applications using ESP32 and Raspberry Pi platforms.',
    achievements: [
      'Built a smart irrigation system that reduced water usage by 40%',
      'Developed firmware for low-power sensor networks',
      'Created dashboard for real-time monitoring and analytics'
    ],
    icon: <FaServer />
  },
  {
    id: 3,
    title: 'Software Engineering Intern',
    company: 'Future Tech',
    date: '2019 - 2020',
    description: 'Assisted in the development of web applications and learned about IoT integration with cloud platforms.',
    achievements: [
      'Contributed to front-end development using React',
      'Implemented RESTful API endpoints for IoT device communication',
      'Participated in Agile development sprints'
    ],
    icon: <FaCode />
  }
];

const Experience = () => {
  const [sectionRef, sectionInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  // Create individual refs for timeline items
  const [itemRef0, itemInView0] = useInView({ threshold: 0.1, triggerOnce: true });
  const [itemRef1, itemInView1] = useInView({ threshold: 0.1, triggerOnce: true });
  const [itemRef2, itemInView2] = useInView({ threshold: 0.1, triggerOnce: true });
  
  // Array of refs and their view states to use with timeline items
  const itemRefs = [
    { ref: itemRef0, inView: itemInView0 },
    { ref: itemRef1, inView: itemInView1 },
    { ref: itemRef2, inView: itemInView2 }
  ];
  
  return (
    <ExperienceSection id="experience" ref={sectionRef}>
      <SectionContainer>
        <SectionHeader>
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            My Journey
          </Subtitle>
          
          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Work <span>Experience</span>
          </Title>
          
          <Description
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            My professional journey in IoT development, machine learning, and software engineering.
          </Description>
        </SectionHeader>
          <Timeline>
        {experienceData.map((item, index) => {
            // For timeline animation and positioning
            const isEven = index % 2 === 0;
            const position = isEven ? 'right' : 'left';
            const slideAnimation = isEven ? slideInRight : slideInLeft;
            const itemRef = itemRefs[index]?.ref;
            const isItemInView = itemRefs[index]?.inView;
            
            return (
              <TimelineItem 
                key={item.id}
                ref={itemRef}
              >
                <TimelineDot />
                <TimelineContent
                  position={position}
                  variants={slideAnimation}
                  initial="hidden"
                  animate={isItemInView ? "visible" : "hidden"}
                >
                  <TimelineHeader>
                    <TimelineTitle>
                      {item.icon} {item.title}
                    </TimelineTitle>
                    <TimelineCompany>{item.company}</TimelineCompany>
                    <TimelineDate>{item.date}</TimelineDate>
                  </TimelineHeader>
                  
                  <TimelineBody>
                    <p>{item.description}</p>
                    <TimelineAchievements>
                      {item.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </TimelineAchievements>
                  </TimelineBody>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </SectionContainer>
    </ExperienceSection>
  );
};

export default Experience;

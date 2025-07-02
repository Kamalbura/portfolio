import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGithub, FaExternalLinkAlt, FaSearch, FaArrowRight } from 'react-icons/fa';

// Sample project data - in production would come from an API or data file
const projectsData = [
  {
    id: 1,
    title: 'Smart Home Monitoring System',
    description: 'A comprehensive IoT solution for monitoring and controlling home devices using ESP32 microcontrollers and MQTT protocol.',
    image: 'https://via.placeholder.com/600x400?text=Smart+Home+Monitoring',
    technologies: ['ESP32', 'MQTT', 'React', 'Node.js', 'MongoDB'],
    category: 'IoT',
    liveUrl: 'https://example.com/smarthome',
    githubUrl: 'https://github.com/username/smarthome',
    featured: true
  },
  {
    id: 2,
    title: 'Predictive Maintenance ML Model',
    description: 'Machine learning system that predicts equipment failures before they occur by analyzing sensor data patterns.',
    image: 'https://via.placeholder.com/600x400?text=Predictive+Maintenance',
    technologies: ['Python', 'TensorFlow', 'Scikit-learn', 'Flask', 'AWS'],
    category: 'Machine Learning',
    liveUrl: 'https://example.com/predictive',
    githubUrl: 'https://github.com/username/predictive-maintenance',
    featured: true
  },
  {
    id: 3,
    title: 'Industrial IoT Dashboard',
    description: 'Real-time monitoring dashboard for industrial equipment with alerts, analytics, and reporting features.',
    image: 'https://via.placeholder.com/600x400?text=IoT+Dashboard',
    technologies: ['React', 'D3.js', 'Node.js', 'InfluxDB', 'MQTT'],
    category: 'Web Development',
    liveUrl: 'https://example.com/dashboard',
    githubUrl: 'https://github.com/username/iot-dashboard',
    featured: false
  },
  {
    id: 4,
    title: 'Agricultural Sensor Network',
    description: 'Low-power sensor network for monitoring soil conditions, weather, and crop health in agricultural applications.',
    image: 'https://via.placeholder.com/600x400?text=Agricultural+Sensors',
    technologies: ['Arduino', 'LoRaWAN', 'Python', 'React', 'PostgreSQL'],
    category: 'IoT',
    liveUrl: 'https://example.com/agri-sensors',
    githubUrl: 'https://github.com/username/agri-sensors',
    featured: false
  },
  {
    id: 5,
    title: 'Computer Vision for Quality Control',
    description: 'Machine learning system using computer vision to detect defects in manufacturing processes.',
    image: 'https://via.placeholder.com/600x400?text=CV+Quality+Control',
    technologies: ['Python', 'OpenCV', 'PyTorch', 'Flask', 'Docker'],
    category: 'Machine Learning',
    liveUrl: 'https://example.com/cv-quality',
    githubUrl: 'https://github.com/username/cv-quality',
    featured: false
  },
  {
    id: 6,
    title: 'Energy Consumption Optimizer',
    description: 'AI-powered system that optimizes energy usage in buildings based on occupancy patterns and external factors.',
    image: 'https://via.placeholder.com/600x400?text=Energy+Optimizer',
    technologies: ['Python', 'TensorFlow', 'MQTT', 'React', 'Node.js'],
    category: 'IoT',
    liveUrl: 'https://example.com/energy-optimizer',
    githubUrl: 'https://github.com/username/energy-optimizer',
    featured: false
  }
];

// Styled components
const ProjectsSection = styled.section`
  padding: 100px 0;
  background: #111216;
  position: relative;
  min-height: 100vh;
  overflow: hidden;
`;

const GlassOverlay = styled.div`
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(8px);
  z-index: 0;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2rem, 4vw, 2.5rem);
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 20px;
  
  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SectionSubtitle = styled(motion.span)`
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

const SectionDescription = styled(motion.p)`
  color: ${({ theme }) => theme.colors.textDim};
  max-width: 700px;
  margin: 0 auto;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const ProjectFilters = styled(motion.div)`
  margin-bottom: 40px;
`;

const FilterControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 400px;
  width: 100%;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 15px 12px 45px;
  background-color: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(0, 153, 204, 0.2);
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1rem;
  transition: all ${({ theme }) => theme.transitions.medium} ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(0, 153, 204, 0.2);
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.primary};
`;

const CategoryFilters = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
  }
`;

const CategoryButton = styled.button`
  background-color: ${({ active, theme }) => 
    active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => 
    active ? '#fff' : theme.colors.textDim};
  border: 1px solid ${({ active, theme }) => 
    active ? theme.colors.primary : 'rgba(0, 153, 204, 0.3)'};
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    background-color: ${({ active, theme }) => 
      active ? theme.colors.primary : 'rgba(0, 153, 204, 0.1)'};
    box-shadow: ${({ active, theme }) => 
      active ? theme.boxShadows.glowPrimary : 'none'};
  }
`;

const SortContainer = styled.div`
  position: relative;
  min-width: 180px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;

const SortSelect = styled.select`
  width: 100%;
  padding: 12px 15px;
  appearance: none;
  background-color: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(0, 153, 204, 0.2);
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.medium} ease;
  background-image: url("data:image/svg+xml;utf8,<svg fill='rgb(0,153,204)' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(0, 153, 204, 0.2);
  }
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
`;

const ProjectCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ featured, theme }) => 
    featured ? theme.colors.primary : 'rgba(0, 153, 204, 0.15)'};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.medium} ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  backdrop-filter: blur(10px);
  cursor: pointer;
  
  &:hover, &:focus-within {
    transform: translateY(-10px);
    box-shadow: ${({ theme }) => theme.boxShadows.medium};
    border-color: ${({ theme }) => theme.colors.primary};
    
    .project-overlay {
      opacity: 1;
    }
    
    .overlay-button {
      opacity: 1;
      transform: translateY(0);
    }
    
    img {
      transform: scale(1.05);
    }
  }
  
  ${({ featured, theme }) => featured && `
    box-shadow: ${theme.boxShadows.glowPrimary};
  `}
  
  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 10px rgba(0, 153, 204, 0.3);
`;

const ProjectImage = styled.div`
  height: 200px;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${({ theme }) => theme.transitions.slow} ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6));
    opacity: 0;
    transition: opacity 0.3s ease;
  }
`;

const ProjectOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1;
`;

const OverlayButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: ${({ theme }) => theme.colors.primary};
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.3s ease;
  
  &:nth-child(2) {
    transition-delay: 0.1s;
  }
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    transform: translateY(0) scale(1.1);
    box-shadow: ${({ theme }) => theme.effects.auraPrimary};
  }
`;

const ProjectContent = styled.div`
  padding: 25px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProjectTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.colors.primary};
  transition: color 0.3s ease;
`;

const ProjectDescription = styled.p`
  color: ${({ theme }) => theme.colors.textDim};
  margin-bottom: 20px;
  line-height: 1.6;
  flex-grow: 1;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: auto;
`;

const TechTag = styled.span`
  background-color: rgba(0, 153, 204, 0.1);
  color: ${({ theme }) => theme.colors.primary};
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(0, 153, 204, 0.2);
    transform: translateY(-2px);
  }
`;

const NoResultsMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 100px 0;
  color: ${({ theme }) => theme.colors.textDim};
  font-style: italic;
  font-size: 1.1rem;
`;

const ViewAllButton = styled(motion.div)`
  margin-top: 50px;
  text-align: center;
  
  a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background-color: transparent;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    padding: 12px 30px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.primary};
      color: #fff;
      transform: translateY(-3px);
      box-shadow: ${({ theme }) => theme.effects.auraPrimary};
    }
    
    svg {
      transition: transform 0.3s ease;
    }
    
    &:hover svg {
      transform: translateX(5px);
    }
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortType, setSortType] = useState('newest');
  const [filteredProjects, setFilteredProjects] = useState([]);
  
  // Extract unique categories
  const categories = ['All', ...new Set(projectsData.map(project => project.category))];
  
  // Filter and sort projects
  useEffect(() => {
    let result = [...projectsData];
    
    // Filter by category
    if (activeCategory !== 'All') {
      result = result.filter(project => project.category === activeCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(project => 
        project.title.toLowerCase().includes(term) || 
        project.description.toLowerCase().includes(term) ||
        project.technologies.some(tech => tech.toLowerCase().includes(term))
      );
    }
    
    // Sort projects
    switch(sortType) {
      case 'newest':
        // Assuming the order in projectsData is from newest to oldest
        break;
      case 'oldest':
        result = [...result].reverse();
        break;
      case 'name-asc':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        result = [...result].sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    
    setFilteredProjects(result);
  }, [activeCategory, searchTerm, sortType]);
  
  // Intersection observer for animations
  const [sectionRef, sectionInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  return (
    <ProjectsSection id="projects">
      <GlassOverlay />
      <ContentWrapper style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeader>
          <SectionSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Showcase
          </SectionSubtitle>
          
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Featured <span>Projects</span>
          </SectionTitle>
          
          <SectionDescription
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Explore my latest projects showcasing IoT development, machine learning implementation, and software engineering expertise.
          </SectionDescription>
        </SectionHeader>
        
        <ProjectFilters
          initial={{ opacity: 0, y: 20 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <FilterControls>
            <SearchContainer>
              <SearchInput
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon>
                <FaSearch />
              </SearchIcon>
            </SearchContainer>
            
            <CategoryFilters>
              {categories.map((category) => (
                <CategoryButton
                  key={category}
                  active={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </CategoryButton>
              ))}
            </CategoryFilters>
            
            <SortContainer>
              <SortSelect
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </SortSelect>
            </SortContainer>
          </FilterControls>
        </ProjectFilters>
        
        <ProjectsGrid
          variants={staggerContainer}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
        >
          <AnimatePresence>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  variants={fadeInUp}
                  featured={project.featured}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {project.featured && (
                    <FeaturedBadge>Featured</FeaturedBadge>
                  )}
                  
                  <ProjectImage>
                    <img src={project.image} alt={project.title} />
                    <ProjectOverlay className="project-overlay">
                      {project.githubUrl && (
                        <OverlayButton 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label="View GitHub Repository"
                          className="overlay-button"
                        >
                          <FaGithub size={20} />
                        </OverlayButton>
                      )}
                      {project.liveUrl && (
                        <OverlayButton 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label="View Live Demo"
                          className="overlay-button"
                        >
                          <FaExternalLinkAlt size={18} />
                        </OverlayButton>
                      )}
                    </ProjectOverlay>
                  </ProjectImage>
                  
                  <ProjectContent>
                    <ProjectTitle>{project.title}</ProjectTitle>
                    <ProjectDescription>{project.description}</ProjectDescription>
                    <TechStack>
                      {project.technologies.slice(0, 4).map((tech, index) => (
                        <TechTag key={index}>{tech}</TechTag>
                      ))}
                      {project.technologies.length > 4 && (
                        <TechTag>+{project.technologies.length - 4}</TechTag>
                      )}
                    </TechStack>
                  </ProjectContent>
                </ProjectCard>
              ))
            ) : (
              <NoResultsMessage>
                No projects found matching your criteria. Try adjusting your search or filters.
              </NoResultsMessage>
            )}
          </AnimatePresence>
        </ProjectsGrid>
        
        <ViewAllButton
          initial={{ opacity: 0, y: 20 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <a href="/projects">
            View All Projects <FaArrowRight />
          </a>
        </ViewAllButton>
      </ContentWrapper>
    </ProjectsSection>
  );
};

export default Projects;

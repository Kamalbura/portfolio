import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaGithub, FaLinkedin, FaTwitter, FaCheckCircle } from 'react-icons/fa';
import emailjs from 'emailjs-com';

// Initialize EmailJS
emailjs.init(process.env.REACT_APP_EMAILJS_USER_ID);

// Styled components
const ContactSection = styled.section`
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
      circle at bottom right, 
      rgba(106, 90, 205, 0.05), 
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

const ContactContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  margin-top: 50px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 30px;
  }
`;

const ContactInfo = styled(motion.div)`
  display: flex;
  flex-direction: column;
`;

const ContactForm = styled(motion.form)`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-row: 1;
  }
`;

const InfoItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  margin-bottom: 30px;
`;

const IconWrapper = styled.div`
  min-width: 50px;
  height: 50px;
  background: ${({ theme }) => `rgba(${theme.colors.primary.replace('#', '')}, 0.1)`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.2rem;
`;

const InfoContent = styled.div`
  h4 {
    color: ${({ theme }) => theme.colors.textLight};
    margin-bottom: 5px;
    font-size: 1.1rem;
  }
  
  p, a {
    color: ${({ theme }) => theme.colors.textDim};
    text-decoration: none;
    transition: color 0.3s ease;
    line-height: 1.5;
  }
  
  a:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 40px;
`;

const SocialLink = styled(motion.a)`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textDim};
  font-size: 1.2rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    transform: translateY(-5px);
    color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.effects.auraPrimary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
`;

const FormLabel = styled.label`
  display: block;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.textLight};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.effects.auraPrimary};
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.textLight};
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 150px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.effects.auraPrimary};
  }
`;

const SubmitButton = styled(motion.button)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textLight};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 12px 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
  box-shadow: ${({ theme }) => theme.effects.auraPrimary};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4d4d;
  font-size: 0.85rem;
  margin-top: 6px;
  opacity: 0.9;
`;

const StatusMessage = styled(motion.div)`
  margin: 20px 0;
  padding: 15px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ success, theme }) => 
    success ? 'rgba(39, 174, 96, 0.1)' : 'rgba(255, 77, 77, 0.1)'};
  border: 1px solid ${({ success }) => 
    success ? 'rgba(39, 174, 96, 0.3)' : 'rgba(255, 77, 77, 0.3)'};
  color: ${({ success }) => 
    success ? '#27ae60' : '#ff4d4d'};
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    font-size: 1.2rem;
  }
`;

const ContactMap = styled(motion.div)`
  margin-top: 60px;
  height: 400px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  filter: grayscale(0.8) contrast(1.2);
  transition: all 0.5s ease;
  box-shadow: ${({ theme }) => theme.boxShadows.medium};
  
  &:hover {
    filter: grayscale(0) contrast(1);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 40px;
    height: 350px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-top: 30px;
    height: 300px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    height: 250px;
  }
  
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  const [formErrors, setFormErrors] = useState({});
  
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  // Initialize EmailJS once when component mounts
  useEffect(() => {
    // Replace with your actual EmailJS user ID
    emailjs.init("YOUR_USER_ID");
  }, []);
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = "Invalid email address";
    }
    
    if (!formData.message.trim()) {
      errors.message = "Message is required";
    }
    
    return errors;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types in field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate the form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });
    
    // Prepare EmailJS template parameters
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message
    };
      // Send email using EmailJS with environment variables
    emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID, 
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID, 
      templateParams)
      .then(response => {
        console.log('Email successfully sent!', response);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setIsSubmitting(false);
        setSubmitStatus({ 
          success: true, 
          message: 'Thank you for your message! I will get back to you soon.' 
        });
      })
      .catch(error => {
        console.error('Failed to send email:', error);
        setIsSubmitting(false);
        setSubmitStatus({ 
          success: false, 
          message: 'Failed to send message. Please try again later or contact me directly via email.' 
        });
      });
  };
    const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.2,
        ease: "easeOut"
      } 
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.35,
        ease: "easeOut"
      }
    },
  };

  return (
    <ContactSection id="contact" ref={ref}>
      <ContentWrapper>
        <SectionHeader>
          <Subtitle
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={itemVariants}
          >
            Get In Touch
          </Subtitle>
          <Title
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={itemVariants}
          >
            Let's <span>Connect</span>
          </Title>
          <Description
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={itemVariants}
          >
            Have a project in mind or just want to say hello? I'd love to hear from you.
          </Description>
        </SectionHeader>
        
        <ContactContainer>
          <ContactInfo
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <InfoItem variants={itemVariants}>
              <IconWrapper>
                <FaEnvelope />
              </IconWrapper>              <InfoContent>
                <h4>Email</h4>
                <a href="mailto:developer@professional-portfolio.com">developer@professional-portfolio.com</a>
              </InfoContent>
            </InfoItem>
            
            <InfoItem variants={itemVariants}>
              <IconWrapper>
                <FaMapMarkerAlt />
              </IconWrapper>
              <InfoContent>
                <h4>Location</h4>
                <p>San Francisco Bay Area, California</p>
              </InfoContent>
            </InfoItem>
            
            <InfoItem variants={itemVariants}>
              <IconWrapper>
                <FaPhone />
              </IconWrapper>
              <InfoContent>
                <h4>Phone</h4>
                <a href="tel:+14155551234">(415) 555-1234</a>
              </InfoContent>
            </InfoItem>
              <SocialLinks>
              <SocialLink 
                href="https://github.com/professional-dev" 
                target="_blank" 
                rel="noreferrer"
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                aria-label="GitHub Profile"
              >
                <FaGithub />
              </SocialLink>
              <SocialLink 
                href="https://linkedin.com/in/professional-dev" 
                target="_blank" 
                rel="noreferrer"
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin />
              </SocialLink>
              <SocialLink 
                href="https://twitter.com/professional_dev" 
                target="_blank" 
                rel="noreferrer"
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                aria-label="Twitter/X Profile"
              >
                <FaTwitter />
              </SocialLink>
            </SocialLinks>
          </ContactInfo>
          
          <ContactForm 
            onSubmit={handleSubmit}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <FormGroup>
              <FormLabel htmlFor="name">Name</FormLabel>
              <FormInput
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                variants={itemVariants}
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormInput
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                variants={itemVariants}
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="subject">Subject</FormLabel>
              <FormInput
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                variants={itemVariants}
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="message">Message</FormLabel>
              <FormTextarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                variants={itemVariants}
              />
            </FormGroup>
            
            <SubmitButton 
              type="submit" 
              disabled={isSubmitting}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </SubmitButton>
          </ContactForm>
        </ContactContainer>
        
        <ContactMap
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={itemVariants}
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555019775!2d-122.50764077068712!3d37.75781499229416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1635547123456!5m2!1sen!2sus" 
            title="Location Map"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </ContactMap>
      </ContentWrapper>
    </ContactSection>
  );
};

export default Contact;

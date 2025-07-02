import { useState, useEffect } from 'react';

/**
 * Hook to track which section is currently active in the viewport
 * @param {Array} sectionIds - Array of section IDs to track
 * @param {Object} options - Configuration options
 * @returns {String} - ID of the currently active section
 */
const useActiveSection = (sectionIds, options = {}) => {
  const [activeSection, setActiveSection] = useState('');
  
  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined' || !sectionIds.length) return;
    
    const defaultOptions = {
      rootMargin: '-20% 0px -80% 0px',
      threshold: 0.1,
      offset: 0
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    const observers = [];
    
    // Set up intersection observers for each section
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              try {              // Update URL hash without scrolling
              const scrollY = window.scrollY;
              window.history.replaceState(null, null, `#${id}`);
              window.scrollTo(0, scrollY);
                
                setActiveSection(id);
              } catch (error) {
                console.warn('Error updating URL hash:', error);
              }
            }
          });
        },
        {
          rootMargin: mergedOptions.rootMargin,
          threshold: mergedOptions.threshold
        }
      );
      
      observer.observe(element);
      observers.push(observer);
    });
    
    // Handle initial section on page load
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      if (sectionIds.includes(hash)) {
        setActiveSection(hash);
      }
    } else if (window.scrollY <= 100) {
      setActiveSection(sectionIds[0]);
    }
    
    // Clean up all observers on unmount
    return () => {
      observers.forEach((observer) => {
        observer.disconnect();
      });
    };
  }, [sectionIds, options]);
  
  return activeSection;
};

export default useActiveSection;

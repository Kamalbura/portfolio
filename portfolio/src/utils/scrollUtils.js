/**
 * Smoothly scrolls to an element with the specified ID
 * @param {string} elementId - The ID of the element to scroll to
 * @param {number} offset - Optional offset from the top of the element (default: 0)
 * @param {number} duration - Duration of the animation in ms (default: 800)
 */
export const scrollToElement = (elementId, offset = 0, duration = 800) => {
  // Check if we're in browser environment
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  
  const targetElement = document.getElementById(elementId);
  if (!targetElement) {
    console.warn(`Element with id "${elementId}" not found.`);
    return;
  }
  
  try {
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easeInOutCubic = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
      window.scrollTo(0, startPosition + distance * easeInOutCubic);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }
    
    requestAnimationFrame(animation);
  } catch (error) {
    console.error('Error scrolling to element:', error);
    
    // Fallback to default browser behavior
    try {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      console.error('Fallback scroll failed:', e);
    }
  }
};

/**
 * Scroll observer to trigger animations when elements enter the viewport
 * @param {IntersectionObserverCallback} callback - Function to execute when intersection changes
 * @param {Object} options - IntersectionObserver options
 * @returns {IntersectionObserver} - The observer instance
 */
export const createScrollObserver = (callback, options = {}) => {
  const defaultOptions = {
    rootMargin: '0px',
    threshold: 0.1,
  };
  
  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

/**
 * Adds a scroll-to-top button that appears when scrolling down
 * @param {number} scrollThreshold - How far to scroll before showing button (px)
 * @returns {Object} - Methods to add/remove the button
 */
export const scrollToTopButton = (scrollThreshold = 300) => {
  let scrollButton = null;
  
  const createButton = () => {
    if (scrollButton) return;
    
    // Only create button in browser environment
    if (typeof document === 'undefined') return;
    
    scrollButton = document.createElement('button');
    scrollButton.classList.add('scroll-to-top');
    scrollButton.innerHTML = '↑';
    
    // Style the button
    scrollButton.style.position = 'fixed';
    scrollButton.style.bottom = '20px';
    scrollButton.style.right = '20px';
    scrollButton.style.width = '45px';
    scrollButton.style.height = '45px';
    scrollButton.style.borderRadius = '50%';
    scrollButton.style.backgroundColor = 'rgba(0, 153, 204, 0.8)';
    scrollButton.style.color = 'white';
    scrollButton.style.border = 'none';
    scrollButton.style.fontSize = '20px';
    scrollButton.style.cursor = 'pointer';
    scrollButton.style.opacity = '0';
    scrollButton.style.transition = 'all 0.3s ease';
    scrollButton.style.boxShadow = '0 0 10px rgba(0, 153, 204, 0.5)';
    scrollButton.style.zIndex = '1000';
    
    // Add hover effect
    scrollButton.addEventListener('mouseenter', () => {
      scrollButton.style.backgroundColor = 'rgba(0, 153, 204, 1)';
      scrollButton.style.transform = 'translateY(-5px)';
    });
    
    scrollButton.addEventListener('mouseleave', () => {
      scrollButton.style.backgroundColor = 'rgba(0, 153, 204, 0.8)';
      scrollButton.style.transform = 'translateY(0)';
    });
    
    scrollButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    document.body.appendChild(scrollButton);
  };
  
  const checkScrollPosition = () => {
    if (!scrollButton) return;
    
    if (window.pageYOffset > scrollThreshold) {
      scrollButton.style.opacity = '1';
      scrollButton.style.pointerEvents = 'auto';
    } else {
      scrollButton.style.opacity = '0';
      scrollButton.style.pointerEvents = 'none';
    }
  };
  
  const init = () => {
    createButton();
    window.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition();
  };
  
  const destroy = () => {
    if (scrollButton && scrollButton.parentNode) {
      scrollButton.parentNode.removeChild(scrollButton);
      scrollButton = null;
    }
    window.removeEventListener('scroll', checkScrollPosition);
  };
  
  return {
    init,
    destroy
  };
};

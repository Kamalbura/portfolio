'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface MagneticConfig {
  strength?: number;
  scaleFactor?: number;
  stiffness?: number;
  damping?: number;
  trigger?: string;
  disabled?: boolean;
}

export const useMagneticButton = (config: MagneticConfig = {}) => {
  const elementRef = useRef<HTMLElement>(null);
  const {
    strength = 0.3,
    scaleFactor = 1.05,
    stiffness = 150,
    damping = 15,
    trigger = 'mousemove',
    disabled = false
  } = config;

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return;
    
    const element = elementRef.current;
    if (!element) return;

    // Check if device supports hover (not touch-only)
    const hasHover = window.matchMedia('(hover: hover)').matches;
    if (!hasHover) return;

    let animationId: number;
    let mouseX = 0;
    let mouseY = 0;
    let elementX = 0;
    let elementY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      // Calculate distance from center
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = Math.max(rect.width, rect.height);
      
      // Apply magnetic effect based on distance
      if (distance < maxDistance * 1.5) {
        mouseX = deltaX * strength;
        mouseY = deltaY * strength;
      } else {
        mouseX = 0;
        mouseY = 0;
      }
    };

    const handleMouseEnter = () => {
      gsap.to(element, {
        scale: scaleFactor,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      mouseX = 0;
      mouseY = 0;
      
      gsap.to(element, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    const animate = () => {
      const dx = mouseX - elementX;
      const dy = mouseY - elementY;
      
      elementX += dx * 0.1;
      elementY += dy * 0.1;
      
      gsap.set(element, {
        x: elementX,
        y: elementY
      });
      
      animationId = requestAnimationFrame(animate);
    };

    // Start animation loop
    animate();

    // Event listeners
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, scaleFactor, stiffness, damping, trigger, disabled]);

  return elementRef;
};

export default useMagneticButton;

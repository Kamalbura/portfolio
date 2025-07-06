'use client';

// Disabled CustomCursor here.
// Full implementation moved to dump folder:
// c:\Users\burak\Desktop\projects\portfolio\web-react-final\dump\CustomCursor.tsx

export default function CustomCursor() {
  return null;
}

// ...existing implementation commented out...
/*
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  isClicking: boolean;
  variant: 'default' | 'project' | 'contact' | 'nav' | 'magnetic';
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<CursorState>({
    x: 0,
    y: 0,
    isHovering: false,
    isClicking: false,
    variant: 'default'
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;

    // Enhanced cursor movement with magnetic attraction
    const animateCursor = () => {
      const distX = mouseX - cursorX;
      const distY = mouseY - cursorY;
      const distFollowerX = mouseX - followerX;
      const distFollowerY = mouseY - followerY;

      // Adaptive speed based on variant
      const cursorSpeed = cursorState.variant === 'magnetic' ? 0.5 : 0.3;
      const followerSpeed = cursorState.variant === 'magnetic' ? 0.15 : 0.1;

      cursorX += distX * cursorSpeed;
      cursorY += distY * cursorSpeed;
      followerX += distFollowerX * followerSpeed;
      followerY += distFollowerY * followerSpeed;

      gsap.set(cursor, { x: cursorX, y: cursorY });
      gsap.set(follower, { x: followerX, y: followerY });

      requestAnimationFrame(animateCursor);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      // Check for magnetic buttons/elements
      if (target.closest('button') || target.classList.contains('magnetic-element')) {
        setCursorState(prev => ({ 
          ...prev, 
          isHovering: true, 
          variant: 'magnetic' 
        }));
        gsap.to(cursor, { scale: 0.3, duration: 0.3 });
        gsap.to(follower, { scale: 4, duration: 0.3 });
        return;
      }

      // Regular interactive elements
      if (target.closest('a, button')) {
        setCursorState(prev => ({ ...prev, isHovering: true }));
        gsap.to(cursor, { scale: 0.5, duration: 0.3 });
        gsap.to(follower, { scale: 3, duration: 0.3 });
      }

      // Project cards
      if (target.closest('.project-card')) {
        setCursorState(prev => ({ ...prev, variant: 'project' }));
      }

      // Navigation
      if (target.closest('nav')) {
        setCursorState(prev => ({ ...prev, variant: 'nav' }));
      }
    };

    const handleMouseLeave = () => {
      setCursorState(prev => ({ 
        ...prev, 
        isHovering: false, 
        variant: 'default' 
      }));
      gsap.to([cursor, follower], { scale: 1, duration: 0.3 });
    };

    const handleMouseDown = () => {
      setCursorState(prev => ({ ...prev, isClicking: true }));
      gsap.to(cursor, { scale: 0.8, duration: 0.1 });
    };

    const handleMouseUp = () => {
      setCursorState(prev => ({ ...prev, isClicking: false }));
      gsap.to(cursor, { scale: 1, duration: 0.1 });
    };

    // Initialize animation
    animateCursor();

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorState.variant]);

  // Hide on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  const getCursorColor = () => {
    switch (cursorState.variant) {
      case 'magnetic':
        return 'bg-gradient-to-r from-blue-500 to-purple-500';
      case 'project':
        return 'bg-blue-500';
      case 'contact':
        return 'bg-green-500';
      case 'nav':
        return 'bg-indigo-500';
      default:
        return 'bg-white';
    }
  };

  const getFollowerBorder = () => {
    switch (cursorState.variant) {
      case 'magnetic':
        return 'border-gradient-to-r from-blue-500/50 to-purple-500/50';
      case 'project':
        return 'border-blue-500/50';
      case 'contact':
        return 'border-green-500/50';
      case 'nav':
        return 'border-indigo-500/50';
      default:
        return 'border-white/30';
    }
  };

  return (
    <>
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-4 h-4 pointer-events-none z-[9999] mix-blend-difference
          ${getCursorColor()}
          rounded-full transition-colors duration-300`}
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={followerRef}
        className={`fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9998] 
          border-2 ${getFollowerBorder()} rounded-full transition-colors duration-300`}
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <style jsx>{`
        .custom-cursor {
          position: fixed;
          top: 0; left: 0;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: rgba(0,0,0,0.8);
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition: width .15s ease, height .15s ease, background .15s ease;
          z-index: 9999;
        }
        .custom-cursor.hover {
          width: 32px; height: 32px;
          background: rgba(0,0,0,0.3);
        }
      `}</style>
    </>
  );
}
*/

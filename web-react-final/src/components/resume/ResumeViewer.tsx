'use client'

import { useState, useEffect, useRef } from 'react';
import { siteConfig } from '@/config/siteConfig';

interface ResumeViewerProps {
  onCloseAction: () => void;
}

export default function ResumeViewer({ onCloseAction }: ResumeViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Use resume URL from siteConfig
  const resumeUrl = siteConfig.resumeUrl;
  
  // Google Docs viewer URL for better compatibility
  const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(resumeUrl)}&embedded=true`;

  useEffect(() => {
    // Handle escape key to close the modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseAction();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Prevent background scrolling
    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Prevent Lenis scroll container from scrolling
    const scrollContainer = document.getElementById('smooth-scroll-container');
    const originalContainerOverflow = scrollContainer ? scrollContainer.style.overflow : '';
    if (scrollContainer) scrollContainer.style.overflow = 'hidden';
    
    // Optimized timeout for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalBodyOverflow;
      // Restore Lenis scroll container overflow
      if (scrollContainer) scrollContainer.style.overflow = originalContainerOverflow;
    };
  }, [onCloseAction]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 backdrop-blur-md bg-black/40" 
      onClick={(e) => {
        // Close if clicking outside the modal content
        if (e.target === e.currentTarget) {
          onCloseAction();
        }
      }}
    >
      <div 
        className="relative w-full max-w-4xl h-[85vh] bg-white/95 dark:bg-gray-900/95 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden backdrop-blur-sm transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={onCloseAction}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-md transition-all duration-200 hover:scale-105"
            aria-label="Close resume viewer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Perfectly centered loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/96 to-gray-50/96 dark:from-gray-900/96 dark:to-gray-800/96 backdrop-blur-sm z-10 animate-in fade-in duration-300">
            {/* Perfect centering container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-6 px-4 animate-in slide-in-from-bottom-4 duration-500">
                {/* Perfectly centered spinner */}
                <div className="flex justify-center items-center">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full opacity-30"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 border-r-blue-500 dark:border-r-blue-300 rounded-full animate-spin"></div>
                    <div className="absolute inset-2 w-12 h-12 border-2 border-transparent border-b-blue-400 dark:border-b-blue-200 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                  </div>
                </div>
                
                {/* Loading text */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Loading Resume
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Preparing professional portfolio...
                  </p>
                </div>
                
                {/* Progress bar with smooth animation */}
                <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden mx-auto">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out animate-pulse"
                    style={{ width: '65%' }}
                  ></div>
                </div>
                
                {/* Professional tip */}
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto animate-pulse">
                    💼 Latest projects and technical expertise showcase
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Optimized PDF iframe */}
        <iframe
          ref={iframeRef}
          src={googleDocsUrl}
          className="w-full h-full border-0"
          onLoad={handleIframeLoad}
          title="Kamal Bura Resume"
          sandbox="allow-scripts allow-same-origin"
          onContextMenu={(e) => e.preventDefault()}
          style={{ 
            backgroundColor: 'transparent',
            userSelect: 'none',
          }}
          loading="eager"
        />
      </div>
    </div>
  );
}
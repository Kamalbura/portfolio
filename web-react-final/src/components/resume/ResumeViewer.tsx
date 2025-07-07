'use client'

import { useState, useEffect, useRef } from 'react';
import * as anime from 'animejs';

interface ResumeViewerProps {
  onCloseAction: () => void;
}

export default function ResumeViewer({ onCloseAction }: ResumeViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [viewerError, setViewerError] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Direct GitHub raw URL for the resume - verified by user
  const resumeUrl = "https://raw.githubusercontent.com/Kamalbura/portfolio/f8a59091c7119e0577b9f19206d82f068d30127f/web-react-final/public/Kamal-bura-resume-jun-2025.pdf";
  
  // Google Docs viewer URL for better compatibility
  const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(resumeUrl)}&embedded=true`;

  useEffect(() => {
    // Check if on mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Handle escape key to close the modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseAction();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Prevent background scrolling
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    // Preload the iframe by creating a hidden one to cache the content
    const preloadIframe = document.createElement('iframe');
    preloadIframe.src = googleDocsUrl;
    preloadIframe.style.display = 'none';
    document.body.appendChild(preloadIframe);
    
    // Smooth loading progress animation
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 80);
    
    // Faster timeout for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
      setLoadingProgress(100);
    }, 1200);
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalStyle;
      // Clean up preload iframe
      if (document.body.contains(preloadIframe)) {
        document.body.removeChild(preloadIframe);
      }
    };
  }, [onCloseAction]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setLoadingProgress(100);
  };

  const handleIframeError = () => {
    setViewerError(true);
    setIsLoading(false);
    setLoadingProgress(100);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 backdrop-blur-md bg-black/40" 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCloseAction();
        }
      }}
    >
      <div 
        className="relative w-full max-w-4xl h-[85vh] bg-white/95 dark:bg-gray-900/95 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={onCloseAction}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close resume viewer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Enhanced Loading overlay with progress */}
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <div className="text-center space-y-6">
              {/* Professional loading spinner */}
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
              </div>
              
              {/* Loading text with typing animation */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Loading Resume
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Preparing Kamal Bura's latest resume...
                </p>
              </div>
              
              {/* Progress bar */}
              <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              
              {/* Professional tip */}
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
                💼 This resume showcases my latest projects and technical skills
              </p>
            </div>
          </div>
        )}
        
        {/* Error fallback */}
        {viewerError && (
          <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 flex flex-col items-center justify-center z-10 p-4">
            <div className="text-center">
              <p className="text-gray-800 dark:text-gray-200 font-medium mb-4">Unable to display PDF in viewer</p>
              <a 
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download Resume
              </a>
            </div>
          </div>
        )}
        
        {/* Mobile viewing tip */}
        {isMobile && !viewerError && (
          <div className="absolute top-0 left-0 right-0 bg-blue-50/90 dark:bg-blue-900/20 backdrop-blur-sm p-2 text-center border-b border-gray-200 dark:border-gray-700 z-10">
            <p className="text-xs text-gray-700 dark:text-gray-300">
              💡 Rotate to landscape for better viewing
            </p>
          </div>
        )}
        
        {/* PDF iframe - Use Google Docs viewer for better compatibility and faster loading */}
        <iframe
          ref={iframeRef}
          src={googleDocsUrl}
          className="w-full h-full border-0"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
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
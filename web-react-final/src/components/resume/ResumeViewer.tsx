'use client'

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Document and Page components from react-pdf
const ReactPDF = dynamic(() => import('react-pdf'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-800 dark:border-gray-200"></div>
    </div>
  ),
});

const { Document, Page, pdfjs } = ReactPDF || {};

// Configure PDF.js worker
if (typeof window !== 'undefined' && pdfjs) {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

interface ResumeViewerProps {
  onCloseAction: () => void;
}

export default function ResumeViewer({ onCloseAction }: ResumeViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [fallbackToIframe, setFallbackToIframe] = useState(false);
  
  // Direct GitHub raw URL for the resume
  const resumeUrl = "https://raw.githubusercontent.com/Kamalbura/portfolio/f8a59091c7119e0577b9f19206d82f068d30127f/web-react-final/public/Kamal-bura-resume-jun-2025.pdf";
  
  // Google Docs viewer URL for fallback
  const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(resumeUrl)}&embedded=true`;

  useEffect(() => {
    // Check if on mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    
    // Safety timeout to ensure loading state changes even if loading fails
    const timer = setTimeout(() => {
      setIsLoading(false);
      // If still loading after timeout, try the fallback
      setFallbackToIframe(true);
    }, 8000);
    
    // Handle escape key to close the modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseAction();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCloseAction]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setIsLoading(false);
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.max(1, Math.min(numPages || 1, newPageNumber));
    });
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  const renderPdfViewer = () => {
    if (fallbackToIframe) {
      return (
        <iframe
          src={googleDocsUrl}
          className="w-full h-full border-0"
          title="Resume"
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => setIsLoading(false)}
          style={{ backgroundColor: 'transparent' }}
        />
      );
    }

    if (!Document || !Page) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <p>PDF viewer is loading...</p>
        </div>
      );
    }

    return (
      <>
        <Document
          file={resumeUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={() => {
            console.error("Failed to load PDF");
            setFallbackToIframe(true);
          }}
          loading={
            <div className="flex h-full w-full items-center justify-center">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400"></div>
            </div>
          }
          className="flex flex-col items-center h-full overflow-auto"
        >
          <Page
            pageNumber={pageNumber}
            width={isMobile ? window.innerWidth - 40 : undefined}
            scale={1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>

        {numPages && numPages > 1 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-3 flex items-center justify-center border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={previousPage} 
              disabled={pageNumber <= 1}
              className="px-4 py-2 bg-gray-100/80 dark:bg-gray-800/80 rounded-l-lg disabled:opacity-50 text-sm font-medium transition-colors hover:bg-gray-200/80 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-700"
            >
              Previous
            </button>
            <p className="mx-4 text-sm font-medium">
              Page {pageNumber} of {numPages}
            </p>
            <button 
              onClick={nextPage} 
              disabled={pageNumber >= numPages}
              className="px-4 py-2 bg-gray-100/80 dark:bg-gray-800/80 rounded-r-lg disabled:opacity-50 text-sm font-medium transition-colors hover:bg-gray-200/80 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-700"
            >
              Next
            </button>
          </div>
        )}
      </>
    );
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    // Save the current overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Prevent scrolling on the body
    document.body.style.overflow = 'hidden';
    
    // Restore original overflow when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/40" 
      onClick={(e) => {
        // Close if clicking outside the modal content
        if (e.target === e.currentTarget) {
          onCloseAction();
        }
      }}
    >
      <div 
        className="relative w-full max-w-4xl h-[80vh] bg-white/90 dark:bg-gray-900/90 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <style jsx global>{`
          iframe {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
        `}</style>
        {/* Header with close button */}
        <div className="absolute top-0 right-0 z-10 m-4">
          <button
            onClick={onCloseAction}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-lg transition-transform hover:scale-105"
            aria-label="Close resume viewer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400"></div>
            <p className="mt-5 text-gray-800 dark:text-gray-200 font-medium">Loading resume...</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">This may take a moment</p>
          </div>
        )}
        
        {/* PDF Viewer */}
        <div className="h-full w-full">
          {renderPdfViewer()}
        </div>
        
        {/* Mobile notice */}
        {isMobile && !fallbackToIframe && (
          <div className="absolute top-0 left-0 right-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-3 text-center border-b border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
              For better viewing, try landscape mode or desktop
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
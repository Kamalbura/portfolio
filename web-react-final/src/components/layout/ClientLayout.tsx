'use client';

import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import dynamic from 'next/dynamic';

// Disable CustomCursor for now
// const CustomCursor = dynamic(
//   () => import('@/components/ui/CustomCursor').then((mod) => mod.default),
//   { ssr: false }
// );

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Initialize smooth scrolling
  useSmoothScroll();

  return (
    <>
      <div id="smooth-scroll-container">{children}</div>
      {/* CustomCursor disabled */}
      {/* <CustomCursor /> */}

      <style jsx global>{`
        /* scrollbar - simple gray styling */
        #smooth-scroll-container {
          scrollbar-width: thin;
          scrollbar-color: rgba(107, 114, 128, 0.6) transparent; /* gray-500 with 60% opacity */
        }
        #smooth-scroll-container::-webkit-scrollbar {
          width: 4px;
          height: 4px;
          background: transparent;
        }
        #smooth-scroll-container::-webkit-scrollbar-track {
          background: transparent;
        }
        #smooth-scroll-container::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.6); /* gray-500 with 60% opacity */
          border-radius: 4px;
        }
        
        /* Mobile even slimmer */
        @media (max-width: 768px) {
          #smooth-scroll-container::-webkit-scrollbar {
            width: 2px;
          }
        }
        
        /* hero & action buttons - professional styling with minimal hover effect */
        .hero-button,
        .next-button,
        .action-button,
        .view-projects-button {
          background-color: rgb(12, 29, 57); /* blue-500 */
          color: #fff;
          border: none;
          transition: background-color 0.2s ease;
        }
        .hero-button:hover,
        .next-button:hover,
        .action-button:hover,
        .view-projects-button:hover {
          background-color: rgb(16, 39, 90); /* blue-600 on hover - slightly darker */
        }
      `}</style>
    </>
  );
}

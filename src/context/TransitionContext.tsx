"use client";

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

type TransitionContextValue = {
  navigateWithTransition: (href: string) => Promise<void>;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const navigateWithTransition = async (href: string) => {
    const overlay = overlayRef.current;

    if (!overlay) {
      router.push(href);
      return;
    }

    try {
      await new Promise<void>((resolve) => {
        gsap.to(overlay, {
          autoAlpha: 1,
          duration: 0.45,
          ease: 'power2.out',
          onComplete: () => resolve(),
        });
      });
    } catch {
      // ignore animation errors and continue navigation
    }

    router.push(href);

    try {
      await new Promise<void>((resolve) => {
        gsap.to(overlay, {
          autoAlpha: 0,
          duration: 0.45,
          delay: 0.08,
          ease: 'power2.inOut',
          onComplete: () => resolve(),
        });
      });
    } catch {
      // swallow errors on exit animation to avoid navigation blocking
    }
  };

  return (
    <TransitionContext.Provider value={{ navigateWithTransition }}>
      {/* Overlay */}
      <div
        ref={overlayRef}
        id="page-transition-overlay"
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-gray-900/90 z-50 opacity-0"
        style={{ transition: 'opacity 0.45s' }}
      />
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return ctx;
}

export default TransitionContext;

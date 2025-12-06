"use client";

import { createContext, useContext, type ReactNode } from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

type ScrollContextValue = {
  scrollTo: ReturnType<typeof useSmoothScroll>['scrollTo'];
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function ScrollProvider({ children }: { children: ReactNode }) {
  const { scrollTo } = useSmoothScroll();

  return <ScrollContext.Provider value={{ scrollTo }}>{children}</ScrollContext.Provider>;
}

export function useScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return ctx;
}

export default ScrollContext;

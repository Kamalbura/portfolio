'use client';

import { PropsWithChildren } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

// Wrap text or children; each line is revealed with a masked upward slide synced to scroll.
export function ScrollReveal({ children }: PropsWithChildren) {
  const { containerRef, setLineRef } = useScrollReveal();

  const lines = typeof children === 'string' ? children.split('\n') : [children];

  return (
    <div ref={containerRef} className="overflow-hidden leading-tight">
      {lines.map((line, i) => (
        <span key={i} ref={setLineRef} className="block will-change-transform">
          {line}
        </span>
      ))}
    </div>
  );
}

export default ScrollReveal;

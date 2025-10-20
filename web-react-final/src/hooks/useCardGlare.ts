'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function useCardGlare<T extends HTMLElement>() {
  const cardRef = useRef<T | null>(null);

  useGSAP(
    () => {
      const card = cardRef.current;
      if (!card) return;
      if (typeof window === 'undefined') return;
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

      const handleMove = (event: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const percentX = ((event.clientX - rect.left) / rect.width) * 100;
        const percentY = ((event.clientY - rect.top) / rect.height) * 100;

        gsap.to(card, {
          duration: 0.4,
          ease: 'power2.out',
          '--glare-x': `${percentX}%`,
          '--glare-y': `${percentY}%`,
        });
      };

      const reset = () => {
        gsap.to(card, {
          duration: 0.5,
          ease: 'power3.out',
          '--glare-x': '50%',
          '--glare-y': '50%',
        });
      };

      card.addEventListener('mousemove', handleMove);
      card.addEventListener('mouseleave', reset);

      return () => {
        card.removeEventListener('mousemove', handleMove);
        card.removeEventListener('mouseleave', reset);
      };
    },
    { scope: cardRef },
  );

  return cardRef;
}

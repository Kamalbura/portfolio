"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type TiltOptions = {
  maxRotation?: number;
  scale?: number;
};

const DEFAULT_OPTIONS: Required<TiltOptions> = {
  maxRotation: 10,
  scale: 1.05,
};

export function useCardTilt<T extends HTMLElement>(options: TiltOptions = {}) {
  const cardRef = useRef<T>(null);
  const { maxRotation, scale } = { ...DEFAULT_OPTIONS, ...options };

  useGSAP(
    () => {
      const card = cardRef.current;
      if (!card) return;
      if (typeof window === "undefined") return;
      if (!window.matchMedia("(hover: hover)").matches) return;

      const handleMouseMove = (event: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const offsetX = event.clientX - rect.left - rect.width / 2;
        const offsetY = event.clientY - rect.top - rect.height / 2;

        const rotateY = (offsetX / (rect.width / 2)) * maxRotation;
        const rotateX = (offsetY / (rect.height / 2)) * -maxRotation;

        gsap.to(card, {
          duration: 0.6,
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
          ease: "power3.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          duration: 1.1,
          transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
          ease: "elastic.out(1, 0.35)",
        });
      };

      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: cardRef },
  );

  return cardRef;
}

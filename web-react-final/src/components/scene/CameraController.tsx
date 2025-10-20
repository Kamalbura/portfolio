"use client";
import { useThree } from '@react-three/fiber';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useReducedMotion } from '@/context/MotionPreferenceContext';


export default function CameraController() {
  const { camera } = useThree();
  const shouldReduceMotion = useReducedMotion();

  useGSAP(
    () => {
      if (shouldReduceMotion) return;
      const triggerEl = document.getElementById('home') || undefined;
      const scrollerEl = document.getElementById('smooth-scroll-container') || undefined;
      const tl = gsap.timeline({ defaults: { ease: 'power1.inOut' } });
      // Hero section camera dolly
      const heroTween = tl.to(camera.position, {
        z: 2,
        scrollTrigger: { trigger: triggerEl, start: 'top top', end: 'bottom top', scrub: true, scroller: scrollerEl },
      });
      // Process section camera dolly
      let processTween: gsap.core.Timeline | undefined;
      const processEl = document.getElementById('process');
      if (processEl) {
        processTween = tl.to(
          camera.position,
          { z: 1.5, y: 1, scrollTrigger: { trigger: processEl, start: 'top top', end: 'bottom top', scrub: true, scroller: scrollerEl } },
          0,
        );
      }
      return () => {
        heroTween.scrollTrigger?.kill();
        processTween?.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { dependencies: [shouldReduceMotion] },
  );

  return null;
}

'use client';

// ...existing code... (removed unused useEffect import)
import { useThree } from '@react-three/fiber';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/context/MotionPreferenceContext';

gsap.registerPlugin(ScrollTrigger);

export default function CameraController() {
  const { camera } = useThree();
  const shouldReduceMotion = useReducedMotion();

  useGSAP(() => {
    if (shouldReduceMotion) return;

    // Ensure we bind to the correct hero section and Lenis scroller if present
    const triggerEl = document.getElementById('home') ?? undefined;
    const scrollerEl = document.getElementById('smooth-scroll-container') ?? undefined;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        scroller: scrollerEl,
      },
      defaults: { ease: 'power1.inOut' },
    });
    tl.to(camera.position, { z: 2 });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  return null;
}

'use client';

import { useEffect, useState } from 'react';
import { ScrollProvider } from '@/context/ScrollContext';
import { TransitionProvider } from '@/context/TransitionContext';
import { MotionPreferenceProvider } from '@/context/MotionPreferenceContext';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import HeroScene from '@/components/scene/HeroScene';
import Plexus from '@/components/ui/Plexus';
import CameraController from '@/components/scene/CameraController';
import ParticleBackground from '@/components/scene/ParticleBackground';
import GrainOverlay from '@/components/ui/GrainOverlay';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Keep using useSmoothScroll inside the provider; provider will call the hook.

const CustomCursor = dynamic(
  () => import('@/components/ui/CustomCursor').then((mod) => mod.default),
  { ssr: false },
);

const ScrollIndicator = dynamic(
  () => import('@/components/ui/ScrollIndicator'),
  { ssr: false },
);

const Preloader = dynamic(
  () => import('@/components/ui/Preloader'),
  { ssr: false },
);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Ensure client-only widgets mount after hydration to avoid any SSR/client tree drift
  const [mounted, setMounted] = useState(false);
  // Intro animation state: Plexus plays, then HeroScene takes over
  const [introComplete, setIntroComplete] = useState(false);

  // Trigger reflow of ScrollTrigger on mount and after all resources load
  useEffect(() => {
    setMounted(true);
    // refresh immediately
    try { ScrollTrigger.refresh(); } catch {}
    // refresh after window load to account for images/fonts
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  // Timer: Plexus animates for approx 5 seconds (scroll-mapped morph),
  // then transition to HeroScene. This allows the pinned scroll animation to complete.
  useEffect(() => {
    if (introComplete) return;
    const timer = setTimeout(() => setIntroComplete(true), 5000);
    return () => clearTimeout(timer);
  }, [introComplete]);
  // Reduced-motion fallback: ensure simple fades when prefers-reduced-motion
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: reduce)', () => {
      // Kill existing ScrollTriggers
      ScrollTrigger.getAll().forEach((st) => st.kill());
      // Fade in sections on scroll
      document.querySelectorAll('section').forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              scroller: document.getElementById('smooth-scroll-container') || undefined,
            },
          },
        );
      });
      return () => mm.revert();
    });
  }, []);

  return (
    <>
      <MotionPreferenceProvider>
        <Canvas
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}
          shadows
          gl={{ alpha: true, antialias: true }}
          onCreated={({ gl }) => {
            try {
              gl.setClearColor(0x000000, 0);
            } catch {}
          }}
        >
          {/* 3D background scene: Intro with Plexus particle animation, then main HeroScene */}
          <ambientLight intensity={0.5} />
          <ParticleBackground />
          <CameraController />
          {/* Conditional render: Plexus intro → HeroScene main scene */}
          {!introComplete ? (
            <Plexus />
          ) : (
            <HeroScene />
          )}
        </Canvas>
        <GrainOverlay />
        <TransitionProvider>
          <ScrollProvider>
            {/* Lenis wrapper: must contain a dedicated content node for proper transforms */}
            {/* Fade in content only after intro animation completes */}
            <div
              id="smooth-scroll-container"
              className={`relative z-10 transition-opacity duration-1000 ease-in ${
                introComplete ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div id="smooth-scroll-content">{children}</div>
            </div>
            {mounted && (
              <>
                {/* Global scroll progress bar */}
                <ScrollIndicator />
                {/* First-load splash */}
                <Preloader />
                <CustomCursor />
              </>
            )}
          </ScrollProvider>
        </TransitionProvider>
      </MotionPreferenceProvider>
    </>
  );
}


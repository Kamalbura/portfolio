'use client';

import { useEffect, useState } from 'react';
import { ScrollProvider } from '@/context/ScrollContext';
import { TransitionProvider } from '@/context/TransitionContext';
import { MotionPreferenceProvider } from '@/context/MotionPreferenceContext';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import CameraController from '@/components/scene/CameraController';
import ParticleBackground from '@/components/scene/ParticleBackground';
import GrainOverlay from '@/components/ui/GrainOverlay';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Plexus from '@/components/ui/Plexus';

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
  const [mounted, setMounted] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    setMounted(true);
    try { ScrollTrigger.refresh(); } catch {}

    // Safety Valve: Force intro to finish after 4.5s even if animation callback fails
    const timer = setTimeout(() => setIntroDone(true), 4500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <MotionPreferenceProvider>
        <Canvas
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}
          shadows
          gl={{ alpha: true, antialias: true }}
          onCreated={({ gl }) => { try { gl.setClearColor(0x000000, 0); } catch {} }}
        >
          <ambientLight intensity={0.5} />
          <ParticleBackground />

          {/* Render dots, but don't let them block the site in safety mode */}
          {!introDone && <Plexus onAnimationComplete={() => setIntroDone(true)} />}

          <CameraController />
        </Canvas>

        <GrainOverlay />

        <TransitionProvider>
          <ScrollProvider>
            {/* Force visibility while keeping smooth-scroll structure intact */}
            <div id="smooth-scroll-container" className={`relative z-10 transition-opacity duration-1000 ${introDone ? 'opacity-100' : 'opacity-0'}`}>
              <div id="smooth-scroll-content">{children}</div>
            </div>

            {mounted && (
              <>
                <ScrollIndicator />
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

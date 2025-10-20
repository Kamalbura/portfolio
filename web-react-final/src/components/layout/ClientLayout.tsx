'use client';

import { useEffect, useState } from 'react';
import { ScrollProvider } from '@/context/ScrollContext';
import { TransitionProvider } from '@/context/TransitionContext';
import { MotionPreferenceProvider } from '@/context/MotionPreferenceContext';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import HeroScene from '@/components/scene/HeroScene';
import CameraController from '@/components/scene/CameraController';

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
  useEffect(() => setMounted(true), []);

  return (
    <>
      <MotionPreferenceProvider>
        <Canvas style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} shadows>
          {/* 3D background scene */}
          <ambientLight intensity={0.5} />
          <HeroScene />
          <CameraController />
        </Canvas>
        <TransitionProvider>
          <ScrollProvider>
            {/* Lenis wrapper: must contain a dedicated content node for proper transforms */}
            <div id="smooth-scroll-container">
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


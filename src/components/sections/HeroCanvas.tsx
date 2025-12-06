'use client';

import { Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Plexus from '@/components/ui/Plexus';
import { useReducedMotion } from '@/context/MotionPreferenceContext';

gsap.registerPlugin(ScrollTrigger);

export default function HeroCanvas() {
  const shouldReduceMotion = useReducedMotion();
  const keyLightRef = useRef<THREE.PointLight>(null);

  if (shouldReduceMotion) {
    return <div className="h-full w-full bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900" aria-hidden />;
  }

  return (
    <Canvas
      className="pointer-events-none block"
      style={{ width: '100vw', height: '100vh' }}
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 6], fov: 55 }}
    >
      <AdaptiveCamera />
      <HeroSceneRig pointLightRef={keyLightRef} />
      <color attach="background" args={["#07090f"]} />
      <ambientLight intensity={0.45} />
      <pointLight ref={keyLightRef} position={[6, 6, 6]} intensity={1.4} color="#ffeba7" />
      <Suspense fallback={null}>
        <Plexus />
      </Suspense>
    </Canvas>
  );
}

function AdaptiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / size.height;
    const perspective = camera as THREE.PerspectiveCamera;
    // widen or tighten FOV based on aspect so plexus stays fully visible
    perspective.fov = aspect > 1.5 ? 60 : aspect < 0.8 ? 65 : 55;
    perspective.position.z = aspect > 1.5 ? 6.5 : aspect < 0.8 ? 5.5 : 6;
    perspective.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

type HeroSceneRigProps = {
  pointLightRef: RefObject<THREE.PointLight | null>;
};

function HeroSceneRig({ pointLightRef }: HeroSceneRigProps) {
  const { camera } = useThree();
  const shouldReduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (shouldReduceMotion) return;
    const heroSection = document.getElementById('home');
    if (!heroSection) return;

    const scroller = document.getElementById('smooth-scroll-container') || undefined;
    const light = pointLightRef.current;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: '+=140%',
          scrub: 1.1,
          scroller,
        },
      });

      timeline.to(camera.position, { z: 5.2, duration: 1.2 }, 0);
      timeline.to(camera.position, { y: -0.35, duration: 1.2 }, 0);

      if (light) {
        timeline.to(light, { intensity: 1.8, duration: 1.2 }, 0);
      }
    });

    return () => ctx.revert();
  }, [camera, pointLightRef, shouldReduceMotion]);

  return null;
}

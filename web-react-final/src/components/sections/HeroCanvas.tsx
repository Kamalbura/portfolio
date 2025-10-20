'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Plexus from '@/components/ui/Plexus';
import { useReducedMotion } from '@/context/MotionPreferenceContext';

export default function HeroCanvas() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div
        className="absolute inset-0 z-0 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900"
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <Canvas dpr={[1, 1.8]} camera={{ position: [0, 0, 6], fov: 55 }}>
        <color attach="background" args={["#07090f"]} />
        <ambientLight intensity={0.45} />
        <pointLight position={[6, 6, 6]} intensity={1.4} color="#ffeba7" />
        <Suspense fallback={null}>
          <Plexus />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-transparent to-gray-900/80" />
    </div>
  );
}

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Perf } from 'r3f-perf';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useReducedMotion } from '@/context/MotionPreferenceContext';
const isProduction = process.env.NODE_ENV === 'production';

export default function HeroScene() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const particlesRef = useRef<THREE.Points>(null!);
  const shouldReduceMotion = useReducedMotion();

  // Reduce complexity in production or reduced-motion
  const subdivisions = shouldReduceMotion || isProduction ? 0 : 2;

  // Generate particle positions once, fewer when reduced-motion
  const positions = useMemo(() => {
    const particleCount = shouldReduceMotion ? 500 : isProduction ? 2000 : 5000;
    const array = new Float32Array(particleCount * 3);
    for (let i = 0; i < array.length; i++) {
      array[i] = (Math.random() - 0.5) * 10;
    }
    return array;
  }, [shouldReduceMotion]);

  // Memoize geometry and material for performance
  const meshGeometry = useMemo(
    () => new THREE.IcosahedronGeometry(1, subdivisions),
    [subdivisions],
  );
  const meshMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ wireframe: true, color: '#ffffff' }),
    [],
  );

  // Animate mesh and particles each frame
  useFrame(({ clock, pointer }) => {
    const mesh = meshRef.current;
    const particles = particlesRef.current;
    const time = clock.getElapsedTime();

    // Animate mesh
    mesh.rotation.y = Math.sin(time * 0.5) * 0.2;
    mesh.rotation.x = Math.cos(time * 0.3) * 0.2;

    // Optional particle sway (skip in production)
    if (!isProduction && particles) {
      particles.rotation.y = pointer.x * 0.1;
      particles.rotation.x = -pointer.y * 0.1;
    }
  });

  return (
    <>
      {/* Optional post-processing (disabled when reduced-motion) */}
      {!shouldReduceMotion && (
        <EffectComposer>
          <Bloom mipmapBlur intensity={0.15} luminanceThreshold={0.6} luminanceSmoothing={0.9} />
        </EffectComposer>
      )}
      {/* Performance monitor (dev only) */}
      {process.env.NODE_ENV === 'development' && <Perf position="top-left" />}
      {/* Secondary directional light for shading */}
      <directionalLight intensity={0.5} position={[5, 5, 5]} />
      <ambientLight intensity={0.3} />
      <mesh ref={meshRef} geometry={meshGeometry} material={meshMaterial} />
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.01} color="#ffffff" />
      </points>
    </>
  );
}

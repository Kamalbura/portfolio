'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Perf } from 'r3f-perf';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useReducedMotion } from '@/context/MotionPreferenceContext';
import { THEME } from '@/config/theme';

const isProduction = process.env.NODE_ENV === 'production';

export default function HeroScene() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const particlesRef = useRef<THREE.Points>(null!);
  const shouldReduceMotion = useReducedMotion();

  // FIX: Detect mobile and reduce geometry subdivisions for battery/performance
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  const subdivisions = useMemo(() => {
    if (shouldReduceMotion) return 0;
    if (isMobile || isProduction) return 0; // Mobile: no subdivisions
    return 2;
  }, [shouldReduceMotion, isMobile]);

  // Generate particle positions once, fewer when reduced-motion
  const positions = useMemo(() => {
    if (shouldReduceMotion) {
      const array = new Float32Array(500 * 3);
      for (let i = 0; i < array.length; i++) array[i] = (Math.random() - 0.5) * 10;
      return array;
    }
    if (isMobile) {
      const array = new Float32Array(1000 * 3);
      for (let i = 0; i < array.length; i++) array[i] = (Math.random() - 0.5) * 10;
      return array;
    }
    if (isProduction) {
      const array = new Float32Array(2000 * 3);
      for (let i = 0; i < array.length; i++) array[i] = (Math.random() - 0.5) * 10;
      return array;
    }
    const array = new Float32Array(5000 * 3);
    for (let i = 0; i < array.length; i++) array[i] = (Math.random() - 0.5) * 10;
    return array;
  }, [shouldReduceMotion, isMobile]);

  // Memoize geometry and material for performance
  const meshGeometry = useMemo(
    () => new THREE.IcosahedronGeometry(1, subdivisions),
    [subdivisions],
  );
  const meshMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ wireframe: true, color: THEME.colors.scene.meshColor }),
    [],
  );

  // Animate mesh and particles each frame
  useFrame(({ clock, pointer }) => {
    if (shouldReduceMotion) return; // Skip animations if reduced-motion is enabled

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
          <Bloom mipmapBlur intensity={THEME.colors.scene.bloomIntensity} luminanceThreshold={0.6} luminanceSmoothing={0.9} />
        </EffectComposer>
      )}
      {/* Performance monitor (dev only) */}
      {process.env.NODE_ENV === 'development' && <Perf position="top-left" />}
      {/* Secondary directional light for shading */}
      <directionalLight intensity={THEME.colors.scene.directionalLightIntensity} position={[5, 5, 5]} />
      <ambientLight intensity={THEME.colors.scene.ambientLightIntensity} />
      <mesh ref={meshRef} geometry={meshGeometry} material={meshMaterial} />
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.01} color={THEME.colors.scene.particleColor} />
      </points>
    </>
  );
}

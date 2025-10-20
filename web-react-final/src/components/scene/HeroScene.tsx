'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function HeroScene() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const particlesRef = useRef<THREE.Points>(null!);

  // Generate particle positions once
  const positions = useMemo(() => {
    const particleCount = 5000;
    const array = new Float32Array(particleCount * 3);
    for (let i = 0; i < array.length; i++) {
      array[i] = (Math.random() - 0.5) * 10;
    }
    return array;
  }, []);

  // Animate mesh and particles each frame
  useFrame(({ clock, pointer }) => {
    const mesh = meshRef.current;
    const particles = particlesRef.current;
    const time = clock.getElapsedTime();

    if (mesh) {
      mesh.rotation.y = Math.sin(time * 0.5) * 0.2;
      mesh.rotation.x = Math.cos(time * 0.3) * 0.2;
    }

    if (particles) {
      particles.rotation.y = pointer.x * 0.1;
      particles.rotation.x = -pointer.y * 0.1;
    }
  });

  return (
    <>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial wireframe color="#ffffff" />
      </mesh>
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

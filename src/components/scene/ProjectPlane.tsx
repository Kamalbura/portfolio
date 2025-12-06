'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../../context/MotionPreferenceContext';

/**
 * Minimal shader-backed plane used as a scaffold for project transitions.
 * Keeps work lightweight and respects reduced-motion preferences.
 */
export default function ProjectPlane({ index = 0, x = 0 }: { index?: number; x?: number }) {
  const ref = useRef<THREE.Mesh | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const targetX = useRef(x);
  targetX.current = x;

  const geometry = useMemo(() => new THREE.PlaneGeometry(1.6, 1), []);

  // Very small, safe shader that tints by time and index.
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uIndex: { value: index },
        // Use iris color from design tokens (#a996ff dark mode)
        uColor: { value: new THREE.Color(0xa996ff) },
        uOpacity: { value: 0.35 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uIndex;
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
          float t = uTime * 0.2 + uIndex * 0.15;
          float wave = 0.1 * sin((vUv.x + t) * 6.2831);
          vec3 col = uColor + wave * 0.2;
          gl_FragColor = vec4(col, uOpacity * (1.0 - smoothstep(0.0, 1.0, abs(vUv.y - 0.5))));
        }
      `,
      transparent: true,
      depthWrite: false,
    });
  }, [index]);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    // Keep position in sync with parent-provided x prop (inside frame loop)
    ref.current.position.x = targetX.current;

    const mat = ref.current.material as THREE.ShaderMaterial;
    if (mat && mat.uniforms) {
      mat.uniforms.uTime.value = clock.getElapsedTime();
    }

    // Subtle motion; skip updates when reduced-motion is active
    if (shouldReduceMotion) return;
    ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.2 + index) * 0.02;
  });

  return (
    <mesh ref={ref} geometry={geometry} position={[x, 0, -0.01]}>
      <primitive object={material} attach="material" />
    </mesh>
  );
}

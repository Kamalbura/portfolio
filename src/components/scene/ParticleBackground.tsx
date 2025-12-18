'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '@/context/MotionPreferenceContext';

// Fullscreen particle sheet that subtly reacts to pointer and scroll velocity.
// Kept lightweight: ~10-15k points with small shader math and manual decay on velocity.
export default function ParticleBackground({ count = 12000 }: { count?: number }) {
  const effectiveCount = useMemo(() => {
    if (typeof window === 'undefined') return count;
    return window.innerWidth < 768 ? 3000 : count;
  }, [count]);
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(effectiveCount * 3);
    const grid = Math.ceil(Math.sqrt(effectiveCount));
    let i = 0;
    for (let y = 0; y < grid; y++) {
      for (let x = 0; x < grid && i < effectiveCount; x++) {
        const nx = (x / grid - 0.5) * 2.4;
        const ny = (y / grid - 0.5) * 2.4;
        positions[i * 3] = nx;
        positions[i * 3 + 1] = ny;
        positions[i * 3 + 2] = 0;
        i++;
      }
    }
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [effectiveCount]);

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const scrollVelocity = useRef(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const handleMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.current.set(nx, ny);
    };

    const handleWheel = (e: WheelEvent) => {
      // Normalize wheel delta to a small range, then decay each frame.
      scrollVelocity.current = THREE.MathUtils.clamp(e.deltaY / 400, -1.5, 1.5);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [shouldReduceMotion]);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;

    // Decay velocity over time so the warp gently settles.
    scrollVelocity.current *= 0.9;

    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.uMouse.value.copy(mouse.current);
    materialRef.current.uniforms.uScrollVelocity.value = scrollVelocity.current;
  });

  if (shouldReduceMotion) {
    // Render a static, low-motion field when reduced motion is preferred.
    return (
      <points geometry={geometry} frustumCulled>
        <pointsMaterial size={0.01} color={'#6b7280'} transparent opacity={0.35} depthWrite={false} />
      </points>
    );
  }

  return (
    <points geometry={geometry} frustumCulled>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uScrollVelocity: { value: 0 },
        }}
        vertexShader={`
          uniform float uTime;
          uniform float uScrollVelocity;
          varying vec2 vUv; // fake uv from position
          varying float vRipple;
          void main() {
            vec3 pos = position;
            // Subtle breathing wobble plus scroll-driven z push
            float wobble = sin(uTime * 0.7 + pos.x * 5.0 + pos.y * 4.5) * 0.015;
            pos.z += wobble + uScrollVelocity * 0.08;
            vUv = pos.xy;
            vRipple = wobble;
            gl_PointSize = 2.5 + abs(uScrollVelocity) * 1.5;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec2 uMouse;
          uniform float uTime;
          varying vec2 vUv;
          varying float vRipple;
          void main() {
            // Approximate NDC from vUv; we're already in clip-like space (-1..1)
            vec2 st = vUv;
            float d = length(st - uMouse);
            float repel = smoothstep(0.5, 0.0, d);
            float alpha = smoothstep(0.32, 0.02, d) * 0.45 + repel * 0.35;
            // Palette inspired by iris/sand tokens
            vec3 base = vec3(0.07, 0.08, 0.12);
            vec3 accent = vec3(0.82, 0.73, 0.42);
            vec3 col = mix(base, accent, alpha + vRipple * 0.5);
            float dist = length(gl_PointCoord - 0.5);
            float mask = smoothstep(0.5, 0.2, dist);
            gl_FragColor = vec4(col, alpha * mask);
          }
        `}
      />
    </points>
  );
}

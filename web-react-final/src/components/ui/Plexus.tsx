'use client';

import { useEffect, useMemo, useRef } from 'react';
import { RootState, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/context/MotionPreferenceContext';

gsap.registerPlugin(ScrollTrigger);

  const PARTICLE_COUNT = 220;
const LINE_THRESHOLD = 0.28; // slightly tighter connections for a softer look
const BASE_RADIUS = 2.4; // expand radius for a more spacious hero

export default function Plexus() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const shouldReduceMotion = useReducedMotion();

  const basePositions = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const offsets = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = 2 * Math.PI * Math.random();
      const radius = BASE_RADIUS * (0.6 + Math.random() * 0.4);

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      offsets[i] = Math.random() * Math.PI * 2;
    }

    return { positions, offsets };
  }, []);

  const workingPositions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const linePositionBuffer = useMemo(
    () => new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 3),
    [],
  );
  const lineColorBuffer = useMemo(
    () => new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 3),
    [],
  );

    useFrame((state: RootState) => {
      const time = state.clock.getElapsedTime();
    if (shouldReduceMotion) {
      return;
    }

    const group = groupRef.current;
    const points = pointsRef.current;
    const lines = linesRef.current;
    if (!group || !points || !lines) return;

    const { positions, offsets } = basePositions;
    const pointPositions = points.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // slower, softer wave motion
      const wave = Math.sin(time * 0.35 + offsets[i]) * 0.08;
      const index = i * 3;
      workingPositions[index] = positions[index] * (1 + wave * 0.08);
      workingPositions[index + 1] = positions[index + 1] * (1 + wave * 0.08);
      workingPositions[index + 2] = positions[index + 2] * (1 + wave * 0.08);

      pointPositions[index] = workingPositions[index];
      pointPositions[index + 1] = workingPositions[index + 1];
      pointPositions[index + 2] = workingPositions[index + 2];
    }

    let lineVertex = 0;
    let colorIndex = 0;
    let connectionCount = 0;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x1 = workingPositions[i * 3];
      const y1 = workingPositions[i * 3 + 1];
      const z1 = workingPositions[i * 3 + 2];

      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = x1 - workingPositions[j * 3];
        const dy = y1 - workingPositions[j * 3 + 1];
        const dz = z1 - workingPositions[j * 3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < LINE_THRESHOLD) {
          const alpha = (1 - distance / LINE_THRESHOLD) * 0.85; // reduce overall line alpha

          linePositionBuffer[lineVertex++] = x1;
          linePositionBuffer[lineVertex++] = y1;
          linePositionBuffer[lineVertex++] = z1;
          linePositionBuffer[lineVertex++] = workingPositions[j * 3];
          linePositionBuffer[lineVertex++] = workingPositions[j * 3 + 1];
          linePositionBuffer[lineVertex++] = workingPositions[j * 3 + 2];

          lineColorBuffer[colorIndex++] = alpha;
          lineColorBuffer[colorIndex++] = alpha;
          lineColorBuffer[colorIndex++] = alpha;
          lineColorBuffer[colorIndex++] = alpha;
          lineColorBuffer[colorIndex++] = alpha;
          lineColorBuffer[colorIndex++] = alpha;

          connectionCount += 1;
        }
      }
    }

    points.geometry.attributes.position.needsUpdate = true;

    lines.geometry.setDrawRange(0, connectionCount * 2);
    const linePositions = lines.geometry.attributes.position.array as Float32Array;
    linePositions.set(linePositionBuffer);
    lines.geometry.attributes.position.needsUpdate = true;

    const lineColors = lines.geometry.attributes.color.array as Float32Array;
    lineColors.set(lineColorBuffer);
    lines.geometry.attributes.color.needsUpdate = true;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!groupRef.current) return;
    if (shouldReduceMotion) return;

      const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom 15%',
        scrub: 1,
      },
    });

    // Lower-amplitude rotations for a gentler, more pastoral motion
    timeline.to(groupRef.current.rotation, { x: Math.PI / 12, y: Math.PI / 3.2, duration: 1 });
    timeline.to(groupRef.current.position, { z: -0.9, duration: 1 }, '<');

    return () => {
      timeline.kill();
    };
  }, [shouldReduceMotion]);

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[basePositions.positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.04} color="#d6f7ff" sizeAttenuation depthWrite={false} transparent opacity={0.95} />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositionBuffer, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColorBuffer, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.66} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
}

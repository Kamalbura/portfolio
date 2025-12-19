'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { RootState, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/context/MotionPreferenceContext';

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 600; // Increased for clearer text, optimized loop handles this fine
const LINE_THRESHOLD = 0.25;
const TEXT_LINE_THRESHOLD = 0.06; // Very tight connections for sharp text
const BASE_RADIUS = 2.4; // expand radius for a more spacious hero
const INTERACTION_RADIUS = 1.2; // Mouse repulsion radius
const INTERACTION_FORCE = 0.5; // Mouse repulsion strength
const WORDS = ['KAMAL', 'BURA'];
const WORD_CANVAS_WIDTH = 1600;
const WORD_CANVAS_HEIGHT = 320;
const WORD_SPACING = 140;
const GLYPH_SAMPLE_STEP = 4; // Sample step balanced for 600 particles
const MORPH_REVEAL_START = 0.25;
const MORPH_REVEAL_END = 0.85;

type PlexusProps = {
  onAnimationComplete?: () => void;
};

export default function Plexus({ onAnimationComplete }: PlexusProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const morphState = useRef({ progress: 0 });
  const shouldReduceMotion = useReducedMotion();
  const { viewport } = useThree();
  
  // Global mouse tracking for interaction even if canvas has pointer-events: none
  const mouseRef = useRef({ x: 9999, y: 9999 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse to -1..1 range relative to window
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const basePositions = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        positions: new Float32Array(PARTICLE_COUNT * 3),
        offsets: new Float32Array(PARTICLE_COUNT),
      };
    }

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
  const wordTarget = useMemo(
    () => generateWordSequencePointCloud(WORDS, PARTICLE_COUNT),
    [],
  );
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

    // Calculate mouse position in world space (at z=0)
    // viewport.width/height is the size of the canvas in world units at z=0
    const mouseX = mouseRef.current.x * (viewport.width / 2);
    const mouseY = mouseRef.current.y * (viewport.height / 2);

    const morphMix = THREE.MathUtils.clamp(morphState.current.progress, 0, 1);
    const shapeStrength = THREE.MathUtils.smoothstep(
      MORPH_REVEAL_START,
      MORPH_REVEAL_END,
      morphMix,
    );
    
    // Easing for the transition: Start slow, snap to text
    const mixFactor = THREE.MathUtils.lerp(0, 1, Math.pow(shapeStrength, 3)); 
    const lineFade = THREE.MathUtils.lerp(1, 0.25, shapeStrength);
    
    // Galaxy Rotation (only affects base sphere state)
    const rotationAngle = time * 0.15;
    const cosR = Math.cos(rotationAngle);
    const sinR = Math.sin(rotationAngle);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const index = i * 3;
      
      // 1. Base State: Rotating Galaxy (No random wobble)
      const bx = positions[index];
      const by = positions[index + 1];
      const bz = positions[index + 2];
      
      // Rotate around Y axis for galaxy feel
      const rotatedX = bx * cosR - bz * sinR;
      const rotatedZ = bx * sinR + bz * cosR;

      const targetX = wordTarget[index] ?? rotatedX;
      const targetY = wordTarget[index + 1] ?? by;
      const targetZ = wordTarget[index + 2] ?? rotatedZ;

      // 2. Interpolate
      let px = THREE.MathUtils.lerp(rotatedX, targetX, mixFactor);
      let py = THREE.MathUtils.lerp(by, targetY, mixFactor);
      let pz = THREE.MathUtils.lerp(rotatedZ, targetZ, mixFactor);

      // 3. Mouse Interaction (Repulsion) - Only when text is forming/formed
      if (shapeStrength > 0.5) {
        const dx = px - mouseX;
        const dy = py - mouseY;
        const distSq = dx * dx + dy * dy;
        
        if (distSq < INTERACTION_RADIUS * INTERACTION_RADIUS) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / INTERACTION_RADIUS) * INTERACTION_FORCE * shapeStrength;
          const angle = Math.atan2(dy, dx);
          
          px += Math.cos(angle) * force;
          py += Math.sin(angle) * force;
        }
      }

      workingPositions[index] = px;
      workingPositions[index + 1] = py;
      workingPositions[index + 2] = pz;

      pointPositions[index] = workingPositions[index];
      pointPositions[index + 1] = workingPositions[index + 1];
      pointPositions[index + 2] = workingPositions[index + 2];
    }

    let lineVertex = 0;
    let colorIndex = 0;
    let connectionCount = 0;
    const currentThreshold = THREE.MathUtils.lerp(LINE_THRESHOLD, TEXT_LINE_THRESHOLD, shapeStrength);
    const thresholdSq = currentThreshold * currentThreshold; // Optimization: compare squared distances

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x1 = workingPositions[i * 3];
      const y1 = workingPositions[i * 3 + 1];
      const z1 = workingPositions[i * 3 + 2];

      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = x1 - workingPositions[j * 3];
        const dy = y1 - workingPositions[j * 3 + 1];
        const dz = z1 - workingPositions[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < thresholdSq) {
          const distance = Math.sqrt(distSq);
          const alpha = (1 - distance / currentThreshold) * 0.6 * lineFade; // cleaner lines

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

  // Time-based intro morph: dots -> name, then signal completion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (shouldReduceMotion) {
      morphState.current.progress = 1;
      onAnimationComplete?.();
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => onAnimationComplete?.(),
    });

    tl.to(morphState.current, { progress: 1, duration: 4.5 });

    return () => {
      tl.kill();
    };
  }, [onAnimationComplete, shouldReduceMotion]);

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[basePositions.positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.032} color="#d6f7ff" sizeAttenuation depthWrite={false} transparent opacity={0.95} />
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

function generateWordSequencePointCloud(words: string[], count: number) {
  if (typeof window === 'undefined') {
    return new Float32Array(count * 3);
  }

  const canvas = document.createElement('canvas');
  canvas.width = WORD_CANVAS_WIDTH;
  canvas.height = WORD_CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return new Float32Array(count * 3);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = '900 240px "Inter", "Space Grotesk", sans-serif'; // Even larger for clarity

  let cursorX = 120;
  words.forEach((rawWord) => {
    const word = rawWord.toUpperCase();
    ctx.fillText(word, cursorX, canvas.height / 2);
    const metrics = ctx.measureText(word);
    cursorX += (metrics.width || 0) + WORD_SPACING;
  });

  const image = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const candidates: Array<[number, number]> = [];

  for (let y = 0; y < canvas.height; y += GLYPH_SAMPLE_STEP) {
    for (let x = 0; x < canvas.width; x += GLYPH_SAMPLE_STEP) {
      const alpha = image[(y * canvas.width + x) * 4 + 3];
      if (alpha > 150) {
        candidates.push([x, y]);
      }
    }
  }

  if (!candidates.length) {
    return new Float32Array(count * 3);
  }

  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const sample =
      candidates[Math.floor((i / count) * candidates.length)] ??
      candidates[Math.floor(Math.random() * candidates.length)];
    const [px, py] = sample;
    const normX = (px / canvas.width) * 2 - 1;
    const normY = 1 - (py / canvas.height) * 2;

    positions[i * 3] = normX * 1.9;
    positions[i * 3 + 1] = normY * 1.05;
    positions[i * 3 + 2] = 0; // Flatten Z-axis for sharp text
  }

  return positions;
}

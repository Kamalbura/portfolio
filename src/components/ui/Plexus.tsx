'use client';

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { RootState, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/context/MotionPreferenceContext';

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 680;
const LINE_THRESHOLD = 0.28; // gentle network before lettering locks
const BASE_RADIUS = 2.4; // expand radius for a more spacious hero
const WORDS = ['KAMAL', 'BURA'];
const WORD_CANVAS_WIDTH = 1600;
const WORD_CANVAS_HEIGHT = 320;
const WORD_SPACING = 140;
const GLYPH_SAMPLE_STEP = 2;
const MORPH_REVEAL_START = 0.25;
const MORPH_REVEAL_END = 0.85;
const MORPH_SCROLL_DISTANCE = 260; // percentage of scroll span for the morph timeline

export default function Plexus() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const morphState = useRef({ progress: 0 });
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

    const morphMix = THREE.MathUtils.clamp(morphState.current.progress, 0, 1);
    const shapeStrength = THREE.MathUtils.smoothstep(
      MORPH_REVEAL_START,
      MORPH_REVEAL_END,
      morphMix,
    );
    const wobbleDampen = THREE.MathUtils.lerp(1, 0.3, shapeStrength);
    const mixFactor = THREE.MathUtils.lerp(0.12, 0.98, shapeStrength);
    const lineFade = THREE.MathUtils.lerp(1, 0.25, shapeStrength);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // slower, softer wave motion that relaxes as the word locks in
      const wave = Math.sin(time * 0.35 + offsets[i]) * 0.1 * wobbleDampen;
      const index = i * 3;
      const wobbleX = positions[index] * (1 + wave * 0.08);
      const wobbleY = positions[index + 1] * (1 + wave * 0.08);
      const wobbleZ = positions[index + 2] * (1 + wave * 0.08);

      const targetX = wordTarget[index] ?? wobbleX;
      const targetY = wordTarget[index + 1] ?? wobbleY;
      const targetZ = wordTarget[index + 2] ?? wobbleZ;

      workingPositions[index] = THREE.MathUtils.lerp(wobbleX, targetX, mixFactor);
      workingPositions[index + 1] = THREE.MathUtils.lerp(wobbleY, targetY, mixFactor);
      workingPositions[index + 2] = THREE.MathUtils.lerp(wobbleZ, targetZ, mixFactor);

      pointPositions[index] = workingPositions[index];
      pointPositions[index + 1] = workingPositions[index + 1];
      pointPositions[index + 2] = workingPositions[index + 2];
    }

    let lineVertex = 0;
    let colorIndex = 0;
    let connectionCount = 0;
    const currentThreshold = THREE.MathUtils.lerp(LINE_THRESHOLD, 0.12, shapeStrength);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x1 = workingPositions[i * 3];
      const y1 = workingPositions[i * 3 + 1];
      const z1 = workingPositions[i * 3 + 2];

      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = x1 - workingPositions[j * 3];
        const dy = y1 - workingPositions[j * 3 + 1];
        const dz = z1 - workingPositions[j * 3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < currentThreshold) {
          const alpha = (1 - distance / currentThreshold) * 0.85 * lineFade; // fade networks once letters lock

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

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (shouldReduceMotion) return;

    const heroSection = document.getElementById('home');
    if (!heroSection) return;

    const scroller = document.getElementById('smooth-scroll-container') || undefined;

    const ctx = gsap.context(() => {
      gsap.to(morphState.current, {
        progress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: `+=${MORPH_SCROLL_DISTANCE}%`,
          scrub: 1.35,
          scroller,
        },
      });
    }, heroSection);

    return () => ctx.revert();
  }, [shouldReduceMotion]);

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
  ctx.font = '700 220px "Space Grotesk", sans-serif';

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
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.18;
  }

  return positions;
}

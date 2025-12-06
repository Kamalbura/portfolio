'use client';

import { useEffect, useRef } from 'react';

// Lightweight animated grain overlay; renders at low resolution and scales up to avoid lag.
export default function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    let frameId: number;

    const resize = () => {
      // Render at quarter res for performance, scale via CSS.
      canvas.width = Math.max(1, Math.floor(window.innerWidth / 3));
      canvas.height = Math.max(1, Math.floor(window.innerHeight / 3));
    };

    const draw = () => {
      const { width, height } = canvas;
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 255;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 16; // subtle alpha
      }
      ctx.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      draw();
      // Throttle to ~30fps to reduce CPU
      frameId = window.setTimeout(() => {
        rafId = requestAnimationFrame(loop);
      }, 33);
    };

    resize();
    loop();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(frameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] mix-blend-soft-light opacity-40 w-full h-full scale-[3] origin-top-left"
    />
  );
}

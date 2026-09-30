import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface SparkleOverlayHandle {
  burst: (x?: number, y?: number) => void;
}

interface SparkleOverlayProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

export const SparkleOverlay = forwardRef<SparkleOverlayHandle, SparkleOverlayProps>(
  ({ className }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animIdRef = useRef<number | null>(null);

    const addBurst = (cx?: number, cy?: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const x = cx !== undefined ? cx : canvas.width / 2;
      const y = cy !== undefined ? cy : canvas.height / 2;
      const colors = ['#FDE047', '#F472B6', '#C084FC', '#60A5FA', '#34D399', '#FFA500'];

      for (let i = 0; i < 18; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 5 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1.0,
        });
      }
    };

    useImperativeHandle(ref, () => ({
      burst: (x, y) => addBurst(x, y),
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const updateSize = () => {
        if (!canvas.parentElement) return;
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      };

      updateSize();
      window.addEventListener('resize', updateSize);

      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const particles = particlesRef.current;

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.04; // subtle gravity
          p.life -= 0.022;

          const currentRadius = Math.max(0, p.size * p.life);
          if (p.life > 0 && currentRadius > 0) {
            ctx.save();
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else {
            particles.splice(i, 1);
          }
        }

        animIdRef.current = requestAnimationFrame(render);
      };

      animIdRef.current = requestAnimationFrame(render);

      return () => {
        window.removeEventListener('resize', updateSize);
        if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 pointer-events-none z-20 ${className || ''}`}
      />
    );
  }
);

SparkleOverlay.displayName = 'SparkleOverlay';

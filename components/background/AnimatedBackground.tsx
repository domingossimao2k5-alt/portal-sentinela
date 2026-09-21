"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";

interface Star {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  twinkleSpeed: number;
  phase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export default function AnimatedBackground() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const rafRef = useRef<number | null>(null);
  const themeRef = useRef(theme);
  const nextShootingStarAt = useRef(0);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function buildStars() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const density = w < 640 ? 9000 : 6000;
      const count = Math.min(220, Math.floor((w * h) / density));
      const stars: Star[] = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 1.3 + 0.3,
          baseOpacity: Math.random() * 0.6 + 0.3,
          twinkleSpeed: Math.random() * 0.015 + 0.004,
          phase: Math.random() * Math.PI * 2,
        });
      }
      starsRef.current = stars;
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = `${window.innerWidth}px`;
      canvas!.style.height = `${window.innerHeight}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
    }

    resize();
    window.addEventListener("resize", resize);

    function maybeSpawnShootingStar(time: number) {
      if (time < nextShootingStarAt.current) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      shootingStarsRef.current.push({
        x: Math.random() * w * 0.6 + w * 0.2,
        y: Math.random() * h * 0.25,
        vx: -(Math.random() * 4 + 5),
        vy: Math.random() * 2.5 + 2,
        life: 0,
        maxLife: 60 + Math.random() * 30,
      });
      nextShootingStarAt.current = time + 7000 + Math.random() * 11000;
    }

    let frame = 0;

    function draw(time: number) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx!.clearRect(0, 0, w, h);

      if (themeRef.current === "dark") {
        // Estrelas cintilantes
        for (const star of starsRef.current) {
          const twinkle = reduceMotion
            ? 0
            : Math.sin(frame * star.twinkleSpeed + star.phase) * 0.35;
          const opacity = Math.max(
            0.05,
            Math.min(1, star.baseOpacity + twinkle)
          );
          ctx!.beginPath();
          ctx!.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(226, 232, 255, ${opacity})`;
          ctx!.fill();
        }

        // Estrelas cadentes ocasionais
        if (!reduceMotion) {
          maybeSpawnShootingStar(time);
          shootingStarsRef.current = shootingStarsRef.current.filter(
            (s) => s.life < s.maxLife
          );
          for (const s of shootingStarsRef.current) {
            const progress = s.life / s.maxLife;
            const fade = progress < 0.15 ? progress / 0.15 : 1 - (progress - 0.15) / 0.85;
            const tailX = s.x - s.vx * 8;
            const tailY = s.y - s.vy * 8;
            const grad = ctx!.createLinearGradient(s.x, s.y, tailX, tailY);
            grad.addColorStop(0, `rgba(255, 255, 255, ${0.85 * fade})`);
            grad.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx!.strokeStyle = grad;
            ctx!.lineWidth = 1.6;
            ctx!.beginPath();
            ctx!.moveTo(s.x, s.y);
            ctx!.lineTo(tailX, tailY);
            ctx!.stroke();

            s.x += s.vx;
            s.y += s.vy;
            s.life += 1;
          }
        }
      }

      frame += 1;
      rafRef.current = requestAnimationFrame(draw);
    }

    function handleVisibility() {
      if (document.hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(draw);
      }
    }

    rafRef.current = requestAnimationFrame(draw);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Céu base  cor sólida no escuro */}
      <div
        className="absolute inset-0 transition-colors duration-700 ease-out"
        style={{
          background:
            theme === "dark"
              ? "#000103"
              : "linear-gradient(180deg, #d9e8fb 0%, #eaf2fd 30%, #f7fafd 65%, #fdfefe 100%)",
        }}
      />

      {/* Campo de estrelas  apenas modo escuro */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 transition-opacity duration-700 ease-out"
        style={{ opacity: theme === "dark" ? 1 : 0 }}
      />
    </div>
  );
}

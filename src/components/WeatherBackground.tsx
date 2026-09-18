import React, { useEffect, useRef } from "react";
import { WeatherConditionInfo, ThemeMode } from "../types";

interface WeatherBackgroundProps {
  condition: WeatherConditionInfo;
  isDay: boolean;
  theme: ThemeMode;
}

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ condition, isDay, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Gradient backgrounds based on weather condition and day/night/theme
  const getBackgroundGradient = () => {
    if (theme === "oled") {
      return "bg-black";
    }
    if (theme === "dark") {
      return "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950";
    }
    if (theme === "light") {
      return isDay
        ? "bg-gradient-to-b from-sky-200 via-sky-100 to-slate-100"
        : "bg-gradient-to-b from-slate-200 via-indigo-100 to-slate-100";
    }

    // Weather-Adaptive Theme
    switch (condition.category) {
      case "thunder":
        return isDay
          ? "bg-gradient-to-b from-slate-800 via-zinc-900 to-slate-950"
          : "bg-gradient-to-b from-neutral-950 via-slate-950 to-purple-950";
      case "rain":
      case "drizzle":
        return isDay
          ? "bg-gradient-to-b from-slate-700 via-sky-900 to-slate-900"
          : "bg-gradient-to-b from-slate-950 via-sky-950 to-zinc-950";
      case "snow":
        return isDay
          ? "bg-gradient-to-b from-blue-200 via-slate-300 to-slate-100"
          : "bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950";
      case "fog":
        return isDay
          ? "bg-gradient-to-b from-zinc-400 via-slate-400 to-zinc-300"
          : "bg-gradient-to-b from-zinc-900 via-slate-900 to-zinc-950";
      case "clouds":
        return isDay
          ? "bg-gradient-to-b from-sky-600 via-slate-500 to-slate-400"
          : "bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950";
      case "clear":
      default:
        return isDay
          ? "bg-gradient-to-b from-sky-500 via-sky-400 to-amber-100"
          : "bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900";
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle Classes
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      maxAlpha?: number;
      pulse?: number;
    }

    const particles: Particle[] = [];
    const count = condition.category === "rain" ? 120 : condition.category === "snow" ? 80 : 50;

    // Initialize particles
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx:
          condition.category === "rain"
            ? (Math.random() - 0.5) * 1.5 - 1.2
            : condition.category === "snow"
            ? (Math.random() - 0.5) * 1.2
            : (Math.random() - 0.5) * 0.4,
        vy:
          condition.category === "rain"
            ? Math.random() * 12 + 10
            : condition.category === "snow"
            ? Math.random() * 2 + 1
            : (Math.random() - 0.5) * 0.4,
        size:
          condition.category === "rain"
            ? Math.random() * 18 + 12
            : condition.category === "snow"
            ? Math.random() * 3.5 + 1.5
            : Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.7 + 0.2,
        maxAlpha: Math.random() * 0.8 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let flashAlpha = 0;
    let nextLightningTime = Date.now() + Math.random() * 5000 + 4000;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Handle lightning for thunderstorm
      if (condition.category === "thunder") {
        if (Date.now() > nextLightningTime) {
          flashAlpha = 0.6 + Math.random() * 0.3;
          nextLightningTime = Date.now() + Math.random() * 7000 + 4000;
        }

        if (flashAlpha > 0) {
          ctx.fillStyle = `rgba(235, 245, 255, ${flashAlpha})`;
          ctx.fillRect(0, 0, width, height);
          flashAlpha -= 0.04;
        }
      }

      // Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (condition.category === "rain" || condition.category === "drizzle" || condition.category === "thunder") {
          // Rain streaks
          ctx.strokeStyle = `rgba(195, 225, 255, ${p.alpha * 0.6})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 1.5, p.y + p.size);
          ctx.stroke();

          p.x += p.vx;
          p.y += p.vy;

          if (p.y > height) {
            p.y = -p.size;
            p.x = Math.random() * width;
          }
        } else if (condition.category === "snow") {
          // Snowflakes
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.vx + Math.sin(p.pulse || 0) * 0.5;
          p.y += p.vy;
          if (p.pulse !== undefined) p.pulse += 0.02;

          if (p.y > height) {
            p.y = -5;
            p.x = Math.random() * width;
          }
        } else if (!isDay || condition.category === "clear") {
          // Stars / sun dust
          p.pulse = (p.pulse || 0) + 0.03;
          const currentAlpha = (Math.sin(p.pulse) * 0.5 + 0.5) * (p.maxAlpha || 0.7);

          ctx.fillStyle = isDay ? `rgba(255, 245, 200, ${currentAlpha * 0.4})` : `rgba(255, 255, 255, ${currentAlpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        } else if (condition.category === "fog") {
          // Mist clouds
          p.x += p.vx * 0.4;
          ctx.fillStyle = `rgba(220, 230, 240, 0.04)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 25, 0, Math.PI * 2);
          ctx.fill();

          if (p.x > width + 50) p.x = -50;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [condition, isDay, theme]);

  return (
    <div className={`fixed inset-0 pointer-events-none transition-colors duration-1000 -z-10 ${getBackgroundGradient()}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />
      {/* Ambient lighting overlays */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          theme === "light"
            ? "bg-gradient-to-t from-slate-200/40 via-transparent to-white/20"
            : "bg-gradient-to-t from-black/40 via-transparent to-black/20"
        }`}
      />
    </div>
  );
};

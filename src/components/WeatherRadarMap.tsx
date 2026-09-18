import React, { useState, useEffect, useRef } from "react";
import { AggregatedWeatherData, AppSettings } from "../types";
import { formatTemp, formatWind } from "../utils/weatherUtils";
import {
  Layers,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Compass,
  MapPin,
  CloudRain,
  Thermometer,
  Wind,
  Cloud,
  Maximize2,
} from "lucide-react";

interface WeatherRadarMapProps {
  weather: AggregatedWeatherData;
  locationName: string;
  settings: AppSettings;
}

export const WeatherRadarMap: React.FC<WeatherRadarMapProps> = ({
  weather,
  locationName,
  settings,
}) => {
  const [activeLayer, setActiveLayer] = useState<"radar" | "temperature" | "wind" | "clouds">("radar");
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeStep, setTimeStep] = useState(2); // 0 = -2h, 1 = -1h, 2 = Now, 3 = +1h, 4 = +2h
  const [zoomLevel, setZoomLevel] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const timeLabels = ["-2 Hours", "-1 Hour", "Now (Live)", "+1 Hour", "+2 Hours"];

  // Play animation loop
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeStep((prev) => (prev + 1) % 5);
    }, 1400);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Render animated canvas radar / streamlines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 260);

    const centerX = width / 2;
    const centerY = height / 2;

    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      frame += 0.03;

      // Draw stylized geographic grid & rings
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      for (let r = 50; r < 250; r += 50) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r * zoomLevel, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw cardinal lines
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      if (activeLayer === "radar") {
        // Draw precipitation radar blobs
        const rainAmount = weather.current.precipitation + (weather.current.weather_code >= 51 ? 2 : 0.5);
        const shiftX = Math.sin(frame + timeStep) * 30;
        const shiftY = Math.cos(frame * 0.8 + timeStep) * 20;

        const grad = ctx.createRadialGradient(
          centerX + 40 + shiftX,
          centerY - 30 + shiftY,
          10,
          centerX + 40 + shiftX,
          centerY - 30 + shiftY,
          90 * zoomLevel
        );
        grad.addColorStop(0, "rgba(56, 189, 248, 0.7)");
        grad.addColorStop(0.5, "rgba(16, 185, 129, 0.4)");
        grad.addColorStop(0.8, "rgba(234, 179, 8, 0.3)");
        grad.addColorStop(1, "rgba(239, 68, 68, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(centerX + 40 + shiftX, centerY - 30 + shiftY, 90 * zoomLevel, 0, Math.PI * 2);
        ctx.fill();

        // Secondary radar cell
        const grad2 = ctx.createRadialGradient(
          centerX - 60 + shiftX * 0.5,
          centerY + 40 + shiftY * 0.5,
          5,
          centerX - 60 + shiftX * 0.5,
          centerY + 40 + shiftY * 0.5,
          60 * zoomLevel
        );
        grad2.addColorStop(0, "rgba(168, 85, 247, 0.6)");
        grad2.addColorStop(0.6, "rgba(56, 189, 248, 0.3)");
        grad2.addColorStop(1, "transparent");
        ctx.fillStyle = grad2;
        ctx.beginPath();
        ctx.arc(centerX - 60 + shiftX * 0.5, centerY + 40 + shiftY * 0.5, 60 * zoomLevel, 0, Math.PI * 2);
        ctx.fill();
      } else if (activeLayer === "wind") {
        // Draw dynamic wind stream vectors
        ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
        ctx.lineWidth = 1.5;
        const windAngle = ((weather.current.wind_direction_10m || 210) * Math.PI) / 180;

        for (let x = 30; x < width; x += 40) {
          for (let y = 30; y < height; y += 40) {
            const wave = Math.sin(frame * 2 + x * 0.05 + y * 0.05) * 6;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(
              x + Math.cos(windAngle) * 20 * zoomLevel + wave,
              y + Math.sin(windAngle) * 20 * zoomLevel
            );
            ctx.stroke();
          }
        }
      } else if (activeLayer === "temperature") {
        // Thermal heat map gradient
        const tGrad = ctx.createLinearGradient(0, 0, width, height);
        tGrad.addColorStop(0, "rgba(239, 68, 68, 0.35)");
        tGrad.addColorStop(0.5, "rgba(245, 158, 11, 0.3)");
        tGrad.addColorStop(1, "rgba(59, 130, 246, 0.35)");
        ctx.fillStyle = tGrad;
        ctx.fillRect(0, 0, width, height);
      } else if (activeLayer === "clouds") {
        // Satellite cloud cover
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        for (let i = 0; i < 4; i++) {
          const cx = (centerX + Math.cos(frame * 0.5 + i) * 80) % width;
          const cy = (centerY + Math.sin(frame * 0.5 + i * 2) * 50) % height;
          ctx.beginPath();
          ctx.arc(cx, cy, 70 * zoomLevel, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw Center Location Pin Marker
      ctx.fillStyle = "#38bdf8";
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Outer radar sweeping beam
      const sweepAngle = frame * 1.5;
      const sweepGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 160 * zoomLevel);
      sweepGrad.addColorStop(0, "rgba(56, 189, 248, 0.25)");
      sweepGrad.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, 160 * zoomLevel, sweepAngle, sweepAngle + 0.5);
      ctx.closePath();
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeLayer, timeStep, zoomLevel, weather]);

  return (
    <section aria-label="Interactive Weather Radar" className="w-full rounded-3xl bg-slate-900/50 backdrop-blur-2xl border border-white/10 p-4 shadow-xl flex flex-col gap-3">
      {/* Header & Layer Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Doppler Radar & Satellite</h3>
        </div>

        {/* Layer Buttons */}
        <div className="flex items-center p-0.5 rounded-xl bg-slate-800/80 border border-white/10 text-xs">
          {[
            { id: "radar", label: "Precipitation", icon: CloudRain },
            { id: "wind", label: "Wind Stream", icon: Wind },
            { id: "temperature", label: "Heatmap", icon: Thermometer },
            { id: "clouds", label: "Satellite", icon: Cloud },
          ].map((l) => {
            const Icon = l.icon;
            const isSelected = activeLayer === l.id;
            return (
              <button
                key={l.id}
                id={`radar-layer-${l.id}-btn`}
                onClick={() => setActiveLayer(l.id as any)}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1 text-[11px] ${
                  isSelected ? "bg-sky-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{l.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Canvas Stage */}
      <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-slate-950/90 border border-white/10 shadow-inner flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Location Pin Badge */}
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/20 text-xs text-white flex items-center gap-2 shadow-lg">
          <MapPin className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-semibold">{locationName}</span>
          <span className="text-sky-300 font-mono">
            {formatTemp(weather.current.temperature_2m, settings.tempUnit)}
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.2))}
            className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-white/20 text-white shadow-md cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
            className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-white/20 text-white shadow-md cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-[10px] text-slate-300 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400" /> Light
          <span className="w-2 h-2 rounded-full bg-emerald-400" /> Mod
          <span className="w-2 h-2 rounded-full bg-amber-400" /> Heavy
          <span className="w-2 h-2 rounded-full bg-rose-500" /> Severe
        </div>
      </div>

      {/* Timeline Controls (Play/Pause & Step) */}
      <div className="flex items-center justify-between gap-3 px-1">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 transition cursor-pointer shadow-md shadow-sky-500/20"
          title={isPlaying ? "Pause Timeline" : "Play Radar Animation"}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
        </button>

        {/* Time step buttons */}
        <div className="flex-1 grid grid-cols-5 gap-1 min-w-0">
          {timeLabels.map((lbl, idx) => (
            <button
              key={lbl}
              onClick={() => {
                setTimeStep(idx);
                setIsPlaying(false);
              }}
              className={`py-1.5 rounded-lg text-[10px] font-semibold transition cursor-pointer text-center truncate ${
                timeStep === idx
                  ? "bg-sky-500 text-white shadow-sm"
                  : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

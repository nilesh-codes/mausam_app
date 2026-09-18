import React from "react";
import { AggregatedWeatherData, AppSettings } from "../../types";
import { getSurfAdvisory, formatTemp, formatWind } from "../../utils/weatherUtils";
import {
  Waves,
  Compass,
  Sun,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Wind,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface BeachSurfDashboardProps {
  weather: AggregatedWeatherData;
  settings: AppSettings;
  onAskAI: (persona: string, customQuestion?: string) => void;
}

export const BeachSurfDashboard: React.FC<BeachSurfDashboardProps> = ({
  weather,
  settings,
  onAskAI,
}) => {
  const surf = getSurfAdvisory(weather);
  const current = weather.current;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-cyan-950/70 via-slate-900/80 to-blue-950/70 border border-cyan-500/30 p-5 backdrop-blur-xl shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Waves className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Beach & Marine Intelligence</span>
              <h3 className="text-lg font-bold text-white">Wave Swell, Tides & Coastal Safety</h3>
            </div>
          </div>

          <button
            id="beach-ai-advice-btn"
            onClick={() => onAskAI("beach", "Provide a coastal surf, tidal safety, UV exposure, and water activity advisory based on current marine telemetry.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-cyan-900/40 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Surf Advisory</span>
          </button>
        </div>

        {/* Surf & Sea Status Big Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 text-center">
            <span className="text-[10px] font-semibold text-slate-400 uppercase block">Wave Height</span>
            <div className="my-1">
              <span className="text-3xl font-extrabold text-cyan-300 font-mono">{surf.waveHeight}</span>
              <span className="text-xs text-slate-400 ml-1">meters</span>
            </div>
            <span className="text-[10px] text-cyan-400 font-semibold">{surf.surfQuality}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 text-center">
            <span className="text-[10px] font-semibold text-slate-400 uppercase block">Swell Period</span>
            <div className="my-1">
              <span className="text-3xl font-extrabold text-white font-mono">{surf.wavePeriod}</span>
              <span className="text-xs text-slate-400 ml-1">seconds</span>
            </div>
            <span className="text-[10px] text-slate-400">Clean Groundswell</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 text-center">
            <span className="text-[10px] font-semibold text-slate-400 uppercase block">Sea Surface Temp</span>
            <div className="my-1">
              <span className="text-3xl font-extrabold text-sky-300 font-mono">
                {formatTemp(parseFloat(surf.seaTemp), settings.tempUnit)}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">{surf.wetsuit}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 text-center">
            <span className="text-[10px] font-semibold text-slate-400 uppercase block">Surf Score</span>
            <div className="my-1">
              <span className="text-3xl font-extrabold text-amber-300 font-mono">{surf.rating}</span>
              <span className="text-xs text-slate-400 ml-1">/10</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">Favorable</span>
          </div>
        </div>
      </div>

      {/* Tides Timeline & Swimming Safety */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tides Timeline */}
        <div className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tide Schedule Today</h4>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {surf.tides.map((tide, i) => (
              <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">{tide.time}</span>
                  <span className="text-[10px] text-cyan-300 font-medium">{tide.type}</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-300 bg-white/10 px-2 py-1 rounded-lg">
                  {tide.height}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Swimming & Beach Safety */}
        <div className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Beachgoer Safety Brief</h4>
            </div>
            <span className="text-xs font-bold text-emerald-400">Green Flag</span>
          </div>

          <div className="my-2 space-y-2 text-xs text-slate-300">
            <p className="p-2 rounded-xl bg-white/5 border border-white/5">
              🏊 <strong>Swimming:</strong> {surf.swimSafety}
            </p>
            <p className="p-2 rounded-xl bg-white/5 border border-white/5">
              ☀️ <strong>Sun & Sand:</strong> UV index {surf.uvIndex.toFixed(1)} with onshore breeze ({formatWind(current.wind_speed_10m, settings.windUnit)}).
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300">
            🏄 <strong>Best surfing window:</strong> 2 hours around mid-tide rising for peak wave shape.
          </div>
        </div>
      </div>
    </div>
  );
};

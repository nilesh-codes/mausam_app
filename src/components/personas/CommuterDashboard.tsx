import React from "react";
import { AggregatedWeatherData, AppSettings } from "../../types";
import { getCommuteRoadInsight, formatWind } from "../../utils/weatherUtils";
import {
  Car,
  Eye,
  AlertTriangle,
  Wind,
  Clock,
  Sparkles,
  ShieldCheck,
  Navigation2,
  Train,
  CheckCircle2,
} from "lucide-react";

interface CommuterDashboardProps {
  weather: AggregatedWeatherData;
  settings: AppSettings;
  onAskAI: (persona: string, customQuestion?: string) => void;
}

export const CommuterDashboard: React.FC<CommuterDashboardProps> = ({
  weather,
  settings,
  onAskAI,
}) => {
  const commute = getCommuteRoadInsight(weather);
  const current = weather.current;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-950/70 via-slate-900/80 to-yellow-950/70 border border-amber-500/30 p-5 backdrop-blur-xl shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Car className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Commute & Travel Safety</span>
              <h3 className="text-lg font-bold text-white">Road Conditions, Visibility & Traffic</h3>
            </div>
          </div>

          <button
            id="commute-ai-briefing-btn"
            onClick={() => onAskAI("commute", "Provide a daily commuter briefing with road traction, departure time recommendations, and visibility/weather hazards.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-amber-900/40 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Commute Brief</span>
          </button>
        </div>

        {/* Road Condition & Hazard Level */}
        <div className="mt-4 p-4 rounded-2xl bg-black/30 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full sm:w-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 flex flex-col items-center justify-center text-amber-400 border border-white/10 shrink-0">
              <Eye className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
              <span className="text-[10px] font-bold font-mono">{commute.visibilityKm} km</span>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-amber-300 uppercase block">Road Condition</span>
              <h4 className="text-sm sm:text-base font-bold text-white mt-0.5 truncate">{commute.roadStatus}</h4>
              <p className="text-xs text-slate-300 mt-1">{commute.suggestedSpeedReduction}</p>
            </div>
          </div>

          {/* Wind Gust Alert for High Vehicles */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 text-left sm:text-right shrink-0 w-full sm:w-auto">
            <span className="text-[10px] text-slate-400 uppercase block">Bridge & Highway Gusts</span>
            <span className="text-sm font-bold text-amber-300 font-mono">{formatWind(commute.windGustsKmh, settings.windUnit)}</span>
          </div>
        </div>
      </div>

      {/* Optimal Departure Windows & Transit Mode Advice */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Departure Window Optimizer */}
        <div className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Optimal Departure Windows</h4>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Morning Commute to Work:</span>
                <span className="font-bold text-white">{commute.bestMorningWindow}</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Evening Return Home:</span>
                <span className="font-bold text-white">{commute.bestEveningWindow}</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            🚗 Departing inside these windows minimizes weather-related braking delays.
          </p>
        </div>

        {/* Transit Mode Comparison (Driving vs Train / Metro) */}
        <div className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <Navigation2 className="w-4 h-4 text-sky-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Transit Mode Recommendation</h4>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-2xl bg-white/5 flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <Car className="w-4 h-4 text-amber-400" /> Personal Car:
              </span>
              <span className="font-bold text-emerald-400">Normal (Dry roads)</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/5 flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <Train className="w-4 h-4 text-sky-400" /> Metro / Train:
              </span>
              <span className="font-bold text-emerald-400">On Time (Smooth)</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-2 p-2 rounded-xl bg-white/5">
            💡 Turn on low-beam headlights during dawn/dusk hours for oncoming vehicle recognition.
          </p>
        </div>
      </div>
    </div>
  );
};

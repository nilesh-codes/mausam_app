import React from "react";
import { AggregatedWeatherData, AppSettings } from "../../types";
import { getSchoolCommuteInsight, formatTemp } from "../../utils/weatherUtils";
import {
  Baby,
  Backpack,
  Sun,
  Droplets,
  Umbrella,
  ShieldAlert,
  Sparkles,
  Shirt,
  Smile,
  AlertTriangle,
} from "lucide-react";

interface ParentsDashboardProps {
  weather: AggregatedWeatherData;
  settings: AppSettings;
  onAskAI: (persona: string, customQuestion?: string) => void;
}

export const ParentsDashboard: React.FC<ParentsDashboardProps> = ({
  weather,
  settings,
  onAskAI,
}) => {
  const school = getSchoolCommuteInsight(weather);
  const current = weather.current;
  const aqi = weather.air_quality?.current?.us_aqi || 40;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-pink-950/70 via-slate-900/80 to-rose-950/70 border border-pink-500/30 p-5 backdrop-blur-xl shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-300">
              <Baby className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">Parents & Family Hub</span>
              <h3 className="text-lg font-bold text-white">School Commute & Kids Safety</h3>
            </div>
          </div>

          <button
            id="parents-ai-routine-btn"
            onClick={() => onAskAI("parents", "Provide a family and school day routine briefing covering morning dropoff attire, afternoon recess safety, and UV/rain precautions for children.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500 hover:bg-pink-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-pink-900/40 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Family Routine</span>
          </button>
        </div>

        {/* Morning & Afternoon School Windows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {/* Morning Drop-off (7-9 AM) */}
          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
                <Backpack className="w-4 h-4" /> Morning School Drop-off (7-9 AM)
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {formatTemp(school.morningTemp, settings.tempUnit)}
              </span>
            </div>

            <div className="my-2 space-y-1 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Rain Risk:</span>
                <span className={`font-semibold ${school.morningRain > 30 ? "text-amber-400" : "text-emerald-400"}`}>
                  {school.morningRain}% chance
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Recommended Wear:</span>
                <span className="font-semibold text-white truncate">{school.morningAttire}</span>
              </div>
            </div>

            <span className="text-[10px] text-slate-400">Bus stop visibility: {school.busStopVisibility}</span>
          </div>

          {/* Afternoon Pickup (2-4 PM) */}
          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sun className="w-4 h-4" /> Afternoon Pickup & Recess (2-4 PM)
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {formatTemp(school.afternoonTemp, settings.tempUnit)}
              </span>
            </div>

            <div className="my-2 space-y-1 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Sun & UV Index:</span>
                <span className="font-semibold text-amber-400">UV {school.afternoonUV} (Hat needed)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Afternoon Rain:</span>
                <span className="font-semibold text-white">{school.afternoonRain}%</span>
              </div>
            </div>

            <span className="text-[10px] text-slate-400">Air Quality for play: AQI {aqi} (Good)</span>
          </div>
        </div>
      </div>

      {/* Recess & Dressing Helper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Recess & Playground Safety Index */}
        <div className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smile className="w-4 h-4 text-pink-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Playground Safety Index</h4>
            </div>
            <span className="text-xs font-bold text-emerald-400">Safe to Play</span>
          </div>

          <div className="my-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-sm font-bold text-white block">{school.recessSafety}</span>
            <p className="text-xs text-slate-400 mt-1">
              Slides and swings are dry. Surface heat is safe for playground activities.
            </p>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Umbrella className="w-3.5 h-3.5 text-sky-400" />
            <span>Pack a mini umbrella in the school bag just in case.</span>
          </div>
        </div>

        {/* What Kids Should Wear Today */}
        <div className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Shirt className="w-4 h-4 text-pink-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Kids' Outfit Recommendation</h4>
          </div>

          <div className="my-3 space-y-1.5 text-xs text-slate-300">
            <div className="p-2 rounded-xl bg-white/5 flex items-center justify-between">
              <span>👕 Top Layer:</span>
              <span className="font-bold text-white">Breathable cotton tee + zip hoodie</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 flex items-center justify-between">
              <span>👖 Bottoms:</span>
              <span className="font-bold text-white">Comfortable athletic pants</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 flex items-center justify-between">
              <span>👟 Footwear:</span>
              <span className="font-bold text-white">Closed-toe running sneakers</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            ☀️ Apply sunscreen before the morning bus if skin is sensitive.
          </p>
        </div>
      </div>
    </div>
  );
};

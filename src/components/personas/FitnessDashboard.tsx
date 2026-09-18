import React, { useState } from "react";
import { AggregatedWeatherData, AppSettings } from "../../types";
import {
  computeBestWorkoutHours,
  formatTemp,
  formatWind,
  getWindDirection,
} from "../../utils/weatherUtils";
import {
  Activity,
  Sunrise,
  Sunset,
  Wind,
  Flame,
  Droplets,
  Sparkles,
  Zap,
  Timer,
  ChevronRight,
} from "lucide-react";

interface FitnessDashboardProps {
  weather: AggregatedWeatherData;
  settings: AppSettings;
  onAskAI: (persona: string, customQuestion?: string) => void;
}

export const FitnessDashboard: React.FC<FitnessDashboardProps> = ({
  weather,
  settings,
  onAskAI,
}) => {
  const [activityType, setActivityType] = useState<"running" | "cycling" | "outdoor_gym">("running");
  const hourlyScores = computeBestWorkoutHours(weather);

  const bestHour = hourlyScores.reduce(
    (max, curr) => (curr.score > max.score ? curr : max),
    hourlyScores[0] || { score: 0, timeLabel: "--", grade: "Ideal" }
  );

  const daily = weather.daily;
  const sunriseStr = daily?.sunrise?.[0] ? new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true }) : "06:15 AM";
  const sunsetStr = daily?.sunset?.[0] ? new Date(daily.sunset[0]).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true }) : "06:45 PM";

  const currentTemp = weather.current.temperature_2m;
  const windKmh = weather.current.wind_speed_10m;
  const gustsKmh = weather.current.wind_gusts_10m;
  const humidity = weather.current.relative_humidity_2m;

  // Heat Index & Sweat Loss calculation
  const getHeatStrain = () => {
    if (currentTemp > 32) return { level: "Extreme Heat Risk", color: "text-red-400", bg: "bg-red-500/20", fluidPerHour: "1.0 - 1.5 L/hr", advice: "High danger of heat exhaustion. Limit workouts to dawn or treadmill." };
    if (currentTemp > 26) return { level: "Moderate Heat Strain", color: "text-amber-400", bg: "bg-amber-500/20", fluidPerHour: "750 - 1000 mL/hr", advice: "Increased sweat rate. Pre-hydrate with sodium electrolytes 30 mins before." };
    if (currentTemp < 5) return { level: "Cold Muscle Strain", color: "text-blue-400", bg: "bg-blue-500/20", fluidPerHour: "400 - 600 mL/hr", advice: "Spend 10 mins on dynamic warmup before pacing to prevent muscle pulls." };
    return { level: "Optimal Thermal Balance", color: "text-emerald-400", bg: "bg-emerald-500/20", fluidPerHour: "500 mL/hr", advice: "Prime aerobic conditions. Ideal for setting new personal records." };
  };

  const heatStrain = getHeatStrain();

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Hero Workout Optimizer Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-orange-950/70 via-slate-900/80 to-amber-950/70 border border-orange-500/30 p-5 backdrop-blur-xl shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">Outdoor Fitness Optimizer</span>
              <h3 className="text-lg font-bold text-white">Peak Workout Hours & Aerobic Conditions</h3>
            </div>
          </div>

          <button
            id="fitness-ai-plan-btn"
            onClick={() => onAskAI("fitness", "Generate an optimized outdoor workout and athletic training plan with optimal morning/evening timing windows, hydration target, UV shield advice, and pace strategy based on current weather.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-orange-950/40 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Workout Plan</span>
          </button>
        </div>

        {/* Activity Selector & Prime Window Highlight */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-black/30 border border-white/10">
          <div className="flex items-center gap-1.5">
            {(["running", "cycling", "outdoor_gym"] as const).map((act) => (
              <button
                key={act}
                onClick={() => setActivityType(act)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
                  activityType === act
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {act.replace("_", " ")}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 text-xs flex-wrap">
            <span className="text-slate-400">Today's Best Window:</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
              {bestHour.timeLabel} (Score: {bestHour.score}/100)
            </span>
          </div>
        </div>

        {/* 24-Hour Best Workout Hours Timeline */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            24-Hour Workout Condition Ratings
          </h4>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            {hourlyScores.slice(0, 16).map((item, idx) => {
              const isBest = item.score === bestHour.score;
              const barColor =
                item.score >= 80
                  ? "bg-emerald-500 text-emerald-400 border-emerald-500/30"
                  : item.score >= 60
                  ? "bg-amber-500 text-amber-400 border-amber-500/30"
                  : "bg-rose-500 text-rose-400 border-rose-500/30";

              return (
                <div
                  key={`fit-hour-${idx}`}
                  className={`p-2.5 min-w-[80px] rounded-2xl border flex flex-col items-center justify-between text-center transition shrink-0 ${
                    isBest
                      ? "bg-orange-500/25 border-orange-500/50 shadow-lg shadow-orange-500/20 ring-2 ring-orange-400/40"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <span className="text-[10px] font-medium text-slate-400">{item.timeLabel}</span>

                  <div className="my-1.5">
                    <span className="text-base font-extrabold text-white font-mono">{item.score}</span>
                    <span className="text-[9px] text-slate-400 block font-medium">/100</span>
                  </div>

                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${barColor.split(" ")[1]} bg-white/10`}>
                    {item.grade}
                  </span>

                  <span className="text-[10px] text-slate-300 mt-1 font-mono">
                    {formatTemp(item.temp, settings.tempUnit)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sun Schedule, Wind Strategy & Hydration Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Sun & Golden Hour */}
        <div className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Sunrise className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Sun & Natural Lighting</h4>
          </div>

          <div className="my-3 space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Sunrise className="w-3.5 h-3.5 text-amber-400" /> Sunrise:
              </span>
              <span className="font-bold text-white">{sunriseStr}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Sunset className="w-3.5 h-3.5 text-orange-400" /> Sunset:
              </span>
              <span className="font-bold text-white">{sunsetStr}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 p-2 rounded-xl bg-white/5">
            🏃 Golden Hour run: 45 mins before sunset for cooler air and soft lighting.
          </p>
        </div>

        {/* Wind & Aerodynamics */}
        <div className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-sky-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Wind & Resistance</h4>
          </div>

          <div className="my-3 space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
              <span className="text-slate-400">Wind Velocity:</span>
              <span className="font-bold text-white">{formatWind(windKmh, settings.windUnit)}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
              <span className="text-slate-400">Peak Gusts:</span>
              <span className="font-bold text-amber-400">{formatWind(gustsKmh, settings.windUnit)}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 p-2 rounded-xl bg-white/5">
            💨 Plan your loop so you run against headwind on the way out and tailwind on the way back.
          </p>
        </div>

        {/* Heat Strain & Hydration Rate */}
        <div className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Thermal & Hydration</h4>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${heatStrain.bg} ${heatStrain.color}`}>
              {heatStrain.level.split(" ")[0]}
            </span>
          </div>

          <div className="my-3 space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
              <span className="text-slate-400">Est. Fluid Loss:</span>
              <span className="font-bold text-white">{heatStrain.fluidPerHour}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
              <span className="text-slate-400">Relative Humidity:</span>
              <span className="font-bold text-white">{humidity}%</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 p-2 rounded-xl bg-white/5">
            💧 {heatStrain.advice}
          </p>
        </div>
      </div>
    </div>
  );
};

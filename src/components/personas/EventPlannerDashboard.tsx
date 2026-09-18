import React from "react";
import { AggregatedWeatherData, AppSettings } from "../../types";
import { getEventComfortIndex, formatTemp, formatWind } from "../../utils/weatherUtils";
import {
  CalendarCheck,
  Sun,
  Droplets,
  Wind,
  Camera,
  Sparkles,
  Tent,
  AlertCircle,
  Clock,
} from "lucide-react";

interface EventPlannerDashboardProps {
  weather: AggregatedWeatherData;
  settings: AppSettings;
  onAskAI: (persona: string, customQuestion?: string) => void;
}

export const EventPlannerDashboard: React.FC<EventPlannerDashboardProps> = ({
  weather,
  settings,
  onAskAI,
}) => {
  const event = getEventComfortIndex(weather);
  const hourly = weather.hourly;
  const current = weather.current;

  // Next 12 hours rain probability matrix for event window
  const eventHours = hourly?.time ? hourly.time.slice(0, 12).map((t, idx) => ({
    time: new Date(t).toLocaleTimeString([], { hour: "numeric", hour12: true }),
    rainProb: hourly.precipitation_probability ? hourly.precipitation_probability[idx] : 0,
    temp: Math.round(hourly.temperature_2m[idx]),
    wind: Math.round(hourly.wind_speed_10m[idx]),
  })) : [];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-fuchsia-950/70 via-slate-900/80 to-purple-950/70 border border-fuchsia-500/30 p-5 backdrop-blur-xl shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-500/40 flex items-center justify-center text-fuchsia-300">
              <CalendarCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-fuchsia-400 uppercase tracking-wider">Event & Gathering Planning</span>
              <h3 className="text-lg font-bold text-white">Outdoor Comfort & Rain Probability</h3>
            </div>
          </div>

          <button
            id="event-ai-assessment-btn"
            onClick={() => onAskAI("event", "Create a complete outdoor event and gathering weather risk assessment, guest thermal comfort analysis, and rain/wind contingency plan.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-fuchsia-500 hover:bg-fuchsia-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-fuchsia-900/40 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Event Risk</span>
          </button>
        </div>

        {/* Big Comfort Score Card */}
        <div className="mt-4 p-4 rounded-2xl bg-black/30 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full sm:w-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-fuchsia-400 flex flex-col items-center justify-center bg-black/40 shadow-inner shrink-0">
              <span className="text-xl sm:text-2xl font-black text-white font-mono">{event.score}</span>
              <span className="text-[9px] uppercase font-bold text-slate-400">/ 100</span>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm sm:text-base font-bold text-fuchsia-300 block">{event.comfortRating}</span>
              <p className="text-xs text-slate-300 mt-0.5 max-w-sm">{event.recommendation}</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 shrink-0 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-fuchsia-400 uppercase block">Discomfort Index (DI)</span>
            <span className="text-sm font-mono font-bold text-white mt-0.5 block">{event.discomfortIndex}</span>
            <span className="text-[10px] text-slate-400">Optimal range: 18 - 24</span>
          </div>
        </div>

        {/* Hourly Rain Probability Table */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-fuchsia-400" />
            Event Window Hourly Precipitation Risk
          </h4>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
            {eventHours.map((h, i) => (
              <div key={i} className="p-2.5 min-w-[72px] rounded-xl bg-white/5 border border-white/10 text-center shrink-0">
                <span className="text-[10px] text-slate-400 block">{h.time}</span>
                <span className={`text-xs font-bold my-1 block ${h.rainProb > 30 ? "text-amber-400" : "text-sky-400"}`}>
                  {h.rainProb}%
                </span>
                <span className="text-[10px] text-slate-300 font-mono">{formatTemp(h.temp, settings.tempUnit)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tent Wind Safety & Photography Golden Hour */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tent & Canopy Wind Safety */}
        <div className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Tent className="w-4 h-4 text-fuchsia-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tent & Decor Wind Safety</h4>
          </div>

          <div className="my-2 p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xs font-bold text-white block">Current Gusts: {formatWind(current.wind_gusts_10m, settings.windUnit)}</span>
            <p className="text-xs text-slate-300 mt-1">{event.windThreshold}</p>
          </div>

          <p className="text-[11px] text-slate-400">
            ⛺ For canopies larger than 20x20 ft, secure with 50-lb water barrel weights on each leg.
          </p>
        </div>

        {/* Photography & Golden Hour Window */}
        <div className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Camera className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Golden Hour & Photography</h4>
          </div>

          <div className="my-2 p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xs font-bold text-amber-300 block">Prime Natural Light Slot:</span>
            <p className="text-xs text-slate-300 mt-1">{event.goldenHourPhotography}</p>
          </div>

          <p className="text-[11px] text-slate-400">
            📸 Schedule couple portraits or group stage photos 40 minutes before sunset for warm ambient glow.
          </p>
        </div>
      </div>
    </div>
  );
};

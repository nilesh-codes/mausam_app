import React from "react";
import { AggregatedWeatherData, AppSettings } from "../../types";
import { getAgricultureStats, formatTemp, formatPrecip } from "../../utils/weatherUtils";
import {
  Sprout,
  Droplets,
  AlertTriangle,
  Sun,
  Sparkles,
  Layers,
  ThermometerSnowflake,
  Shovel,
  Leaf,
} from "lucide-react";

interface AgricultureDashboardProps {
  weather: AggregatedWeatherData;
  settings: AppSettings;
  onAskAI: (persona: string, customQuestion?: string) => void;
}

export const AgricultureDashboard: React.FC<AgricultureDashboardProps> = ({
  weather,
  settings,
  onAskAI,
}) => {
  const agri = getAgricultureStats(weather);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-lime-950/70 via-slate-900/80 to-emerald-950/70 border border-lime-500/30 p-5 backdrop-blur-xl shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-lime-500/20 border border-lime-500/40 flex items-center justify-center text-lime-300">
              <Sprout className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-lime-400 uppercase tracking-wider">Garden & Agri Weather</span>
              <h3 className="text-lg font-bold text-white">Soil Moisture, Frost & Crop Care</h3>
            </div>
          </div>

          <button
            id="agri-ai-advisory-btn"
            onClick={() => onAskAI("agriculture", "Provide an agricultural crop management advisory with soil moisture assessment, spraying window, and frost/heat risk.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lime-500 hover:bg-lime-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-lime-900/40 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Farm Advisory</span>
          </button>
        </div>

        {/* Soil Moisture at 3 Depths */}
        <div className="mt-4 p-4 rounded-2xl bg-black/30 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-lime-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Soil Moisture Profile by Depth
            </span>
            <span className="text-[11px] text-slate-300 font-mono">
              Soil Temp: {formatTemp(agri.soilTemp, settings.tempUnit)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 0-1 cm Topsoil */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400">Surface (0-1 cm)</span>
                <span className="font-bold text-lime-400">{agri.topSoilMoisture}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-lime-400 rounded-full"
                  style={{ width: `${Math.min(100, agri.topSoilMoisture)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Seedbed & Grass Roots</span>
            </div>

            {/* 1-3 cm Root zone */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400">Root Zone (1-3 cm)</span>
                <span className="font-bold text-emerald-400">{agri.midSoilMoisture}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full"
                  style={{ width: `${Math.min(100, agri.midSoilMoisture)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Vegetable & Flower Zone</span>
            </div>

            {/* 3-9 cm Subsoil */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400">Deep Subsoil (3-9 cm)</span>
                <span className="font-bold text-cyan-400">{agri.deepSoilMoisture}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                  style={{ width: `${Math.min(100, agri.deepSoilMoisture)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Shrub & Tree Reservoir</span>
            </div>
          </div>
        </div>

        {/* Status Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 block">7-Day Rain Total</span>
            <span className="text-sm font-bold text-white my-0.5 block font-mono">{agri.rainSum7d} mm</span>
            <span className="text-[9px] text-sky-400">Adequate</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 block">Evapotranspiration</span>
            <span className="text-sm font-bold text-white my-0.5 block font-mono">{agri.et0} mm/day</span>
            <span className="text-[9px] text-lime-400">ET0 Normal</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 block">Frost Risk</span>
            <span className="text-sm font-bold text-emerald-400 my-0.5 block truncate">{agri.frostRisk.split(" ")[0]}</span>
            <span className="text-[9px] text-slate-400">Safe overnight</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 block">Irrigation Plan</span>
            <span className="text-sm font-bold text-lime-400 my-0.5 block">Light Morning</span>
            <span className="text-[9px] text-slate-400">Water early</span>
          </div>
        </div>
      </div>

      {/* Action Plan & Planting Advice */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Watering & Soil Advice */}
        <div className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-4 h-4 text-lime-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Watering & Irrigation Strategy</h4>
          </div>

          <div className="my-2 p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xs font-bold text-lime-300 block">{agri.wateringStatus}</span>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {agri.wateringRecommendation}
            </p>
          </div>

          <p className="text-[11px] text-slate-400">
            🌱 Drip irrigation at dawn saves up to 40% water loss from solar evaporation.
          </p>
        </div>

        {/* Seasonal Planting Guidance */}
        <div className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Seasonal Garden Guidance</h4>
          </div>

          <div className="my-2 space-y-1.5 text-xs text-slate-300">
            <div className="p-2 rounded-xl bg-white/5 flex items-center justify-between">
              <span>🍅 Tomatoes & Peppers:</span>
              <span className="font-semibold text-white">Ideal vegetative growth window</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 flex items-center justify-between">
              <span>🥬 Leafy Greens & Herbs:</span>
              <span className="font-semibold text-white">Provide light afternoon shade</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 flex items-center justify-between">
              <span>🌸 Lawn & Ornamentals:</span>
              <span className="font-semibold text-white">Apply organic mulch to retain moisture</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            🌾 Check for mildew if nighttime humidity exceeds 85%.
          </p>
        </div>
      </div>
    </div>
  );
};

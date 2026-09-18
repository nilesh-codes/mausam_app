import React, { useState } from "react";
import { AggregatedWeatherData, AppSettings, GeoLocation, PackingItem } from "../../types";
import { generatePackingList, formatTemp, formatPrecip } from "../../utils/weatherUtils";
import { OfflineStorage } from "../../utils/offlineCache";
import {
  Luggage,
  Plane,
  AlertTriangle,
  CheckSquare,
  Square,
  Sparkles,
  Plus,
  Trash2,
  MapPin,
  Clock,
  Compass,
} from "lucide-react";

interface TravelDashboardProps {
  weather: AggregatedWeatherData;
  locationName: string;
  savedLocations: GeoLocation[];
  onSelectLocation: (loc: GeoLocation) => void;
  settings: AppSettings;
  onAskAI: (persona: string, customQuestion?: string) => void;
}

export const TravelDashboard: React.FC<TravelDashboardProps> = ({
  weather,
  locationName,
  savedLocations,
  onSelectLocation,
  settings,
  onAskAI,
}) => {
  // Load or generate initial packing items
  const [packingList, setPackingList] = useState<PackingItem[]>(() => {
    const saved = OfflineStorage.getPackingItems();
    if (saved && saved.length > 0) return saved;
    return generatePackingList(weather, locationName);
  });

  const [newItemText, setNewItemText] = useState("");

  const toggleItem = (id: string) => {
    const updated = packingList.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setPackingList(updated);
    OfflineStorage.savePackingItems(updated);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem: PackingItem = {
      id: `custom-pack-${Date.now()}`,
      item: newItemText.trim(),
      category: "gear",
      reason: "User custom travel item",
      checked: false,
    };
    const updated = [newItem, ...packingList];
    setPackingList(updated);
    OfflineStorage.savePackingItems(updated);
    setNewItemText("");
  };

  const deleteItem = (id: string) => {
    const updated = packingList.filter((item) => item.id !== id);
    setPackingList(updated);
    OfflineStorage.savePackingItems(updated);
  };

  const resetPackingList = () => {
    const generated = generatePackingList(weather, locationName);
    setPackingList(generated);
    OfflineStorage.savePackingItems(generated);
  };

  // Flight & Transit Disruption analysis
  const current = weather.current;
  const visMeters = weather.hourly?.visibility?.[0] || 10000;
  const windGusts = current.wind_gusts_10m;
  const hasThunder = current.weather_code === 95 || current.weather_code === 96 || current.weather_code === 99;

  const getFlightDisruptionRisk = () => {
    if (hasThunder || windGusts > 55 || visMeters < 800) {
      return {
        level: "High Disruption Risk",
        color: "text-red-400",
        bg: "bg-red-500/20",
        border: "border-red-500/40",
        desc: "Active severe cells or dense fog reported. Flights may encounter ground stops or approach holds.",
      };
    }
    if (windGusts > 35 || visMeters < 3000 || current.rain > 3) {
      return {
        level: "Minor Delay Potential",
        color: "text-amber-400",
        bg: "bg-amber-500/20",
        border: "border-amber-500/40",
        desc: "Breezy crosswinds or rain showers. Check airline boarding gate status.",
      };
    }
    return {
      level: "Normal Flight Operations",
      color: "text-emerald-400",
      bg: "bg-emerald-500/20",
      border: "border-emerald-500/40",
      desc: "Clear ceiling and stable atmospheric pressure. Smooth takeoff and landing conditions.",
    };
  };

  const flightRisk = getFlightDisruptionRisk();
  const checkedCount = packingList.filter((i) => i.checked).length;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-violet-950/70 via-slate-900/80 to-purple-950/70 border border-violet-500/30 p-5 backdrop-blur-xl shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-300">
              <Luggage className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider">Travel & Destinations</span>
              <h3 className="text-lg font-bold text-white">Smart Packing & Transit Weather</h3>
            </div>
          </div>

          <button
            id="travel-ai-guide-btn"
            onClick={() => onAskAI("travel", "Create a personalized travel packing list, transit weather outlook, and day-to-night outfit checklist tailored to current weather and destination conditions.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500 hover:bg-violet-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-violet-900/40 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Packing Guide</span>
          </button>
        </div>

        {/* Flight & Airport Weather Status */}
        <div className={`mt-4 p-4 rounded-2xl ${flightRisk.bg} border ${flightRisk.border} flex items-start gap-3`}>
          <Plane className={`w-5 h-5 ${flightRisk.color} shrink-0 mt-0.5`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${flightRisk.color}`}>
                Flight & Transit Status: {flightRisk.level}
              </span>
              <span className="text-[10px] text-slate-300 font-mono">
                Vis: {(visMeters / 1000).toFixed(1)} km
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-0.5">{flightRisk.desc}</p>
          </div>
        </div>

        {/* Saved Destinations Fast Navigator */}
        <div className="mt-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Switch Destination Hub
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {savedLocations.map((loc) => {
              const isCurrent = loc.name === locationName;
              return (
                <button
                  key={`${loc.name}-${loc.latitude}`}
                  onClick={() => onSelectLocation(loc)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 shrink-0 transition cursor-pointer ${
                    isCurrent
                      ? "bg-violet-500 text-white border-violet-400 shadow-md shadow-violet-500/20"
                      : "bg-white/5 text-slate-300 hover:text-white border-white/10 hover:bg-white/10"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-violet-300" />
                  <span>{loc.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Smart Packing Checklist */}
      <div className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-violet-400" />
              Smart Weather-Tailored Packing Checklist ({checkedCount}/{packingList.length})
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Customized for {locationName}'s upcoming forecast & temperature swings.
            </p>
          </div>

          <button
            onClick={resetPackingList}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition cursor-pointer"
          >
            Regenerate
          </button>
        </div>

        {/* Add custom item form */}
        <form onSubmit={handleAddItem} className="flex gap-2 mb-3">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add custom packing item (e.g. Passport, Camera)..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </form>

        {/* Packing items list */}
        <div className="space-y-2">
          {packingList.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-2.5 rounded-2xl border transition flex items-start justify-between gap-3 cursor-pointer ${
                item.checked
                  ? "bg-violet-950/30 border-violet-500/30 opacity-60"
                  : "bg-white/5 hover:bg-white/10 border-white/10"
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <button
                  type="button"
                  className="mt-0.5 text-violet-400 shrink-0"
                >
                  {item.checked ? (
                    <CheckSquare className="w-4 h-4 text-violet-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                <div className="min-w-0">
                  <span
                    className={`text-xs font-bold block truncate ${
                      item.checked ? "line-through text-slate-400" : "text-white"
                    }`}
                  >
                    {item.item}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 leading-tight">
                    {item.reason}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem(item.id);
                }}
                className="text-slate-500 hover:text-rose-400 p-1 rounded transition shrink-0"
                title="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

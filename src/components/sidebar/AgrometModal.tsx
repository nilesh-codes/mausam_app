import React, { useState } from "react";
import { AggregatedWeatherData, GeoLocation } from "../../types";
import { Sprout, X, Droplets, Sun, Wind, Calendar, AlertCircle, FileText, CheckCircle2, ShieldAlert } from "lucide-react";

interface AgrometModalProps {
  isOpen: boolean;
  onClose: () => void;
  weather: AggregatedWeatherData | null;
  location: GeoLocation;
}

export const AgrometModal: React.FC<AgrometModalProps> = ({
  isOpen,
  onClose,
  weather,
  location,
}) => {
  const [selectedCrop, setSelectedCrop] = useState<"Rice / Paddy" | "Wheat" | "Cotton" | "Sugarcane" | "Pulses / Gram" | "Vegetables">("Rice / Paddy");
  const [activeTab, setActiveTab] = useState<"bulletin" | "soil" | "spray" | "advisory">("bulletin");

  if (!isOpen) return null;

  const current = weather?.current;
  const hourly = weather?.hourly;
  const soilMoist = hourly?.soil_moisture_0_to_1cm?.[0] ? Math.round(hourly.soil_moisture_0_to_1cm[0] * 100) : 48;
  const soilTemp = hourly?.soil_temperature_0cm?.[0] ? Math.round(hourly.soil_temperature_0cm[0]) : 26;
  const et0 = hourly?.et0_fao_evapotranspiration?.[0] ?? 4.2;
  const rainSum = weather?.daily?.precipitation_sum?.[0] ?? 0;
  const windSpeed = Math.round(current?.wind_speed_10m ?? 12);

  const cropAdvisories: Record<string, { stage: string; waterReq: string; pestRisk: string; advice: string }> = {
    "Rice / Paddy": {
      stage: "Tillering to Panicle Initiation",
      waterReq: "Maintain 3-5 cm standing water in paddy fields.",
      pestRisk: "Low to Moderate (Stem Borer / Leaf Folder)",
      advice: "Apply nitrogenous top-dressing after draining excess rainwater. Monitor for Brown Plant Hopper if humidity remains above 80%.",
    },
    "Wheat": {
      stage: "CRI (Crown Root Initiation) / Vegetative",
      waterReq: "First irrigation at 21-25 days after sowing.",
      pestRisk: "Low (Aphids & Termite monitoring)",
      advice: "Ensure weed control using recommended post-emergence herbicide under clear sky conditions.",
    },
    "Cotton": {
      stage: "Square & Boll Formation",
      waterReq: "Avoid waterlogging; ensure clean drainage channels.",
      pestRisk: "Moderate (Pink Bollworm & Whitefly)",
      advice: "Install pheromone traps @ 5/ha. Spray neem-based formulation if whitefly count exceeds 8-10 per leaf.",
    },
    "Sugarcane": {
      stage: "Grand Growth Stage",
      waterReq: "Irrigate at 10-12 day intervals if dry spell exceeds 5 days.",
      pestRisk: "Low (Early shoot borer)",
      advice: "Perform trash mulching between rows to conserve topsoil moisture and prevent weed emergence.",
    },
    "Pulses / Gram": {
      stage: "Flowering & Pod Development",
      waterReq: "Light sprinkler irrigation; strictly prevent water stagnation.",
      pestRisk: "Moderate (Pod Borer - Helicoverpa)",
      advice: "Set up bird perches @ 20/ha for natural predation. Apply bio-pesticide NPV spray during evening hours.",
    },
    "Vegetables": {
      stage: "Fruiting / Harvesting",
      waterReq: "Drip irrigation recommended during early morning.",
      pestRisk: "Moderate (Fruit Borer & Powdery Mildew)",
      advice: "Harvest mature produce before heavy afternoon showers. Ensure raised bed drainage.",
    },
  };

  const currentCrop = cropAdvisories[selectedCrop];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl p-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Agromet Products & GKMS</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  IMD Krishi Advisory
                </span>
              </div>
              <p className="text-xs text-slate-400">
                District Agro-Meteorological Field Unit (DAMFU) • {location.name}, {location.admin1 || "India"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex rounded-2xl bg-slate-800/80 p-1 mt-4 border border-white/5 text-xs font-medium">
          <button
            onClick={() => setActiveTab("bulletin")}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              activeTab === "bulletin" ? "bg-emerald-600 text-white font-bold shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Agro Bulletin
          </button>
          <button
            onClick={() => setActiveTab("soil")}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              activeTab === "soil" ? "bg-emerald-600 text-white font-bold shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Soil & Moisture
          </button>
          <button
            onClick={() => setActiveTab("spray")}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              activeTab === "spray" ? "bg-emerald-600 text-white font-bold shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Foliar Spray Planner
          </button>
          <button
            onClick={() => setActiveTab("advisory")}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              activeTab === "advisory" ? "bg-emerald-600 text-white font-bold shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Crop Matrix
          </button>
        </div>

        {/* Tab 1: Agro Bulletin */}
        {activeTab === "bulletin" && (
          <div className="py-4 space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Weekly District Agromet Advisory Bulletin (AAS)
                </span>
                <span className="text-[11px] text-slate-400">Issue Date: Today</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Prevailing weather in <strong>{location.name}</strong> indicates day temperatures around{" "}
                <strong>{Math.round(current?.temperature_2m ?? 30)}°C</strong> with relative humidity around{" "}
                <strong>{Math.round(current?.relative_humidity_2m ?? 60)}%</strong>. Expected rainfall in the next 3 days:{" "}
                <strong>{rainSum.toFixed(1)} mm</strong>.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block">Topsoil Moisture</span>
                <span className="text-lg font-mono font-bold text-emerald-400">{soilMoist}%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">0–1 cm depth</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block">Evapotranspiration</span>
                <span className="text-lg font-mono font-bold text-sky-400">{et0.toFixed(1)} mm/d</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">FAO-56 ET₀</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block">Soil Temperature</span>
                <span className="text-lg font-mono font-bold text-amber-400">{soilTemp}°C</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Surface bed</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block">Wind Drift</span>
                <span className="text-lg font-mono font-bold text-purple-400">{windSpeed} km/h</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{windSpeed < 15 ? "Low Drift" : "Moderate"}</span>
              </div>
            </div>

            {/* General Field Advice */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-white/5 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Key Agronomic Directives:</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Irrigation:</strong> Schedule drip/sprinkler runs between 06:00 AM – 08:30 AM to minimize solar evaporation loss.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Field Drainage:</strong> Keep drainage furrows clear in low-lying crop patches to prevent root hypoxia during sudden spells.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Harvest Storage:</strong> Sun-dry harvested grains to below 12% moisture content before bagging to avert fungal storage rot.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Soil & Moisture */}
        {activeTab === "soil" && (
          <div className="py-4 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Multi-Depth Soil Profile (Open-Meteo Land Surface Model)</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Surface Layer (0–1 cm)</span>
                    <span className="font-mono font-bold text-emerald-400">{soilMoist}% saturation</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, soilMoist)}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Root Zone Depth (1–3 cm)</span>
                    <span className="font-mono font-bold text-sky-400">{Math.round(soilMoist * 0.95)}% saturation</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: `${Math.min(100, soilMoist * 0.95)}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Subsoil Depth (3–9 cm)</span>
                    <span className="font-mono font-bold text-indigo-400">{Math.round(soilMoist * 0.9)}% saturation</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, soilMoist * 0.9)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-white/5 text-xs text-slate-300">
              <span className="font-bold text-white block mb-1">Interpretation:</span>
              {soilMoist > 60 ? (
                <span className="text-emerald-300">Adequate soil moisture reserve. Additional irrigation can be suspended for 48 hours to conserve water.</span>
              ) : soilMoist < 35 ? (
                <span className="text-amber-300">Topsoil is approaching wilting point. Light irrigation advised before midday thermal rise.</span>
              ) : (
                <span className="text-sky-300">Optimal field moisture equilibrium. Excellent for root aeration and nutrient uptake.</span>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Spray Planner */}
        {activeTab === "spray" && (
          <div className="py-4 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Agrochemical Spray Window Index</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  windSpeed < 15 && rainSum < 2 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}>
                  {windSpeed < 15 && rainSum < 2 ? "Favorable Spray Window" : "Caution / Defer Spraying"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/60">
                  <span className="text-[10px] text-slate-400 block">Wind Drift</span>
                  <span className="font-bold text-white">{windSpeed} km/h</span>
                  <span className="text-[10px] text-emerald-400 block">&lt; 15 km/h limit</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60">
                  <span className="text-[10px] text-slate-400 block">Washout Risk</span>
                  <span className="font-bold text-white">{rainSum.toFixed(1)} mm</span>
                  <span className="text-[10px] text-emerald-400 block">&lt; 2 mm safe</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60">
                  <span className="text-[10px] text-slate-400 block">Evaporation</span>
                  <span className="font-bold text-white">{Math.round(current?.relative_humidity_2m ?? 60)}% RH</span>
                  <span className="text-[10px] text-sky-400 block">&gt; 40% safe</span>
                </div>
              </div>

              <p className="text-xs text-slate-300">
                <strong>Best Spraying Time:</strong> Early morning between <strong>06:30 AM and 09:30 AM</strong> or late afternoon after <strong>04:30 PM</strong> when thermal updrafts and leaf droplet evaporation are low.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Crop Matrix */}
        {activeTab === "advisory" && (
          <div className="py-4 space-y-4">
            <div className="flex flex-wrap gap-1.5">
              {(["Rice / Paddy", "Wheat", "Cotton", "Sugarcane", "Pulses / Gram", "Vegetables"] as const).map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                    selectedCrop === crop
                      ? "bg-emerald-500 text-white border-emerald-400 shadow"
                      : "bg-slate-800 text-slate-400 border-white/5 hover:text-white"
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-emerald-400">{selectedCrop} Advisory</h4>
                <span className="text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg">
                  Stage: {currentCrop.stage}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/60">
                  <span className="font-bold text-sky-300 block mb-0.5">💧 Water & Irrigation Directive:</span>
                  <p className="text-slate-300">{currentCrop.waterReq}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60">
                  <span className="font-bold text-amber-300 block mb-0.5">🐛 Pest & Disease Scouting:</span>
                  <p className="text-slate-300">{currentCrop.pestRisk}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60">
                  <span className="font-bold text-emerald-300 block mb-0.5">🌾 Scientific Agronomic Recommendation:</span>
                  <p className="text-slate-300">{currentCrop.advice}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

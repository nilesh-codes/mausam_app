import React from "react";
import { AggregatedWeatherData, AppSettings, UnifiedWeatherContext, UserPreferences, HealthNote } from "../../types";
import { getAQIInfo, getUVInfo, formatTemp } from "../../utils/weatherUtils";
import {
  HeartPulse,
  Wind,
  Sun,
  Droplets,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Flower2,
  Activity,
  CheckCircle2,
  Info,
  Calendar,
  AlertTriangle,
} from "lucide-react";

interface HealthDashboardProps {
  weather: AggregatedWeatherData;
  settings: AppSettings;
  weatherContext?: UnifiedWeatherContext | null;
  userPreferences?: UserPreferences;
  onAskAI: (persona: string, customQuestion?: string) => void;
}

const HEALTH_LABELS: Record<HealthNote, string> = {
  none: "None",
  asthma: "Asthma / Respiratory",
  skin_sensitivity: "Skin Sensitivity",
  allergies: "Allergies (Pollen/Seasonal)",
  heart_condition: "Heart Condition",
  other: "Other Health Note",
};

export const HealthDashboard: React.FC<HealthDashboardProps> = ({
  weather,
  settings,
  weatherContext,
  userPreferences,
  onAskAI,
}) => {
  // Use unified context if available, or fall back to raw data
  const aqiVal = weatherContext?.current?.aqi ?? (weather.air_quality?.current?.us_aqi || 42);
  const euroAqi = weather.air_quality?.current?.european_aqi || 28;
  const aqiInfo = getAQIInfo(aqiVal);

  const pm25 = weatherContext?.current?.pollutants?.pm2_5 ?? (weather.air_quality?.current?.pm2_5 ?? 12.4);
  const pm10 = weatherContext?.current?.pollutants?.pm10 ?? (weather.air_quality?.current?.pm10 ?? 24.8);
  const o3 = weatherContext?.current?.pollutants?.ozone ?? (weather.air_quality?.current?.ozone ?? 45.2);
  const no2 = weatherContext?.current?.pollutants?.nitrogen_dioxide ?? (weather.air_quality?.current?.nitrogen_dioxide ?? 18.0);
  const so2 = weather.air_quality?.current?.sulphur_dioxide ?? 4.2;
  const co = weather.air_quality?.current?.carbon_monoxide ?? 320;

  const uvVal = weatherContext?.current?.uvIndex ?? (weather.hourly?.uv_index?.[0] || weather.daily?.uv_index_max?.[0] || 4.2);
  const uvInfo = getUVInfo(uvVal);

  const humidity = weatherContext?.current?.humidity ?? weather.current.relative_humidity_2m;
  const dewPoint = weather.hourly?.dew_point_2m?.[0] ?? weather.current.temperature_2m - ((100 - humidity) / 5);

  // Pollen indicators from date-aware UnifiedWeatherContext
  const ctxPollen = weatherContext?.pollen;
  const seasonName = ctxPollen?.seasonName ?? "Current Season";
  const seasonDescription = ctxPollen?.seasonDescription ?? "Seasonal pollen tracking";

  const getPollenSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "low":
      case "negligible":
      case "dormant":
        return { color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30" };
      case "moderate":
        return { color: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/30" };
      case "high":
        return { color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30" };
      default:
        return { color: "text-rose-400", bg: "bg-rose-500/20", border: "border-rose-500/30" };
    }
  };

  const pollenItems = ctxPollen
    ? [
        {
          name: "Grass Pollen",
          val: ctxPollen.grass.value,
          severity: ctxPollen.grass.severity,
          icon: "🌾",
          desc: ctxPollen.grass.description,
          context: ctxPollen.grass.seasonContext,
          active: ctxPollen.grass.seasonActive,
        },
        {
          name: "Birch / Tree",
          val: ctxPollen.tree.value,
          severity: ctxPollen.tree.severity,
          icon: "🌳",
          desc: ctxPollen.tree.description,
          context: ctxPollen.tree.seasonContext,
          active: ctxPollen.tree.seasonActive,
        },
        {
          name: "Ragweed / Weeds",
          val: ctxPollen.ragweed.value,
          severity: ctxPollen.ragweed.severity,
          icon: "🌿",
          desc: ctxPollen.ragweed.description,
          context: ctxPollen.ragweed.seasonContext,
          active: ctxPollen.ragweed.seasonActive,
        },
        {
          name: "Olive / Shrub",
          val: ctxPollen.olive.value,
          severity: ctxPollen.olive.severity,
          icon: "🫒",
          desc: ctxPollen.olive.description,
          context: ctxPollen.olive.seasonContext,
          active: ctxPollen.olive.seasonActive,
        },
      ]
    : [
        { name: "Grass Pollen", val: 1.8, severity: "Moderate", icon: "🌾", desc: "Common seasonal hayfever trigger", context: "Active", active: true },
        { name: "Birch / Tree", val: 0.6, severity: "Low", icon: "🌳", desc: "Tree airborne pollen", context: "Off-peak", active: false },
        { name: "Ragweed / Weeds", val: 1.2, severity: "Moderate", icon: "🌿", desc: "Late summer weed allergen", context: "Active", active: true },
        { name: "Olive / Shrub", val: 0.9, severity: "Low", icon: "🫒", desc: "Shrub and evergreen pollen", context: "Low activity", active: false },
      ];

  // Health consideration (single selection)
  const healthNote: HealthNote =
    weatherContext?.userProfile?.healthNote ||
    userPreferences?.healthNote ||
    "none";

  const isAsthma = healthNote === "asthma";
  const isSkin = healthNote === "skin_sensitivity";
  const isAllergies = healthNote === "allergies";
  const isHeart = healthNote === "heart_condition";
  const isOther = healthNote === "other";
  const hasHealthCondition = healthNote !== "none";

  // Determine skin and asthma comfort levels
  const getSkinComfort = () => {
    if (humidity < 35) return { status: "Dry Air Risk", desc: "Low humidity may cause skin cracking, eczema flare-ups, and dry eyes. Hydrate skin frequently." };
    if (humidity > 75) return { status: "Humid / Muggy", desc: "High moisture may trigger heat rash and sweat retention. Wear loose breathable cotton." };
    return { status: "Ideal Moisture", desc: "Balanced ambient humidity is gentle on sensitive skin and barrier repair." };
  };

  const getAsthmaRisk = () => {
    if (aqiVal > 150 || pm25 > 35) return { status: "Elevated Risk", color: "text-rose-400", desc: "High particulate matter may provoke bronchospasms. Keep rescue inhaler on hand and minimize outdoor cardio." };
    if (aqiVal > 100) return { status: "Moderate Caution", color: "text-amber-400", desc: "Sensitive airways may experience throat tickle or mild cough." };
    return { status: "Low Risk", color: "text-emerald-400", desc: "Clean breathable air today. Safe for all outdoor activities." };
  };

  const skin = getSkinComfort();
  const asthma = getAsthmaRisk();

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Banner with AI Analysis trigger */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-950/70 via-slate-900/80 to-teal-950/70 border border-emerald-500/30 p-5 backdrop-blur-xl shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <HeartPulse className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Health & Allergy Suite</span>
                {hasHealthCondition && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{HEALTH_LABELS[healthNote]} Flagged</span>
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white">Air Quality & Biometeorology</h3>
            </div>
          </div>

          <button
            id="health-ai-advice-btn"
            onClick={() => onAskAI("health", "Generate a comprehensive health, air quality (AQI), pollen allergy, and respiratory protection advisory tailored to my health profile and current weather conditions.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-emerald-900/40 cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Health Plan</span>
          </button>
        </div>

        {/* Personalized Health Alert based on single selected condition */}
        {hasHealthCondition && (
          <div className="mt-3 p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-3 text-xs text-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-white block">
                Personalized {HEALTH_LABELS[healthNote]} Advisory
              </span>
              <p className="text-rose-200 leading-relaxed">
                {isAsthma && `Asthma condition flagged: Live AQI is ${aqiVal} (${aqiInfo.label}) with PM2.5 at ${pm25.toFixed(1)} µg/m³. Keep rescue inhaler on hand and minimize heavy outdoor cardio in stagnant air.`}
                {isSkin && `Skin sensitivity flagged: UV Index is ${uvVal.toFixed(1)} (${uvInfo.level}). Apply broad-spectrum SPF 50+ sunscreen, wear UV-rated eyewear, and seek shade during midday hours.`}
                {isAllergies && `Allergies flagged: Date-aware season is ${seasonName}. Monitor active pollen levels (${ctxPollen?.grass.severity || "Moderate"} grass, ${ctxPollen?.tree.severity || "Low"} tree) before outdoor recreation.`}
                {isHeart && `Heart condition flagged: Ambient thermal load is ${Math.round(weather.current.temperature_2m)}°C with ${humidity}% humidity. Stay hydrated, pace yourself, and rest in climate-controlled areas.`}
                {isOther && `Personal health condition flagged: Keep track of local AQI (${aqiVal}) and thermal variations.`}
              </p>
            </div>
          </div>
        )}

        {/* AQI Big Status Gauge */}
        <div className="mt-4 p-4 rounded-2xl bg-black/30 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-20 h-20 rounded-full border-4 ${aqiInfo.colorClass.replace("text-", "border-")} flex flex-col items-center justify-center bg-black/40 shadow-inner`}>
              <span className="text-2xl font-black text-white font-mono">{aqiVal}</span>
              <span className="text-[9px] uppercase font-bold text-slate-400">US AQI</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-base font-bold ${aqiInfo.colorClass}`}>{aqiInfo.label}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">EU: {euroAqi}</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-sm">{aqiInfo.advice}</p>
            </div>
          </div>

          {/* Quick Sensitive Groups Badge */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 max-w-xs">
            <span className="text-[10px] font-bold text-emerald-400 uppercase block">Asthma & Allergy Impact</span>
            <p className="text-[11px] text-slate-300 mt-0.5">{aqiInfo.healthSensitiveRisk}</p>
          </div>
        </div>

        {/* Pollutants Breakdown Grid */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Pollutants Concentration</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { label: "PM2.5", val: `${pm25.toFixed(1)} µg/m³`, status: pm25 < 15 ? "Good" : pm25 < 35 ? "Moderate" : "High" },
              { label: "PM10", val: `${pm10.toFixed(1)} µg/m³`, status: pm10 < 45 ? "Good" : "Elevated" },
              { label: "Ozone (O3)", val: `${o3.toFixed(1)} µg/m³`, status: o3 < 60 ? "Low" : "Moderate" },
              { label: "NO2", val: `${no2.toFixed(1)} µg/m³`, status: "Good" },
              { label: "SO2", val: `${so2.toFixed(1)} µg/m³`, status: "Low" },
              { label: "CO", val: `${(co / 1000).toFixed(2)} mg/m³`, status: "Safe" },
            ].map((item) => (
              <div key={item.label} className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 text-center min-w-0">
                <span className="text-[10px] text-slate-400 block font-medium truncate">{item.label}</span>
                <span className="text-[11px] sm:text-xs font-bold text-white my-0.5 block font-mono truncate">{item.val}</span>
                <span className="text-[9px] font-semibold text-emerald-400 block truncate">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pollen Forecast & Allergies */}
      <div className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Flower2 className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Date-Aware Pollen Spectrum
            </h4>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>{seasonName}</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-3">{seasonDescription}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {pollenItems.map((pollen) => {
            const badge = getPollenSeverityBadge(pollen.severity);
            return (
              <div
                key={pollen.name}
                className={`p-3.5 rounded-2xl border flex flex-col justify-between transition ${
                  pollen.active
                    ? "bg-slate-800/80 border-white/15 shadow-md"
                    : "bg-white/5 border-white/5 opacity-80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{pollen.icon}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${badge.bg} ${badge.color} ${badge.border}`}>
                    {pollen.severity}
                  </span>
                </div>
                <div className="mt-2.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-white block">{pollen.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{pollen.val.toFixed(1)}/10</span>
                  </div>
                  <span className="text-[10px] text-slate-300 mt-1 block leading-tight">{pollen.desc}</span>
                  <span className="text-[9px] text-sky-400/90 mt-1 block font-medium">{pollen.context}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* UV & Sun Exposure Protection Timer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* UV Index & Skin Burn Timer */}
        <div className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">UV & Sun Exposure (Synchronized)</h4>
            </div>
            <span className={`text-xs font-bold ${uvInfo.color}`}>{uvInfo.level}</span>
          </div>

          <div className="my-3 flex items-center gap-4">
            <div className="text-4xl font-extrabold text-amber-400 font-mono">{uvVal.toFixed(1)}</div>
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-white block">Recommended: {uvInfo.spf}</span>
              <span className="text-slate-400">Burn time for unprotected skin: {uvInfo.burnTime}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 p-2.5 rounded-xl bg-white/5 border border-white/5">
            💡 {isSkin ? "Sensitive skin flagged: UV radiation induces faster erythema; reapply SPF 50+ every 2 hours." : uvInfo.tip}
          </p>
        </div>

        {/* Humidity, Dew Point & Asthma/Skin Sensitivity */}
        <div className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Humidity & Respiratory Comfort</h4>
            </div>
            <span className="text-xs font-bold text-sky-400">{humidity}% RH</span>
          </div>

          <div className="my-3 space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
              <span className="text-slate-400">Dew Point:</span>
              <span className="font-bold text-white">{formatTemp(dewPoint, settings.tempUnit)}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
              <span className="text-slate-400">Asthma Status:</span>
              <span className={`font-bold ${asthma.color}`}>{asthma.status}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 p-2.5 rounded-xl bg-white/5 border border-white/5">
            💧 {isAsthma ? "Asthma flagged: Monitor humidity shifts; high moisture or severe dryness can irritate sensitive airways." : skin.desc}
          </p>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { AggregatedWeatherData, AppSettings, SevereAlert, UnifiedWeatherContext } from "../types";
import {
  getWeatherCondition,
  formatTemp,
  formatWind,
  formatPressure,
  getAQIInfo,
  getUVInfo,
} from "../utils/weatherUtils";
import { WeatherIcon } from "./WeatherIcon";
import {
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  AlertTriangle,
  HeartPulse,
  Sun,
  ShieldAlert,
} from "lucide-react";

interface CurrentWeatherHeroProps {
  weather: AggregatedWeatherData;
  locationName: string;
  settings: AppSettings;
  alerts: SevereAlert[];
  weatherContext?: UnifiedWeatherContext | null;
  onOpenAlerts?: () => void;
  onOpenHealth?: () => void;
}

export const CurrentWeatherHero: React.FC<CurrentWeatherHeroProps> = ({
  weather,
  locationName,
  settings,
  alerts,
  weatherContext,
  onOpenHealth,
}) => {
  const current = weather.current;
  const daily = weather.daily;
  const condition = getWeatherCondition(current.weather_code, current.is_day);

  const minTemp = weatherContext?.daily[0]?.tempLow ?? (daily?.temperature_2m_min?.[0] ?? current.temperature_2m - 4);
  const maxTemp = weatherContext?.daily[0]?.tempHigh ?? (daily?.temperature_2m_max?.[0] ?? current.temperature_2m + 5);
  const sunriseStr = weatherContext?.daily[0]?.sunrise ?? (daily?.sunrise?.[0]
    ? new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })
    : "06:15 AM");
  const sunsetStr = weatherContext?.daily[0]?.sunset ?? (daily?.sunset?.[0]
    ? new Date(daily.sunset[0]).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })
    : "06:45 PM");

  const aqiVal = weatherContext?.current?.aqi ?? (weather.air_quality?.current?.us_aqi || 42);
  const aqiInfo = getAQIInfo(aqiVal);
  const uvVal = weatherContext?.current?.uvIndex ?? (daily?.uv_index_max?.[0] || weather.hourly?.uv_index?.[0] || 4);
  const uvInfo = getUVInfo(uvVal);
  const rainProb = weatherContext?.current?.rainChance ?? (weather.hourly?.precipitation_probability?.[0] || 0);

  // Day & Date formatting
  const todayDate = new Date();
  const dayName = todayDate.toLocaleDateString([], { weekday: "long" });
  const fullDateStr = todayDate.toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Severe Weather Alert Banner if present */}
      {alerts.length > 0 && (
        <div
          id="severe-weather-alert-banner"
          className="w-full p-4 rounded-3xl bg-rose-950/40 border border-rose-800/80 backdrop-blur-xl flex items-start gap-3 shadow-xl"
        >
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-rose-300 uppercase tracking-widest">
                {alerts[0].title}
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold uppercase tracking-wider border border-rose-500/30">
                {alerts[0].severity}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {alerts[0].description}
            </p>
          </div>
        </div>
      )}

      {/* Main Natural Tones Hero Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left 2-Cols: Sky-to-Indigo Gradient Primary Weather Display */}
        <div
          id="current-weather-main-hero"
          className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-800 p-6 sm:p-7 flex flex-col justify-between shadow-2xl border border-sky-500/30 min-h-[210px]"
        >
          {/* Ambient blur sphere */}
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Row: Location & Live Condition Badge + Day/Date */}
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold text-sky-200 uppercase tracking-widest opacity-90 block mb-0.5">
                Current Meteorological Station
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm">
                {locationName}
              </h2>
            </div>

            <div className="text-right shrink-0">
              <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">{dayName}</p>
              <p className="text-xs font-medium text-sky-200 opacity-90">{fullDateStr}</p>
            </div>
          </div>

          {/* Middle: Giant Temperature, Condition & Feels-like */}
          <div className="relative z-10 flex items-end justify-between gap-4 mt-4">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl sm:text-6xl font-bold text-white tracking-tighter drop-shadow font-mono">
                  {formatTemp(current.temperature_2m, settings.tempUnit)}
                </span>
                <span className="text-base sm:text-lg font-medium text-sky-100 opacity-95">
                  {condition.label}
                </span>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="font-medium bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white shadow-sm border border-white/15">
                  Feels like {formatTemp(current.apparent_temperature, settings.tempUnit)}
                </span>
                <span className="font-medium bg-sky-950/30 backdrop-blur-md px-3 py-1 rounded-full text-xs text-sky-100 border border-white/10">
                  H: {formatTemp(maxTemp, settings.tempUnit)} • L: {formatTemp(minTemp, settings.tempUnit)}
                </span>
              </div>
            </div>

            {/* Condition Icon badge */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-amber-300 shadow-xl shrink-0">
              <WeatherIcon name={condition.iconName} className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </div>
        </div>

        {/* Right 1-Col: Natural Slate Air Quality Index Widget */}
        <div
          id="hero-aqi-natural-card"
          onClick={onOpenHealth}
          className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between gap-4 shadow-xl hover:border-slate-700 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-widest">
            <span className="font-semibold">Air Quality Index</span>
            <span className={`font-bold ${aqiInfo.colorClass} group-hover:scale-105 transition`}>
              {aqiInfo.label}
            </span>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight flex items-baseline gap-2">
              <span>AQI {aqiVal}</span>
              <HeartPulse className="w-4 h-4 text-emerald-400 animate-pulse inline" />
            </div>

            {/* AQI Level Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  aqiVal <= 50
                    ? "bg-emerald-500"
                    : aqiVal <= 100
                    ? "bg-amber-500"
                    : aqiVal <= 150
                    ? "bg-orange-500"
                    : "bg-rose-500"
                }`}
                style={{ width: `${Math.min(100, (aqiVal / 250) * 100)}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {aqiVal <= 50
              ? "Perfect for outdoor runs, cycling and open-air activities."
              : aqiVal <= 100
              ? "Moderate air quality. Sensitive individuals should take light precautions."
              : "Elevated particulate pollution. Consider limiting strenuous outdoor exertion."}
          </p>
        </div>
      </div>

      {/* Atmospheric Footer Metrics Bar */}
      <div
        id="hero-metrics-footer-bar"
        className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 sm:px-6 sm:py-4 shadow-xl"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
          {/* Humidity */}
          <div className="text-center pt-2 sm:pt-0">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
              <Droplets className="w-3 h-3 text-sky-400" /> Humidity
            </p>
            <p className="font-mono font-bold text-base sm:text-lg text-white mt-1">
              {current.relative_humidity_2m}%
            </p>
          </div>

          {/* UV Index */}
          <div className="text-center pt-2 sm:pt-0 sm:pl-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
              <Sun className="w-3 h-3 text-amber-400" /> UV Index
            </p>
            <p className={`font-mono font-bold text-base sm:text-lg mt-1 ${uvInfo.color}`}>
              {uvVal.toFixed(1)} <span className="text-xs font-normal text-slate-400">{uvInfo.level}</span>
            </p>
          </div>

          {/* Wind Speed */}
          <div className="text-center pt-2 sm:pt-0 sm:pl-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
              <Wind className="w-3 h-3 text-sky-400" /> Wind Speed
            </p>
            <p className="font-mono font-bold text-base sm:text-lg text-white mt-1">
              {formatWind(current.wind_speed_10m, settings.windUnit)}
            </p>
          </div>

          {/* Visibility */}
          <div className="text-center pt-2 sm:pt-0 sm:pl-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
              <Eye className="w-3 h-3 text-emerald-400" /> Visibility
            </p>
            <p className="font-mono font-bold text-base sm:text-lg text-white mt-1">
              {weather.hourly?.visibility?.[0]
                ? `${(weather.hourly.visibility[0] / 1000).toFixed(1)} km`
                : "10+ km"}
            </p>
          </div>

          {/* Pressure */}
          <div className="text-center pt-2 sm:pt-0 sm:pl-3 hidden md:block">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
              <Gauge className="w-3 h-3 text-purple-400" /> Pressure
            </p>
            <p className="font-mono font-bold text-base text-white mt-1">
              {formatPressure(current.surface_pressure || current.pressure_msl, settings.pressureUnit)}
            </p>
          </div>

          {/* Sunrise / Sunset */}
          <div className="text-center pt-2 sm:pt-0 sm:pl-3 hidden md:block">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
              <Sunrise className="w-3 h-3 text-amber-400" /> Daylight
            </p>
            <p className="font-mono font-bold text-xs text-white mt-1">
              {sunriseStr} – {sunsetStr}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


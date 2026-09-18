import React, { useState } from "react";
import { AggregatedWeatherData, AppSettings, UnifiedWeatherContext } from "../types";
import {
  getWeatherCondition,
  formatTemp,
  formatTempNum,
  formatWind,
} from "../utils/weatherUtils";
import { WeatherIcon } from "./WeatherIcon";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ComposedChart,
} from "recharts";
import { Clock, TrendingUp, BarChart3 } from "lucide-react";

interface HourlyForecastProps {
  weather: AggregatedWeatherData;
  settings: AppSettings;
  weatherContext?: UnifiedWeatherContext | null;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  weather,
  settings,
  weatherContext,
}) => {
  const [viewMode, setViewMode] = useState<"cards" | "chart">("cards");

  // If weatherContext hourly is available, map from the standardized hourly array
  const hourlyData = weatherContext?.hourly && weatherContext.hourly.length > 0
    ? weatherContext.hourly.slice(0, 24).map((h, idx) => ({
        timeLabel: idx === 0 ? "Now" : h.hourLabel,
        fullTime: h.timeIso,
        temp: formatTempNum(h.temp, settings.tempUnit),
        rawTempC: h.temp,
        feels: formatTempNum(h.feelsLike, settings.tempUnit),
        rainProb: h.rainChance,
        precipMm: h.precipitationMm,
        wind: Math.round(h.windSpeed),
        uv: h.uvIndex,
        condition: getWeatherCondition(h.weatherCode, h.isDay ? 1 : 0),
      }))
    : (() => {
        const hourly = weather.hourly;
        if (!hourly || !hourly.time || hourly.time.length === 0) return [];
        const currentHour = new Date().getHours();
        const startIdx = hourly.time.findIndex((t) => {
          const d = new Date(t);
          return d.getHours() >= currentHour;
        });
        const safeStart = startIdx >= 0 ? startIdx : 0;
        return hourly.time.slice(safeStart, safeStart + 24).map((timeStr, idx) => {
          const date = new Date(timeStr);
          const timeLabel = idx === 0 ? "Now" : date.toLocaleTimeString([], { hour: "numeric", hour12: true });
          const actualIdx = safeStart + idx;
          const temp = hourly.temperature_2m[actualIdx] ?? 24;
          const feels = hourly.apparent_temperature[actualIdx] ?? temp;
          const rainProb = hourly.precipitation_probability ? hourly.precipitation_probability[actualIdx] ?? 0 : 0;
          const precipMm = hourly.precipitation ? hourly.precipitation[actualIdx] ?? 0 : 0;
          const code = hourly.weather_code[actualIdx] ?? 0;
          const isDay = hourly.is_day ? hourly.is_day[actualIdx] ?? 1 : 1;
          const wind = hourly.wind_speed_10m[actualIdx] ?? 10;
          const uv = hourly.uv_index ? hourly.uv_index[actualIdx] ?? 0 : 0;
          const condition = getWeatherCondition(code, isDay);

          return {
            timeLabel,
            fullTime: timeStr,
            temp: formatTempNum(temp, settings.tempUnit),
            rawTempC: temp,
            feels: formatTempNum(feels, settings.tempUnit),
            rainProb,
            precipMm,
            wind: Math.round(wind),
            uv,
            condition,
          };
        });
      })();

  if (hourlyData.length === 0) return null;

  return (
    <section aria-label="Hourly Forecast" className="w-full rounded-3xl bg-slate-900/50 backdrop-blur-2xl border border-white/10 p-4 shadow-xl flex flex-col gap-3">
      {/* Header & Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">24-Hour Forecast</h3>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-0.5 rounded-xl bg-slate-800/80 border border-white/10 text-xs">
          <button
            id="hourly-cards-toggle-btn"
            onClick={() => setViewMode("cards")}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1 ${
              viewMode === "cards" ? "bg-sky-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Cards
          </button>
          <button
            id="hourly-chart-toggle-btn"
            onClick={() => setViewMode("chart")}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1 ${
              viewMode === "chart" ? "bg-sky-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Chart
          </button>
        </div>
      </div>

      {/* Cards View */}
      {viewMode === "cards" ? (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-1 no-scrollbar scroll-smooth">
          {hourlyData.map((hour, i) => (
            <div
              key={`hour-${i}-${hour.timeLabel}`}
              className={`flex flex-col items-center justify-between p-3 min-w-[76px] rounded-2xl border transition shrink-0 ${
                i === 0
                  ? "bg-sky-500/20 border-sky-500/40 text-white shadow-md shadow-sky-500/10 ring-1 ring-sky-400/30"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-200"
              }`}
            >
              <span className="text-[11px] font-medium text-slate-400 mb-1">{hour.timeLabel}</span>

              {/* Weather Icon */}
              <div className="w-8 h-8 flex items-center justify-center my-1 text-amber-300">
                <WeatherIcon name={hour.condition.iconName} className="w-6 h-6" />
              </div>

              {/* Temperature */}
              <span className="text-sm font-bold text-white my-0.5">
                {hour.temp}°{settings.tempUnit === "fahrenheit" ? "F" : "C"}
              </span>

              {/* Rain chance badge */}
              {hour.rainProb > 0 ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30 mt-1">
                  {hour.rainProb}%
                </span>
              ) : (
                <span className="text-[10px] text-slate-500 mt-1 font-mono">
                  {formatWind(hour.wind, settings.windUnit)}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Chart View */
        <div className="w-full h-48 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={hourlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/20 p-2 text-xs shadow-xl text-white">
                        <p className="font-bold text-sky-400">{data.timeLabel} - {data.condition.label}</p>
                        <p>Temperature: {data.temp}°{settings.tempUnit === "fahrenheit" ? "F" : "C"}</p>
                        <p>Precipitation Chance: {data.rainProb}%</p>
                        <p>Wind: {formatWind(data.wind, settings.windUnit)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="temp" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGradient)" />
              <Bar dataKey="rainProb" fill="url(#rainGradient)" radius={[4, 4, 0, 0]} maxBarSize={12} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};


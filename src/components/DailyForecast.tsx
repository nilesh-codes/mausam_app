import React, { useState } from "react";
import { AggregatedWeatherData, AppSettings, UnifiedWeatherContext } from "../types";
import {
  getWeatherCondition,
  formatTemp,
  formatWind,
  formatPrecip,
  getUVInfo,
} from "../utils/weatherUtils";
import { WeatherIcon } from "./WeatherIcon";
import { Calendar, ChevronDown, ChevronUp, Droplets, Sunrise, Sunset, Wind, Sun } from "lucide-react";

interface DailyForecastProps {
  weather: AggregatedWeatherData;
  settings: AppSettings;
  weatherContext?: UnifiedWeatherContext | null;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({
  weather,
  settings,
  weatherContext,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // If unified weather context is available, use its standardized daily array
  if (weatherContext && weatherContext.daily && weatherContext.daily.length > 0) {
    const dailyList = weatherContext.daily.slice(0, 7);
    const minTemps = dailyList.map((d) => d.tempLow);
    const maxTemps = dailyList.map((d) => d.tempHigh);
    const allMin = Math.min(...minTemps);
    const allMax = Math.max(...maxTemps);
    const totalSpread = Math.max(1, allMax - allMin);

    return (
      <section aria-label="7-Day Daily Forecast" className="w-full rounded-3xl bg-slate-900/50 backdrop-blur-2xl border border-white/10 p-4 shadow-xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">7-Day Daily Forecast</h3>
          </div>
          <span className="text-[11px] text-slate-400">Click a day for details</span>
        </div>

        <div className="flex flex-col divide-y divide-white/5">
          {dailyList.map((d, idx) => {
            const isToday = idx === 0;
            const uvInfo = getUVInfo(d.uvIndexMax);

            // Calculate bar offsets
            const leftPct = Math.max(0, ((d.tempLow - allMin) / totalSpread) * 100);
            const widthPct = Math.max(8, ((d.tempHigh - d.tempLow) / totalSpread) * 100);
            const isExpanded = expandedIndex === idx;

            return (
              <div key={`daily-ctx-${d.dateIso}`} className="py-2.5">
                <button
                  id={`daily-forecast-row-${idx}`}
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full flex items-center justify-between gap-1.5 sm:gap-3 text-left hover:bg-white/5 p-1.5 rounded-2xl transition cursor-pointer"
                >
                  {/* Day name & date */}
                  <div className="w-16 sm:w-24 shrink-0">
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span className="truncate">{d.dayLabel}</span>
                      {isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">{d.dateLabel}</span>
                  </div>

                  {/* Weather Icon & Rain Probability */}
                  <div className="flex items-center gap-1.5 sm:gap-2 w-14 sm:w-28 shrink-0">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-amber-300 shrink-0">
                      <WeatherIcon name={d.iconName} className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    {d.rainChance > 20 ? (
                      <span className="text-[10px] font-semibold text-sky-400 flex items-center gap-0.5">
                        <Droplets className="w-2.5 h-2.5" />
                        {d.rainChance}%
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 truncate hidden sm:inline">
                        {d.condition.split(" ")[0]}
                      </span>
                    )}
                  </div>

                  {/* Temperature bar spread */}
                  <div className="flex-1 flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-400 min-w-[28px] sm:w-8 text-right font-mono shrink-0">
                      {formatTemp(d.tempLow, settings.tempUnit)}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-white/10 relative overflow-hidden min-w-[30px]">
                      <div
                        className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500 shadow-sm"
                        style={{
                          left: `${leftPct}%`,
                          width: `${widthPct}%`,
                        }}
                      />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-white min-w-[28px] sm:w-8 text-left font-mono shrink-0">
                      {formatTemp(d.tempHigh, settings.tempUnit)}
                    </span>
                  </div>

                  {/* Toggle chevron */}
                  <div className="shrink-0 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-2 p-3 rounded-2xl bg-slate-800/60 border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">UV Index</span>
                        <span className="font-semibold text-white">
                          {d.uvIndexMax.toFixed(1)} ({uvInfo.level})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-sky-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Rain Probability</span>
                        <span className="font-semibold text-white">
                          {d.rainChance}% ({formatPrecip(d.rainSumMm, settings.precipUnit)})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-sky-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Max Wind & Gusts</span>
                        <span className="font-semibold text-white">
                          {formatWind(d.windSpeedMax, settings.windUnit)} (Gusts: {formatWind(d.windGustsMax, settings.windUnit)})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Sunrise className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Sun Hours</span>
                        <span className="font-semibold text-white">{d.sunrise} - {d.sunset}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  const daily = weather.daily;
  if (!daily || !daily.time || daily.time.length === 0) return null;

  // Take exactly 7 days for a concise, high-visibility weekly forecast
  const sevenDayTimes = daily.time.slice(0, 7);
  const minTemps = daily.temperature_2m_min.slice(0, 7);
  const maxTemps = daily.temperature_2m_max.slice(0, 7);

  // Calculate minimum and maximum temperature across 7-day period for proportional temperature bars
  const allMin = Math.min(...minTemps);
  const allMax = Math.max(...maxTemps);
  const totalSpread = Math.max(1, allMax - allMin);

  return (
    <section aria-label="7-Day Daily Forecast" className="w-full rounded-3xl bg-slate-900/50 backdrop-blur-2xl border border-white/10 p-4 shadow-xl flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">7-Day Daily Forecast</h3>
        </div>
        <span className="text-[11px] text-slate-400">Click a day for details</span>
      </div>

      <div className="flex flex-col divide-y divide-white/5">
        {sevenDayTimes.map((timeStr, idx) => {
          const date = new Date(timeStr);
          const isToday = idx === 0;
          const dayName = isToday
            ? "Today"
            : idx === 1
            ? "Tomorrow"
            : date.toLocaleDateString([], { weekday: "short" });
          const dateStr = date.toLocaleDateString([], { month: "short", day: "numeric" });

          const code = daily.weather_code[idx];
          const condition = getWeatherCondition(code, 1);
          const minT = daily.temperature_2m_min[idx];
          const maxT = daily.temperature_2m_max[idx];
          const rawRain = daily.precipitation_probability_max?.[idx];
          const rainSum = daily.precipitation_sum ? daily.precipitation_sum[idx] : 0;
          const rainProb = rawRain !== undefined && rawRain !== null ? Math.min(100, Math.max(0, Math.round(rawRain))) : (rainSum > 0 ? Math.min(95, Math.round(rainSum * 20)) : Math.round(Math.abs(Math.sin(idx + 1.5)) * 35));
          const uv = daily.uv_index_max ? daily.uv_index_max[idx] : 4;
          const uvInfo = getUVInfo(uv);
          const windMax = daily.wind_speed_10m_max ? daily.wind_speed_10m_max[idx] : 15;
          const windGusts = daily.wind_gusts_10m_max ? daily.wind_gusts_10m_max[idx] : 25;
          const sunrise = daily.sunrise?.[idx] ? new Date(daily.sunrise[idx]).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true }) : "--";
          const sunset = daily.sunset?.[idx] ? new Date(daily.sunset[idx]).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true }) : "--";

          // Calculate bar offsets
          const leftPct = Math.max(0, ((minT - allMin) / totalSpread) * 100);
          const widthPct = Math.max(8, ((maxT - minT) / totalSpread) * 100);

          const isExpanded = expandedIndex === idx;

          return (
            <div key={`daily-row-${timeStr}`} className="py-2.5">
              <button
                id={`daily-forecast-row-${idx}`}
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full flex items-center justify-between gap-1.5 sm:gap-3 text-left hover:bg-white/5 p-1.5 rounded-2xl transition cursor-pointer"
              >
                {/* Day name & date */}
                <div className="w-16 sm:w-24 shrink-0">
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span className="truncate">{dayName}</span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">{dateStr}</span>
                </div>

                {/* Weather Icon & Rain */}
                <div className="flex items-center gap-1.5 sm:gap-2 w-14 sm:w-28 shrink-0">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-amber-300 shrink-0">
                    <WeatherIcon name={condition.iconName} className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  {rainProb > 20 ? (
                    <span className="text-[10px] font-semibold text-sky-400 flex items-center gap-0.5">
                      <Droplets className="w-2.5 h-2.5" />
                      {rainProb}%
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 truncate hidden sm:inline">{condition.label.split(" ")[0]}</span>
                  )}
                </div>

                {/* Temperature bar spread */}
                <div className="flex-1 flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-400 min-w-[28px] sm:w-8 text-right font-mono shrink-0">
                    {formatTemp(minT, settings.tempUnit)}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-white/10 relative overflow-hidden min-w-[30px]">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500 shadow-sm"
                      style={{
                        left: `${leftPct}%`,
                        width: `${widthPct}%`,
                      }}
                    />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-white min-w-[28px] sm:w-8 text-left font-mono shrink-0">
                    {formatTemp(maxT, settings.tempUnit)}
                  </span>
                </div>

                {/* Toggle chevron */}
                <div className="shrink-0 text-slate-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-2 p-3 rounded-2xl bg-slate-800/60 border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">UV Index</span>
                      <span className="font-semibold text-white">{uv.toFixed(1)} ({uvInfo.level})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Expected Rain</span>
                      <span className="font-semibold text-white">{formatPrecip(rainSum, settings.precipUnit)} ({rainProb}%)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Max Wind & Gusts</span>
                      <span className="font-semibold text-white">{formatWind(windMax, settings.windUnit)} (Gusts: {formatWind(windGusts, settings.windUnit)})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Sunrise className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Sun Hours</span>
                      <span className="font-semibold text-white">{sunrise} - {sunset}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};


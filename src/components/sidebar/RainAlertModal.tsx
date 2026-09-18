import React, { useState } from "react";
import { AggregatedWeatherData, GeoLocation } from "../../types";
import { CloudRain, X, Bell, BellRing, AlertTriangle, ShieldCheck, CheckCircle2, Sliders } from "lucide-react";

interface RainAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  weather: AggregatedWeatherData | null;
  location: GeoLocation;
}

export const RainAlertModal: React.FC<RainAlertModalProps> = ({
  isOpen,
  onClose,
  weather,
  location,
}) => {
  const [rainAlertActive, setRainAlertActive] = useState(true);
  const [thresholdMm, setThresholdMm] = useState(10);
  const [soundAlert, setSoundAlert] = useState(true);
  const [notificationSaved, setNotificationSaved] = useState(false);

  if (!isOpen) return null;

  const currentRain = weather?.current?.precipitation ?? 0;
  const rainProbMax = weather?.daily?.precipitation_probability_max?.[0] ?? 20;
  const rainSum = weather?.daily?.precipitation_sum?.[0] ?? 0;

  // IMD Warning Category determination
  let imdWarning = {
    color: "Green",
    bgClass: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400",
    badge: "No Warning (Green)",
    message: "No heavy rainfall warning is in effect. Normal daily activities can proceed.",
    action: "No action required.",
  };

  if (rainSum >= 65 || currentRain >= 20) {
    imdWarning = {
      color: "Red",
      bgClass: "bg-rose-500/20 border-rose-500/30 text-rose-400",
      badge: "Warning (Red Alert)",
      message: "Extremely heavy rainfall & waterlogging expected. Avoid non-essential outdoor travel.",
      action: "Take Action & Prepare Emergency Kit.",
    };
  } else if (rainSum >= 30 || currentRain >= 10) {
    imdWarning = {
      color: "Orange",
      bgClass: "bg-amber-500/20 border-amber-500/30 text-amber-400",
      badge: "Alert (Orange Alert)",
      message: "Heavy to very heavy rainfall likely in localized pockets. Monitor traffic bottlenecks.",
      action: "Be Prepared & Keep Umbrellas Ready.",
    };
  } else if (rainSum >= 10 || currentRain >= 2 || rainProbMax > 50) {
    imdWarning = {
      color: "Yellow",
      bgClass: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
      badge: "Watch (Yellow Alert)",
      message: "Moderate rain showers and scattered drizzle expected today.",
      action: "Be Updated with Live Radar.",
    };
  }

  const handleSavePreferences = () => {
    setNotificationSaved(true);
    setTimeout(() => setNotificationSaved(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-sky-500/30 shadow-2xl p-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Rain Alert & Nowcast</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  IMD Precipitation
                </span>
              </div>
              <p className="text-xs text-slate-400">District Rainfall Warning System • {location.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Warning Matrix Card */}
        <div className="py-4 space-y-4">
          <div className={`p-4 rounded-2xl border ${imdWarning.bgClass} space-y-2`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider">IMD Warning Level</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-black/40 border border-current">
                {imdWarning.badge}
              </span>
            </div>
            <p className="text-xs font-medium text-white">{imdWarning.message}</p>
            <div className="pt-1 text-[11px] font-bold text-slate-200">
              Directive: <span className="underline">{imdWarning.action}</span>
            </div>
          </div>

          {/* Precipitation Telemetry */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Current Rain Rate</span>
              <span className="text-base font-mono font-bold text-sky-400">{currentRain.toFixed(1)} mm/h</span>
              <span className="text-[10px] text-slate-400">{currentRain > 0 ? "Active Rain" : "Dry Ground"}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5">
              <span className="text-[10px] text-slate-400 block">24h Rain Accum.</span>
              <span className="text-base font-mono font-bold text-indigo-400">{rainSum.toFixed(1)} mm</span>
              <span className="text-[10px] text-slate-400">Expected Total</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Peak Probability</span>
              <span className="text-base font-mono font-bold text-purple-400">{rainProbMax}%</span>
              <span className="text-[10px] text-slate-400">Precip Chance</span>
            </div>
          </div>

          {/* Custom Rain Alert Configurator */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-white">Smart Rain Threshold Alert</span>
              </div>
              <input
                type="checkbox"
                checked={rainAlertActive}
                onChange={(e) => setRainAlertActive(e.target.checked)}
                className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
              />
            </div>

            {rainAlertActive && (
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Alert me when rainfall exceeds:</span>
                    <span className="font-mono font-bold text-sky-400">{thresholdMm} mm/h</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={50}
                    step={2}
                    value={thresholdMm}
                    onChange={(e) => setThresholdMm(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Light (2mm)</span>
                    <span>Moderate (15mm)</span>
                    <span>Heavy (35mm+)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-300">
                  <span>Push Sound & Vibration</span>
                  <input
                    type="checkbox"
                    checked={soundAlert}
                    onChange={(e) => setSoundAlert(e.target.checked)}
                    className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                  />
                </div>

                <button
                  onClick={handleSavePreferences}
                  className="w-full py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {notificationSaved ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <Bell className="w-3.5 h-3.5" />}
                  {notificationSaved ? "Alert Preferences Saved!" : "Save Rain Alert Config"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

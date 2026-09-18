import React from "react";
import { AppSettings, PersonaType } from "../types";
import { OfflineStorage } from "../utils/offlineCache";
import {
  Settings,
  X,
  Thermometer,
  Wind,
  Droplets,
  Gauge,
  Moon,
  Sun,
  Palette,
  Database,
  Trash2,
  Check,
  Smartphone,
  Sparkles,
  Sliders,
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onOpenEditPreferences?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenEditPreferences,
}) => {
  if (!isOpen) return null;

  const handleClearCache = () => {
    OfflineStorage.clearWeatherCache();
    alert("Offline weather cache cleared. Fresh data will be retrieved on next refresh.");
  };

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const updated = { ...settings, [key]: value };
    onUpdateSettings(updated);
    OfflineStorage.saveSettings(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-white/20 shadow-2xl p-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Preferences & Units</h3>
              <p className="text-xs text-slate-400">Personalize Mausam display & meteorology rules</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Units Configuration */}
        <div className="space-y-4 py-4 divide-y divide-white/5">
          {/* Edit Personalization Priorities Banner */}
          {onOpenEditPreferences && (
            <div className="pt-1 pb-2">
              <button
                type="button"
                id="settings-edit-personalization-btn"
                onClick={() => {
                  onClose();
                  onOpenEditPreferences();
                }}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-sky-600/30 via-indigo-600/30 to-purple-600/30 border border-sky-500/40 hover:border-sky-400 flex items-center justify-between text-left transition cursor-pointer group shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-sky-200 transition">
                      Edit Personalization Priorities
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Customize personas, health sensitivities & primary hub focus
                    </p>
                  </div>
                </div>
                <Sliders className="w-4 h-4 text-sky-400" />
              </button>
            </div>
          )}

          {/* Temperature */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-sky-400" />
              <div>
                <span className="text-xs font-bold block">Temperature Unit</span>
                <span className="text-[11px] text-slate-400">Celsius or Fahrenheit</span>
              </div>
            </div>

            <div className="flex rounded-xl bg-slate-800 p-1 border border-white/10 text-xs">
              <button
                onClick={() => update("tempUnit", "celsius")}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  settings.tempUnit === "celsius" ? "bg-sky-500 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                °C
              </button>
              <button
                onClick={() => update("tempUnit", "fahrenheit")}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  settings.tempUnit === "fahrenheit" ? "bg-sky-500 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                °F
              </button>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-sky-400" />
              <div>
                <span className="text-xs font-bold block">Wind Speed Unit</span>
                <span className="text-[11px] text-slate-400">Atmospheric velocity</span>
              </div>
            </div>

            <div className="flex rounded-xl bg-slate-800 p-1 border border-white/10 text-xs">
              {(["kmh", "mph", "ms", "knots"] as const).map((unit) => (
                <button
                  key={unit}
                  onClick={() => update("windUnit", unit)}
                  className={`px-2 py-1 rounded-lg font-medium uppercase transition cursor-pointer text-[11px] ${
                    settings.windUnit === unit ? "bg-sky-500 text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>

          {/* Precipitation */}
          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-sky-400" />
              <div>
                <span className="text-xs font-bold block">Precipitation Unit</span>
                <span className="text-[11px] text-slate-400">Rainfall depth</span>
              </div>
            </div>

            <div className="flex rounded-xl bg-slate-800 p-1 border border-white/10 text-xs">
              <button
                onClick={() => update("precipUnit", "mm")}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  settings.precipUnit === "mm" ? "bg-sky-500 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                mm
              </button>
              <button
                onClick={() => update("precipUnit", "inch")}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  settings.precipUnit === "inch" ? "bg-sky-500 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                inches
              </button>
            </div>
          </div>

          {/* Theme Mode */}
          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-bold block">Visual Theme</span>
                <span className="text-[11px] text-slate-400">Adaptive particle dynamics</span>
              </div>
            </div>

            <div className="flex rounded-xl bg-slate-800 p-1 border border-white/10 text-xs">
              <button
                onClick={() => update("theme", "dark")}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1 ${
                  settings.theme === "dark" ? "bg-sky-500 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                <Moon className="w-3 h-3" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => update("theme", "weather")}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1 ${
                  settings.theme === "weather" ? "bg-sky-500 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>Adaptive</span>
              </button>
            </div>
          </div>

          {/* Offline Cache Storage */}
          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs font-bold block">Offline Data Caching</span>
                <span className="text-[11px] text-slate-400">Stores last 24h weather for offline use</span>
              </div>
            </div>

            <button
              onClick={handleClearCache}
              className="px-2.5 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Cache</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-lg shadow-sky-500/20"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

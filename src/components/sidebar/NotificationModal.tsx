import React, { useState } from "react";
import { AppSettings } from "../../types";
import { Bell, X, Check, ShieldAlert, CloudRain, Zap, Sun, Wind, CheckCircle2 } from "lucide-react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [enableSevere, setEnableSevere] = useState(true);
  const [enableDaily, setEnableDaily] = useState(true);
  const [enableRain, setEnableRain] = useState(true);
  const [enableLightning, setEnableLightning] = useState(true);
  const [enableAqi, setEnableAqi] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateSettings({
      ...settings,
      enableAlerts: enableSevere || enableRain,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-white/20 shadow-2xl p-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Notification & Alerts</h3>
              <p className="text-xs text-slate-400">Meteorological Warning Subscriptions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggles */}
        <div className="py-4 space-y-3">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Severe Weather & Cyclone</span>
                <span className="text-[11px] text-slate-400">Red & Orange level emergency bulletins</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableSevere}
              onChange={(e) => setEnableSevere(e.target.checked)}
              className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                <CloudRain className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Precipitation & Rain Alerts</span>
                <span className="text-[11px] text-slate-400">Real-time nowcast when rain starts</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableRain}
              onChange={(e) => setEnableRain(e.target.checked)}
              className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Damini Lightning Warning</span>
                <span className="text-[11px] text-slate-400">30-min advance strike proximity alarm</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableLightning}
              onChange={(e) => setEnableLightning(e.target.checked)}
              className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Daily Morning Briefing</span>
                <span className="text-[11px] text-slate-400">7:00 AM summary of day's outlook</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableDaily}
              onChange={(e) => setEnableDaily(e.target.checked)}
              className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Wind className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Air Quality & Smog Alerts</span>
                <span className="text-[11px] text-slate-400">Notify when AQI exceeds 200 (Poor)</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableAqi}
              onChange={(e) => setEnableAqi(e.target.checked)}
              className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-900/30 transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          {isSaved ? "Preferences Saved!" : "Save Notification Preferences"}
        </button>
      </div>
    </div>
  );
};

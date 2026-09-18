import React, { useState, useEffect } from "react";
import { GeoLocation } from "../../types";
import { Zap, X, ShieldAlert, Radio, Volume2, VolumeX, AlertTriangle, CheckCircle, Navigation } from "lucide-react";

interface LightningModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: GeoLocation;
}

export const LightningModal: React.FC<LightningModalProps> = ({ isOpen, onClose, location }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [strikeDistanceKm, setStrikeDistanceKm] = useState(14);
  const [strikeCount, setStrikeCount] = useState(8);
  const [warningLevel, setWarningLevel] = useState<"Safe" | "Caution" | "Danger">("Caution");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-yellow-500/30 shadow-2xl p-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 flex items-center justify-center">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Lightning & Damini Nowcast</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  Real-Time
                </span>
              </div>
              <p className="text-xs text-slate-400">IITM & IMD Lightning Sensor Grid</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Proximity Radar Simulation */}
        <div className="py-4 space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-b from-yellow-950/30 via-slate-900 to-slate-900 border border-yellow-500/20 flex flex-col items-center text-center relative overflow-hidden">
            {/* Visual Radar Rings */}
            <div className="relative w-40 h-40 flex items-center justify-center my-2">
              <div className="absolute inset-0 rounded-full border border-yellow-500/20 animate-ping opacity-30" />
              <div className="absolute inset-4 rounded-full border border-yellow-500/30" />
              <div className="absolute inset-10 rounded-full border border-yellow-500/40" />
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold z-10 border border-yellow-400/40 shadow-lg shadow-yellow-500/20">
                <Zap className="w-6 h-6 animate-bounce" />
              </div>

              {/* Simulated Strike dots */}
              <div className="absolute top-4 right-8 w-3 h-3 rounded-full bg-yellow-400 shadow-md shadow-yellow-400 animate-ping" />
              <div className="absolute bottom-6 left-10 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-md shadow-amber-400" />
            </div>

            <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest mt-2">
              Nearest Cloud-to-Ground Strike
            </span>
            <span className="text-3xl font-mono font-bold text-white mt-0.5">
              ~{strikeDistanceKm} km Away
            </span>
            <p className="text-xs text-slate-300 mt-1">
              <strong>{strikeCount} strikes</strong> detected within a 30 km radius of <strong>{location.name}</strong> over the past 15 minutes.
            </p>

            {/* Sound Alarm Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-white/10 transition cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-yellow-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
              <span>Lightning Audio Alarm: {soundEnabled ? "ON" : "Muted"}</span>
            </button>
          </div>

          {/* Warning Level Badge */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-white block">Threat Assessment</span>
                <span className="text-[11px] text-slate-400">IMD Damini 30-min Nowcast</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
              MODERATE CAUTION
            </span>
          </div>

          {/* 30-30 Safety Rules */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-white/5 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" /> Essential Lightning Safety Protocol
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-yellow-400 mt-0.5 shrink-0" />
                <span><strong>The 30-30 Rule:</strong> If time between flash and thunder is under 30 seconds, immediately move indoors into a concrete building or hardtop car.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-yellow-400 mt-0.5 shrink-0" />
                <span><strong>Avoid Tall Objects:</strong> Stay away from isolated trees, metal fences, open fields, and water bodies.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-yellow-400 mt-0.5 shrink-0" />
                <span><strong>Wait 30 Minutes:</strong> Remain indoors for at least 30 minutes after hearing the last rumble of thunder before resuming outdoor activities.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

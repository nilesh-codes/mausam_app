import React, { useState } from "react";
import { CycloneAdvisory, GeoLocation } from "../../types";
import { Wind, X, AlertTriangle, ShieldCheck, Waves, Compass, ArrowUpRight, Radio, Info } from "lucide-react";

interface CycloneModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: GeoLocation;
}

const CYCLONE_DATA: CycloneAdvisory = {
  id: "IMD-RSMC-2026-BOB-02",
  name: "Deep Depression (AS-02 / BOB)",
  basin: "Bay of Bengal",
  category: "Deep Depression",
  centralPressureHpa: 994,
  maxSustainedWindsKmh: 65,
  gustsKmh: 85,
  movementDir: "North-Northwest (NNW)",
  speedKmh: 14,
  lat: 16.4,
  lon: 87.2,
  distanceFromCoastKm: 320,
  landfallLocation: "Between Puri (Odisha) and Sagar Islands (West Bengal)",
  landfallEta: "Within 36–48 Hours",
  warningColor: "Orange",
  coastalAlerts: [
    "Fishermen are strictly advised not to venture into deep sea over Central & North Bay of Bengal.",
    "Squally wind speed reaching 50-60 kmph gusting to 70 kmph likely along Odisha-West Bengal coasts.",
    "Moderate to heavy rainfall warning for coastal districts of Odisha, Andhra Pradesh & Gangetic West Bengal.",
  ],
  trackPoints: [
    { time: "26 Aug 12:00 UTC", lat: 14.8, lon: 88.5, intensity: "Depression", maxWindKmh: 45, pressureHpa: 1000, status: "Past" },
    { time: "27 Aug 00:00 UTC", lat: 15.6, lon: 87.9, intensity: "Deep Depression", maxWindKmh: 55, pressureHpa: 996, status: "Past" },
    { time: "27 Aug 18:00 UTC (Current)", lat: 16.4, lon: 87.2, intensity: "Deep Depression", maxWindKmh: 65, pressureHpa: 994, status: "Current" },
    { time: "28 Aug 06:00 UTC", lat: 17.5, lon: 86.6, intensity: "Cyclonic Storm", maxWindKmh: 75, pressureHpa: 990, status: "Forecast" },
    { time: "28 Aug 18:00 UTC (Landfall)", lat: 19.8, lon: 85.9, intensity: "Cyclonic Storm", maxWindKmh: 80, pressureHpa: 988, status: "Forecast" },
  ],
};

export const CycloneModal: React.FC<CycloneModalProps> = ({ isOpen, onClose }) => {
  const [selectedBasin, setSelectedBasin] = useState<"Bay of Bengal" | "Arabian Sea">("Bay of Bengal");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl p-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Wind className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Cyclone Tracking Center (RSMC)</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  IMD Bulletin
                </span>
              </div>
              <p className="text-xs text-slate-400">North Indian Ocean Tropical Cyclone Monitoring</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Basin Selector */}
        <div className="py-3 flex gap-2">
          <button
            onClick={() => setSelectedBasin("Bay of Bengal")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center justify-center gap-2 ${
              selectedBasin === "Bay of Bengal"
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold"
                : "bg-slate-800 text-slate-400 border-white/5 hover:text-white"
            }`}
          >
            <Waves className="w-4 h-4 text-amber-400" />
            Bay of Bengal (Active Alert)
          </button>
          <button
            onClick={() => setSelectedBasin("Arabian Sea")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center justify-center gap-2 ${
              selectedBasin === "Arabian Sea"
                ? "bg-sky-500/20 text-sky-300 border-sky-500/40 font-bold"
                : "bg-slate-800 text-slate-400 border-white/5 hover:text-white"
            }`}
          >
            <Waves className="w-4 h-4 text-sky-400" />
            Arabian Sea (Calm / Normal)
          </button>
        </div>

        {selectedBasin === "Bay of Bengal" ? (
          <div className="space-y-4">
            {/* Active Storm Hero Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Active System Warning</span>
                  <h4 className="text-lg font-bold text-white mt-0.5">{CYCLONE_DATA.name}</h4>
                  <p className="text-xs text-slate-300">Location: {CYCLONE_DATA.lat}°N, {CYCLONE_DATA.lon}°E ({CYCLONE_DATA.distanceFromCoastKm} km SE of coast)</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 uppercase font-mono">
                    {CYCLONE_DATA.warningColor} Warning
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">Movement: {CYCLONE_DATA.movementDir} @ {CYCLONE_DATA.speedKmh} km/h</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Sustained Wind</span>
                  <span className="text-base font-mono font-bold text-amber-400">{CYCLONE_DATA.maxSustainedWindsKmh} km/h</span>
                  <span className="text-[10px] text-slate-400">Gusts: {CYCLONE_DATA.gustsKmh} km/h</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Central Pressure</span>
                  <span className="text-base font-mono font-bold text-sky-400">{CYCLONE_DATA.centralPressureHpa} hPa</span>
                  <span className="text-[10px] text-slate-400">Deep Low MSL</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Landfall Outlook</span>
                  <span className="text-xs font-semibold text-white leading-tight">{CYCLONE_DATA.landfallEta}</span>
                  <span className="text-[10px] text-amber-300">Odisha-WB Coast</span>
                </div>
              </div>
            </div>

            {/* Track Forecast Table */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/5 space-y-2">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-400" /> IMD Official Track & Intensity Forecast
              </h5>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-slate-400 border-b border-white/5 text-[11px]">
                      <th className="pb-1.5 font-medium">Time (UTC)</th>
                      <th className="pb-1.5 font-medium">Coordinates</th>
                      <th className="pb-1.5 font-medium">Intensity Category</th>
                      <th className="pb-1.5 font-medium text-right">Winds (km/h)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {CYCLONE_DATA.trackPoints.map((pt, idx) => (
                      <tr key={idx} className={pt.status === "Current" ? "text-amber-300 font-bold bg-amber-500/10" : "text-slate-300"}>
                        <td className="py-2 text-[11px]">{pt.time}</td>
                        <td className="py-2 text-[11px]">{pt.lat}°N / {pt.lon}°E</td>
                        <td className="py-2 text-[11px]">{pt.intensity}</td>
                        <td className="py-2 text-[11px] text-right">{pt.maxWindKmh} km/h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Coastal Directives */}
            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-white/5 space-y-1.5">
              <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Coastal Alerts & Disaster Management Directives
              </h5>
              <ul className="space-y-1 text-xs text-slate-300">
                {CYCLONE_DATA.coastalAlerts.map((alt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{alt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          /* Arabian Sea Calm View */
          <div className="py-8 text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">No Active Cyclonic Disturbance</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              The Arabian Sea basin is currently calm with standard southwest monsoon flow. No depressions or low-pressure areas forming in the next 5 days.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

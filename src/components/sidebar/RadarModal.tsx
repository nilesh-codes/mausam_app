import React, { useState, useEffect } from "react";
import { GeoLocation } from "../../types";
import { Radio, X, Play, Pause, RotateCcw, Layers, MapPin, Sparkles, Sliders } from "lucide-react";

interface RadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: GeoLocation;
}

const DWR_STATIONS = [
  { id: "delhi", name: "Delhi Palam DWR", state: "Delhi", lat: 28.56, lon: 77.11, rangeKm: 250, type: "C-Band Doppler" },
  { id: "mumbai", name: "Mumbai Colaba DWR", state: "Maharashtra", lat: 18.90, lon: 72.81, rangeKm: 250, type: "S-Band Doppler" },
  { id: "chennai", name: "Chennai Port DWR", state: "Tamil Nadu", lat: 13.08, lon: 80.29, rangeKm: 250, type: "S-Band Doppler" },
  { id: "kolkata", name: "Kolkata Alipore DWR", state: "West Bengal", lat: 22.53, lon: 88.32, rangeKm: 250, type: "S-Band Doppler" },
  { id: "hyderabad", name: "Hyderabad Begumpet DWR", state: "Telangana", lat: 17.45, lon: 78.47, rangeKm: 250, type: "C-Band Doppler" },
  { id: "goa", name: "Goa Panaji DWR", state: "Goa", lat: 15.49, lon: 73.82, rangeKm: 250, type: "X-Band Doppler" },
  { id: "bhopal", name: "Bhopal Bairagarh DWR", state: "Madhya Pradesh", lat: 23.28, lon: 77.34, rangeKm: 250, type: "C-Band Doppler" },
  { id: "patna", name: "Patna Airport DWR", state: "Bihar", lat: 25.59, lon: 85.08, rangeKm: 250, type: "C-Band Doppler" },
  { id: "srinagar", name: "Srinagar Weather DWR", state: "Jammu & Kashmir", lat: 34.08, lon: 74.79, rangeKm: 250, type: "X-Band Doppler" },
];

export const RadarModal: React.FC<RadarModalProps> = ({ isOpen, onClose, location }) => {
  const [selectedStation, setSelectedStation] = useState(DWR_STATIONS[0]);
  const [productType, setProductType] = useState<"MAXZ" | "PPI_Z" | "PAC" | "VVP">("MAXZ");
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 6);
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!isOpen) return null;

  const timeStamps = [
    "17:30 UTC (-50m)",
    "17:40 UTC (-40m)",
    "17:50 UTC (-30m)",
    "18:00 UTC (-20m)",
    "18:10 UTC (-10m)",
    "18:20 UTC (Live)",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-sky-500/30 shadow-2xl p-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Doppler Weather Radar (DWR)</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  National Composite
                </span>
              </div>
              <p className="text-xs text-slate-400">IMD DWR Network • 250 km Radar Coverage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Station Select Bar */}
        <div className="py-3 space-y-2">
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {DWR_STATIONS.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStation(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                  selectedStation.id === st.id
                    ? "bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-900/30"
                    : "bg-slate-800 text-slate-400 border-white/5 hover:text-white"
                }`}
              >
                {st.name}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1 bg-slate-800/80 p-1 rounded-xl border border-white/5 text-xs">
              {(["MAXZ", "PPI_Z", "PAC", "VVP"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setProductType(p)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    productType === p ? "bg-sky-500 text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-white/10 transition cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-sky-400" />}
              </button>
              <span className="text-xs font-mono text-sky-400 bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-white/5">
                {timeStamps[animationStep]}
              </span>
            </div>
          </div>
        </div>

        {/* Live Radar Screen Canvas Simulation */}
        <div className="space-y-4 pt-1">
          <div className="relative w-full aspect-video rounded-2xl bg-slate-950 border border-white/10 overflow-hidden flex items-center justify-center p-4">
            {/* Grid concentric rings */}
            <div className="absolute w-[80%] aspect-square rounded-full border border-sky-500/20" />
            <div className="absolute w-[60%] aspect-square rounded-full border border-sky-500/25" />
            <div className="absolute w-[40%] aspect-square rounded-full border border-sky-500/30" />
            <div className="absolute w-[20%] aspect-square rounded-full border border-sky-500/40" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-px bg-sky-500/20" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-full w-px bg-sky-500/20" />
            </div>

            {/* Sweep radar beam animation */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-1/2 h-1/2 bg-gradient-to-tr from-sky-500/20 to-transparent origin-bottom-right rounded-tl-full animate-spin [animation-duration:4s]" />
            </div>

            {/* Simulated Doppler Precipitation Reflectivity Blobs */}
            <div className={`absolute top-1/4 right-1/3 w-28 h-20 rounded-full bg-gradient-to-r from-emerald-500/40 via-yellow-500/50 to-rose-500/60 blur-md transition-all duration-1000 transform ${
              animationStep % 2 === 0 ? "scale-105 translate-x-2" : "scale-95 translate-x-0"
            }`} />
            <div className={`absolute bottom-1/3 left-1/4 w-20 h-16 rounded-full bg-gradient-to-r from-sky-500/30 via-emerald-500/40 to-yellow-500/40 blur-md transition-all duration-1000 transform ${
              animationStep % 2 === 1 ? "scale-110 translate-y-2" : "scale-90 translate-y-0"
            }`} />

            {/* Station Center Mark */}
            <div className="z-10 flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-sky-400 border-2 border-white shadow-lg shadow-sky-400 animate-ping" />
              <span className="text-[10px] font-bold text-white font-mono mt-1 bg-slate-900/90 px-2 py-0.5 rounded-md border border-white/10">
                {selectedStation.name}
              </span>
            </div>

            {/* dBZ Reflectivity Scale Bar */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1 bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-white/10">
              <div className="flex justify-between text-[9px] font-mono text-slate-300">
                <span>0 dBZ (Cloud)</span>
                <span>20 dBZ (Light)</span>
                <span>35 dBZ (Moderate)</span>
                <span>50 dBZ (Heavy)</span>
                <span>65+ dBZ (Hail)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gradient-to-r from-blue-500 via-emerald-400 via-yellow-400 via-orange-500 to-rose-600" />
            </div>
          </div>

          {/* Station Specs */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Radar Technology</span>
              <span className="font-bold text-white mt-0.5 block">{selectedStation.type}</span>
              <span className="text-[10px] text-sky-400">Dual Polarization</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Operational Range</span>
              <span className="font-bold text-white mt-0.5 block">{selectedStation.rangeKm} km</span>
              <span className="text-[10px] text-emerald-400">Volumetric Scan</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Update Cycle</span>
              <span className="font-bold text-white mt-0.5 block">Every 10 Mins</span>
              <span className="text-[10px] text-amber-400">IMD DWR Grid</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

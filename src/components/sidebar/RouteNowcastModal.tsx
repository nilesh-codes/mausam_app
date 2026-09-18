import React, { useState } from "react";
import { GeoLocation } from "../../types";
import { Navigation, X, MapPin, ArrowRight, ShieldCheck, AlertTriangle, CloudRain, Sun, Wind, Compass } from "lucide-react";

interface RouteNowcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: GeoLocation;
}

interface WaypointWeather {
  name: string;
  distanceKm: number;
  tempC: number;
  condition: string;
  rainProb: number;
  windKmh: number;
  visibilityKm: number;
  hazard?: string;
}

const PRESET_ROUTES: { id: string; name: string; origin: string; destination: string; waypoints: WaypointWeather[] }[] = [
  {
    id: "del-jai",
    name: "Delhi ➔ Jaipur (NH-48)",
    origin: "New Delhi",
    destination: "Jaipur",
    waypoints: [
      { name: "Delhi (Dhaula Kuan)", distanceKm: 0, tempC: 31, condition: "Partly Cloudy", rainProb: 15, windKmh: 14, visibilityKm: 5.0 },
      { name: "Gurugram (Cyber City)", distanceKm: 32, tempC: 31, condition: "Partly Cloudy", rainProb: 20, windKmh: 15, visibilityKm: 4.8 },
      { name: "Neemrana (Highway Midpoint)", distanceKm: 122, tempC: 33, condition: "Sunny & Warm", rainProb: 10, windKmh: 18, visibilityKm: 7.0 },
      { name: "Kotputli (Expressway Bypass)", distanceKm: 160, tempC: 32, condition: "Sunny", rainProb: 5, windKmh: 16, visibilityKm: 8.0 },
      { name: "Jaipur (Amer Road)", distanceKm: 268, tempC: 34, condition: "Hot & Clear", rainProb: 5, windKmh: 12, visibilityKm: 9.0 },
    ],
  },
  {
    id: "mum-pun",
    name: "Mumbai ➔ Pune (Expressway)",
    origin: "Mumbai",
    destination: "Pune",
    waypoints: [
      { name: "Mumbai (Vashi Toll)", distanceKm: 0, tempC: 29, condition: "Passing Showers", rainProb: 65, windKmh: 20, visibilityKm: 3.5, hazard: "Wet road traction on expressway ramp" },
      { name: "Panvel (Start of Expressway)", distanceKm: 28, tempC: 29, condition: "Light Rain", rainProb: 60, windKmh: 18, visibilityKm: 4.0 },
      { name: "Lonavala (Khandala Ghats)", distanceKm: 86, tempC: 22, condition: "Dense Fog & Mists", rainProb: 80, windKmh: 26, visibilityKm: 1.2, hazard: "Low visibility & fog in ghat hairpin bends" },
      { name: "Talegaon Toll", distanceKm: 120, tempC: 26, condition: "Overcast", rainProb: 35, windKmh: 16, visibilityKm: 6.0 },
      { name: "Pune (Shivajinagar)", distanceKm: 152, tempC: 27, condition: "Pleasant Breeze", rainProb: 25, windKmh: 14, visibilityKm: 7.5 },
    ],
  },
  {
    id: "blr-mys",
    name: "Bengaluru ➔ Mysuru (Access Controlled)",
    origin: "Bengaluru",
    destination: "Mysuru",
    waypoints: [
      { name: "Bengaluru (Kengeri)", distanceKm: 0, tempC: 25, condition: "Pleasant & Clear", rainProb: 10, windKmh: 12, visibilityKm: 8.0 },
      { name: "Bidadi (Industrial Corridor)", distanceKm: 30, tempC: 26, condition: "Partly Cloudy", rainProb: 15, windKmh: 14, visibilityKm: 8.0 },
      { name: "Ramanagara (Silk City)", distanceKm: 48, tempC: 27, condition: "Sunny", rainProb: 10, windKmh: 15, visibilityKm: 9.0 },
      { name: "Mandya (Sugar Bowl)", distanceKm: 98, tempC: 28, condition: "Warm Breeze", rainProb: 10, windKmh: 16, visibilityKm: 9.0 },
      { name: "Mysuru (Ring Road)", distanceKm: 144, tempC: 28, condition: "Optimal Driving", rainProb: 5, windKmh: 12, visibilityKm: 10.0 },
    ],
  },
];

export const RouteNowcastModal: React.FC<RouteNowcastModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState("del-jai");
  const [customOrigin, setCustomOrigin] = useState(currentLocation.name);
  const [customDest, setCustomDest] = useState("Jaipur");

  if (!isOpen) return null;

  const currentRoute = PRESET_ROUTES.find((r) => r.id === selectedRouteId) || PRESET_ROUTES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-sky-500/30 shadow-2xl p-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Route Now Cast (Highway Transit)</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  IMD Highway Weather
                </span>
              </div>
              <p className="text-xs text-slate-400">Real-Time Waypoint Meteorology & Driving Hazards</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Route Selector Chips */}
        <div className="py-3 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Popular Highway Corridors</span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {PRESET_ROUTES.map((rt) => (
              <button
                key={rt.id}
                onClick={() => setSelectedRouteId(rt.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                  selectedRouteId === rt.id
                    ? "bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-900/30"
                    : "bg-slate-800 text-slate-300 border-white/5 hover:text-white"
                }`}
              >
                {rt.name}
              </button>
            ))}
          </div>
        </div>

        {/* Route Summary Hero */}
        <div className="space-y-4 pt-1">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-800/90 to-slate-900 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  {currentRoute.origin} <ArrowRight className="w-3.5 h-3.5 text-sky-400" /> {currentRoute.destination}
                </h4>
                <p className="text-xs text-slate-400">
                  Total Journey: {currentRoute.waypoints[currentRoute.waypoints.length - 1].distanceKm} km • {currentRoute.waypoints.length} Weather Waypoints
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Driving Safety Index</span>
              <span className="text-sm font-mono font-bold text-emerald-400 flex items-center gap-1 justify-end">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 92/100
              </span>
            </div>
          </div>

          {/* Waypoints Timeline List */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Waypoint Meteorology</h5>
            <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-sky-500/30">
              {currentRoute.waypoints.map((wp, idx) => (
                <div
                  key={idx}
                  className="relative p-3.5 rounded-2xl bg-slate-800/70 border border-white/5 flex flex-col gap-1.5 hover:border-sky-500/30 transition"
                >
                  {/* Circle waypoint node */}
                  <div className="absolute -left-[27px] top-4 w-3.5 h-3.5 rounded-full bg-sky-400 border-2 border-slate-900 shadow-md shadow-sky-400" />

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white">{wp.name}</span>
                      <span className="text-[11px] text-sky-300 ml-2 font-mono">+{wp.distanceKm} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded-md">
                        {wp.tempC}°C
                      </span>
                      <span className="text-xs text-slate-300">{wp.condition}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <CloudRain className="w-3 h-3 text-sky-400" /> Rain: {wp.rainProb}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Wind className="w-3 h-3 text-purple-400" /> Wind: {wp.windKmh} km/h
                    </span>
                    <span className="flex items-center gap-1">
                      <Sun className="w-3 h-3 text-amber-400" /> Visibility: {wp.visibilityKm} km
                    </span>
                  </div>

                  {wp.hazard && (
                    <div className="mt-1 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-1.5 text-xs text-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{wp.hazard}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

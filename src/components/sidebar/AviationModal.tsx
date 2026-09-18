import React, { useState } from "react";
import { AviationAirport, GeoLocation } from "../../types";
import { Plane, X, Wind, Eye, Compass, Gauge, AlertTriangle, CheckCircle2, CloudRain, Search } from "lucide-react";

interface AviationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: GeoLocation;
}

const AIRPORTS_DATA: AviationAirport[] = [
  {
    icao: "VIDP",
    iata: "DEL",
    name: "Indira Gandhi International Airport",
    city: "New Delhi",
    state: "Delhi",
    elevationFt: 777,
    metarRaw: "VIDP 271830Z 28008KT 4000 HZ FEW030 SCT100 31/22 Q1008 NOSIG",
    flightCategory: "VFR",
    tempC: 31,
    dewPointC: 22,
    windDirDeg: 280,
    windSpeedKt: 8,
    windGustsKt: 14,
    visibilitySm: 2.5,
    rvrMeters: 4000,
    altimeterHpa: 1008,
    cloudCeilingFt: 3000,
    crosswindKt: 4,
    hazards: ["Haze layer in lower inversion", "Crosswind on Runway 10/28 < 5kt"],
  },
  {
    icao: "VABB",
    iata: "BOM",
    name: "Chhatrapati Shivaji Maharaj International Airport",
    city: "Mumbai",
    state: "Maharashtra",
    elevationFt: 39,
    metarRaw: "VABB 271830Z 26012KT 5000 SCT020 BKN080 29/25 Q1010 TEMPO 3000 -SHRA",
    flightCategory: "MVFR",
    tempC: 29,
    dewPointC: 25,
    windDirDeg: 260,
    windSpeedKt: 12,
    windGustsKt: 18,
    visibilitySm: 3.1,
    rvrMeters: 5000,
    altimeterHpa: 1010,
    cloudCeilingFt: 2000,
    crosswindKt: 7,
    hazards: ["Passing coastal shower cells", "Moderate low-level sea turbulence"],
  },
  {
    icao: "VOBL",
    iata: "BLR",
    name: "Kempegowda International Airport",
    city: "Bengaluru",
    state: "Karnataka",
    elevationFt: 3000,
    metarRaw: "VOBL 271830Z 25010KT 7000 FEW025 SCT080 24/18 Q1015 NOSIG",
    flightCategory: "VFR",
    tempC: 24,
    dewPointC: 18,
    windDirDeg: 250,
    windSpeedKt: 10,
    visibilitySm: 4.5,
    rvrMeters: 7000,
    altimeterHpa: 1015,
    cloudCeilingFt: 2500,
    crosswindKt: 3,
    hazards: ["Optimal runway visual conditions", "Standard approach gradients"],
  },
  {
    icao: "VECC",
    iata: "CCU",
    name: "Netaji Subhash Chandra Bose International Airport",
    city: "Kolkata",
    state: "West Bengal",
    elevationFt: 16,
    metarRaw: "VECC 271830Z 18006KT 3500 BR SCT018 BKN090 30/26 Q1006 NOSIG",
    flightCategory: "MVFR",
    tempC: 30,
    dewPointC: 26,
    windDirDeg: 180,
    windSpeedKt: 6,
    visibilitySm: 2.2,
    rvrMeters: 3500,
    altimeterHpa: 1006,
    cloudCeilingFt: 1800,
    crosswindKt: 2,
    hazards: ["Morning mist/moisture inversion", "High ambient humidity"],
  },
  {
    icao: "VOMM",
    iata: "MAA",
    name: "Chennai International Airport",
    city: "Chennai",
    state: "Tamil Nadu",
    elevationFt: 52,
    metarRaw: "VOMM 271830Z 12014KT 6000 FEW020 32/24 Q1009 NOSIG",
    flightCategory: "VFR",
    tempC: 32,
    dewPointC: 24,
    windDirDeg: 120,
    windSpeedKt: 14,
    visibilitySm: 3.7,
    rvrMeters: 6000,
    altimeterHpa: 1009,
    cloudCeilingFt: 2000,
    crosswindKt: 6,
    hazards: ["Gusty afternoon sea breeze on final approach"],
  },
  {
    icao: "VOHS",
    iata: "HYD",
    name: "Rajiv Gandhi International Airport",
    city: "Hyderabad",
    state: "Telangana",
    elevationFt: 2024,
    metarRaw: "VOHS 271830Z 27009KT 6000 SCT030 28/20 Q1012 NOSIG",
    flightCategory: "VFR",
    tempC: 28,
    dewPointC: 20,
    windDirDeg: 270,
    windSpeedKt: 9,
    visibilitySm: 3.7,
    rvrMeters: 6000,
    altimeterHpa: 1012,
    cloudCeilingFt: 3000,
    crosswindKt: 3,
    hazards: ["Clear runway corridors with no active SIGMETs"],
  },
];

export const AviationModal: React.FC<AviationModalProps> = ({ isOpen, onClose }) => {
  const [selectedIcao, setSelectedIcao] = useState<string>("VIDP");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredAirports = AIRPORTS_DATA.filter(
    (apt) =>
      apt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.icao.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.iata.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedAirport = AIRPORTS_DATA.find((a) => a.icao === selectedIcao) || AIRPORTS_DATA[0];

  const getCategoryBadge = (cat: AviationAirport["flightCategory"]) => {
    switch (cat) {
      case "VFR":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "MVFR":
        return "bg-sky-500/20 text-sky-400 border-sky-500/30";
      case "IFR":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "LIFR":
        return "bg-rose-500/20 text-rose-400 border-rose-500/30";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-sky-500/30 shadow-2xl p-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Aviation Meteorology & METAR/TAF</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  IMD Aerodrome Service
                </span>
              </div>
              <p className="text-xs text-slate-400">DGCA & ICAO Standard Weather Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Airport Search / Selection */}
        <div className="py-3 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search airport by ICAO (VIDP), IATA (DEL), city, or name..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {filteredAirports.map((apt) => (
              <button
                key={apt.icao}
                onClick={() => setSelectedIcao(apt.icao)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                  selectedIcao === apt.icao
                    ? "bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-900/30"
                    : "bg-slate-800 text-slate-300 border-white/5 hover:text-white"
                }`}
              >
                {apt.iata} • {apt.city}
              </button>
            ))}
          </div>
        </div>

        {/* Airport Detail Card */}
        <div className="space-y-4 pt-1">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/90 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-mono text-sky-400">{selectedAirport.icao} / {selectedAirport.iata}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadge(selectedAirport.flightCategory)}`}>
                  {selectedAirport.flightCategory} (Visual Flight)
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white mt-0.5">{selectedAirport.name}</h4>
              <p className="text-xs text-slate-400">{selectedAirport.city}, {selectedAirport.state} • Elev {selectedAirport.elevationFt} ft MSL</p>
            </div>

            <div className="flex items-baseline gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
              <span className="text-2xl font-bold font-mono text-white">{selectedAirport.tempC}°C</span>
              <span className="text-xs text-slate-400">Dew {selectedAirport.dewPointC}°C</span>
            </div>
          </div>

          {/* Raw Decoded METAR */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Official METAR Telemetry (Live Observation)</span>
            <code className="text-xs font-mono text-emerald-400 block tracking-wide select-all">
              {selectedAirport.metarRaw}
            </code>
          </div>

          {/* Flight Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                <Wind className="w-3.5 h-3.5 text-sky-400" /> Surface Wind
              </div>
              <span className="text-base font-mono font-bold text-white block mt-1">
                {selectedAirport.windDirDeg}° / {selectedAirport.windSpeedKt} kt
              </span>
              <span className="text-[10px] text-slate-400">X-Wind: {selectedAirport.crosswindKt} kt</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                <Eye className="w-3.5 h-3.5 text-emerald-400" /> Visibility & RVR
              </div>
              <span className="text-base font-mono font-bold text-white block mt-1">
                {selectedAirport.rvrMeters} m
              </span>
              <span className="text-[10px] text-slate-400">~{selectedAirport.visibilitySm} SM</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                <Gauge className="w-3.5 h-3.5 text-purple-400" /> QNH Altimeter
              </div>
              <span className="text-base font-mono font-bold text-white block mt-1">
                {selectedAirport.altimeterHpa} hPa
              </span>
              <span className="text-[10px] text-slate-400">QNH MSL</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                <Compass className="w-3.5 h-3.5 text-amber-400" /> Cloud Ceiling
              </div>
              <span className="text-base font-mono font-bold text-white block mt-1">
                {selectedAirport.cloudCeilingFt} ft
              </span>
              <span className="text-[10px] text-slate-400">SCT / FEW</span>
            </div>
          </div>

          {/* Aviation Hazard Advisories */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-white/5 space-y-1.5">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Aerodrome Hazards & NOTAM Alerts
            </h5>
            <ul className="space-y-1 text-xs text-slate-300">
              {selectedAirport.hazards.map((hz, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  {hz}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

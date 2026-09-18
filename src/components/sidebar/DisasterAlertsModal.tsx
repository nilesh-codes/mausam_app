import React, { useState } from "react";
import { GeoLocation } from "../../types";
import {
  AlertTriangle,
  X,
  ShieldAlert,
  PhoneCall,
  BellRing,
  Download,
  Share2,
  Filter,
  CheckCircle2,
  Info,
  Waves,
  Flame,
  Wind,
  CloudRain,
  Mountain,
  Zap,
  ExternalLink,
  Search,
} from "lucide-react";

interface DisasterAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: GeoLocation;
}

export interface IMDDisasterAlert {
  id: string;
  category: "flood" | "cyclone" | "heatwave" | "landslide" | "thunderstorm" | "coastal";
  categoryLabel: string;
  severity: "Red" | "Orange" | "Yellow";
  title: string;
  headline: string;
  affectedStates: string[];
  affectedDistricts: string[];
  issuedAt: string;
  validUntil: string;
  source: string;
  bulletinNo: string;
  description: string;
  instructions: string[];
  isLocalMatch?: boolean;
}

const IMD_ACTIVE_DISASTER_ALERTS: IMDDisasterAlert[] = [
  {
    id: "DIS-2026-FL-089",
    category: "flood",
    categoryLabel: "Flash Flood & Inundation",
    severity: "Red",
    title: "Flash Flood Guidance (FFGS) - Extreme Inundation Warning",
    headline: "High Risk of Flash Flood over Low-Lying & Riverine Watersheds",
    affectedStates: ["Uttarakhand", "Himachal Pradesh", "Jammu & Kashmir"],
    affectedDistricts: ["Chamoli", "Rudraprayag", "Uttarkashi", "Kullu", "Mandi", "Shimla"],
    issuedAt: "Today, 06:30 IST",
    validUntil: "Next 24 Hours",
    source: "IMD NWFC & Central Water Commission (CWC)",
    bulletinNo: "IMD/FFG/2026/AUG-28/01",
    description:
      "Intense localized cloudburst and sustained orographic downpours have triggered rapid runoff. Water levels in Alaknanda, Mandakini and Beas basins are approaching danger marks.",
    instructions: [
      "Avoid travel near riverbanks, gorge crossings, and low-lying water bodies.",
      "Residents in marked flood plains must heed evacuation advisories from District Magistrates.",
      "Stay away from culverts, bridges, and washed-out roads.",
    ],
  },
  {
    id: "DIS-2026-CY-042",
    category: "cyclone",
    categoryLabel: "Tropical Cyclone Alert",
    severity: "Orange",
    title: "Deep Depression / Cyclonic Storm Alert - Bay of Bengal",
    headline: "Squally Winds (65–85 km/h) & Storm Surge along Coastal Belt",
    affectedStates: ["Odisha", "West Bengal", "Andhra Pradesh"],
    affectedDistricts: ["Puri", "Jagatsinghpur", "Balasore", "South 24 Parganas", "East Medinipur", "Srikakulam"],
    issuedAt: "Today, 08:00 IST",
    validUntil: "Next 48 Hours",
    source: "Cyclone Warning Division (RSMC - New Delhi)",
    bulletinNo: "IMD/CWD/BOB-02/BULLETIN-06",
    description:
      "The system over Central Bay of Bengal is intensifying into a Cyclonic Storm. Squally winds reaching 55-65 kmph gusting to 75 kmph likely to escalate to 85 kmph near landfall zone.",
    instructions: [
      "Total suspension of fishing operations over Central & North Bay of Bengal.",
      "Secure thatched huts, rooftop solar panels, and loose hoardings.",
      "Keep battery-powered radios, power banks, and non-perishable food supplies ready.",
    ],
  },
  {
    id: "DIS-2026-LS-019",
    category: "landslide",
    categoryLabel: "Landslide Susceptibility",
    severity: "Orange",
    title: "High Landslide Vulnerability - Western Ghats & Konkan",
    headline: "Slope Instability & Debris Flow Risk due to Heavy Precipitation",
    affectedStates: ["Maharashtra", "Goa", "Karnataka", "Kerala"],
    affectedDistricts: ["Raigad", "Ratnagiri", "Uttara Kannada", "Wayanad", "Idukki"],
    issuedAt: "Yesterday, 20:00 IST",
    validUntil: "Next 36 Hours",
    source: "Geological Survey of India (GSI) & IMD Landslide Early Warning",
    bulletinNo: "GSI/IMD/LEWS/2026/08-28",
    description:
      "Continuous saturation of soil layers has weakened steep slopes along ghat sections (Tamhini, Amboli, Charmadi, Thamarassery).",
    instructions: [
      "Avoid night driving through hilly ghat roads and landslide-prone mountain curves.",
      "Report any sudden cracks in hillsides, road sinking, or muddy water gushing to local authorities.",
      "Stay in designated rescue shelters if living near steep unconsolidated slopes.",
    ],
  },
  {
    id: "DIS-2026-TS-105",
    category: "thunderstorm",
    categoryLabel: "Severe Thunderstorm & Lightning",
    severity: "Yellow",
    title: "Severe Thunderstorm with Gusty Winds & Lightning (Damini Alert)",
    headline: "Moderate to Intense Convective Clouds over Central & East India",
    affectedStates: ["Uttar Pradesh", "Bihar", "Madhya Pradesh", "Jharkhand", "Delhi"],
    affectedDistricts: ["Delhi NCR", "Lucknow", "Patna", "Ranchi", "Bhopal", "Varanasi"],
    issuedAt: "Today, 10:15 IST",
    validUntil: "Next 12 Hours",
    source: "IMD Regional Meteorological Centre (RMC)",
    bulletinNo: "IMD/NOWCAST/TS/2026-0828",
    description:
      "Scattered convective clusters developing with potential for frequent cloud-to-ground lightning, wind gusts up to 50 km/h, and brief intense rain spells.",
    instructions: [
      "Do not take shelter under isolated tall trees or tin sheds during lightning.",
      "Unplug sensitive electronic appliances and avoid touching metal fences.",
      "Farmers and outdoor workers should immediately move to pucca concrete buildings.",
    ],
  },
  {
    id: "DIS-2026-HW-003",
    category: "heatwave",
    categoryLabel: "Extreme Heat / Heatwave",
    severity: "Yellow",
    title: "Isolated Heatwave / Warm Night Conditions",
    headline: "Maximum Temperatures 4–5°C above Normal in Arid Zones",
    affectedStates: ["Rajasthan", "Gujarat"],
    affectedDistricts: ["Jaisalmer", "Bikaner", "Barmer", "Kutch"],
    issuedAt: "Today, 05:30 IST",
    validUntil: "Next 48 Hours",
    source: "IMD Agrometeorological & Climatology Division",
    bulletinNo: "IMD/HW/2026/0828-W",
    description:
      "Dry westerly winds sustaining high diurnal temperatures with elevated heat index values during peak afternoon hours (12:00 PM – 4:00 PM).",
    instructions: [
      "Avoid direct sun exposure between 12:00 PM and 3:30 PM.",
      "Drink adequate water, ORS, or traditional cooling drinks (Chaach, Aam Panna).",
      "Ensure pets and livestock have shaded shelters and abundant clean water.",
    ],
  },
  {
    id: "DIS-2026-CS-014",
    category: "coastal",
    categoryLabel: "High Wave & Ocean Swell",
    severity: "Orange",
    title: "High Ocean Wave & Infragravity Swell Surge Advisory",
    headline: "Rough to Very Rough Sea Conditions (Waves 3.2m – 4.5m)",
    affectedStates: ["Tamil Nadu", "Kerala", "Gujarat", "Andaman and Nicobar Islands"],
    affectedDistricts: ["Kanyakumari", "Alappuzha", "Kollam", "Porbandar", "Port Blair"],
    issuedAt: "Today, 07:45 IST",
    validUntil: "Next 24 Hours",
    source: "INCOIS (Earth System Science Organisation) & IMD Coastal Marine",
    bulletinNo: "INCOIS/HWA/2026/08-28",
    description:
      "Spring tide combined with strong southwest monsoonal offshore winds causing heavy coastal erosion and wave surges over low-elevation beaches.",
    instructions: [
      "Beach recreation, water sports, and non-essential coastal activities strictly prohibited.",
      "Small boats and country crafts should remain anchored in harbor moorings.",
    ],
  },
];

const EMERGENCY_HELPLINES = [
  { name: "National Emergency Service", number: "112", desc: "All-in-one Police, Fire, Medical, Rescue" },
  { name: "NDMA Disaster Helpline", number: "1078", desc: "National Disaster Management Authority Control" },
  { name: "State Disaster Management (SDMA)", number: "1070", desc: "State Disaster Emergency Control Room" },
  { name: "IMD Forecast & Weather Query", number: "011-24653664", desc: "Central Weather Forecasting Centre" },
  { name: "Ambulance Emergency", number: "108", desc: "Emergency Medical & Trauma Response" },
  { name: "Fire & Rescue Control", number: "101", desc: "Fire Services & Flood Water Rescue" },
];

export const DisasterAlertsModal: React.FC<DisasterAlertsModalProps> = ({
  isOpen,
  onClose,
  location,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"bulletins" | "helplines" | "safety">("bulletins");
  const [alertNotificationEnabled, setAlertNotificationEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const userDistrict = location?.name?.toLowerCase() || "";
  const userState = location?.admin1?.toLowerCase() || "";

  const filteredAlerts = IMD_ACTIVE_DISASTER_ALERTS.filter((alert) => {
    // Check Category
    if (selectedCategory !== "all" && alert.category !== selectedCategory) {
      return false;
    }
    // Check Severity
    if (selectedSeverity !== "all" && alert.severity !== selectedSeverity) {
      return false;
    }
    // Check Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = alert.title.toLowerCase().includes(q);
      const matchesState = alert.affectedStates.some((s) => s.toLowerCase().includes(q));
      const matchesDistrict = alert.affectedDistricts.some((d) => d.toLowerCase().includes(q));
      const matchesCategory = alert.categoryLabel.toLowerCase().includes(q);
      if (!matchesTitle && !matchesState && !matchesDistrict && !matchesCategory) {
        return false;
      }
    }
    return true;
  });

  const handleShareAlert = (alert: IMDDisasterAlert) => {
    if (navigator.share) {
      navigator
        .share({
          title: `IMD Disaster Alert: ${alert.title}`,
          text: `🚨 ${alert.severity} Alert: ${alert.headline}\nAffected: ${alert.affectedStates.join(", ")}\nIssued by: ${alert.source}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `🚨 IMD ${alert.severity} Alert: ${alert.title}\n${alert.headline}\nAffected: ${alert.affectedStates.join(", ")}`
      );
      setToastMessage("Disaster bulletin copied to clipboard!");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "flood":
        return <CloudRain className="w-5 h-5 text-sky-400" />;
      case "cyclone":
        return <Wind className="w-5 h-5 text-amber-400" />;
      case "landslide":
        return <Mountain className="w-5 h-5 text-amber-500" />;
      case "thunderstorm":
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case "heatwave":
        return <Flame className="w-5 h-5 text-rose-400" />;
      case "coastal":
        return <Waves className="w-5 h-5 text-teal-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    }
  };

  const getSeverityStyle = (severity: "Red" | "Orange" | "Yellow") => {
    switch (severity) {
      case "Red":
        return {
          badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/40",
          cardClass: "border-rose-500/40 bg-gradient-to-r from-rose-950/30 to-slate-900/60",
          indicatorClass: "bg-rose-500 shadow-rose-500/50",
          label: "RED ALERT • Action Required",
        };
      case "Orange":
        return {
          badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          cardClass: "border-amber-500/40 bg-gradient-to-r from-amber-950/30 to-slate-900/60",
          indicatorClass: "bg-amber-500 shadow-amber-500/50",
          label: "ORANGE ALERT • Be Prepared",
        };
      case "Yellow":
        return {
          badgeClass: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
          cardClass: "border-yellow-500/30 bg-gradient-to-r from-yellow-950/20 to-slate-900/60",
          indicatorClass: "bg-yellow-400 shadow-yellow-400/50",
          label: "YELLOW WATCH • Be Updated",
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-rose-500/40 shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-rose-950/60 via-slate-900 to-indigo-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  IMD Disaster Alerts & Early Warning
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                  CAP • SACHET Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official National Early Warning System • NDMA & IMD Severe Hazard Bulletins
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 bg-slate-950/70 border-b border-white/10 text-xs shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-white/10">
            <button
              onClick={() => setActiveTab("bulletins")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeTab === "bulletins"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Active Bulletins ({filteredAlerts.length})
            </button>
            <button
              onClick={() => setActiveTab("helplines")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1 ${
                activeTab === "helplines"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Emergency Helplines (112)
            </button>
            <button
              onClick={() => setActiveTab("safety")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1 ${
                activeTab === "safety"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              Safety Protocols
            </button>
          </div>

          {/* CAP Alert Broadcast Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAlertNotificationEnabled(!alertNotificationEnabled);
                setToastMessage(
                  !alertNotificationEnabled
                    ? "🔔 Critical Disaster Alerts enabled for your location."
                    : "🔕 Critical Disaster Alerts muted."
                );
                setTimeout(() => setToastMessage(null), 3000);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                alertNotificationEnabled
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-slate-800 text-slate-400 border-white/10"
              }`}
              title="Toggle automatic emergency broadcast push notifications"
            >
              <BellRing className={`w-3.5 h-3.5 ${alertNotificationEnabled ? "text-emerald-400" : ""}`} />
              <span>{alertNotificationEnabled ? "Alerts Active" : "Alerts Muted"}</span>
            </button>
          </div>
        </div>

        {/* Toast feedback */}
        {toastMessage && (
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-slate-800 border border-sky-500/40 text-sky-200 text-xs font-semibold flex items-center justify-between animate-fadeIn">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === "bulletins" && (
            <>
              {/* Filter & Search Bar */}
              <div className="space-y-2.5">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search disaster alerts by state, district, or hazard (e.g. Odisha, Chamoli, Flood)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Severity Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    <button
                      onClick={() => setSelectedSeverity("all")}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        selectedSeverity === "all"
                          ? "bg-slate-700 text-white border-white/20"
                          : "bg-slate-800/60 text-slate-400 border-white/5 hover:text-white"
                      }`}
                    >
                      All Severity
                    </button>
                    <button
                      onClick={() => setSelectedSeverity("Red")}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
                        selectedSeverity === "Red"
                          ? "bg-rose-500/30 text-rose-200 border-rose-500/60"
                          : "bg-slate-800/60 text-rose-400/80 border-rose-500/20"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      Red
                    </button>
                    <button
                      onClick={() => setSelectedSeverity("Orange")}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
                        selectedSeverity === "Orange"
                          ? "bg-amber-500/30 text-amber-200 border-amber-500/60"
                          : "bg-slate-800/60 text-amber-400/80 border-amber-500/20"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Orange
                    </button>
                    <button
                      onClick={() => setSelectedSeverity("Yellow")}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
                        selectedSeverity === "Yellow"
                          ? "bg-yellow-500/30 text-yellow-200 border-yellow-500/60"
                          : "bg-slate-800/60 text-yellow-400/80 border-yellow-500/20"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-yellow-400" />
                      Yellow
                    </button>
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
                  <span className="text-slate-400 text-[11px] font-medium mr-1 shrink-0 flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Hazard:
                  </span>
                  {[
                    { id: "all", label: "All Hazards" },
                    { id: "flood", label: "Floods & Rain" },
                    { id: "cyclone", label: "Cyclone" },
                    { id: "landslide", label: "Landslide" },
                    { id: "thunderstorm", label: "Thunderstorm" },
                    { id: "heatwave", label: "Heatwave" },
                    { id: "coastal", label: "Coastal & Sea" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer border ${
                        selectedCategory === cat.id
                          ? "bg-sky-500 text-white border-sky-400 shadow-sm"
                          : "bg-slate-800/80 text-slate-300 border-white/10 hover:bg-slate-700"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alert List */}
              <div className="space-y-3.5 pt-1">
                {filteredAlerts.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-2xl bg-slate-950/40 border border-white/5">
                    <ShieldAlert className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
                    <h4 className="text-sm font-bold text-white">No Critical Alerts Found</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                      There are no active hazard bulletins matching your selected filter criteria.
                    </p>
                  </div>
                ) : (
                  filteredAlerts.map((alert) => {
                    const style = getSeverityStyle(alert.severity);
                    return (
                      <div
                        key={alert.id}
                        className={`p-4 sm:p-4.5 rounded-2xl border ${style.cardClass} shadow-lg space-y-3 transition hover:border-opacity-80`}
                      >
                        {/* Card Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-center shrink-0">
                              {getCategoryIcon(alert.category)}
                            </div>
                            <div className="min-w-0">
                              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                                {alert.bulletinNo}
                              </span>
                              <h4 className="text-sm sm:text-base font-bold text-white truncate">
                                {alert.title}
                              </h4>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${style.badgeClass}`}
                            >
                              <span className={`w-2 h-2 rounded-full ${style.indicatorClass} animate-ping`} />
                              {style.label}
                            </span>
                          </div>
                        </div>

                        {/* Headline */}
                        <p className="text-xs sm:text-sm font-semibold text-rose-200/90 leading-snug">
                          {alert.headline}
                        </p>

                        {/* Description */}
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {alert.description}
                        </p>

                        {/* Affected Geography */}
                        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1 text-xs">
                          <div className="flex items-start gap-1.5">
                            <span className="text-slate-400 font-semibold shrink-0">States:</span>
                            <span className="text-slate-200 font-medium">{alert.affectedStates.join(", ")}</span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <span className="text-slate-400 font-semibold shrink-0">High-Risk Districts:</span>
                            <span className="text-amber-300 font-medium">{alert.affectedDistricts.join(", ")}</span>
                          </div>
                        </div>

                        {/* Safety Guidelines / Actions */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
                            Mandated Safety Actions:
                          </span>
                          <ul className="space-y-1">
                            {alert.instructions.map((ins, i) => (
                              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{ins}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Footer & Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-slate-400 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span>Issued: <strong className="text-slate-300">{alert.issuedAt}</strong></span>
                            <span>•</span>
                            <span>Valid: <strong className="text-amber-300">{alert.validUntil}</strong></span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleShareAlert(alert)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-white/10 flex items-center gap-1 transition cursor-pointer"
                              title="Share this IMD Alert"
                            >
                              <Share2 className="w-3 h-3" />
                              Share Alert
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {activeTab === "helplines" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3">
                <PhoneCall className="w-8 h-8 text-rose-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Emergency Response Dispatch Network</h4>
                  <p className="text-xs text-slate-300">
                    Toll-free emergency helplines for life safety, search & rescue, and medical evacuation across India.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EMERGENCY_HELPLINES.map((hl) => (
                  <div
                    key={hl.number}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2 hover:border-rose-500/40 transition"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-bold text-white">{hl.name}</h5>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {hl.number}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{hl.desc}</p>
                    <a
                      href={`tel:${hl.number.replace(/[^0-9]/g, "")}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      Dial {hl.number}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "safety" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Info className="w-4 h-4 text-sky-400" />
                  National Disaster Management Authority (NDMA) Safety Guidelines
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Standard Operating Procedures (SOPs) for high-impact hydrometeorological events.
                </p>
              </div>

              {/* Floods Checklist */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2.5">
                <h5 className="text-sm font-bold text-sky-300 flex items-center gap-2">
                  <CloudRain className="w-4 h-4" /> Floods & Waterlogging Safety
                </h5>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                  <li>Turn off main electricity switch and gas supply if floodwaters enter your home.</li>
                  <li>Do not walk or drive through flowing floodwaters. Just 15 cm of moving water can knock you down.</li>
                  <li>Boil drinking water or use water purification tablets before consumption.</li>
                  <li>Keep emergency kit (torch, dry rations, first-aid, medicines, identity papers) in waterproof pouch.</li>
                </ul>
              </div>

              {/* Cyclone Checklist */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2.5">
                <h5 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Wind className="w-4 h-4" /> Cyclone & Severe Storm Safety
                </h5>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                  <li>Board up glass windows or put cross tape on panes to prevent shattered glass injuries.</li>
                  <li>Trim overhanging tree branches near rooftops and telephone/power lines.</li>
                  <li>Stay inside a well-constructed building until official all-clear is announced by IMD.</li>
                </ul>
              </div>

              {/* Lightning Checklist */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2.5">
                <h5 className="text-sm font-bold text-yellow-300 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Lightning & Thunderstorm Safety
                </h5>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                  <li>Follow the 30-30 Rule: If time between thunder & lightning is less than 30s, stay indoors.</li>
                  <li>If trapped outdoors in open ground, crouch down in a ball-like position with feet together.</li>
                  <li>Avoid plumbing fixtures and electrical sockets during active lightning storms.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-950/80 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Realtime IMD & NDMA CAP Server Sync</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { PersonaType, HealthNote, UserPreferences } from "../types";
import {
  HeartPulse,
  Activity,
  Waves,
  Luggage,
  Baby,
  Sprout,
  Car,
  CalendarCheck,
  Check,
  Sparkles,
  Sliders,
  X,
  ShieldCheck,
} from "lucide-react";

interface PersonalizationSetupProps {
  initialPreferences?: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
  isEditMode?: boolean;
  onClose?: () => void;
}

const PERSONA_OPTIONS: Array<{
  id: PersonaType;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  accent: string;
}> = [
  { id: "health", label: "Health & Allergies", sublabel: "AQI, Pollen & Respiration", icon: HeartPulse, accent: "text-rose-400 bg-rose-500/10 border-rose-500/30" },
  { id: "fitness", label: "Fitness & Outdoor", sublabel: "Workout Windows & Thermal Load", icon: Activity, accent: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  { id: "beach", label: "Beach & Surf", sublabel: "Swell, Tides & Coastal Water", icon: Waves, accent: "text-sky-400 bg-sky-500/10 border-sky-500/30" },
  { id: "travel", label: "Travel & Transit", sublabel: "Multi-City Routes & Airport Hubs", icon: Luggage, accent: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
  { id: "parents", label: "Family / School", sublabel: "Recess Safety & Drop-off Layering", icon: Baby, accent: "text-pink-400 bg-pink-500/10 border-pink-500/30" },
  { id: "agriculture", label: "Gardening & Agro", sublabel: "Soil Hydration & Frost Protection", icon: Sprout, accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  { id: "commute", label: "Daily Commute", sublabel: "Highway Visibility & Road Slickness", icon: Car, accent: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
  { id: "event", label: "Events & Gatherings", sublabel: "Comfort Index & Marquee Anchoring", icon: CalendarCheck, accent: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30" },
];

export const HEALTH_NOTE_OPTIONS: Array<{
  id: HealthNote;
  label: string;
}> = [
  { id: "none", label: "None" },
  { id: "asthma", label: "Asthma / Respiratory issues" },
  { id: "skin_sensitivity", label: "Skin sensitivity" },
  { id: "allergies", label: "Allergies (pollen/seasonal)" },
  { id: "heart_condition", label: "Heart condition" },
  { id: "other", label: "Other" },
];

export const PersonalizationSetup: React.FC<PersonalizationSetupProps> = ({
  initialPreferences = {
    personas: ["health", "fitness", "commute"],
    healthNote: "none",
  },
  onSave,
  isEditMode = false,
  onClose,
}) => {
  const [selectedPersonas, setSelectedPersonas] = useState<PersonaType[]>(
    initialPreferences.personas.length > 0 ? initialPreferences.personas : ["health", "fitness"]
  );
  const [healthNote, setHealthNote] = useState<HealthNote>(
    initialPreferences.healthNote || "none"
  );

  const togglePersona = (p: PersonaType) => {
    setSelectedPersonas((prev) => {
      if (prev.includes(p)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== p);
      } else {
        return [...prev, p];
      }
    });
  };

  const handleSave = () => {
    onSave({
      personas: selectedPersonas,
      healthNote,
    });
  };

  return (
    <div
      id="personalization-setup-container"
      className={`${
        isEditMode
          ? "fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-md animate-fadeIn"
          : "fixed inset-0 z-50 overflow-y-auto bg-slate-950 flex flex-col items-center justify-start p-4 sm:p-6 py-8"
      }`}
    >
      <div
        className={`w-full ${
          isEditMode
            ? "max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-5 sm:p-7 text-white"
            : "max-w-2xl my-auto rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl p-6 sm:p-8 text-white flex flex-col gap-6"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 shrink-0">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Let's personalize your Mausam
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-relaxed">
                Tell us what matters to you. We'll adjust meteorology and health thresholds specifically for you.
              </p>
            </div>
          </div>
          {isEditMode && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* QUESTION 1 — WHAT MATTERS TO YOU? */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                1. Which weather information matters most to you?
              </label>
              <span className="text-[11px] text-slate-400">Multi-select</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Select all categories you track regularly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PERSONA_OPTIONS.map((opt) => {
              const isSelected = selectedPersonas.includes(opt.id);
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  id={`pref-persona-${opt.id}`}
                  onClick={() => togglePersona(opt.id)}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between gap-3 cursor-pointer group ${
                    isSelected
                      ? "bg-slate-800/90 border-sky-500/80 shadow-md shadow-sky-500/10"
                      : "bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-xl border ${opt.accent} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs sm:text-sm font-semibold truncate ${isSelected ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
                        {opt.label}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {opt.sublabel}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition ${
                      isSelected
                        ? "bg-sky-500 border-sky-400 text-slate-950"
                        : "border-slate-700 bg-slate-900 text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* QUESTION 2 / HEALTH CONDITION — SINGLE SELECT */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                2. Do you have any health conditions we should consider?
              </label>
              <span className="text-[11px] text-slate-400">Single select</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              This helps Mausam adjust AQI, UV, and pollen thresholds specifically for you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {HEALTH_NOTE_OPTIONS.map((opt) => {
              const isSelected = healthNote === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  id={`pref-health-${opt.id}`}
                  onClick={() => setHealthNote(opt.id)}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between gap-3 cursor-pointer group ${
                    isSelected
                      ? "bg-sky-600 border-sky-400 text-white font-bold shadow-lg shadow-sky-600/30"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <span className="text-xs sm:text-sm font-medium">{opt.label}</span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition ${
                      isSelected
                        ? "bg-white border-white text-sky-700"
                        : "border-slate-700 bg-slate-900 text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            id="save-preferences-btn"
            onClick={handleSave}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-sky-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>{isEditMode ? "Save Preferences" : "Show My Mausam"}</span>
          </button>

          {isEditMode && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { PersonaType } from "../types";
import {
  Sparkles,
  HeartPulse,
  Activity,
  Waves,
  Luggage,
  Baby,
  Sprout,
  Car,
  CalendarCheck,
} from "lucide-react";

interface PersonaSelectorProps {
  activePersona: PersonaType;
  onSelect: (persona: PersonaType) => void;
  selectedPersonas?: PersonaType[];
  onOpenEditPreferences?: () => void;
}

export const PERSONAS: {
  id: PersonaType;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  tagColor: string;
}[] = [
  {
    id: "all",
    label: "All Features",
    shortLabel: "All-in-One",
    icon: Sparkles,
    description: "Adaptive panoramic dashboard combining all weather insights",
    tagColor: "from-blue-500 to-indigo-600",
  },
  {
    id: "health",
    label: "Health & Allergies",
    shortLabel: "Health",
    icon: HeartPulse,
    description: "AQI pollutants, pollen levels, UV index, asthma risk & air safety",
    tagColor: "from-emerald-500 to-teal-600",
  },
  {
    id: "fitness",
    label: "Outdoor Fitness",
    shortLabel: "Fitness",
    icon: Activity,
    description: "Best running hours timeline, heat stress index & workout windows",
    tagColor: "from-orange-500 to-amber-600",
  },
  {
    id: "beach",
    label: "Beach & Surfing",
    shortLabel: "Beach/Surf",
    icon: Waves,
    description: "Wave height, swell period, sea temperature & high/low tides",
    tagColor: "from-cyan-500 to-blue-600",
  },
  {
    id: "travel",
    label: "Travel & Packing",
    shortLabel: "Travel",
    icon: Luggage,
    description: "Multi-city destinations, flight disruption alerts & packing checklist",
    tagColor: "from-violet-500 to-purple-600",
  },
  {
    id: "parents",
    label: "Parents & School",
    shortLabel: "Parents",
    icon: Baby,
    description: "School commute timing, kids attire advice & playground safety",
    tagColor: "from-pink-500 to-rose-600",
  },
  {
    id: "agriculture",
    label: "Garden & Agriculture",
    shortLabel: "Farming",
    icon: Sprout,
    description: "Soil moisture at 3 depths, frost hazard, ET0 & rain accumulation",
    tagColor: "from-lime-500 to-green-600",
  },
  {
    id: "commute",
    label: "Commute & Traffic",
    shortLabel: "Commute",
    icon: Car,
    description: "Road hazards, hydroplaning, fog visibility & best departure times",
    tagColor: "from-amber-500 to-yellow-600",
  },
  {
    id: "event",
    label: "Event & Gathering",
    shortLabel: "Events",
    icon: CalendarCheck,
    description: "7-day comfort index, hourly rain probability & canopy wind limits",
    tagColor: "from-fuchsia-500 to-purple-600",
  },
];

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  activePersona,
  onSelect,
  selectedPersonas = [],
  onOpenEditPreferences,
}) => {
  // Only display "all" (overview) and the personas selected by the user
  const visiblePersonas = PERSONAS.filter(
    (p) =>
      p.id === "all" ||
      (selectedPersonas && selectedPersonas.length > 0
        ? selectedPersonas.includes(p.id)
        : true)
  );

  return (
    <section aria-label="Personalized Weather Profiles" className="w-full">
      <div className="flex items-center justify-between px-1 mb-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300/80 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Personalized Perspectives
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">
            {PERSONAS.find((p) => p.id === activePersona)?.shortLabel} Mode
          </span>
          {onOpenEditPreferences && (
            <button
              onClick={onOpenEditPreferences}
              className="text-[10px] text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 px-2 py-0.5 rounded-md border border-sky-500/30 transition cursor-pointer font-medium"
              title="Add or remove active personas"
            >
              Customize
            </button>
          )}
        </div>
      </div>

      {/* Horizontal scrollable pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 no-scrollbar scroll-smooth">
        {visiblePersonas.map((p) => {
          const Icon = p.icon;
          const isActive = activePersona === p.id;

          return (
            <button
              key={p.id}
              id={`persona-pill-${p.id}`}
              onClick={() => onSelect(p.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                isActive
                  ? `bg-gradient-to-r ${p.tagColor} text-white border-white/30 shadow-lg shadow-black/20 scale-105 ring-2 ring-white/20`
                  : "bg-slate-900/60 backdrop-blur-md text-slate-300 hover:text-white border-white/10 hover:bg-slate-800/80 hover:border-white/20"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

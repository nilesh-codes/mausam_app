import React, { useState, useEffect } from "react";
import { AggregatedWeatherData, PersonaType, UserPreferences, SevereAlert, HealthNote } from "../types";
import { getVerdict, getPersonalizedSmartSummary, PersonaVerdict } from "../utils/weatherUtils";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";

interface QuickActionsProps {
  weather: AggregatedWeatherData;
  preferences: UserPreferences;
  alerts: SevereAlert[];
  onSelectPersonaTab: (persona: PersonaType) => void;
  onOpenEditPreferences: () => void;
  onAskAI?: (persona: string, customQuestion?: string) => void;
}

const ACTION_CHIPS: Array<{
  persona: PersonaType;
  emoji: string;
  actionText: string;
}> = [
  { persona: "fitness", emoji: "🏃", actionText: "Going for a run" },
  { persona: "health", emoji: "🫁", actionText: "Check air quality" },
  { persona: "beach", emoji: "🌊", actionText: "Beach day" },
  { persona: "travel", emoji: "✈️", actionText: "Travel today" },
  { persona: "parents", emoji: "🎒", actionText: "School run" },
  { persona: "agriculture", emoji: "🌱", actionText: "Garden today" },
  { persona: "commute", emoji: "🚗", actionText: "Commute" },
  { persona: "event", emoji: "🎉", actionText: "Event today" },
];

const HEALTH_LABELS: Record<HealthNote, string> = {
  none: "None",
  asthma: "Asthma / Respiratory issues",
  skin_sensitivity: "Skin sensitivity",
  allergies: "Allergies (pollen/seasonal)",
  heart_condition: "Heart condition",
  other: "Other health condition",
};

export const PersonalizedQuickActionsAndVerdict: React.FC<QuickActionsProps> = ({
  weather,
  preferences,
  alerts,
  onSelectPersonaTab,
  onOpenEditPreferences,
  onAskAI,
}) => {
  // Determine default active chip based on first selected persona
  const getDefaultPersona = (): PersonaType => {
    return preferences.personas[0] || "health";
  };

  const [activePersona, setActivePersona] = useState<PersonaType>(getDefaultPersona);
  const [showWhyThis, setShowWhyThis] = useState<boolean>(false);

  // Synchronize activePersona whenever preferences.personas change
  useEffect(() => {
    if (preferences.personas.length > 0 && !preferences.personas.includes(activePersona)) {
      setActivePersona(preferences.personas[0] || "health");
    }
  }, [preferences.personas, activePersona]);

  // Compute verdict deterministically
  const verdict: PersonaVerdict = getVerdict(
    activePersona,
    weather,
    undefined,
    preferences.healthNote || "none"
  );

  // Compute personalized smart summary
  const smartSummary = getPersonalizedSmartSummary(weather, preferences, alerts);

  // ONLY show quick action chips for personas the user selected
  const userSelectedChips = ACTION_CHIPS.filter((chip) =>
    preferences.personas.includes(chip.persona)
  );
  const displayChips = (userSelectedChips.length > 0 ? userSelectedChips : ACTION_CHIPS).sort(
    (a, b) => preferences.personas.indexOf(a.persona) - preferences.personas.indexOf(b.persona)
  );

  const getStatusBadge = (status: "GO" | "CAUTION" | "WAIT") => {
    switch (status) {
      case "GO":
        return {
          bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          icon: CheckCircle2,
          color: "text-emerald-400",
          barBg: "bg-emerald-500",
        };
      case "CAUTION":
        return {
          bg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          icon: AlertTriangle,
          color: "text-amber-400",
          barBg: "bg-amber-500",
        };
      case "WAIT":
        return {
          bg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
          icon: Clock,
          color: "text-rose-400",
          barBg: "bg-rose-500",
        };
    }
  };

  const statusStyle = getStatusBadge(verdict.status);
  const StatusIcon = statusStyle.icon;
  const currentHealthNote = preferences.healthNote || "none";
  const hasHealthCondition = currentHealthNote !== "none";

  return (
    <section aria-label="Personalized Weather Verdict" className="w-full flex flex-col gap-3">
      {/* 1. Personalized Smart Summary Banner */}
      <div
        id="personalized-smart-summary-card"
        className="w-full rounded-2xl bg-gradient-to-r from-sky-950/70 via-indigo-950/60 to-slate-900/80 border border-sky-500/30 p-3.5 sm:p-4 backdrop-blur-md flex items-start justify-between gap-3 shadow-lg"
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-widest text-sky-300">
                Personalized Mausam Insight
              </span>
              {hasHealthCondition && (
                <span className="text-[9px] px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{HEALTH_LABELS[currentHealthNote]}</span>
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-100 mt-1 leading-relaxed">
              {smartSummary}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenEditPreferences}
          className="shrink-0 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-slate-300 hover:text-white border border-white/10 transition cursor-pointer self-center"
          title="Edit your personalized priorities"
        >
          Edit Priorities
        </button>
      </div>

      {/* 2. Quick Action Chips Selector */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-300 flex items-center gap-1.5">
            <span>Quick Activity Verdict</span>
            <span className="text-[10px] font-normal text-slate-400 lowercase">• tap to evaluate</span>
          </span>
          <span className="text-[11px] text-sky-400">Deterministic IMD Rules</span>
        </div>

        {/* Horizontal scrollable chips bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {displayChips.map((chip) => {
            const isSelected = activePersona === chip.persona;
            return (
              <button
                key={chip.persona}
                id={`verdict-chip-${chip.persona}`}
                onClick={() => {
                  setActivePersona(chip.persona);
                  setShowWhyThis(false);
                }}
                className={`px-3 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
                  isSelected
                    ? "bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20 scale-105 font-bold"
                    : "bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600"
                }`}
              >
                <span>{chip.emoji}</span>
                <span>{chip.actionText}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Decision Engine Verdict Card */}
      <div
        id="quick-action-verdict-card"
        className="w-full rounded-3xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 backdrop-blur-xl shadow-xl flex flex-col gap-4"
      >
        {/* Verdict Top Row: Status Badge, Headline, and Score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-start gap-3.5">
            <div className={`px-3 py-1.5 rounded-2xl border flex items-center gap-2 font-mono font-bold text-sm tracking-wider uppercase shrink-0 ${statusStyle.bg}`}>
              <StatusIcon className="w-4 h-4" />
              <span>{verdict.status}</span>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {verdict.headline}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Primary Driver: <span className="text-slate-200 font-medium">{verdict.primaryFactor}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="text-right mr-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">Suitability Score</span>
              <span className="text-xl font-mono font-bold text-sky-300">{verdict.score}/100</span>
            </div>

            {onAskAI && (
              <button
                id="verdict-ai-plan-btn"
                onClick={() =>
                  onAskAI(
                    activePersona,
                    `Create an AI planner strategy for ${
                      ACTION_CHIPS.find((c) => c.persona === activePersona)?.actionText || activePersona
                    } taking into account current weather telemetry and my profile preferences.`
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white transition flex items-center gap-1.5 shadow-md shadow-purple-900/30 cursor-pointer"
                title="Open AI Planner for this activity"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                <span>AI Plan</span>
              </button>
            )}

            <button
              onClick={() => onSelectPersonaTab(activePersona)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-400 hover:text-sky-300 transition flex items-center gap-1 border border-slate-700 cursor-pointer"
            >
              <span>Deep Dive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Verdict Recommendation */}
        <div className="text-xs sm:text-sm text-slate-200 bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800/80 leading-relaxed font-medium">
          {verdict.recommendation}
        </div>

        {/* Supporting Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {verdict.metrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-2.5 flex flex-col justify-between text-center"
            >
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block truncate">
                {m.label}
              </span>
              <span
                className={`font-mono font-bold text-xs sm:text-sm mt-1 ${
                  m.status === "alert"
                    ? "text-rose-400"
                    : m.status === "warning"
                    ? "text-amber-400"
                    : "text-slate-100"
                }`}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {/* "Why this?" Collapsible Explanation Drawer */}
        <div className="pt-2 border-t border-white/5">
          <button
            id="verdict-why-this-btn"
            onClick={() => setShowWhyThis(!showWhyThis)}
            className="w-full flex items-center justify-between text-xs font-semibold text-sky-400 hover:text-sky-300 py-1 transition cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Why this verdict? (Deterministic Calculation)</span>
            </span>
            {showWhyThis ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showWhyThis && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 text-slate-300 animate-fadeIn">
              <p className="font-semibold text-slate-200">Meteorological Analysis Triggers:</p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                {verdict.whyThis.map((reason, i) => (
                  <li key={i} className="leading-relaxed">
                    {reason}
                  </li>
                ))}
              </ul>
              <div className="pt-2 mt-2 border-t border-white/5 text-[11px] text-slate-400">
                <span>Calculated based on live meteorological parameters</span>
                {hasHealthCondition && (
                  <span> • Adjusted specifically for your <strong>{HEALTH_LABELS[currentHealthNote]}</strong> condition</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

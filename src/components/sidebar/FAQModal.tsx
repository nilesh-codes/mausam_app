import React, { useState } from "react";
import { HelpCircle, X, ChevronDown, ChevronUp, BookOpen, AlertCircle, Radio, Sprout, Zap } from "lucide-react";

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FAQItem {
  question: string;
  category: "General" | "Radar & Tech" | "Warnings" | "Agriculture";
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    category: "General",
    question: "What is the official source of data in the Mausam App?",
    answer:
      "Mausam integrates high-resolution numerical weather prediction (NWP) models, Doppler Weather Radars (DWR), automatic weather stations (AWS), and INSAT-3D/3DR meteorological satellites from the India Meteorological Department (IMD) combined with global high-resolution ECMWF / GFS ensemble grids.",
  },
  {
    category: "Warnings",
    question: "What do the Color-Coded Weather Alerts (Green, Yellow, Orange, Red) mean?",
    answer:
      "• Green (No Warning): No severe weather is expected. Normal activities.\n• Yellow (Watch / Be Updated): Weather condition is likely to deteriorate; stay tuned for updates.\n• Orange (Alert / Be Prepared): Severe weather is imminent; expect transport disruptions and prepare backup plans.\n• Red (Warning / Take Action): Extremely severe weather (cyclone/deluge/heatwave) posing risk to life and infrastructure; strictly follow disaster management guidelines.",
  },
  {
    category: "Radar & Tech",
    question: "How should I read the Doppler Weather Radar (DWR) dBZ scale?",
    answer:
      "dBZ measures radar echo reflectivity:\n• 10–20 dBZ (Blue/Cyan): High clouds or light drizzle.\n• 25–35 dBZ (Green/Yellow): Moderate rain showers.\n• 40–50 dBZ (Orange/Red): Heavy downpours and thunderstorm cores.\n• 55+ dBZ (Purple/Magenta): Severe hailstorms and severe convective storm tops.",
  },
  {
    category: "Agriculture",
    question: "How are the Agromet Advisories (GKMS) generated?",
    answer:
      "The Gramin Krishi Mausam Sewa (GKMS) issues bi-weekly district & block-level agro-bulletins prepared by agricultural scientists at State Agricultural Universities (SAUs) and ICAR institutes, providing tailor-made crop-specific advice based on 5-day weather forecasts.",
  },
  {
    category: "Radar & Tech",
    question: "What is the Damini Lightning Alert system and the 30-30 Rule?",
    answer:
      "Damini utilizes the IITM/IMD lightning sensor network to predict lightning strikes within a 20-30 km radius 30-45 minutes in advance. The 30-30 rule states: If the time between flash and thunder is less than 30 seconds, immediately take shelter; wait 30 minutes after the last thunder before stepping outside.",
  },
  {
    category: "General",
    question: "Can I use the Mausam App offline without internet connectivity?",
    answer:
      "Yes! Mausam features a high-performance offline engine that caches your last refreshed meteorological forecasts, 7-day outlook, radar snapshots, and emergency safety guidelines for instant offline viewing.",
  },
];

export const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  if (!isOpen) return null;

  const categories = ["All", "General", "Warnings", "Radar & Tech", "Agriculture"];

  const filteredFaqs =
    selectedCategory === "All" ? FAQS : FAQS.filter((f) => f.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-white/20 shadow-2xl p-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Frequently Asked Questions (FAQ)</h3>
              <p className="text-xs text-slate-400">IMD Mausam Weather Guide & Knowledge Base</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories */}
        <div className="py-3 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                selectedCategory === cat
                  ? "bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-900/30"
                  : "bg-slate-800 text-slate-300 border-white/5 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-2.5 pt-1">
          {filteredFaqs.map((faq, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-800/60 border border-white/5 overflow-hidden transition"
              >
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left transition hover:bg-slate-800/90 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sky-400 px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20 text-[10px]">
                      {faq.category}
                    </span>
                    <span className="text-xs font-bold text-white">{faq.question}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-sky-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-white/5 whitespace-pre-line">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

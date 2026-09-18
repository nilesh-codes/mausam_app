import React from "react";
import { AppLanguage } from "../../types";
import { LANGUAGES } from "../../utils/translations";
import { Languages, X, Check } from "lucide-react";

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: AppLanguage;
  onSelectLanguage: (lang: AppLanguage) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-white/20 shadow-2xl p-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Select Language / भाषा चुनें</h3>
              <p className="text-xs text-slate-400">Multilingual National Weather Interface</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Languages List */}
        <div className="py-4 space-y-2">
          {LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`w-full p-3 rounded-2xl flex items-center justify-between border transition cursor-pointer ${
                  isSelected
                    ? "bg-sky-500/20 border-sky-400 text-white font-bold"
                    : "bg-slate-800/60 border-white/5 text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{lang.nativeName}</span>
                  <span className="text-xs text-slate-400">({lang.label})</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-sky-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { AppSettings, GeoLocation, UserProfile } from "../types";
import { getTranslation } from "../utils/translations";
import {
  User,
  LogIn,
  Sprout,
  Plane,
  Users,
  Wind,
  Zap,
  Radio,
  CloudRain,
  Route,
  Languages,
  SlidersHorizontal,
  Heart,
  Bell,
  Share2,
  Star,
  HelpCircle,
  ChevronRight,
  X,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Award,
  Bot,
} from "lucide-react";

export type SidebarFeatureId =
  | "login"
  | "mausam_ai"
  | "observer_perks"
  | "agromet"
  | "aviation"
  | "crowdsource"
  | "cyclone"
  | "lightning"
  | "radar"
  | "rain_alert"
  | "route_nowcast"
  | "disaster_alert"
  | "language"
  | "preferences_units"
  | "personalize"
  | "favourites"
  | "notification"
  | "share"
  | "rate_app"
  | "faq";

interface MausamSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  userProfile?: UserProfile;
  currentLocation: GeoLocation;
  onOpenFeature: (featureId: SidebarFeatureId) => void;
}

export const MausamSidebarDrawer: React.FC<MausamSidebarDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  userProfile,
  currentLocation,
  onOpenFeature,
}) => {
  if (!isOpen) return null;

  const t = getTranslation(settings.language || "en");
  const isLoggedIn = userProfile?.isLoggedIn;

  const handleItemClick = (id: SidebarFeatureId) => {
    onOpenFeature(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="relative w-80 max-w-[85vw] h-full bg-slate-900 text-slate-100 shadow-2xl flex flex-col z-10 border-r border-white/10 overflow-y-auto animate-slideRight">
        {/* Close Button top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          title="Close menu"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. Header Profile / Login section */}
        <div
          onClick={() => handleItemClick("login")}
          className="p-5 flex items-center gap-3.5 hover:bg-slate-800/50 transition cursor-pointer group select-none"
        >
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 group-hover:border-sky-400 transition text-2xl">
            {isLoggedIn && userProfile?.avatar ? (
              userProfile.avatar
            ) : (
              <User className="w-6 h-6 text-slate-300 group-hover:text-sky-400 transition" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {isLoggedIn ? (
              <>
                <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition truncate flex items-center gap-1.5">
                  {userProfile?.name}
                  <ShieldCheck className="w-4 h-4 text-emerald-400 inline" />
                </h3>
                <p className="text-xs text-sky-400 font-medium truncate">
                  {userProfile?.role} • {userProfile?.district}
                </p>
              </>
            ) : (
              <>
                <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition">
                  {t.logIn}
                </h3>
                <p className="text-xs text-slate-400 font-medium">{t.notLoggedIn}</p>
              </>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mx-5" />

        {/* 2. Primary IMD Meteorology Features */}
        <div className="py-2 px-3 space-y-0.5">
          {/* Mausam AI Companion Chat Button */}
          <button
            id="sidebar-mausam-ai-btn"
            onClick={() => handleItemClick("mausam_ai")}
            className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-gradient-to-r from-purple-600/20 via-indigo-600/15 to-transparent border border-purple-500/35 hover:border-purple-400/60 hover:bg-purple-600/25 text-left transition cursor-pointer group mb-1.5 shadow-sm"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-6 h-6 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold text-purple-200 group-hover:text-purple-100 transition block truncate">
                  Mausam AI Companion
                </span>
                <span className="text-[11px] text-purple-300/80 font-medium block truncate">
                  Multi-lingual: English • हिंदी • Hinglish
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/25 text-purple-300 border border-purple-500/40 shrink-0">
              Live AI
            </span>
          </button>

          {/* Observer Perks & Rewards */}
          <button
            id="sidebar-observer-perks-btn"
            onClick={() => handleItemClick("observer_perks")}
            className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 hover:border-amber-400/60 hover:bg-amber-500/20 text-left transition cursor-pointer group mb-1"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-6 h-6 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold text-amber-200 group-hover:text-amber-100 transition block truncate">
                  Observer Perks & Rewards
                </span>
                <span className="text-[11px] text-amber-400/80 font-medium block truncate">
                  Daily quests, ranking & vault
                </span>
              </div>
            </div>
            {isLoggedIn ? (
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-amber-500/25 text-amber-300 border border-amber-500/40 shrink-0">
                {userProfile?.points ?? 0} pts
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 shrink-0 flex items-center gap-1">
                Guest
              </span>
            )}
          </button>

          {/* Agromet Products */}
          <button
            onClick={() => handleItemClick("agromet")}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-slate-800/80 text-left transition cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-200 group-hover:text-white transition">
              {t.agrometProducts}
            </span>
          </button>

          {/* Aviation */}
          <button
            onClick={() => handleItemClick("aviation")}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-slate-800/80 text-left transition cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center text-sky-400 group-hover:scale-110 transition">
              <Plane className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-200 group-hover:text-white transition">
              {t.aviation}
            </span>
          </button>

          {/* Crowd Source */}
          <button
            onClick={() => handleItemClick("crowdsource")}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-slate-800/80 text-left transition cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-200 group-hover:text-white transition">
              {t.crowdSource}
            </span>
          </button>

          {/* Cyclone */}
          <button
            onClick={() => handleItemClick("cyclone")}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-slate-800/80 text-left transition cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
              <Wind className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-200 group-hover:text-white transition">
              {t.cyclone}
            </span>
          </button>

          {/* Lightning */}
          <button
            onClick={() => handleItemClick("lightning")}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-slate-800/80 text-left transition cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-200 group-hover:text-white transition">
              {t.lightning}
            </span>
          </button>

          {/* Radar */}
          <button
            onClick={() => handleItemClick("radar")}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-slate-800/80 text-left transition cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center text-sky-400 group-hover:scale-110 transition">
              <Radio className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-200 group-hover:text-white transition">
              {t.radar}
            </span>
          </button>

          {/* Rain Alert */}
          <button
            onClick={() => handleItemClick("rain_alert")}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-slate-800/80 text-left transition cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition">
              <CloudRain className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-200 group-hover:text-white transition">
              {t.rainAlert}
            </span>
          </button>

          {/* Route Now Cast */}
          <button
            onClick={() => handleItemClick("route_nowcast")}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-slate-800/80 text-left transition cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center text-teal-400 group-hover:scale-110 transition">
              <Route className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-200 group-hover:text-white transition">
              {t.routeNowCast}
            </span>
          </button>

          {/* Disaster Alerts */}
          <button
            id="sidebar-disaster-alert-btn"
            onClick={() => handleItemClick("disaster_alert")}
            className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-rose-950/40 text-left transition cursor-pointer group border border-rose-500/20 hover:border-rose-500/40 bg-rose-500/10"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-6 h-6 flex items-center justify-center text-rose-400 group-hover:scale-110 transition">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-semibold text-rose-200 group-hover:text-white transition block truncate">
                  {t.disasterAlerts || "Disaster Alerts"}
                </span>
                <span className="text-[11px] text-rose-400/80 font-medium block truncate">
                  IMD & NDMA CAP Early Warning
                </span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-rose-500/30 text-rose-200 border border-rose-500/40 shrink-0 animate-pulse">
              Live
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mx-5 my-1" />

        {/* 3. Settings, Language & App Utilities */}
        <div className="py-2 px-3 space-y-0.5 pb-6">
          {/* Language selection */}
          <button
            onClick={() => handleItemClick("language")}
            className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-slate-800/80 text-left transition cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-6 h-6 flex items-center justify-center text-slate-400 group-hover:text-sky-400 group-hover:scale-110 transition">
                <Languages className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-200 group-hover:text-white transition">
                {t.english}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
          </button>

          {/* Preferences & Units */}
          <button
            onClick={() => handleItemClick("preferences_units")}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-slate-800/80 text-left transition cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center text-slate-400 group-hover:text-sky-400 group-hover:scale-110 transition">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-slate-200 group-hover:text-white transition block">
                {t.preferencesAndUnits}
              </span>
              <span className="text-[11px] text-slate-400 block truncate">
                {settings.tempUnit === "celsius" ? "°C" : "°F"} • {settings.windUnit} • {settings.precipUnit}
              </span>
            </div>
          </button>

          {/* Personalize Priorities */}
          <button
            id="sidebar-personalize-btn"
            onClick={() => handleItemClick("personalize")}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-slate-800/80 text-left transition cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-slate-200 group-hover:text-white transition block">
                Personalize Priorities
              </span>
              <span className="text-[11px] text-slate-400 block truncate">
                Focus modules, health & activities
              </span>
            </div>
          </button>

          {/* Favourites */}
          <button
            onClick={() => handleItemClick("favourites")}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-slate-800/80 text-left transition cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center text-rose-400 group-hover:scale-110 transition">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-200 group-hover:text-white transition">
              {t.favourites}
            </span>
          </button>

          {/* Notification */}
          <button
            onClick={() => handleItemClick("notification")}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-slate-800/80 text-left transition cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
              <Bell className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-200 group-hover:text-white transition">
              {t.notification}
            </span>
          </button>

          {/* Share */}
          <button
            onClick={() => handleItemClick("share")}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-slate-800/80 text-left transition cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center text-sky-400 group-hover:scale-110 transition">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-200 group-hover:text-white transition">
              {t.share}
            </span>
          </button>

          {/* Rate App */}
          <button
            onClick={() => handleItemClick("rate_app")}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-slate-800/80 text-left transition cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition">
              <Star className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-200 group-hover:text-white transition">
              {t.rateApp}
            </span>
          </button>

          {/* FAQ */}
          <button
            onClick={() => handleItemClick("faq")}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-slate-800/80 text-left transition cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center text-sky-400 group-hover:scale-110 transition">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-200 group-hover:text-white transition">
              {t.faq}
            </span>
          </button>
        </div>

        {/* Footer IMD Emblem / Version */}
        <div className="mt-auto p-4 bg-slate-950 border-t border-white/5 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Ministry of Earth Sciences, Govt. of India
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Mausam National Weather Service v4.2</p>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { GeoLocation, AppSettings, UserProfile } from "../types";
import { getTranslation, getTimeOfDayGreeting } from "../utils/translations";
import {
  MapPin,
  Search,
  Navigation,
  RefreshCw,
  Sun,
  Moon,
  WifiOff,
  Radio,
  CloudSun,
  Menu,
  User,
  Award,
  Sparkles,
} from "lucide-react";

interface HeaderProps {
  currentLocation: GeoLocation;
  savedLocations: GeoLocation[];
  onSelectLocation: (loc: GeoLocation) => void;
  onOpenSearch: () => void;
  onOpenSettings?: () => void;
  onOpenSidebar: () => void;
  onOpenProfile?: () => void;
  onOpenPerks?: () => void;
  onOpenAI?: () => void;
  onToggleTheme: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  isOffline: boolean;
  cachedAt?: number;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
  settings: AppSettings;
  userProfile?: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  savedLocations,
  onSelectLocation,
  onOpenSearch,
  onOpenSettings,
  onOpenSidebar,
  onOpenProfile,
  onOpenPerks,
  onOpenAI,
  onToggleTheme,
  onRefresh,
  isRefreshing,
  isOffline,
  cachedAt,
  onUseCurrentLocation,
  isLocating,
  settings,
  userProfile,
}) => {
  const t = getTranslation(settings.language || "en");
  const isLight = settings.theme === "light";

  const getCacheLabel = () => {
    if (isOffline) return "Offline Mode";
    if (cachedAt) {
      const diffMins = Math.floor((Date.now() - cachedAt) / (60 * 1000));
      if (diffMins < 1) return "Just updated";
      return `Cached ${diffMins}m ago`;
    }
    return "Live Weather";
  };

  return (
    <header className="w-full flex flex-col gap-3 pt-3 pb-2 px-1">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-2">
        {/* Menu & Logo & Brand */}
        <div className="flex items-center gap-2">
          {/* Hamburger Menu Button to open Mausam official sidebar drawer */}
          <button
            id="header-sidebar-menu-btn"
            onClick={onOpenSidebar}
            className="p-2 rounded-2xl bg-slate-900/70 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 shadow-md transition cursor-pointer flex items-center justify-center group"
            title="Open Mausam Services Menu"
          >
            <Menu className="w-5 h-5 text-slate-300 group-hover:text-sky-400 transition" />
          </button>

          <button
            onClick={onOpenSidebar}
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 p-0.5 shadow-md shadow-sky-500/20 flex items-center justify-center group-hover:scale-105 transition">
              <div className="w-full h-full bg-slate-950/80 backdrop-blur-sm rounded-[14px] flex items-center justify-center">
                <CloudSun className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-bold tracking-tight text-white font-serif">{t.appTitle}</h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  {t.live}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{t.appSubtitle}</p>
            </div>
          </button>
        </div>

        {/* Right Tools: Mausam AI Copilot, Theme Mode Switcher & Refresh Button */}
        <div className="flex items-center gap-1.5">
          {/* Dedicated Header Mausam AI Button */}
          {onOpenAI && (
            <button
              id="header-mausam-ai-trigger"
              onClick={onOpenAI}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-md bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white border border-purple-400/40 shadow-purple-900/30 transition cursor-pointer hover:scale-105"
              title="Open Mausam AI Companion Chat"
              aria-label="Open Mausam AI Companion"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="font-bold">Mausam AI</span>
            </button>
          )}

          {/* Light / Dark Mode Toggle Switcher */}
          <button
            id="header-theme-toggle-btn"
            onClick={onToggleTheme}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md transition cursor-pointer border ${
              isLight
                ? "bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 shadow-amber-200/50"
                : "bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-white/10 shadow-slate-950/40"
            }`}
            title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
            aria-label="Toggle Light or Dark Mode"
          >
            {isLight ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
                <span className="hidden sm:inline font-medium">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline font-medium">Dark</span>
              </>
            )}
          </button>

          {/* Refresh button */}
          <button
            id="header-refresh-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-full bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition cursor-pointer disabled:opacity-50"
            title="Refresh weather data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-sky-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* User Greeting: Clean typography greeting without repetitive card borders */}
      {userProfile?.isLoggedIn && (
        <div
          id="header-user-greeting-line"
          className="flex items-center justify-between px-1.5 pt-0.5 pb-0.5"
        >
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5 truncate">
            <span className="text-sky-300/90 font-medium">
              {getTimeOfDayGreeting(settings.language)},
            </span>
            <span className="text-white font-bold truncate">
              {userProfile.name}!
            </span>
          </h2>
        </div>
      )}

      {/* Main City & Location Bar */}
      <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/10 shadow-lg">
        {/* City name & click to search */}
        <button
          id="header-search-trigger"
          onClick={onOpenSearch}
          className="flex items-center gap-2 text-left flex-1 min-w-0 hover:opacity-80 transition cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-400 shrink-0 border border-sky-500/20 group-hover:bg-sky-500/25 transition">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-white truncate">{currentLocation.name}</span>
              {currentLocation.country && (
                <span className="text-xs text-slate-400 truncate">
                  {currentLocation.admin1 ? `${currentLocation.admin1}, ` : ""}
                  {currentLocation.country}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                {isOffline ? (
                  <WifiOff className="w-3 h-3 text-amber-400" />
                ) : (
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                )}
                {getCacheLabel()}
              </span>
            </div>
          </div>
        </button>

        {/* GPS Current Location button */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            id="header-gps-btn"
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-white/10 transition cursor-pointer disabled:opacity-50"
            title="Use current GPS location"
          >
            <Navigation className={`w-3.5 h-3.5 text-sky-400 ${isLocating ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">GPS</span>
          </button>

          {/* Search Icon button */}
          <button
            id="header-search-btn"
            onClick={onOpenSearch}
            className="p-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 transition cursor-pointer"
            title="Search city"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Location Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
        <span className="text-[11px] font-medium text-slate-400 shrink-0 flex items-center gap-1 mr-1">
          <MapPin className="w-3 h-3 text-slate-400" /> Saved:
        </span>
        {savedLocations.map((loc) => {
          const isSelected = loc.name === currentLocation.name && loc.country === currentLocation.country;
          return (
            <button
              key={`${loc.name}-${loc.latitude}-${loc.longitude}`}
              id={`quick-location-pill-${loc.name.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => onSelectLocation(loc)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition cursor-pointer border ${
                isSelected
                  ? "bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/20"
                  : "bg-slate-900/40 text-slate-300 hover:text-white border-white/10 hover:bg-slate-800/60"
              }`}
            >
              {loc.name}
            </button>
          );
        })}
      </div>
    </header>
  );
};


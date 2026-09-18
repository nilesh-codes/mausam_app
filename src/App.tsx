import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  AggregatedWeatherData,
  AppSettings,
  GeoLocation,
  PersonaType,
  SevereAlert,
  UserProfile,
  AppLanguage,
  UserPreferences,
  ThemeMode,
} from "./types";
import { OfflineStorage, DEFAULT_USER_PREFERENCES } from "./utils/offlineCache";
import { getContextualAlerts, getWeatherCondition } from "./utils/weatherUtils";
import { buildUnifiedWeatherContext } from "./utils/weatherContext";
import { WeatherBackground } from "./components/WeatherBackground";
import { Header } from "./components/Header";
import { PersonaSelector } from "./components/PersonaSelector";
import { CurrentWeatherHero } from "./components/CurrentWeatherHero";
import { HourlyForecast } from "./components/HourlyForecast";
import { DailyForecast } from "./components/DailyForecast";
import { WeatherRadarMap } from "./components/WeatherRadarMap";
import { HealthDashboard } from "./components/personas/HealthDashboard";
import { FitnessDashboard } from "./components/personas/FitnessDashboard";
import { BeachSurfDashboard } from "./components/personas/BeachSurfDashboard";
import { TravelDashboard } from "./components/personas/TravelDashboard";
import { ParentsDashboard } from "./components/personas/ParentsDashboard";
import { AgricultureDashboard } from "./components/personas/AgricultureDashboard";
import { CommuterDashboard } from "./components/personas/CommuterDashboard";
import { EventPlannerDashboard } from "./components/personas/EventPlannerDashboard";
import { MausamAICopilot } from "./components/MausamAICopilot";
import { SettingsModal } from "./components/SettingsModal";
import { LocationSearchModal } from "./components/LocationSearchModal";
import { SplashScreen } from "./components/SplashScreen";
import { AuthScreen } from "./components/AuthScreen";
import { PersonalizationSetup } from "./components/PersonalizationSetup";
import { PersonalizedQuickActionsAndVerdict } from "./components/PersonalizedQuickActionsAndVerdict";

// Mausam Official Sidebar & Sub-Modals
import { MausamSidebarDrawer, SidebarFeatureId } from "./components/MausamSidebarDrawer";
import { LoginProfileModal } from "./components/sidebar/LoginProfileModal";
import { AgrometModal } from "./components/sidebar/AgrometModal";
import { AviationModal } from "./components/sidebar/AviationModal";
import { CrowdsourceModal } from "./components/sidebar/CrowdsourceModal";
import { CycloneModal } from "./components/sidebar/CycloneModal";
import { LightningModal } from "./components/sidebar/LightningModal";
import { RadarModal } from "./components/sidebar/RadarModal";
import { RainAlertModal } from "./components/sidebar/RainAlertModal";
import { RouteNowcastModal } from "./components/sidebar/RouteNowcastModal";
import { LanguageModal } from "./components/sidebar/LanguageModal";
import { FavouritesModal } from "./components/sidebar/FavouritesModal";
import { NotificationModal } from "./components/sidebar/NotificationModal";
import { ShareModal } from "./components/sidebar/ShareModal";
import { RateAppModal } from "./components/sidebar/RateAppModal";
import { FAQModal } from "./components/sidebar/FAQModal";
import { ObserverPerksModal } from "./components/sidebar/ObserverPerksModal";
import { DisasterAlertsModal } from "./components/sidebar/DisasterAlertsModal";

import {
  Sparkles,
  WifiOff,
  RefreshCw,
  HeartPulse,
  Activity,
  Waves,
  Luggage,
  Baby,
  Sprout,
  Car,
  CalendarCheck,
  Compass,
} from "lucide-react";

export default function App() {
  // Settings & Saved Locations
  const [settings, setSettings] = useState<AppSettings>(() => OfflineStorage.getSettings());
  const [savedLocations, setSavedLocations] = useState<GeoLocation[]>(() => OfflineStorage.getSavedLocations());
  const [currentLocation, setCurrentLocation] = useState<GeoLocation>(() => OfflineStorage.getActiveLocation());
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>(() => settings.activePersona || "all");
  const [userProfile, setUserProfile] = useState<UserProfile>(() => OfflineStorage.getUserProfile());

  // Startup Flow State: "loading" | "auth" | "personalization" | "dashboard"
  const [appStage, setAppStage] = useState<"loading" | "auth" | "personalization" | "dashboard">("loading");
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() =>
    OfflineStorage.getUserPreferences()
  );
  const [isEditPreferencesOpen, setIsEditPreferencesOpen] = useState<boolean>(false);

  // Weather state
  const [weatherData, setWeatherData] = useState<AggregatedWeatherData | null>(() =>
    OfflineStorage.getCachedWeather(currentLocation.latitude, currentLocation.longitude)
  );
  const [isLoading, setIsLoading] = useState<boolean>(!weatherData);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [aiPersonaTrigger, setAiPersonaTrigger] = useState<PersonaType>("all");
  const [aiCustomQuestion, setAiCustomQuestion] = useState<string | undefined>();

  // Official Mausam Sidebar & Sub-feature Modals State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isObserverPerksOpen, setIsObserverPerksOpen] = useState(false);
  const [isAgrometModalOpen, setIsAgrometModalOpen] = useState(false);
  const [isAviationModalOpen, setIsAviationModalOpen] = useState(false);
  const [isCrowdsourceModalOpen, setIsCrowdsourceModalOpen] = useState(false);
  const [isCycloneModalOpen, setIsCycloneModalOpen] = useState(false);
  const [isLightningModalOpen, setIsLightningModalOpen] = useState(false);
  const [isRadarModalOpen, setIsRadarModalOpen] = useState(false);
  const [isRainAlertModalOpen, setIsRainAlertModalOpen] = useState(false);
  const [isRouteNowcastModalOpen, setIsRouteNowcastModalOpen] = useState(false);
  const [isDisasterAlertsModalOpen, setIsDisasterAlertsModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isFavouritesModalOpen, setIsFavouritesModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isRateAppModalOpen, setIsRateAppModalOpen] = useState(false);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);

  // Severe alerts
  const [alerts, setAlerts] = useState<SevereAlert[]>([]);

  // Monitor network connectivity
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch Weather Data from Express backend proxy
  const fetchWeather = useCallback(
    async (loc: GeoLocation, forceRefresh = false) => {
      if (forceRefresh) {
        setIsRefreshing(true);
      } else if (!weatherData) {
        setIsLoading(true);
      }
      setErrorMsg(null);

      // Check cache if offline
      if (!navigator.onLine) {
        const cached = OfflineStorage.getCachedWeather(loc.latitude, loc.longitude);
        if (cached) {
          setWeatherData(cached);
          setAlerts(getContextualAlerts(cached, loc.name));
          setIsLoading(false);
          setIsRefreshing(false);
          return;
        }
      }

      try {
        const params = new URLSearchParams({
          lat: loc.latitude.toString(),
          lon: loc.longitude.toString(),
          name: loc.name,
          temp_unit: settings.tempUnit,
          wind_unit: settings.windUnit,
          precip_unit: settings.precipUnit,
        });

        const res = await fetch(`/api/weather?${params.toString()}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch meteorological data (${res.status})`);
        }

        const data: AggregatedWeatherData = await res.json();
        setWeatherData(data);
        OfflineStorage.setCachedWeather(loc.latitude, loc.longitude, data);
        setAlerts(getContextualAlerts(data, loc.name));
      } catch (err: any) {
        console.error("Error loading weather:", err);
        const cached = OfflineStorage.getCachedWeather(loc.latitude, loc.longitude);
        if (cached) {
          setWeatherData(cached);
          setAlerts(getContextualAlerts(cached, loc.name));
          setErrorMsg("Using offline cached data.");
        } else {
          setErrorMsg(err.message || "Failed to load meteorological data");
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [settings.tempUnit, settings.windUnit, settings.precipUnit]
  );

  // Load weather on location change
  useEffect(() => {
    fetchWeather(currentLocation);
    OfflineStorage.saveActiveLocation(currentLocation);
  }, [currentLocation, fetchWeather]);

  // Synchronize active persona with selected user preferences
  useEffect(() => {
    if (
      selectedPersona !== "all" &&
      userPreferences.personas.length > 0 &&
      !userPreferences.personas.includes(selectedPersona)
    ) {
      setSelectedPersona("all");
    }
  }, [userPreferences.personas, selectedPersona]);

  const handleSelectLocation = (loc: GeoLocation) => {
    setCurrentLocation(loc);
    if (!savedLocations.some((l) => l.name === loc.name && Math.abs(l.latitude - loc.latitude) < 0.01)) {
      const updated = [loc, ...savedLocations.slice(0, 7)];
      setSavedLocations(updated);
      OfflineStorage.saveLocations(updated);
    }
  };

  const handleSaveLocation = (loc: GeoLocation) => {
    if (!savedLocations.some((l) => l.name === loc.name && Math.abs(l.latitude - loc.latitude) < 0.01)) {
      const updated = [loc, ...savedLocations];
      setSavedLocations(updated);
      OfflineStorage.saveLocations(updated);
    }
  };

  const handleRemoveLocation = (loc: GeoLocation) => {
    const updated = savedLocations.filter((l) => l.name !== loc.name);
    setSavedLocations(updated);
    OfflineStorage.saveLocations(updated);
  };

  // GPS Geolocation Handler
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          // Reverse geocode via server proxy with fallback
          const res = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lon}`);
          if (res.ok) {
            const data = await res.json();
            const gpsLoc: GeoLocation = {
              name: data.name || "My Location",
              country: data.country || "",
              admin1: data.admin1 || "",
              latitude: lat,
              longitude: lon,
              isCurrentLocation: true,
            };
            handleSelectLocation(gpsLoc);
            return;
          }
          throw new Error("Reverse geocode proxy status " + res.status);
        } catch (e) {
          const fallbackLoc: GeoLocation = {
            name: "GPS Location",
            latitude: lat,
            longitude: lon,
            isCurrentLocation: true,
          };
          handleSelectLocation(fallbackLoc);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn("GPS error:", err);
        setIsLocating(false);
        alert("Unable to retrieve GPS coordinates. Please ensure location permissions are granted.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleAskAI = (persona: string, customQuestion?: string) => {
    setAiPersonaTrigger(persona as PersonaType);
    setAiCustomQuestion(customQuestion);
    setIsAIModalOpen(true);
  };

  // Sidebar Feature Dispatcher
  const handleOpenSidebarFeature = (featureId: SidebarFeatureId) => {
    switch (featureId) {
      case "mausam_ai":
        setAiPersonaTrigger(selectedPersona);
        setAiCustomQuestion(undefined);
        setIsAIModalOpen(true);
        break;
      case "login":
        if (userProfile.isLoggedIn) {
          setIsLoginModalOpen(true);
        } else {
          setAppStage("auth");
        }
        break;
      case "observer_perks":
        setIsObserverPerksOpen(true);
        break;
      case "agromet":
        setIsAgrometModalOpen(true);
        break;
      case "aviation":
        setIsAviationModalOpen(true);
        break;
      case "crowdsource":
        setIsCrowdsourceModalOpen(true);
        break;
      case "cyclone":
        setIsCycloneModalOpen(true);
        break;
      case "lightning":
        setIsLightningModalOpen(true);
        break;
      case "radar":
        setIsRadarModalOpen(true);
        break;
      case "rain_alert":
        setIsRainAlertModalOpen(true);
        break;
      case "route_nowcast":
        setIsRouteNowcastModalOpen(true);
        break;
      case "disaster_alert":
        setIsDisasterAlertsModalOpen(true);
        break;
      case "language":
        setIsLanguageModalOpen(true);
        break;
      case "preferences_units":
        setIsSettingsOpen(true);
        break;
      case "personalize":
        setIsEditPreferencesOpen(true);
        break;
      case "favourites":
        setIsFavouritesModalOpen(true);
        break;
      case "notification":
        setIsNotificationModalOpen(true);
        break;
      case "share":
        setIsShareModalOpen(true);
        break;
      case "rate_app":
        setIsRateAppModalOpen(true);
        break;
      case "faq":
        setIsFAQModalOpen(true);
        break;
    }
  };

  // Startup Flow Handlers: Splash (loading) -> Login/Register (auth) -> Personalization -> Dashboard
  const handleSplashComplete = useCallback(() => {
    const profile = OfflineStorage.getUserProfile();
    // If the user is already authenticated
    if (profile && profile.isLoggedIn) {
      if (OfflineStorage.hasCompletedOnboarding()) {
        setAppStage("dashboard");
      } else {
        setAppStage("personalization");
      }
    } else {
      // Immediately direct to the single dedicated Login or Register page right after splash screen!
      setAppStage("auth");
    }
  }, []);

  const handleAuthSuccess = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
    OfflineStorage.saveUserProfile(profile);
    if (OfflineStorage.hasCompletedOnboarding()) {
      setAppStage("dashboard");
    } else {
      setAppStage("personalization");
    }
  }, []);

  const handleAuthGuest = useCallback(() => {
    if (OfflineStorage.hasCompletedOnboarding()) {
      setAppStage("dashboard");
    } else {
      setAppStage("personalization");
    }
  }, []);

  const handleLogout = useCallback(() => {
    const guest = OfflineStorage.logoutUser();
    setUserProfile(guest);
    setIsLoginModalOpen(false);
    setAppStage("auth");
  }, []);

  const handleSavePersonalization = useCallback((newPrefs: UserPreferences) => {
    OfflineStorage.saveUserPreferences(newPrefs);
    OfflineStorage.setOnboardingCompleted();
    setUserPreferences(newPrefs);
    setAppStage("dashboard");
  }, []);

  const handleSaveEditPreferences = useCallback((newPrefs: UserPreferences) => {
    OfflineStorage.saveUserPreferences(newPrefs);
    setUserPreferences(newPrefs);
    setIsEditPreferencesOpen(false);
  }, []);

  // Priority Calculator for Overview Persona Hub
  const getPersonaPriority = useCallback(
    (persona: PersonaType): number => {
      const prefIndex = userPreferences.personas.indexOf(persona);
      if (prefIndex !== -1) {
        return prefIndex; // Selected user personas in order
      }
      return 100; // Remaining personas
    },
    [userPreferences]
  );

  const handleUpdateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    OfflineStorage.saveUserProfile(profile);
  };

  const handleUpdateLanguage = (lang: AppLanguage) => {
    const updatedSettings: AppSettings = { ...settings, language: lang };
    setSettings(updatedSettings);
    OfflineStorage.saveSettings(updatedSettings);
  };

  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = settings.theme === "light" ? "dark" : "light";
    const updatedSettings: AppSettings = { ...settings, theme: nextTheme };
    setSettings(updatedSettings);
    OfflineStorage.saveSettings(updatedSettings);
  };

  // Condition info for background
  const weatherCode = weatherData?.current.weather_code ?? 0;
  const isDay = (weatherData?.current.is_day ?? 1) === 1;
  const conditionInfo = getWeatherCondition(weatherCode, weatherData?.current.is_day ?? 1);
  const isLight = settings.theme === "light";

  // Single Source of Truth: Unified Weather Context
  const unifiedWeatherContext = useMemo(() => {
    if (!weatherData) return null;
    return buildUnifiedWeatherContext(weatherData, currentLocation, userPreferences);
  }, [weatherData, currentLocation, userPreferences]);

  // 1. Loading Stage: Splash Screen (exactly 2 seconds)
  if (appStage === "loading") {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // 2. Auth Stage: Single dedicated Login & Register portal right after splash screen
  if (appStage === "auth") {
    return (
      <AuthScreen
        onAuthSuccess={handleAuthSuccess}
        onContinueGuest={handleAuthGuest}
      />
    );
  }

  // 3. Personalization Stage: Clean first-time onboarding
  if (appStage === "personalization") {
    return (
      <PersonalizationSetup
        initialPreferences={userPreferences}
        onSave={handleSavePersonalization}
        isEditMode={false}
      />
    );
  }

  // 4. Dashboard Stage
  return (
    <div className={`relative min-h-screen w-full font-sans antialiased transition-colors duration-500 selection:bg-sky-500 selection:text-white ${
      isLight ? "light-mode bg-slate-100 text-slate-900" : "dark-mode bg-slate-950 text-slate-100"
    }`}>
      {/* Dynamic Animated Atmospheric Canvas */}
      <WeatherBackground condition={conditionInfo} isDay={isDay} theme={settings.theme} />

      {/* Main App Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-3 sm:px-5 py-3 flex flex-col gap-4 pb-24">
        {/* Offline notice bar if offline */}
        {isOffline && (
          <div
            id="offline-banner"
            className="w-full p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 backdrop-blur-md flex items-center justify-between text-xs text-amber-200"
          >
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-400" />
              <span>Offline Mode Active • Serving cached meteorological profiles</span>
            </div>
            <button
              onClick={() => fetchWeather(currentLocation, true)}
              className="px-2 py-0.5 rounded-lg bg-amber-500/30 hover:bg-amber-500/40 text-white font-semibold transition cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Global Navigation Header */}
        <Header
          currentLocation={currentLocation}
          savedLocations={savedLocations}
          onSelectLocation={handleSelectLocation}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenProfile={() => setIsLoginModalOpen(true)}
          onOpenPerks={() => setIsObserverPerksOpen(true)}
          onOpenAI={() => {
            setAiPersonaTrigger(selectedPersona);
            setAiCustomQuestion(undefined);
            setIsAIModalOpen(true);
          }}
          userProfile={userProfile}
          onToggleTheme={handleToggleTheme}
          onRefresh={() => fetchWeather(currentLocation, true)}
          isRefreshing={isRefreshing}
          isOffline={isOffline}
          cachedAt={weatherData?._cachedAt}
          onUseCurrentLocation={handleUseCurrentLocation}
          isLocating={isLocating}
          settings={settings}
        />

        {/* Persona Selector Tabs */}
        <PersonaSelector
          activePersona={selectedPersona}
          onSelect={(p) => setSelectedPersona(p)}
          selectedPersonas={userPreferences.personas}
          onOpenEditPreferences={() => setIsEditPreferencesOpen(true)}
        />

        {/* Loading State */}
        {isLoading && !weatherData && (
          <div className="w-full h-96 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
            <p className="text-sm font-semibold text-slate-300">
              Aggregating satellite, radar & biometric telemetry for {currentLocation.name}...
            </p>
          </div>
        )}

        {/* Main Content View when Weather Data is Ready */}
        {weatherData && (
          <main className="w-full flex flex-col gap-4">
            {/* Current Conditions Hero */}
            <CurrentWeatherHero
              weather={weatherData}
              locationName={currentLocation.name}
              settings={settings}
              alerts={alerts}
              weatherContext={unifiedWeatherContext}
              onOpenHealth={() => {
                if (userPreferences.personas.includes("health")) {
                  setSelectedPersona("health");
                }
              }}
            />

            {/* Persona Dashboards Routing */}
            {selectedPersona === "all" && (
              <>
                {/* Real-time Personalized Verdict & Quick Action Engine */}
                <PersonalizedQuickActionsAndVerdict
                  weather={weatherData}
                  preferences={userPreferences}
                  alerts={alerts}
                  onSelectPersonaTab={(p) => setSelectedPersona(p)}
                  onOpenEditPreferences={() => {
                    setIsEditPreferencesOpen(true);
                  }}
                  onAskAI={handleAskAI}
                />

                {/* Quick Persona Highlights Matrix in Overview (Sorted by User Priorities) */}
                <section aria-label="Personalized Daily Hub" className="w-full flex flex-col gap-3">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-sky-400" />
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-300">
                        Personalized Daily Hub
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400">Prioritized for your profile</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        persona: "fitness" as PersonaType,
                        render: (isPrimary: boolean) => (
                          <button
                            key="fitness"
                            id="overview-fitness-card-btn"
                            onClick={() => setSelectedPersona("fitness")}
                            className={`bg-slate-900/40 hover:bg-slate-900/70 border ${
                              isPrimary
                                ? "border-amber-500/50 ring-1 ring-amber-500/30"
                                : "border-slate-800 hover:border-slate-700"
                            } rounded-3xl p-5 sm:p-6 flex flex-col justify-between text-left transition cursor-pointer group shadow-xl relative`}
                          >
                            {isPrimary && (
                              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30 uppercase tracking-widest">
                                Primary Focus
                              </span>
                            )}
                            <div className="flex justify-between items-start w-full">
                              <div className="bg-amber-500/10 p-2.5 rounded-2xl text-amber-500 border border-amber-500/20 group-hover:scale-110 transition">
                                <Activity className="w-5 h-5" />
                              </div>
                              {!isPrimary && (
                                <span className="text-xs text-slate-400 font-semibold tracking-widest uppercase">FITNESS</span>
                              )}
                            </div>
                            <div className="my-3">
                              <h3 className="text-base sm:text-lg font-semibold text-white">Best Running Hours</h3>
                              <p className="text-xs text-slate-400 mt-1">05:30 PM – 07:30 PM</p>
                            </div>
                            <div className="flex gap-1.5 w-full">
                              <div className="flex-1 h-1.5 bg-amber-500/40 rounded-full"></div>
                              <div className="flex-1 h-1.5 bg-amber-500 rounded-full"></div>
                              <div className="flex-1 h-1.5 bg-slate-800 rounded-full"></div>
                            </div>
                          </button>
                        ),
                      },
                      {
                        persona: "beach" as PersonaType,
                        render: (isPrimary: boolean) => (
                          <button
                            key="beach"
                            id="overview-beach-card-btn"
                            onClick={() => setSelectedPersona("beach")}
                            className={`bg-slate-900/40 hover:bg-slate-900/70 border ${
                              isPrimary
                                ? "border-sky-500/50 ring-1 ring-sky-500/30"
                                : "border-slate-800 hover:border-slate-700"
                            } rounded-3xl p-5 sm:p-6 flex flex-col justify-between text-left transition cursor-pointer group shadow-xl relative`}
                          >
                            {isPrimary && (
                              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[9px] font-bold border border-sky-500/30 uppercase tracking-widest">
                                Primary Focus
                              </span>
                            )}
                            <div className="flex justify-between items-start w-full">
                              <div className="bg-sky-500/10 p-2.5 rounded-2xl text-sky-400 border border-sky-500/20 group-hover:scale-110 transition">
                                <Waves className="w-5 h-5" />
                              </div>
                              {!isPrimary && (
                                <span className="text-xs text-slate-400 font-semibold tracking-widest uppercase">BEACH</span>
                              )}
                            </div>
                            <div className="my-3">
                              <h3 className="text-base sm:text-lg font-semibold text-white">Next High Tide</h3>
                              <p className="text-xs text-slate-400 mt-1">1.2m Swell • 04:12 PM</p>
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-mono font-bold text-white">21°</span>
                              <span className="text-xs text-slate-400">Water Temp</span>
                            </div>
                          </button>
                        ),
                      },
                      {
                        persona: "agriculture" as PersonaType,
                        render: (isPrimary: boolean) => (
                          <button
                            key="agriculture"
                            id="overview-agriculture-card-btn"
                            onClick={() => setSelectedPersona("agriculture")}
                            className={`bg-slate-900/40 hover:bg-slate-900/70 border ${
                              isPrimary
                                ? "border-emerald-500/50 ring-1 ring-emerald-500/30"
                                : "border-slate-800 hover:border-slate-700"
                            } rounded-3xl p-5 sm:p-6 flex flex-col justify-between text-left transition cursor-pointer group shadow-xl relative`}
                          >
                            {isPrimary && (
                              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30 uppercase tracking-widest">
                                Primary Focus
                              </span>
                            )}
                            <div className="flex justify-between items-start w-full">
                              <div className="bg-emerald-500/10 p-2.5 rounded-2xl text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition">
                                <Sprout className="w-5 h-5" />
                              </div>
                              {!isPrimary && (
                                <span className="text-xs text-slate-400 font-semibold tracking-widest uppercase">AGRICULTURE</span>
                              )}
                            </div>
                            <div className="my-3">
                              <h3 className="text-base sm:text-lg font-semibold text-white">Soil Moisture</h3>
                              <p className="text-xs text-slate-400 mt-1">Optimal for Sowing</p>
                            </div>
                            <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400">
                              {Math.round((weatherData.hourly?.soil_moisture_0_to_1cm?.[0] ?? 0.38) * 100)}%
                            </div>
                          </button>
                        ),
                      },
                      {
                        persona: "travel" as PersonaType,
                        render: (isPrimary: boolean) => (
                          <button
                            key="travel"
                            id="overview-travel-card-btn"
                            onClick={() => setSelectedPersona("travel")}
                            className={`bg-slate-900/40 hover:bg-slate-900/70 border ${
                              isPrimary
                                ? "border-purple-500/50 ring-1 ring-purple-500/30"
                                : "border-slate-800 hover:border-slate-700"
                            } rounded-3xl p-5 sm:p-6 flex flex-col justify-between text-left transition cursor-pointer group shadow-xl relative`}
                          >
                            {isPrimary && (
                              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-bold border border-purple-500/30 uppercase tracking-widest">
                                Primary Focus
                              </span>
                            )}
                            <div className="flex justify-between items-start w-full">
                              <div className="bg-purple-500/10 p-2.5 rounded-2xl text-purple-400 border border-purple-500/20 group-hover:scale-110 transition">
                                <Luggage className="w-5 h-5" />
                              </div>
                              {!isPrimary && (
                                <span className="text-xs text-slate-400 font-semibold tracking-widest uppercase">TRAVELER</span>
                              )}
                            </div>
                            <div className="my-3">
                              <h3 className="text-base sm:text-lg font-semibold text-white">Trip Advisory</h3>
                              <p className="text-xs text-slate-400 mt-1">Multi-City Sync Ready</p>
                            </div>
                            <div className="bg-purple-500/10 border border-purple-500/20 py-1.5 px-2.5 rounded-xl text-[10px] text-purple-300 font-bold uppercase tracking-wider block truncate">
                              Packing: Smart Checklist
                            </div>
                          </button>
                        ),
                      },
                      {
                        persona: "commute" as PersonaType,
                        render: (isPrimary: boolean) => (
                          <button
                            key="commute"
                            id="overview-commute-card-btn"
                            onClick={() => setSelectedPersona("commute")}
                            className={`bg-slate-900/40 hover:bg-slate-900/70 border ${
                              isPrimary
                                ? "border-amber-500/50 ring-1 ring-amber-500/30"
                                : "border-slate-800 hover:border-slate-700"
                            } rounded-3xl p-5 sm:p-6 flex flex-col justify-between text-left transition cursor-pointer group shadow-xl relative`}
                          >
                            {isPrimary && (
                              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30 uppercase tracking-widest">
                                Primary Focus
                              </span>
                            )}
                            <div className="flex justify-between items-start w-full">
                              <div className="bg-amber-500/10 p-2.5 rounded-2xl text-amber-400 border border-amber-500/20 group-hover:scale-110 transition">
                                <Car className="w-5 h-5" />
                              </div>
                              {!isPrimary && (
                                <span className="text-xs text-slate-400 font-semibold tracking-widest uppercase">COMMUTER</span>
                              )}
                            </div>
                            <div className="my-3">
                              <h3 className="text-base sm:text-lg font-semibold text-white">Road Conditions</h3>
                              <p className="text-xs text-slate-400 mt-1">Clear Highway Visibility</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                              Normal Traffic Services
                            </div>
                          </button>
                        ),
                      },
                      {
                        persona: "parents" as PersonaType,
                        render: (isPrimary: boolean) => (
                          <button
                            key="parents"
                            id="overview-parents-card-btn"
                            onClick={() => setSelectedPersona("parents")}
                            className={`bg-slate-900/40 hover:bg-slate-900/70 border ${
                              isPrimary
                                ? "border-pink-500/50 ring-1 ring-pink-500/30"
                                : "border-slate-800 hover:border-slate-700"
                            } rounded-3xl p-5 sm:p-6 flex flex-col justify-between text-left transition cursor-pointer group shadow-xl relative`}
                          >
                            {isPrimary && (
                              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[9px] font-bold border border-pink-500/30 uppercase tracking-widest">
                                Primary Focus
                              </span>
                            )}
                            <div className="flex justify-between items-start w-full">
                              <div className="bg-pink-500/10 p-2.5 rounded-2xl text-pink-400 border border-pink-500/20 group-hover:scale-110 transition">
                                <Baby className="w-5 h-5" />
                              </div>
                              {!isPrimary && (
                                <span className="text-xs text-slate-400 font-semibold tracking-widest uppercase">FAMILY</span>
                              )}
                            </div>
                            <div className="my-3">
                              <h3 className="text-base sm:text-lg font-semibold text-white">School & Recess</h3>
                              <p className="text-xs text-slate-400 mt-1">Outdoor Play Safe</p>
                            </div>
                            <div className="text-xs text-pink-300 font-medium">
                              Sunscreen & Light Jacket
                            </div>
                          </button>
                        ),
                      },
                      {
                        persona: "event" as PersonaType,
                        render: (isPrimary: boolean) => (
                          <button
                            key="event"
                            id="overview-events-card-btn"
                            onClick={() => setSelectedPersona("event")}
                            className={`bg-slate-900/40 hover:bg-slate-900/70 border ${
                              isPrimary
                                ? "border-fuchsia-500/50 ring-1 ring-fuchsia-500/30"
                                : "border-slate-800 hover:border-slate-700"
                            } rounded-3xl p-5 sm:p-6 flex flex-col justify-between text-left transition cursor-pointer group shadow-xl relative`}
                          >
                            {isPrimary && (
                              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 text-[9px] font-bold border border-fuchsia-500/30 uppercase tracking-widest">
                                Primary Focus
                              </span>
                            )}
                            <div className="flex justify-between items-start w-full">
                              <div className="bg-fuchsia-500/10 p-2.5 rounded-2xl text-fuchsia-400 border border-fuchsia-500/20 group-hover:scale-110 transition">
                                <CalendarCheck className="w-5 h-5" />
                              </div>
                              {!isPrimary && (
                                <span className="text-xs text-slate-400 font-semibold tracking-widest uppercase">EVENTS</span>
                              )}
                            </div>
                            <div className="my-3">
                              <h3 className="text-base sm:text-lg font-semibold text-white">Outdoor Gathering</h3>
                              <p className="text-xs text-slate-400 mt-1">7-Day Suitability</p>
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-mono font-bold text-fuchsia-400">88/100</span>
                              <span className="text-xs text-slate-400">Comfort Score</span>
                            </div>
                          </button>
                        ),
                      },
                      {
                        persona: "health" as PersonaType,
                        render: (isPrimary: boolean) => (
                          <button
                            key="health"
                            id="overview-health-card-btn"
                            onClick={() => setSelectedPersona("health")}
                            className={`bg-slate-900/40 hover:bg-slate-900/70 border ${
                              isPrimary
                                ? "border-emerald-500/50 ring-1 ring-emerald-500/30"
                                : "border-slate-800 hover:border-slate-700"
                            } rounded-3xl p-5 sm:p-6 flex flex-col justify-between text-left transition cursor-pointer group shadow-xl relative`}
                          >
                            {isPrimary && (
                              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30 uppercase tracking-widest">
                                Primary Focus
                              </span>
                            )}
                            <div className="flex justify-between items-start w-full">
                              <div className="bg-emerald-500/10 p-2.5 rounded-2xl text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition">
                                <HeartPulse className="w-5 h-5" />
                              </div>
                              {!isPrimary && (
                                <span className="text-xs text-slate-400 font-semibold tracking-widest uppercase">ALLERGIES</span>
                              )}
                            </div>
                            <div className="my-3">
                              <h3 className="text-base sm:text-lg font-semibold text-white">Pollen & Respiratory</h3>
                              <p className="text-xs text-slate-400 mt-1">Low Grass & Tree Pollen</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                              Low Asthma Risk Today
                            </div>
                          </button>
                        ),
                      },
                    ]
                      .filter((item) =>
                        userPreferences.personas.length > 0
                          ? userPreferences.personas.includes(item.persona)
                          : true
                      )
                      .sort((a, b) => getPersonaPriority(a.persona) - getPersonaPriority(b.persona))
                      .map((item) => {
                        const isPrimary = getPersonaPriority(item.persona) === 0;
                        return item.render(isPrimary);
                      })}
                  </div>
                </section>

                {/* 24-Hour Hourly Forecast */}
                <HourlyForecast weather={weatherData} settings={settings} weatherContext={unifiedWeatherContext} />

                {/* 7-Day Daily Forecast */}
                <DailyForecast weather={weatherData} settings={settings} weatherContext={unifiedWeatherContext} />

                {/* Live Doppler Radar & Map */}
                <WeatherRadarMap
                  weather={weatherData}
                  locationName={currentLocation.name}
                  settings={settings}
                />
              </>
            )}

            {selectedPersona === "health" && (
              <>
                <HealthDashboard
                  weather={weatherData}
                  settings={settings}
                  weatherContext={unifiedWeatherContext}
                  userPreferences={userPreferences}
                  onAskAI={handleAskAI}
                />
                <HourlyForecast weather={weatherData} settings={settings} weatherContext={unifiedWeatherContext} />
                <DailyForecast weather={weatherData} settings={settings} weatherContext={unifiedWeatherContext} />
              </>
            )}

            {selectedPersona === "fitness" && (
              <>
                <FitnessDashboard
                  weather={weatherData}
                  settings={settings}
                  onAskAI={handleAskAI}
                />
                <HourlyForecast weather={weatherData} settings={settings} weatherContext={unifiedWeatherContext} />
                <DailyForecast weather={weatherData} settings={settings} weatherContext={unifiedWeatherContext} />
              </>
            )}

            {selectedPersona === "beach" && (
              <>
                <BeachSurfDashboard
                  weather={weatherData}
                  settings={settings}
                  onAskAI={handleAskAI}
                />
                <HourlyForecast weather={weatherData} settings={settings} weatherContext={unifiedWeatherContext} />
                <WeatherRadarMap
                  weather={weatherData}
                  locationName={currentLocation.name}
                  settings={settings}
                />
              </>
            )}

            {selectedPersona === "travel" && (
              <>
                <TravelDashboard
                  weather={weatherData}
                  locationName={currentLocation.name}
                  savedLocations={savedLocations}
                  onSelectLocation={handleSelectLocation}
                  settings={settings}
                  onAskAI={handleAskAI}
                />
                <DailyForecast weather={weatherData} settings={settings} weatherContext={unifiedWeatherContext} />
              </>
            )}

            {selectedPersona === "parents" && (
              <>
                <ParentsDashboard
                  weather={weatherData}
                  settings={settings}
                  onAskAI={handleAskAI}
                />
                <HourlyForecast weather={weatherData} settings={settings} weatherContext={unifiedWeatherContext} />
                <DailyForecast weather={weatherData} settings={settings} weatherContext={unifiedWeatherContext} />
              </>
            )}

            {selectedPersona === "agriculture" && (
              <>
                <AgricultureDashboard
                  weather={weatherData}
                  settings={settings}
                  onAskAI={handleAskAI}
                />
                <DailyForecast weather={weatherData} settings={settings} weatherContext={unifiedWeatherContext} />
              </>
            )}

            {selectedPersona === "commute" && (
              <>
                <CommuterDashboard
                  weather={weatherData}
                  settings={settings}
                  onAskAI={handleAskAI}
                />
                <HourlyForecast weather={weatherData} settings={settings} weatherContext={unifiedWeatherContext} />
                <WeatherRadarMap
                  weather={weatherData}
                  locationName={currentLocation.name}
                  settings={settings}
                />
              </>
            )}

            {selectedPersona === "event" && (
              <>
                <EventPlannerDashboard
                  weather={weatherData}
                  settings={settings}
                  onAskAI={handleAskAI}
                />
                <HourlyForecast weather={weatherData} settings={settings} weatherContext={unifiedWeatherContext} />
                <DailyForecast weather={weatherData} settings={settings} weatherContext={unifiedWeatherContext} />
              </>
            )}
          </main>
        )}
      </div>

      {/* Floating Gemini AI Copilot Trigger Button */}
      <button
        id="floating-mausam-ai-btn"
        onClick={() => {
          setAiPersonaTrigger(selectedPersona);
          setAiCustomQuestion(undefined);
          setIsAIModalOpen(true);
        }}
        className="fixed bottom-5 right-5 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-purple-900/50 flex items-center gap-2 border border-white/20 transition-all hover:scale-105 cursor-pointer backdrop-blur-md"
        title="Open Mausam AI Assistant"
      >
        <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
        <span>Ask Mausam AI</span>
      </button>

      {/* Gemini AI Copilot Modal */}
      {weatherData && (
        <MausamAICopilot
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          weather={weatherData}
          locationName={currentLocation.name}
          weatherContext={unifiedWeatherContext}
          userPreferences={userPreferences}
          userProfile={userProfile}
          initialPersona={aiPersonaTrigger}
          initialQuestion={aiCustomQuestion}
        />
      )}

      {/* App Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newS) => setSettings(newS)}
        onOpenEditPreferences={() => {
          setIsEditPreferencesOpen(true);
        }}
      />

      {/* Location Search Modal */}
      <LocationSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectLocation={handleSelectLocation}
        savedLocations={savedLocations}
        onSaveLocation={handleSaveLocation}
        onRemoveLocation={handleRemoveLocation}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLocating={isLocating}
      />

      {/* Official Mausam Left Sidebar Navigation Drawer */}
      <MausamSidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        settings={settings}
        userProfile={userProfile}
        currentLocation={currentLocation}
        onOpenFeature={handleOpenSidebarFeature}
      />

      {/* 1. Login / User Profile Modal */}
      <LoginProfileModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentProfile={userProfile}
        onSaveProfile={handleUpdateProfile}
        onLogout={handleLogout}
        onOpenAuth={() => {
          setIsLoginModalOpen(false);
          setAppStage("auth");
        }}
        onOpenPerks={() => {
          setIsLoginModalOpen(false);
          setIsObserverPerksOpen(true);
        }}
      />

      {/* 1b. Observer Perks & Rewards System Modal (Quests, Leaderboards, Vault) */}
      <ObserverPerksModal
        isOpen={isObserverPerksOpen}
        onClose={() => setIsObserverPerksOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
        currentLocation={currentLocation}
        onOpenLogin={() => {
          setIsObserverPerksOpen(false);
          setAppStage("auth");
        }}
        onOpenCrowdsource={() => {
          setIsObserverPerksOpen(false);
          setIsCrowdsourceModalOpen(true);
        }}
        onOpenPersona={(p) => {
          setIsObserverPerksOpen(false);
          if (!userPreferences.personas.includes(p)) {
            const updated = {
              ...userPreferences,
              personas: [...userPreferences.personas, p],
            };
            setUserPreferences(updated);
            OfflineStorage.saveUserPreferences(updated);
          }
          setSelectedPersona(p);
        }}
      />

      {/* 2. Agromet Products Modal */}
      <AgrometModal
        isOpen={isAgrometModalOpen}
        onClose={() => setIsAgrometModalOpen(false)}
        weather={weatherData}
        location={currentLocation}
      />

      {/* 3. Aviation Products Modal */}
      <AviationModal
        isOpen={isAviationModalOpen}
        onClose={() => setIsAviationModalOpen(false)}
        location={currentLocation}
      />

      {/* 4. Crowd Source Observations Modal */}
      <CrowdsourceModal
        isOpen={isCrowdsourceModalOpen}
        onClose={() => setIsCrowdsourceModalOpen(false)}
        location={currentLocation}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
        onOpenPerks={() => setIsObserverPerksOpen(true)}
      />

      {/* 5. Cyclone Tracker & Warning Modal */}
      <CycloneModal
        isOpen={isCycloneModalOpen}
        onClose={() => setIsCycloneModalOpen(false)}
        location={currentLocation}
      />

      {/* 6. Lightning & Damini Nowcast Modal */}
      <LightningModal
        isOpen={isLightningModalOpen}
        onClose={() => setIsLightningModalOpen(false)}
        location={currentLocation}
      />

      {/* 7. Doppler Weather Radar Modal */}
      <RadarModal
        isOpen={isRadarModalOpen}
        onClose={() => setIsRadarModalOpen(false)}
        location={currentLocation}
      />

      {/* 8. Rain Alert & IMD Precipitation Matrix Modal */}
      <RainAlertModal
        isOpen={isRainAlertModalOpen}
        onClose={() => setIsRainAlertModalOpen(false)}
        weather={weatherData}
        location={currentLocation}
      />

      {/* 9. Route Now Cast Modal */}
      <RouteNowcastModal
        isOpen={isRouteNowcastModalOpen}
        onClose={() => setIsRouteNowcastModalOpen(false)}
        currentLocation={currentLocation}
      />

      {/* 9b. Disaster Alerts & Early Warning Modal (IMD & NDMA CAP SACHET) */}
      <DisasterAlertsModal
        isOpen={isDisasterAlertsModalOpen}
        onClose={() => setIsDisasterAlertsModalOpen(false)}
        location={currentLocation}
      />

      {/* 10. Language Selection Modal */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLanguage={settings.language || "en"}
        onSelectLanguage={handleUpdateLanguage}
      />

      {/* 11. Favourites Modal */}
      <FavouritesModal
        isOpen={isFavouritesModalOpen}
        onClose={() => setIsFavouritesModalOpen(false)}
        savedLocations={savedLocations}
        currentLocation={currentLocation}
        onSelectLocation={handleSelectLocation}
        onDeleteLocation={handleRemoveLocation}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* 12. Notification Subscriptions Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        settings={settings}
        onUpdateSettings={(newS) => {
          setSettings(newS);
          OfflineStorage.saveSettings(newS);
        }}
      />

      {/* 13. Share Weather Bulletin Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        weather={weatherData}
        location={currentLocation}
      />

      {/* 14. Rate App Modal */}
      <RateAppModal
        isOpen={isRateAppModalOpen}
        onClose={() => setIsRateAppModalOpen(false)}
      />

      {/* 15. FAQ Modal */}
      <FAQModal
        isOpen={isFAQModalOpen}
        onClose={() => setIsFAQModalOpen(false)}
      />

      {/* Personalization Setup / Edit Preferences Modal in Dashboard */}
      {isEditPreferencesOpen && (
        <PersonalizationSetup
          initialPreferences={userPreferences}
          onSave={handleSaveEditPreferences}
          isEditMode={true}
          onClose={() => setIsEditPreferencesOpen(false)}
        />
      )}
    </div>
  );
}

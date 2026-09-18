import {
  AggregatedWeatherData,
  GeoLocation,
  AppSettings,
  UserProfile,
  CrowdsourceObservation,
  UserPreferences,
  DailyPerksState,
  PerkQuest,
  PerkReward,
  PerkRankUser,
} from "../types";

const STORAGE_KEYS = {
  SETTINGS: "mausam_app_settings",
  SAVED_LOCATIONS: "mausam_saved_locations",
  ACTIVE_LOCATION: "mausam_active_location",
  WEATHER_CACHE_PREFIX: "mausam_weather_cache_",
  PACKING_ITEMS: "mausam_packing_items",
  USER_PROFILE: "mausam_user_profile",
  USER_ACCOUNTS: "mausam_user_accounts",
  CROWDSOURCE_OBSERVATIONS: "mausam_crowdsource_obs",
  USER_PREFERENCES: "mausam_user_preferences",
  ONBOARDING_COMPLETED: "mausam_onboarding_completed",
  PERKS_STATE: "mausam_perks_state",
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  personas: ["health", "fitness", "commute"],
  healthNote: "none",
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: "Guest Observer",
  emailOrPhone: "",
  state: "Delhi",
  district: "New Delhi",
  role: "Guest",
  avatar: "🇮🇳",
  isLoggedIn: false,
  points: 0,
};

export const DEFAULT_SETTINGS: AppSettings = {
  tempUnit: "celsius",
  windUnit: "kmh",
  precipUnit: "mm",
  pressureUnit: "hpa",
  timeFormat: "12h",
  theme: "weather",
  autoRefreshInterval: 15,
  enableAlerts: true,
  activePersona: "all",
  language: "en",
  userProfile: DEFAULT_USER_PROFILE,
};

export const DEFAULT_LOCATIONS: GeoLocation[] = [
  {
    id: 1275339,
    name: "Mumbai",
    country: "India",
    admin1: "Maharashtra",
    latitude: 19.076,
    longitude: 72.8777,
    timezone: "Asia/Kolkata",
  },
  {
    id: 1261481,
    name: "New Delhi",
    country: "India",
    admin1: "Delhi",
    latitude: 28.6139,
    longitude: 77.209,
    timezone: "Asia/Kolkata",
  },
  {
    id: 2643743,
    name: "London",
    country: "United Kingdom",
    admin1: "England",
    latitude: 51.5085,
    longitude: -0.1257,
    timezone: "Europe/London",
  },
  {
    id: 5128581,
    name: "New York",
    country: "United States",
    admin1: "New York",
    latitude: 40.7128,
    longitude: -74.006,
    timezone: "America/New_York",
  },
  {
    id: 1850147,
    name: "Tokyo",
    country: "Japan",
    admin1: "Tokyo",
    latitude: 35.6895,
    longitude: 139.6917,
    timezone: "Asia/Tokyo",
  },
  {
    id: 2988507,
    name: "Paris",
    country: "France",
    admin1: "Île-de-France",
    latitude: 48.8534,
    longitude: 2.3488,
    timezone: "Europe/Paris",
  },
  {
    id: 292223,
    name: "Dubai",
    country: "United Arab Emirates",
    admin1: "Dubai",
    latitude: 25.2048,
    longitude: 55.2708,
    timezone: "Asia/Dubai",
  },
  {
    id: 2147714,
    name: "Sydney",
    country: "Australia",
    admin1: "New South Wales",
    latitude: -33.8688,
    longitude: 151.2093,
    timezone: "Australia/Sydney",
  },
];

// Offline Cache Manager
export const OfflineStorage = {
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn("Failed to persist settings:", e);
    }
  },

  getSavedLocations(): GeoLocation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_LOCATIONS);
      return data ? JSON.parse(data) : DEFAULT_LOCATIONS;
    } catch {
      return DEFAULT_LOCATIONS;
    }
  },

  saveLocations(locations: GeoLocation[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_LOCATIONS, JSON.stringify(locations));
    } catch (e) {
      console.warn("Failed to persist locations:", e);
    }
  },

  getActiveLocation(): GeoLocation {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_LOCATION);
      return data ? JSON.parse(data) : DEFAULT_LOCATIONS[0];
    } catch {
      return DEFAULT_LOCATIONS[0];
    }
  },

  saveActiveLocation(location: GeoLocation): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_LOCATION, JSON.stringify(location));
    } catch (e) {
      console.warn("Failed to persist active location:", e);
    }
  },

  getCachedWeather(lat: number, lon: number): AggregatedWeatherData | null {
    try {
      const key = `${STORAGE_KEYS.WEATHER_CACHE_PREFIX}${lat.toFixed(3)}_${lon.toFixed(3)}`;
      const data = localStorage.getItem(key);
      if (!data) return null;
      const parsed = JSON.parse(data);
      return parsed;
    } catch {
      return null;
    }
  },

  setCachedWeather(lat: number, lon: number, weather: AggregatedWeatherData): void {
    try {
      const key = `${STORAGE_KEYS.WEATHER_CACHE_PREFIX}${lat.toFixed(3)}_${lon.toFixed(3)}`;
      localStorage.setItem(
        key,
        JSON.stringify({
          ...weather,
          _cachedAt: Date.now(),
        })
      );
    } catch (e) {
      console.warn("Failed to cache weather:", e);
    }
  },

  getPackingItems(): any[] | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PACKING_ITEMS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  savePackingItems(items: any[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PACKING_ITEMS, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to persist packing items:", e);
    }
  },

  clearWeatherCache(): void {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(STORAGE_KEYS.WEATHER_CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn("Failed to clear weather cache:", e);
    }
  },

  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  },

  saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn("Failed to persist user profile:", e);
    }
  },

  getCrowdsourceObservations(): CrowdsourceObservation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CROWDSOURCE_OBSERVATIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn("Failed to parse crowdsource obs:", e);
    }
    return [
      {
        id: "cs-1",
        timestamp: "10 mins ago",
        locationName: "Connaught Place, New Delhi",
        category: "Clear & Sunny",
        intensity: "Low",
        description: "Bright sunny sky with light breeze. Ground visibility is excellent.",
        reporterName: "Rajesh S. (Citizen)",
        verified: true,
        upvotes: 24,
      },
      {
        id: "cs-2",
        timestamp: "25 mins ago",
        locationName: "Andheri West, Mumbai",
        category: "Light Rain",
        intensity: "Moderate",
        description: "Passing localized light drizzle near railway station. Wet roads.",
        reporterName: "Pooja V. (Observer)",
        verified: true,
        upvotes: 41,
      },
      {
        id: "cs-3",
        timestamp: "1 hour ago",
        locationName: "Electronic City, Bengaluru",
        category: "Dense Fog",
        intensity: "Moderate",
        description: "Overcast cloud cover and misty breeze, pleasant 22°C.",
        reporterName: "Anand M. (Citizen)",
        verified: true,
        upvotes: 18,
      },
    ];
  },

  saveCrowdsourceObservations(observations: CrowdsourceObservation[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CROWDSOURCE_OBSERVATIONS, JSON.stringify(observations));
    } catch (e) {
      console.warn("Failed to persist crowdsource obs:", e);
    }
  },

  getUserPreferences(): UserPreferences {
    try {
      const data =
        sessionStorage.getItem(STORAGE_KEYS.USER_PREFERENCES) ||
        sessionStorage.getItem("userPreferences");
      if (!data) return DEFAULT_USER_PREFERENCES;
      const parsed = JSON.parse(data);
      let healthNote = parsed.healthNote || "none";
      if (!parsed.healthNote && Array.isArray(parsed.healthConsiderations)) {
        const first = parsed.healthConsiderations.find((h: string) => h !== "None");
        if (first === "Asthma") healthNote = "asthma";
        else if (first === "Allergies") healthNote = "allergies";
        else if (first === "Skin Sensitivity") healthNote = "skin_sensitivity";
        else healthNote = "none";
      }
      return {
        personas: parsed.personas || DEFAULT_USER_PREFERENCES.personas,
        healthNote,
      };
    } catch {
      return DEFAULT_USER_PREFERENCES;
    }
  },

  saveUserPreferences(preferences: UserPreferences): void {
    try {
      const json = JSON.stringify(preferences);
      sessionStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, json);
      sessionStorage.setItem("userPreferences", json);
    } catch (e) {
      console.warn("Failed to persist user preferences to session:", e);
    }
  },

  hasCompletedOnboarding(): boolean {
    try {
      return (
        sessionStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED) === "true" ||
        sessionStorage.getItem("personalizationCompleted") === "true" ||
        sessionStorage.getItem("onboardingCompleted") === "true"
      );
    } catch {
      return false;
    }
  },

  setOnboardingCompleted(): void {
    try {
      sessionStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, "true");
      sessionStorage.setItem("personalizationCompleted", "true");
      sessionStorage.setItem("onboardingCompleted", "true");
    } catch (e) {
      console.warn("Failed to persist onboarding status to session:", e);
    }
  },

  // User Accounts Store (Persistent accounts & their individual perks history)
  getUserAccounts(): Record<string, { profile: UserProfile; perksState: DailyPerksState }> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_ACCOUNTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn("Failed to read user accounts:", e);
    }
    // Default seeded demo account
    const demoAccount = {
      profile: {
        name: "Aarav Sharma",
        emailOrPhone: "demo@mausam.imd.gov.in",
        state: "Delhi",
        district: "New Delhi",
        role: "Citizen" as const,
        avatar: "🇮🇳",
        isLoggedIn: true,
        memberSince: "August 2026",
        points: 420,
      },
      perksState: DEFAULT_PERKS_STATE,
    };
    return {
      "demo@mausam.imd.gov.in": demoAccount,
      demo: demoAccount,
    };
  },

  saveUserAccounts(accounts: Record<string, { profile: UserProfile; perksState: DailyPerksState }>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_ACCOUNTS, JSON.stringify(accounts));
    } catch (e) {
      console.warn("Failed to persist user accounts:", e);
    }
  },

  getUserAccount(emailOrPhone: string): { profile: UserProfile; perksState: DailyPerksState } | null {
    const key = emailOrPhone.trim().toLowerCase();
    const accounts = this.getUserAccounts();
    return accounts[key] || null;
  },

  loginUserAccount(
    emailOrPhone: string,
    fallbackProfile?: Partial<UserProfile>
  ): { profile: UserProfile; perksState: DailyPerksState } {
    const key = emailOrPhone.trim().toLowerCase();
    const accounts = this.getUserAccounts();
    let account = accounts[key];

    if (!account) {
      // Create new account entry if logging in first time
      const name =
        fallbackProfile?.name ||
        (key.includes("@")
          ? key.split("@")[0].charAt(0).toUpperCase() +
            key.split("@")[0].slice(1).replace(/[._]/g, " ")
          : "Citizen Observer");

      const startingPoints = key.includes("demo") ? 420 : 250;
      const initialProfile: UserProfile = {
        name,
        emailOrPhone: key,
        state: fallbackProfile?.state || "Delhi",
        district: fallbackProfile?.district || "New Delhi",
        role: fallbackProfile?.role || "Citizen",
        avatar: fallbackProfile?.avatar || "🇮🇳",
        isLoggedIn: true,
        memberSince: "August 2026",
        points: startingPoints,
      };

      const initialPerksState: DailyPerksState = {
        streakDays: 1,
        lastCheckInDate: new Date().toISOString().split("T")[0],
        completedQuestIds: ["quest_forecast"],
        redeemedRewardIds: [],
        history: [
          {
            id: `hist-welcome-${Date.now()}`,
            title: "Welcome Observer Bonus",
            points: startingPoints,
            timestamp: "Just now",
            type: "earn",
          },
        ],
      };

      account = { profile: initialProfile, perksState: initialPerksState };
      accounts[key] = account;
      this.saveUserAccounts(accounts);
    } else {
      // Update login status
      account.profile = { ...account.profile, isLoggedIn: true };
      accounts[key] = account;
      this.saveUserAccounts(accounts);
    }

    // Set as active session
    this.saveUserProfile(account.profile);
    this.savePerksState(account.perksState);

    return account;
  },

  registerUserAccount(newProfile: UserProfile): { profile: UserProfile; perksState: DailyPerksState } {
    const key = (newProfile.emailOrPhone || newProfile.name).trim().toLowerCase();
    const accounts = this.getUserAccounts();

    const initialPerksState: DailyPerksState = {
      streakDays: 1,
      lastCheckInDate: new Date().toISOString().split("T")[0],
      completedQuestIds: [],
      redeemedRewardIds: [],
      history: [
        {
          id: `hist-reg-${Date.now()}`,
          title: "New Observer Registration Bonus",
          points: newProfile.points ?? 150,
          timestamp: "Just now",
          type: "earn",
        },
      ],
    };

    const registeredProfile: UserProfile = {
      ...newProfile,
      isLoggedIn: true,
    };

    const account = { profile: registeredProfile, perksState: initialPerksState };
    accounts[key] = account;
    this.saveUserAccounts(accounts);

    // Set as active session
    this.saveUserProfile(registeredProfile);
    this.savePerksState(initialPerksState);

    return account;
  },

  logoutUser(): UserProfile {
    const guest: UserProfile = {
      name: "Guest Observer",
      emailOrPhone: "",
      state: "Delhi",
      district: "New Delhi",
      role: "Guest",
      avatar: "🇮🇳",
      isLoggedIn: false,
      points: 0,
    };
    this.saveUserProfile(guest);
    return guest;
  },

  getPerksState(userProfile?: UserProfile): DailyPerksState {
    const profile = userProfile || this.getUserProfile();
    if (!profile.isLoggedIn || !profile.emailOrPhone) {
      return GUEST_PERKS_STATE;
    }

    try {
      const key = profile.emailOrPhone.trim().toLowerCase();
      const accounts = this.getUserAccounts();
      if (accounts[key]?.perksState) {
        return accounts[key].perksState;
      }
      const data = localStorage.getItem(STORAGE_KEYS.PERKS_STATE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn("Failed to read perks state:", e);
    }
    return DEFAULT_PERKS_STATE;
  },

  savePerksState(state: DailyPerksState, userProfile?: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PERKS_STATE, JSON.stringify(state));
      const profile = userProfile || this.getUserProfile();
      if (profile.isLoggedIn && profile.emailOrPhone) {
        const key = profile.emailOrPhone.trim().toLowerCase();
        const accounts = this.getUserAccounts();
        if (accounts[key]) {
          accounts[key].perksState = state;
          this.saveUserAccounts(accounts);
        }
      }
    } catch (e) {
      console.warn("Failed to persist perks state:", e);
    }
  },

  awardPerkPoints(
    amount: number,
    reason: string,
    passedProfile?: UserProfile
  ): { success: boolean; newTotal: number; state: DailyPerksState; error?: string } {
    const profile = passedProfile || this.getUserProfile();
    
    // CRITICAL: Perks can ONLY be collected by authenticated users
    if (!profile.isLoggedIn) {
      return {
        success: false,
        newTotal: 0,
        state: GUEST_PERKS_STATE,
        error: "Sign in required to earn Observer Perks.",
      };
    }

    const currentPoints = profile.points ?? 0;
    const newTotal = currentPoints + amount;
    
    // Update profile
    const updatedProfile: UserProfile = {
      ...profile,
      points: newTotal,
    };
    this.saveUserProfile(updatedProfile);

    // Update perks state history
    const state = this.getPerksState(profile);
    const newHistoryItem = {
      id: `hist-${Date.now()}`,
      title: reason,
      points: amount,
      timestamp: "Just now",
      type: "earn" as const,
    };
    const updatedState: DailyPerksState = {
      ...state,
      history: [newHistoryItem, ...(state.history || []).slice(0, 24)],
    };
    this.savePerksState(updatedState, updatedProfile);

    // Sync to user account record
    if (updatedProfile.emailOrPhone) {
      const key = updatedProfile.emailOrPhone.trim().toLowerCase();
      const accounts = this.getUserAccounts();
      if (accounts[key]) {
        accounts[key].profile = updatedProfile;
        accounts[key].perksState = updatedState;
        this.saveUserAccounts(accounts);
      }
    }

    return { success: true, newTotal, state: updatedState };
  },

  redeemPerkReward(
    reward: PerkReward,
    passedProfile?: UserProfile
  ): { success: boolean; newTotal: number; state: DailyPerksState; error?: string } {
    const profile = passedProfile || this.getUserProfile();

    if (!profile.isLoggedIn) {
      return {
        success: false,
        newTotal: 0,
        state: GUEST_PERKS_STATE,
        error: "Sign in required to redeem rewards.",
      };
    }

    const currentPoints = profile.points ?? 0;
    const state = this.getPerksState(profile);

    if (currentPoints < reward.costPoints) {
      return {
        success: false,
        newTotal: currentPoints,
        state,
        error: `Insufficient balance: you need ${reward.costPoints - currentPoints} more Perks.`,
      };
    }

    const newTotal = currentPoints - reward.costPoints;
    const updatedProfile: UserProfile = {
      ...profile,
      points: newTotal,
    };
    this.saveUserProfile(updatedProfile);

    const redeemedIds = Array.from(new Set([...(state.redeemedRewardIds || []), reward.id]));
    const newHistoryItem = {
      id: `redeem-${Date.now()}`,
      title: `Redeemed: ${reward.title}`,
      points: -reward.costPoints,
      timestamp: "Just now",
      type: "redeem" as const,
    };

    const updatedState: DailyPerksState = {
      ...state,
      redeemedRewardIds: redeemedIds,
      history: [newHistoryItem, ...(state.history || []).slice(0, 24)],
    };
    this.savePerksState(updatedState, updatedProfile);

    // Sync to user account record
    if (updatedProfile.emailOrPhone) {
      const key = updatedProfile.emailOrPhone.trim().toLowerCase();
      const accounts = this.getUserAccounts();
      if (accounts[key]) {
        accounts[key].profile = updatedProfile;
        accounts[key].perksState = updatedState;
        this.saveUserAccounts(accounts);
      }
    }

    return { success: true, newTotal, state: updatedState };
  },
};

// Perks level calculation helper
export const getPerkLevelInfo = (points: number = 0) => {
  if (points >= 2500) {
    return {
      level: 5 as const,
      title: "Chief Grand Observer",
      badge: "👑",
      nextTierPoints: 5000,
      prevTierPoints: 2500,
      progressPct: Math.min(100, Math.round(((points - 2500) / 2500) * 100)),
      color: "from-amber-500 to-yellow-300",
      textColor: "text-amber-300",
      borderColor: "border-amber-400/50",
      multiplier: "3.0x",
    };
  }
  if (points >= 1200) {
    return {
      level: 4 as const,
      title: "Atmospheric Maestro",
      badge: "⚡",
      nextTierPoints: 2500,
      prevTierPoints: 1200,
      progressPct: Math.min(100, Math.round(((points - 1200) / 1300) * 100)),
      color: "from-purple-500 to-indigo-400",
      textColor: "text-purple-300",
      borderColor: "border-purple-400/50",
      multiplier: "2.5x",
    };
  }
  if (points >= 600) {
    return {
      level: 3 as const,
      title: "Meteorology Scout",
      badge: "🛰️",
      nextTierPoints: 1200,
      prevTierPoints: 600,
      progressPct: Math.min(100, Math.round(((points - 600) / 600) * 100)),
      color: "from-sky-500 to-teal-400",
      textColor: "text-sky-300",
      borderColor: "border-sky-400/50",
      multiplier: "2.0x",
    };
  }
  if (points >= 250) {
    return {
      level: 2 as const,
      title: "Field Observer",
      badge: "🌦️",
      nextTierPoints: 600,
      prevTierPoints: 250,
      progressPct: Math.min(100, Math.round(((points - 250) / 350) * 100)),
      color: "from-emerald-500 to-cyan-400",
      textColor: "text-emerald-300",
      borderColor: "border-emerald-400/50",
      multiplier: "1.5x",
    };
  }
  return {
    level: 1 as const,
    title: "Novice Scout",
    badge: "🌱",
    nextTierPoints: 250,
    prevTierPoints: 0,
    progressPct: Math.min(100, Math.round((points / 250) * 100)),
    color: "from-slate-500 to-slate-300",
    textColor: "text-slate-300",
    borderColor: "border-slate-400/30",
    multiplier: "1.0x",
  };
};

export const GUEST_PERKS_STATE: DailyPerksState = {
  streakDays: 0,
  lastCheckInDate: "",
  completedQuestIds: [],
  redeemedRewardIds: [],
  history: [],
};

export const DEFAULT_PERKS_STATE: DailyPerksState = {
  streakDays: 3,
  lastCheckInDate: new Date().toISOString().split("T")[0],
  completedQuestIds: ["quest_forecast"],
  redeemedRewardIds: ["reward_badge_scout"],
  history: [
    {
      id: "hist-1",
      title: "Daily Check-in Streak (Day 3)",
      points: 25,
      timestamp: "Today, 08:30 AM",
      type: "earn",
    },
    {
      id: "hist-2",
      title: "Morning Weather Briefing Explored",
      points: 15,
      timestamp: "Today, 08:35 AM",
      type: "earn",
    },
    {
      id: "hist-3",
      title: "Citizen Ground Truth Onboarding",
      points: 200,
      timestamp: "Yesterday",
      type: "earn",
    },
  ],
};

export const DEFAULT_PERKS_QUESTS: PerkQuest[] = [
  {
    id: "quest_checkin",
    title: "Daily Observer Check-in",
    description: "Check in daily to build your activity streak & claim bonus multiplier.",
    points: 25,
    icon: "CalendarCheck",
    category: "daily",
    isCompleted: false,
    actionLabel: "Claim +25",
    actionType: "checkin",
  },
  {
    id: "quest_forecast",
    title: "Morning Weather Briefing",
    description: "Scan hourly forecast, precipitation probability & 7-day outlook.",
    points: 15,
    icon: "CloudSun",
    category: "daily",
    isCompleted: true,
    actionLabel: "Completed",
    actionType: "forecast",
  },
  {
    id: "quest_crowdsource",
    title: "Citizen Ground Truth Report",
    description: "Submit a localized weather observation or rainfall report in Crowdsource.",
    points: 50,
    icon: "Users",
    category: "crowdsource",
    isCompleted: false,
    actionLabel: "Report Weather (+50)",
    actionType: "crowdsource",
  },
  {
    id: "quest_radar",
    title: "Doppler Radar & Satellite Scan",
    description: "Inspect live Doppler reflectivity or storm cloud motion layers.",
    points: 20,
    icon: "Radio",
    category: "exploration",
    isCompleted: false,
    actionLabel: "Scan Radar (+20)",
    actionType: "radar",
  },
  {
    id: "quest_persona",
    title: "Specialized Persona Deep Dive",
    description: "Switch to Health, Farming, Marine, or Commuter weather dashboards.",
    points: 15,
    icon: "Sparkles",
    category: "exploration",
    isCompleted: false,
    actionLabel: "Explore Persona (+15)",
    actionType: "persona",
  },
  {
    id: "quest_ai",
    title: "Mausam AI Meteorology Query",
    description: "Ask the AI Weather Copilot for tailored guidance or atmospheric analysis.",
    points: 25,
    icon: "Bot",
    category: "exploration",
    isCompleted: false,
    actionLabel: "Ask Copilot (+25)",
    actionType: "ai",
  },
  {
    id: "quest_share",
    title: "Weather Alert Vigilance Broadcast",
    description: "Share live weather nowcast or severe alert bulletin with friends or family.",
    points: 20,
    icon: "Share2",
    category: "daily",
    isCompleted: false,
    actionLabel: "Share Bulletin (+20)",
    actionType: "share",
  },
  {
    id: "quest_quiz",
    title: "Daily Meteorological Science Trivia",
    description: "Test your atmospheric knowledge with today's 1-question science quiz.",
    points: 30,
    icon: "HelpCircle",
    category: "quiz",
    isCompleted: false,
    actionLabel: "Take Trivia (+30)",
    actionType: "quiz",
  },
];

export const DEFAULT_PERKS_REWARDS: PerkReward[] = [
  {
    id: "reward_badge_scout",
    title: "Verified IMD Citizen Scout Badge",
    subtitle: "Digital verified observer badge on your profile & crowdsource reports",
    category: "badge",
    costPoints: 100,
    icon: "ShieldCheck",
    badgeLabel: "Scout Verified",
    isUnlocked: true,
    code: "IMD-SCOUT-2026",
    unlockedAt: "Active",
    description: "Grants a distinguished emerald verification badge beside your name across all citizen science weather feeds.",
  },
  {
    id: "reward_cert_observer",
    title: "National Weather Observer E-Certificate",
    subtitle: "Official printable certificate of recognition with IMD seal & your name",
    category: "certificate",
    costPoints: 250,
    icon: "Award",
    badgeLabel: "Official E-Cert",
    isUnlocked: false,
    code: "CERT-IMD-NWS-4821",
    description: "Download and print your personalized National Weather Service Certificate of Contribution endorsed by IMD Citizen Science Directorate.",
  },
  {
    id: "reward_radar_theme",
    title: "Doppler Pro High-Res Radar Skin",
    subtitle: "Unlock dual-polarization reflectivity palette & velocity vector layers",
    category: "feature",
    costPoints: 400,
    icon: "Radio",
    badgeLabel: "Pro Layer",
    isUnlocked: false,
    code: "RADAR-PRO-NEXRAD",
    description: "Enhances your Weather Radar map with meteorological dual-polarization color scales and 15-minute predictive cloud vectors.",
  },
  {
    id: "reward_priority_alerts",
    title: "Priority Severe Storm Nowcast Alerts",
    subtitle: "Instant early-warning push notifications 30 minutes ahead of thunderstorm cells",
    category: "feature",
    costPoints: 600,
    icon: "Zap",
    badgeLabel: "Storm Priority",
    isUnlocked: false,
    code: "NOWCAST-TURBO-VIP",
    description: "Get prioritized direct alerts for lightning strikes within 15km radius and severe cloudburst warnings.",
  },
  {
    id: "reward_copilot_turbo",
    title: "AI Copilot Unlimited Deep Turbo Pass",
    subtitle: "Unlimited multi-model deep synthesis queries with advanced radar vision",
    category: "feature",
    costPoints: 800,
    icon: "Sparkles",
    badgeLabel: "Turbo Copilot",
    isUnlocked: false,
    code: "GEMINI-PRO-WEATHER",
    description: "Unlocks high-speed reasoning mode for complex agricultural, aviation, and disaster planning queries.",
  },
  {
    id: "reward_plant_tree",
    title: "Green India Climate Action: Plant 1 Tree",
    subtitle: "Mausam plants an indigenous sapling in your name with GPS tracking certificate",
    category: "eco",
    costPoints: 1200,
    icon: "Sprout",
    badgeLabel: "Eco Champion",
    isUnlocked: false,
    code: "ECO-TREE-GEO-893",
    description: "Contribute to Indian afforestation. A native tree is planted in the Western Ghats / Aravallis with an official Geo-tagged e-certificate.",
  },
  {
    id: "reward_merch_pin",
    title: "Official IMD Mausam Lapel Pin & Cap Voucher",
    subtitle: "Exclusive physical souvenir voucher redeemable at IMD Observatories & Events",
    category: "merchandise",
    costPoints: 2500,
    icon: "Gift",
    badgeLabel: "Physical Souvenir",
    isUnlocked: false,
    code: "IMD-PIN-SOUVENIR-2026",
    description: "Commemorative brass enamel IMD Mausam emblem pin and weather observer cap voucher for top-tier national observers.",
  },
];

export const MOCK_NATIONAL_LEADERBOARD: PerkRankUser[] = [
  {
    rank: 1,
    name: "Dr. Vikram K. Sen",
    district: "Pune",
    state: "Maharashtra",
    points: 4820,
    levelTitle: "Chief Grand Observer",
    avatar: "👩‍🔬",
    verified: true,
    trend: "same",
  },
  {
    rank: 2,
    name: "Meera Subramanian",
    district: "Chennai",
    state: "Tamil Nadu",
    points: 4390,
    levelTitle: "Chief Grand Observer",
    avatar: "🌾",
    verified: true,
    trend: "up",
  },
  {
    rank: 3,
    name: "Col. Rajesh Rathore",
    district: "Dehradun",
    state: "Uttarakhand",
    points: 3950,
    levelTitle: "Chief Grand Observer",
    avatar: "🧭",
    verified: true,
    trend: "up",
  },
  {
    rank: 4,
    name: "Ananya Deshmukh",
    district: "Nagpur",
    state: "Maharashtra",
    points: 3410,
    levelTitle: "Atmospheric Maestro",
    avatar: "🌦️",
    verified: true,
    trend: "down",
  },
  {
    rank: 5,
    name: "Harpreet Singh",
    district: "Amritsar",
    state: "Punjab",
    points: 2980,
    levelTitle: "Atmospheric Maestro",
    avatar: "🚜",
    verified: true,
    trend: "up",
  },
  {
    rank: 6,
    name: "Siddharth Nambiar",
    district: "Kochi",
    state: "Kerala",
    points: 2650,
    levelTitle: "Atmospheric Maestro",
    avatar: "🌊",
    verified: true,
    trend: "same",
  },
  {
    rank: 7,
    name: "Tsering Norbu",
    district: "Leh",
    state: "Ladakh",
    points: 2410,
    levelTitle: "Atmospheric Maestro",
    avatar: "🏔️",
    verified: true,
    trend: "up",
  },
  {
    rank: 8,
    name: "Deepak Choudhury",
    district: "Guwahati",
    state: "Assam",
    points: 1980,
    levelTitle: "Meteorology Scout",
    avatar: "⚡",
    verified: true,
    trend: "same",
  },
  {
    rank: 9,
    name: "Sunita Roy",
    district: "Kolkata",
    state: "West Bengal",
    points: 1740,
    levelTitle: "Meteorology Scout",
    avatar: "🌲",
    verified: true,
    trend: "down",
  },
  {
    rank: 10,
    name: "Aarav Sharma",
    district: "New Delhi",
    state: "Delhi",
    points: 1420,
    levelTitle: "Atmospheric Maestro",
    avatar: "🇮🇳",
    verified: true,
    trend: "up",
  },
];

// Ensure legacy permanent localStorage onboarding keys are cleaned up
try {
  localStorage.removeItem("mausam_onboarding_completed");
  localStorage.removeItem("onboardingCompleted");
} catch {
  // Ignore
}


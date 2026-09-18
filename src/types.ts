export type PersonaType =
  | "all"
  | "health"
  | "fitness"
  | "beach"
  | "travel"
  | "parents"
  | "agriculture"
  | "commute"
  | "event";

export interface GeoLocation {
  id?: number;
  name: string;
  country?: string;
  admin1?: string; // State / Region
  latitude: number;
  longitude: number;
  timezone?: string;
  isCurrentLocation?: boolean;
}

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  dew_point_2m?: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  rain: number[];
  showers: number[];
  snowfall: number[];
  weather_code: number[];
  pressure_msl: number[];
  surface_pressure?: number[];
  cloud_cover: number[];
  visibility: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
  wind_gusts_10m: number[];
  uv_index: number[];
  is_day: number[];
  soil_temperature_0cm?: number[];
  soil_moisture_0_to_1cm?: number[];
  soil_moisture_1_to_3cm?: number[];
  soil_moisture_3_to_9cm?: number[];
  et0_fao_evapotranspiration?: number[];
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  daylight_duration?: number[];
  sunshine_duration?: number[];
  uv_index_max: number[];
  uv_index_clear_sky_max?: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  showers_sum: number[];
  snowfall_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  wind_direction_10m_dominant: number[];
  et0_fao_evapotranspiration?: number[];
}

export interface AirQualityData {
  current?: {
    european_aqi?: number;
    us_aqi?: number;
    pm10?: number;
    pm2_5?: number;
    carbon_monoxide?: number;
    nitrogen_dioxide?: number;
    sulphur_dioxide?: number;
    ozone?: number;
    dust?: number;
    uv_index?: number;
  };
  hourly?: {
    time: string[];
    pm10: number[];
    pm2_5: number[];
    carbon_monoxide?: number[];
    nitrogen_dioxide?: number[];
    sulphur_dioxide?: number[];
    ozone?: number[];
    dust?: number[];
    uv_index?: number[];
    alder_pollen?: number[];
    birch_pollen?: number[];
    grass_pollen?: number[];
    mugwort_pollen?: number[];
    olive_pollen?: number[];
    ragweed_pollen?: number[];
    us_aqi?: number[];
    european_aqi?: number[];
  };
}

export interface MarineData {
  hourly?: {
    time: string[];
    wave_height?: number[];
    wave_direction?: number[];
    wave_period?: number[];
    wind_wave_height?: number[];
    wind_wave_direction?: number[];
    wind_wave_period?: number[];
    swell_wave_height?: number[];
    swell_wave_direction?: number[];
    swell_wave_period?: number[];
    ocean_current_velocity?: number[];
    ocean_current_direction?: number[];
    sea_surface_temperature?: number[];
  };
  daily?: {
    time: string[];
    wave_height_max?: number[];
    wave_direction_dominant?: number[];
    wave_period_max?: number[];
    wind_wave_height_max?: number[];
    swell_wave_height_max?: number[];
  };
}

export interface AggregatedWeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  elevation?: number;
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
  air_quality?: AirQualityData | null;
  marine?: MarineData | null;
  fetchedAt: string;
  _cached?: boolean;
  _cachedAt?: number;
}

export type UnitTemperature = "celsius" | "fahrenheit";
export type UnitWind = "kmh" | "mph" | "ms" | "knots";
export type UnitPrecipitation = "mm" | "inch";
export type UnitPressure = "hpa" | "inHg" | "mmHg";
export type ThemeMode = "system" | "light" | "dark" | "oled" | "weather";
export type AppLanguage = "en" | "hi" | "bn" | "ta" | "te" | "mr" | "gu";

export interface UserProfile {
  name: string;
  emailOrPhone: string;
  state: string;
  district: string;
  role: "Citizen" | "Farmer" | "Pilot" | "Disaster Manager" | "Scientist" | "Guest";
  avatar: string;
  isLoggedIn: boolean;
  memberSince?: string;
  points?: number;
}

export interface AppSettings {
  tempUnit: UnitTemperature;
  windUnit: UnitWind;
  precipUnit: UnitPrecipitation;
  pressureUnit: UnitPressure;
  timeFormat: "12h" | "24h";
  theme: ThemeMode;
  autoRefreshInterval: number; // in minutes
  enableAlerts: boolean;
  activePersona: PersonaType;
  language: AppLanguage;
  userProfile?: UserProfile;
}

export type HealthNote =
  | "none"
  | "asthma"
  | "skin_sensitivity"
  | "allergies"
  | "heart_condition"
  | "other";

export interface UserPreferences {
  personas: PersonaType[];
  healthNote: HealthNote;
}

export interface CrowdsourceObservation {
  id: string;
  timestamp: string;
  locationName: string;
  category: "Light Rain" | "Heavy Rain" | "Thunderstorm" | "Hailstorm" | "Dense Fog" | "Waterlogging" | "Strong Wind" | "Clear & Sunny";
  intensity: "Low" | "Moderate" | "Severe";
  description: string;
  reporterName: string;
  verified: boolean;
  upvotes: number;
}

export interface AviationAirport {
  icao: string;
  iata: string;
  name: string;
  city: string;
  state: string;
  elevationFt: number;
  metarRaw: string;
  flightCategory: "VFR" | "MVFR" | "IFR" | "LIFR";
  tempC: number;
  dewPointC: number;
  windDirDeg: number;
  windSpeedKt: number;
  windGustsKt?: number;
  visibilitySm: number;
  rvrMeters?: number;
  altimeterHpa: number;
  cloudCeilingFt: number;
  crosswindKt: number;
  hazards: string[];
}

export interface CycloneTrackPoint {
  time: string;
  lat: number;
  lon: number;
  intensity: string;
  maxWindKmh: number;
  pressureHpa: number;
  status: "Past" | "Current" | "Forecast";
}

export interface CycloneAdvisory {
  id: string;
  name: string;
  basin: "Bay of Bengal" | "Arabian Sea";
  category: "Depression" | "Deep Depression" | "Cyclonic Storm" | "Severe Cyclonic Storm" | "Very Severe Cyclonic Storm" | "Extremely Severe Cyclonic Storm" | "Super Cyclone";
  centralPressureHpa: number;
  maxSustainedWindsKmh: number;
  gustsKmh: number;
  movementDir: string;
  speedKmh: number;
  lat: number;
  lon: number;
  distanceFromCoastKm: number;
  landfallLocation: string;
  landfallEta: string;
  warningColor: "Yellow" | "Orange" | "Red";
  coastalAlerts: string[];
  trackPoints: CycloneTrackPoint[];
}

export interface WeatherConditionInfo {
  code: number;
  label: string;
  iconName: string;
  category: "clear" | "clouds" | "rain" | "snow" | "thunder" | "fog" | "drizzle";
  description: string;
}

export interface SevereAlert {
  id: string;
  severity: "info" | "advisory" | "watch" | "warning" | "emergency";
  title: string;
  description: string;
  source: string;
  effective: string;
  expires: string;
  personaTags: PersonaType[];
}

export interface PackingItem {
  id: string;
  item: string;
  category: "clothing" | "gear" | "toiletries" | "documents";
  reason: string;
  checked: boolean;
}

// Single Source of Truth Shared Weather Context
export interface PollenItem {
  name: string;
  value: number;
  severity: "Low" | "Moderate" | "High" | "Very High";
  seasonActive: boolean;
  description: string;
  seasonContext: string;
}

export interface PollenContext {
  season: "Spring" | "Summer" | "Late Summer / Autumn" | "Winter";
  seasonName: string;
  seasonDescription: string;
  grass: PollenItem;
  tree: PollenItem;
  ragweed: PollenItem;
  olive: PollenItem;
  primaryAllergen: string;
}

export interface HourlyWeatherContextEntry {
  timeIso: string;
  hourLabel: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  rainChance: number;
  precipitationMm: number;
  weatherCode: number;
  condition: string;
  iconName: string;
  isDay: boolean;
  uvIndex: number;
  aqi: number;
  windSpeed: number;
}

export interface DailyWeatherContextEntry {
  dateIso: string;
  dayLabel: string;
  dateLabel: string;
  tempHigh: number;
  tempLow: number;
  rainChance: number;
  rainSumMm: number;
  weatherCode: number;
  condition: string;
  iconName: string;
  uvIndexMax: number;
  windSpeedMax: number;
  windGustsMax: number;
  sunrise: string;
  sunset: string;
}

export interface UnifiedWeatherContext {
  location: {
    name: string;
    city: string;
    admin1?: string;
    country?: string;
    latitude: number;
    longitude: number;
    timezone?: string;
  };
  current: {
    temp: number;
    feelsLike: number;
    condition: string;
    conditionCode: number;
    iconName: string;
    isDay: boolean;
    humidity: number;
    uvIndex: number;
    uvLevel: string;
    windSpeed: number;
    windGusts: number;
    windDirection: number;
    visibilityMeters: number;
    visibilityKm: number;
    pressureHpa: number;
    dewPoint: number;
    rainChance: number;
    precipitationMm: number;
    aqi: number;
    aqiLevel: string;
    aqiAdvice: string;
    pollutants: {
      pm2_5: number;
      pm10: number;
      ozone: number;
      nitrogen_dioxide: number;
      sulphur_dioxide: number;
      carbon_monoxide: number;
    };
    soilMoisturePct: number;
    soilTempC: number;
    marineWaveHeightM: number;
  };
  pollen: PollenContext;
  hourly: HourlyWeatherContextEntry[];
  daily: DailyWeatherContextEntry[];
  userProfile: {
    activePersonas: PersonaType[];
    healthNote: HealthNote;
    healthNoteLabel: string;
    userName: string;
    hasAsthma: boolean;
    hasAllergies: boolean;
    hasSkinSensitivity: boolean;
    hasHeartCondition: boolean;
  };
  fetchedAt: string;
}

// Observer Perks & Rewards System Types
export type PerkTierLevel = 1 | 2 | 3 | 4 | 5;

export interface PerkQuest {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  category: "daily" | "weekly" | "crowdsource" | "exploration" | "quiz";
  isCompleted: boolean;
  progress?: { current: number; total: number };
  actionLabel?: string;
  actionType?: "checkin" | "forecast" | "radar" | "persona" | "crowdsource" | "ai" | "share" | "quiz";
}

export interface PerkReward {
  id: string;
  title: string;
  subtitle: string;
  category: "badge" | "certificate" | "feature" | "merchandise" | "eco";
  costPoints: number;
  icon: string;
  badgeLabel?: string;
  isUnlocked: boolean;
  code?: string;
  unlockedAt?: string;
  description: string;
}

export interface PerkRankUser {
  rank: number;
  name: string;
  district: string;
  state: string;
  points: number;
  levelTitle: string;
  avatar: string;
  verified: boolean;
  isCurrentUser?: boolean;
  trend?: "up" | "down" | "same";
}

export interface DailyPerksState {
  lastCheckInDate?: string;
  streakDays: number;
  completedQuestIds: string[];
  redeemedRewardIds: string[];
  history: Array<{
    id: string;
    title: string;
    points: number;
    timestamp: string;
    type: "earn" | "redeem";
  }>;
}


import {
  AggregatedWeatherData,
  GeoLocation,
  UserPreferences,
  UserProfile,
  UnifiedWeatherContext,
  HealthNote,
  PollenContext,
  PollenItem,
  HourlyWeatherContextEntry,
  DailyWeatherContextEntry,
} from "../types";
import { getWeatherCondition, getAQIInfo, getUVInfo } from "./weatherUtils";

/**
 * Finds the index in `hourly.time` corresponding to the current live hour.
 */
export function getCurrentHourIndex(hourlyTimes?: string[]): number {
  if (!hourlyTimes || hourlyTimes.length === 0) return 0;
  const now = new Date();
  const currentIsoHour = now.toISOString().slice(0, 13); // e.g. "2026-08-28T07"

  const exactIdx = hourlyTimes.findIndex((t) => t.startsWith(currentIsoHour));
  if (exactIdx !== -1) return exactIdx;

  // Fallback to nearest timestamp
  let closestIdx = 0;
  let minDiff = Infinity;
  const nowMs = now.getTime();
  for (let i = 0; i < hourlyTimes.length; i++) {
    const diff = Math.abs(new Date(hourlyTimes[i]).getTime() - nowMs);
    if (diff < minDiff) {
      minDiff = diff;
      closestIdx = i;
    }
  }
  return closestIdx;
}

/**
 * Computes seasonal, date-aware pollen analysis based on actual date and air quality data.
 */
export function computeDateAwarePollen(
  airQualityHourly: any,
  currentHourIdx: number,
  referenceDate: Date = new Date()
): PollenContext {
  const month = referenceDate.getMonth(); // 0 = Jan, 1 = Feb, ..., 7 = Aug, ..., 11 = Dec
  let season: "Spring" | "Summer" | "Late Summer / Autumn" | "Winter" = "Summer";
  let seasonName = "Summer Pollen Season";
  let seasonDescription = "Grass pollen and late summer weed allergens are the primary active airborne triggers.";

  if (month >= 2 && month <= 4) {
    season = "Spring";
    seasonName = "Spring Tree Pollen Season";
    seasonDescription = "Early spring blooming trees (Birch, Alder, Oak, Cedar) produce airborne pollen.";
  } else if (month >= 5 && month <= 7) {
    season = "Summer";
    seasonName = "Mid-Summer Grass Pollen Season";
    seasonDescription = "Meadow grasses, lawn mowing, and agricultural pollen are the dominant triggers.";
  } else if (month >= 8 && month <= 10) {
    season = "Late Summer / Autumn";
    seasonName = "Late Summer & Weed Pollen Season";
    seasonDescription = "Ragweed, sagebrush, and mold spores peak in late summer warmth and breezes.";
  } else {
    season = "Winter";
    seasonName = "Winter Low Pollen Season";
    seasonDescription = "Outdoor botanical pollen is minimal; indoor dust mites and heating dryness are primary.";
  }

  // Get raw pollen readings or compute realistic seasonal levels
  const rawGrass = airQualityHourly?.grass_pollen?.[currentHourIdx];
  const rawBirch = airQualityHourly?.birch_pollen?.[currentHourIdx];
  const rawRagweed = airQualityHourly?.ragweed_pollen?.[currentHourIdx];
  const rawOlive = airQualityHourly?.olive_pollen?.[currentHourIdx];

  // Helper to rate severity
  const ratePollen = (val: number, isPeakSeason: boolean): "Low" | "Moderate" | "High" | "Very High" => {
    if (!isPeakSeason) {
      if (val > 3.0) return "Moderate";
      return "Low";
    }
    if (val < 1.0) return "Low";
    if (val < 2.5) return "Moderate";
    if (val < 4.5) return "High";
    return "Very High";
  };

  // Grass Pollen (peaks May - Aug)
  const isGrassActive = month >= 4 && month <= 8;
  const grassVal = typeof rawGrass === "number" && !isNaN(rawGrass)
    ? rawGrass
    : isGrassActive ? 2.4 : 0.4;
  const grassItem: PollenItem = {
    name: "Grass Pollen",
    value: Number(grassVal.toFixed(1)),
    severity: ratePollen(grassVal, isGrassActive),
    seasonActive: isGrassActive,
    description: isGrassActive
      ? "Active summer meadow and lawn grass allergen"
      : "Dormant / Low seasonal presence",
    seasonContext: isGrassActive ? "Peak Summer Season" : "Off-Peak Season",
  };

  // Tree / Birch Pollen (peaks March - May)
  const isTreeActive = month >= 2 && month <= 4;
  const treeVal = typeof rawBirch === "number" && !isNaN(rawBirch)
    ? rawBirch
    : isTreeActive ? 3.2 : 0.6;
  const treeItem: PollenItem = {
    name: "Tree Pollen (Birch/Oak)",
    value: Number(treeVal.toFixed(1)),
    severity: ratePollen(treeVal, isTreeActive),
    seasonActive: isTreeActive,
    description: isTreeActive
      ? "Spring tree blooming and windborne pollen"
      : `Past spring peak (${referenceDate.toLocaleDateString([], { month: "short" })} is low tree pollen season)`,
    seasonContext: isTreeActive ? "Active Spring Bloom" : "Out of Peak Bloom",
  };

  // Ragweed / Weed Pollen (peaks August - October)
  const isRagweedActive = month >= 7 && month <= 10;
  const ragweedVal = typeof rawRagweed === "number" && !isNaN(rawRagweed)
    ? rawRagweed
    : isRagweedActive ? 3.1 : 0.5;
  const ragweedItem: PollenItem = {
    name: "Ragweed & Weeds",
    value: Number(ragweedVal.toFixed(1)),
    severity: ratePollen(ragweedVal, isRagweedActive),
    seasonActive: isRagweedActive,
    description: isRagweedActive
      ? "Late summer / autumn invasive weed allergen"
      : "Low winter/spring baseline",
    seasonContext: isRagweedActive ? "Active Late-Summer Season" : "Dormant",
  };

  // Olive Tree (peaks April - June)
  const isOliveActive = month >= 3 && month <= 6;
  const oliveVal = typeof rawOlive === "number" && !isNaN(rawOlive)
    ? rawOlive
    : isOliveActive ? 1.8 : 0.3;
  const oliveItem: PollenItem = {
    name: "Olive & Shrub Pollen",
    value: Number(oliveVal.toFixed(1)),
    severity: ratePollen(oliveVal, isOliveActive),
    seasonActive: isOliveActive,
    description: isOliveActive
      ? "Mediterranean and regional shrub pollen"
      : "Low off-season levels",
    seasonContext: isOliveActive ? "Active Bloom" : "Off-Peak",
  };

  // Identify highest allergen
  let primary = grassItem.name;
  let maxSev = grassItem.value;
  if (ragweedItem.value > maxSev && ragweedItem.seasonActive) {
    primary = ragweedItem.name;
    maxSev = ragweedItem.value;
  }
  if (treeItem.value > maxSev && treeItem.seasonActive) {
    primary = treeItem.name;
  }

  return {
    season,
    seasonName,
    seasonDescription,
    grass: grassItem,
    tree: treeItem,
    ragweed: ragweedItem,
    olive: oliveItem,
    primaryAllergen: primary,
  };
}

/**
 * Builds the Single Source of Truth `UnifiedWeatherContext` used across:
 * - Homepage Hero & Header
 * - Personalized Verdict & Quick Actions
 * - 24-Hour Hourly Forecast
 * - 7-Day Daily Forecast (each day calculated independently)
 * - Persona Deep-Dive Modules (Health, Fitness, Beach, Commute, etc.)
 * - Mausam AI Copilot (Gemini Prompt & Deterministic Engine)
 * - Data Consistency Inspector
 */
export function buildUnifiedWeatherContext(
  weather: AggregatedWeatherData,
  location: GeoLocation,
  preferences: UserPreferences,
  userProfile?: UserProfile
): UnifiedWeatherContext {
  const current = weather.current;
  const daily = weather.daily;
  const hourly = weather.hourly;
  const airQuality = weather.air_quality;
  const marine = weather.marine;

  const currentHourIdx = getCurrentHourIndex(hourly?.time);

  // 1. Current Live Metrics
  const currentTemp = Math.round(current.temperature_2m);
  const feelsLike = Math.round(current.apparent_temperature);
  const conditionCode = current.weather_code;
  const isDay = current.is_day === 1;
  const conditionInfo = getWeatherCondition(conditionCode, current.is_day);

  // Determine current live UV index: prefer current hour from hourly, or max for sunny daytime, or fallback
  let liveUv = hourly?.uv_index?.[currentHourIdx];
  if (liveUv === undefined || isNaN(liveUv)) {
    liveUv = isDay ? (daily?.uv_index_max?.[0] ?? 4.5) : 0;
  }
  liveUv = Number(liveUv.toFixed(1));
  const uvInfo = getUVInfo(liveUv);

  // AQI and Pollutants
  const aqiVal = airQuality?.current?.us_aqi || 42;
  const aqiInfo = getAQIInfo(aqiVal);
  const pm25 = airQuality?.current?.pm2_5 ?? 12.4;
  const pm10 = airQuality?.current?.pm10 ?? 24.8;
  const o3 = airQuality?.current?.ozone ?? 45.2;
  const no2 = airQuality?.current?.nitrogen_dioxide ?? 18.0;
  const so2 = airQuality?.current?.sulphur_dioxide ?? 4.2;
  const co = airQuality?.current?.carbon_monoxide ?? 320;

  // Rain Probability for current hour
  const liveRainChance = hourly?.precipitation_probability?.[currentHourIdx] ?? (current.precipitation > 0 ? 80 : 10);
  const liveVisibilityMeters = hourly?.visibility?.[currentHourIdx] ?? 10000;
  const liveVisibilityKm = Number((liveVisibilityMeters / 1000).toFixed(1));

  // Soil & Marine
  const liveSoilMoisture = hourly?.soil_moisture_0_to_1cm?.[currentHourIdx] ?? 0.35;
  const liveSoilTemp = hourly?.soil_temperature_0cm?.[currentHourIdx] ?? currentTemp;
  const liveWaveHeight = marine?.hourly?.wave_height?.[currentHourIdx] ?? 1.2;

  // Dew point
  const humidity = current.relative_humidity_2m;
  const liveDewPoint = hourly?.dew_point_2m?.[currentHourIdx] ?? (currentTemp - ((100 - humidity) / 5));

  // 2. Pollen Analysis
  const pollenContext = computeDateAwarePollen(airQuality?.hourly, currentHourIdx, new Date());

  // 3. Hourly 24-Hour Sequence (starting from currentHourIdx)
  const hourlyEntries: HourlyWeatherContextEntry[] = [];
  if (hourly?.time && hourly.time.length > 0) {
    const startIdx = currentHourIdx;
    const maxEntries = Math.min(24, hourly.time.length - startIdx);
    for (let i = 0; i < (maxEntries > 0 ? maxEntries : Math.min(24, hourly.time.length)); i++) {
      const idx = (startIdx + i) % hourly.time.length;
      const tStr = hourly.time[idx];
      const dateObj = new Date(tStr);
      const hourLabel = i === 0 ? "Now" : dateObj.toLocaleTimeString([], { hour: "numeric", hour12: true });
      const hTemp = Math.round(hourly.temperature_2m[idx]);
      const hFeels = Math.round(hourly.apparent_temperature?.[idx] ?? hTemp);
      const hHumid = hourly.relative_humidity_2m?.[idx] ?? humidity;
      const hRain = hourly.precipitation_probability?.[idx] ?? 0;
      const hPrecipMm = hourly.precipitation?.[idx] ?? 0;
      const hCode = hourly.weather_code?.[idx] ?? 0;
      const hIsDay = hourly.is_day?.[idx] === 1;
      const hCond = getWeatherCondition(hCode, hourly.is_day?.[idx] ?? 1);
      const hUv = hourly.uv_index?.[idx] ?? 0;
      const hAqi = airQuality?.hourly?.us_aqi?.[idx] ?? aqiVal;
      const hWind = Math.round(hourly.wind_speed_10m?.[idx] ?? current.wind_speed_10m);

      hourlyEntries.push({
        timeIso: tStr,
        hourLabel,
        temp: hTemp,
        feelsLike: hFeels,
        humidity: hHumid,
        rainChance: Math.min(100, Math.max(0, Math.round(hRain))),
        precipitationMm: Number(hPrecipMm.toFixed(1)),
        weatherCode: hCode,
        condition: hCond.label,
        iconName: hCond.iconName,
        isDay: hIsDay,
        uvIndex: Number(hUv.toFixed(1)),
        aqi: hAqi,
        windSpeed: hWind,
      });
    }
  }

  // 4. Daily 7-Day Forecast (EACH DAY COMPUTED INDEPENDENTLY)
  const dailyEntries: DailyWeatherContextEntry[] = [];
  if (daily?.time && daily.time.length > 0) {
    const numDays = Math.min(7, daily.time.length);
    for (let idx = 0; idx < numDays; idx++) {
      const timeStr = daily.time[idx];
      const date = new Date(timeStr);
      const isToday = idx === 0;
      const dayLabel = isToday ? "Today" : idx === 1 ? "Tomorrow" : date.toLocaleDateString([], { weekday: "short" });
      const dateLabel = date.toLocaleDateString([], { month: "short", day: "numeric" });

      const code = daily.weather_code?.[idx] ?? conditionCode;
      const cond = getWeatherCondition(code, 1);
      const minT = Math.round(daily.temperature_2m_min?.[idx] ?? (currentTemp - 4));
      const maxT = Math.round(daily.temperature_2m_max?.[idx] ?? (currentTemp + 4));

      // Compute rain probability for each day INDEPENDENTLY
      let rainProb = 0;
      if (daily.precipitation_probability_max && typeof daily.precipitation_probability_max[idx] === "number") {
        rainProb = daily.precipitation_probability_max[idx];
      } else {
        // Fallback to independent meteorological calculation per day
        const precipSum = daily.precipitation_sum?.[idx] ?? 0;
        if (precipSum > 8 || [65, 75, 82, 95, 96, 99].includes(code)) rainProb = 85;
        else if (precipSum > 2 || [61, 63, 80, 81].includes(code)) rainProb = 65;
        else if (precipSum > 0 || [51, 53, 55].includes(code)) rainProb = 40;
        else if ([2, 3, 45, 48].includes(code)) rainProb = 15;
        else rainProb = 5;
      }
      rainProb = Math.min(100, Math.max(0, Math.round(rainProb)));

      const rainSum = Number((daily.precipitation_sum?.[idx] ?? 0).toFixed(1));
      const uvMax = Number((daily.uv_index_max?.[idx] ?? 5.5).toFixed(1));
      const windMax = Math.round(daily.wind_speed_10m_max?.[idx] ?? 14);
      const windGustsMax = Math.round(daily.wind_gusts_10m_max?.[idx] ?? windMax * 1.3);

      const sunrise = daily.sunrise?.[idx]
        ? new Date(daily.sunrise[idx]).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })
        : "06:15 AM";
      const sunset = daily.sunset?.[idx]
        ? new Date(daily.sunset[idx]).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })
        : "06:45 PM";

      dailyEntries.push({
        dateIso: timeStr,
        dayLabel,
        dateLabel,
        tempHigh: maxT,
        tempLow: minT,
        rainChance: rainProb,
        rainSumMm: rainSum,
        weatherCode: code,
        condition: cond.label,
        iconName: cond.iconName,
        uvIndexMax: uvMax,
        windSpeedMax: windMax,
        windGustsMax: windGustsMax,
        sunrise,
        sunset,
      });
    }
  }

  // 5. User Profile & Health Condition
  const rawHealth = preferences.healthNote || "none";
  const healthNote: HealthNote = (
    ["none", "asthma", "skin_sensitivity", "allergies", "heart_condition", "other"].includes(rawHealth)
      ? rawHealth
      : "none"
  ) as HealthNote;

  const HEALTH_LABELS: Record<HealthNote, string> = {
    none: "None",
    asthma: "Asthma / Respiratory issues",
    skin_sensitivity: "Skin sensitivity",
    allergies: "Allergies (pollen/seasonal)",
    heart_condition: "Heart condition",
    other: "Other",
  };

  const hasAsthma = healthNote === "asthma";
  const hasAllergies = healthNote === "allergies";
  const hasSkinSensitivity = healthNote === "skin_sensitivity";
  const hasHeartCondition = healthNote === "heart_condition";

  return {
    location: {
      name: location.name,
      city: location.name,
      admin1: location.admin1,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: location.timezone,
    },
    current: {
      temp: currentTemp,
      feelsLike,
      condition: conditionInfo.label,
      conditionCode,
      iconName: conditionInfo.iconName,
      isDay,
      humidity,
      uvIndex: liveUv,
      uvLevel: uvInfo.level,
      windSpeed: Math.round(current.wind_speed_10m),
      windGusts: Math.round(current.wind_gusts_10m),
      windDirection: current.wind_direction_10m,
      visibilityMeters: liveVisibilityMeters,
      visibilityKm: liveVisibilityKm,
      pressureHpa: Math.round(current.pressure_msl),
      dewPoint: Math.round(liveDewPoint),
      rainChance: liveRainChance,
      precipitationMm: Number(current.precipitation.toFixed(1)),
      aqi: aqiVal,
      aqiLevel: aqiInfo.label,
      aqiAdvice: aqiInfo.advice,
      pollutants: {
        pm2_5: Number(pm25.toFixed(1)),
        pm10: Number(pm10.toFixed(1)),
        ozone: Number(o3.toFixed(1)),
        nitrogen_dioxide: Number(no2.toFixed(1)),
        sulphur_dioxide: Number(so2.toFixed(1)),
        carbon_monoxide: Math.round(co),
      },
      soilMoisturePct: Math.round(liveSoilMoisture * 100),
      soilTempC: Math.round(liveSoilTemp),
      marineWaveHeightM: Number(liveWaveHeight.toFixed(1)),
    },
    pollen: pollenContext,
    hourly: hourlyEntries,
    daily: dailyEntries,
    userProfile: {
      activePersonas: preferences.personas || ["health", "fitness"],
      healthNote,
      healthNoteLabel: HEALTH_LABELS[healthNote] || "None",
      userName: userProfile?.name || "Observer",
      hasAsthma,
      hasAllergies,
      hasSkinSensitivity,
      hasHeartCondition,
    },
    fetchedAt: new Date().toISOString(),
  };
}

import {
  WeatherConditionInfo,
  UnitTemperature,
  UnitWind,
  UnitPrecipitation,
  UnitPressure,
  AggregatedWeatherData,
  SevereAlert,
  PackingItem,
  PersonaType,
  HealthNote,
  UserPreferences,
} from "../types";

// WMO Weather interpretation codes (WW)
export function getWeatherCondition(code: number, isDay: number = 1): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        code,
        label: isDay ? "Clear Sky" : "Clear Night",
        iconName: isDay ? "Sun" : "Moon",
        category: "clear",
        description: "Completely clear skies with high visibility.",
      };
    case 1:
      return {
        code,
        label: isDay ? "Mainly Clear" : "Mainly Clear Night",
        iconName: isDay ? "SunMedium" : "MoonStar",
        category: "clear",
        description: "Scattered light clouds across the sky.",
      };
    case 2:
      return {
        code,
        label: "Partly Cloudy",
        iconName: isDay ? "CloudSun" : "CloudMoon",
        category: "clouds",
        description: "Mix of sun and clouds throughout the day.",
      };
    case 3:
      return {
        code,
        label: "Overcast",
        iconName: "Cloud",
        category: "clouds",
        description: "Continuous gray cloud cover with low sunlight.",
      };
    case 45:
      return {
        code,
        label: "Foggy",
        iconName: "CloudFog",
        category: "fog",
        description: "Dense fog reducing surface visibility.",
      };
    case 48:
      return {
        code,
        label: "Depositing Rime Fog",
        iconName: "CloudFog",
        category: "fog",
        description: "Freezing fog creating ice crystals on surfaces.",
      };
    case 51:
      return {
        code,
        label: "Light Drizzle",
        iconName: "CloudDrizzle",
        category: "drizzle",
        description: "Gentle mist and fine water droplets.",
      };
    case 53:
      return {
        code,
        label: "Moderate Drizzle",
        iconName: "CloudDrizzle",
        category: "drizzle",
        description: "Steady fine drizzle across the area.",
      };
    case 55:
      return {
        code,
        label: "Dense Drizzle",
        iconName: "CloudDrizzle",
        category: "drizzle",
        description: "Thick drizzle with wet ground conditions.",
      };
    case 61:
      return {
        code,
        label: "Slight Rain",
        iconName: "CloudRain",
        category: "rain",
        description: "Light passing rain showers.",
      };
    case 63:
      return {
        code,
        label: "Moderate Rain",
        iconName: "CloudRain",
        category: "rain",
        description: "Steady rainfall. Carry an umbrella.",
      };
    case 65:
      return {
        code,
        label: "Heavy Rain",
        iconName: "CloudRainWind",
        category: "rain",
        description: "Intense downpours. Potential localized pooling.",
      };
    case 71:
      return {
        code,
        label: "Slight Snow Fall",
        iconName: "CloudSnow",
        category: "snow",
        description: "Light drifting snowflakes.",
      };
    case 73:
      return {
        code,
        label: "Moderate Snow Fall",
        iconName: "CloudSnow",
        category: "snow",
        description: "Steady snowfall accumulating on cold ground.",
      };
    case 75:
      return {
        code,
        label: "Heavy Snow Fall",
        iconName: "Snowflake",
        category: "snow",
        description: "Heavy blustery snowfall with reduced visibility.",
      };
    case 80:
      return {
        code,
        label: "Slight Rain Showers",
        iconName: "CloudSunRain",
        category: "rain",
        description: "Intermittent light rain showers.",
      };
    case 81:
      return {
        code,
        label: "Moderate Rain Showers",
        iconName: "CloudRain",
        category: "rain",
        description: "Moderate convective rain showers.",
      };
    case 82:
      return {
        code,
        label: "Violent Rain Showers",
        iconName: "CloudRainWind",
        category: "rain",
        description: "Torrential squalls with sudden gusty winds.",
      };
    case 85:
      return {
        code,
        label: "Slight Snow Showers",
        iconName: "CloudSnow",
        category: "snow",
        description: "Occasional brief snow showers.",
      };
    case 86:
      return {
        code,
        label: "Heavy Snow Showers",
        iconName: "Snowflake",
        category: "snow",
        description: "Intense bursts of snow flurries.",
      };
    case 95:
      return {
        code,
        label: "Thunderstorm",
        iconName: "CloudLightning",
        category: "thunder",
        description: "Active lightning and thunder with rain.",
      };
    case 96:
    case 99:
      return {
        code,
        label: "Thunderstorm with Hail",
        iconName: "CloudHail",
        category: "thunder",
        description: "Severe thunderstorm with hail hazards.",
      };
    default:
      return {
        code,
        label: isDay ? "Partly Clear" : "Clear Night",
        iconName: isDay ? "Sun" : "Moon",
        category: "clear",
        description: "Pleasant meteorological conditions.",
      };
  }
}

// Unit Converters
export function formatTemp(celsius: number, unit: UnitTemperature = "celsius"): string {
  if (unit === "fahrenheit") {
    const f = (celsius * 9) / 5 + 32;
    return `${Math.round(f)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatTempNum(celsius: number, unit: UnitTemperature = "celsius"): number {
  if (unit === "fahrenheit") {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatWind(kmh: number, unit: UnitWind = "kmh"): string {
  switch (unit) {
    case "mph":
      return `${Math.round(kmh * 0.621371)} mph`;
    case "ms":
      return `${(kmh / 3.6).toFixed(1)} m/s`;
    case "knots":
      return `${Math.round(kmh * 0.539957)} kts`;
    case "kmh":
    default:
      return `${Math.round(kmh)} km/h`;
  }
}

export function formatPrecip(mm: number, unit: UnitPrecipitation = "mm"): string {
  if (unit === "inch") {
    return `${(mm * 0.0393701).toFixed(2)} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

export function formatPressure(hpa: number, unit: UnitPressure = "hpa"): string {
  switch (unit) {
    case "inHg":
      return `${(hpa * 0.02953).toFixed(2)} inHg`;
    case "mmHg":
      return `${Math.round(hpa * 0.750062)} mmHg`;
    case "hpa":
    default:
      return `${Math.round(hpa)} hPa`;
  }
}

export function getWindDirection(deg: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

// AQI Calculation & Severity
export interface AQIInfo {
  val: number;
  label: string;
  category: "good" | "moderate" | "unhealthy_sensitive" | "unhealthy" | "very_unhealthy" | "hazardous";
  colorClass: string;
  badgeBg: string;
  advice: string;
  healthSensitiveRisk: string;
}

export function getAQIInfo(aqi: number = 42): AQIInfo {
  if (aqi <= 50) {
    return {
      val: aqi,
      label: "Good",
      category: "good",
      colorClass: "text-emerald-500",
      badgeBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
      advice: "Air quality is satisfactory and poses little or no health risk.",
      healthSensitiveRisk: "Low risk. Ideal for asthma and allergy sufferers.",
    };
  }
  if (aqi <= 100) {
    return {
      val: aqi,
      label: "Moderate",
      category: "moderate",
      colorClass: "text-yellow-500",
      badgeBg: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400",
      advice: "Acceptable quality; unusually sensitive people may experience minor irritation.",
      healthSensitiveRisk: "Mild risk. Asthmatics should keep inhalers handy if exerting heavily outdoors.",
    };
  }
  if (aqi <= 150) {
    return {
      val: aqi,
      label: "Unhealthy for Sensitive Groups",
      category: "unhealthy_sensitive",
      colorClass: "text-amber-500",
      badgeBg: "bg-amber-500/15 border-amber-500/30 text-amber-400",
      advice: "Members of sensitive groups may experience health effects. General public not likely affected.",
      healthSensitiveRisk: "Moderate to high risk. Children, seniors, and asthma patients should limit outdoor exertion.",
    };
  }
  if (aqi <= 200) {
    return {
      val: aqi,
      label: "Unhealthy",
      category: "unhealthy",
      colorClass: "text-red-500",
      badgeBg: "bg-red-500/15 border-red-500/30 text-red-400",
      advice: "Everyone may begin to experience health effects; sensitive groups experience more serious effects.",
      healthSensitiveRisk: "High risk. Wear N95 masks outdoors, run air purifiers indoors.",
    };
  }
  if (aqi <= 300) {
    return {
      val: aqi,
      label: "Very Unhealthy",
      category: "very_unhealthy",
      colorClass: "text-purple-500",
      badgeBg: "bg-purple-500/15 border-purple-500/30 text-purple-400",
      advice: "Health alert: The risk of health effects is increased for everyone.",
      healthSensitiveRisk: "Severe risk. Avoid all outdoor physical activity.",
    };
  }
  return {
    val: aqi,
    label: "Hazardous",
    category: "hazardous",
    colorClass: "text-rose-600",
    badgeBg: "bg-rose-600/20 border-rose-600/40 text-rose-400",
    advice: "Health warnings of emergency conditions. The entire population is likely affected.",
    healthSensitiveRisk: "Critical risk. Seal windows and avoid going outdoors.",
  };
}

// UV Index Helpers
export function getUVInfo(uv: number) {
  if (uv < 3) {
    return {
      level: "Low",
      color: "text-emerald-400",
      bg: "bg-emerald-500/15",
      spf: "SPF 15 (Optional)",
      burnTime: "60+ mins",
      tip: "Minimal sun protection required for most skin types.",
    };
  }
  if (uv < 6) {
    return {
      level: "Moderate",
      color: "text-yellow-400",
      bg: "bg-yellow-500/15",
      spf: "SPF 30",
      burnTime: "30-45 mins",
      tip: "Wear sunglasses, hat, and apply sunscreen during midday hours.",
    };
  }
  if (uv < 8) {
    return {
      level: "High",
      color: "text-amber-400",
      bg: "bg-amber-500/15",
      spf: "SPF 50",
      burnTime: "15-25 mins",
      tip: "Protection essential. Seek shade during 11 AM - 4 PM.",
    };
  }
  if (uv < 11) {
    return {
      level: "Very High",
      color: "text-red-400",
      bg: "bg-red-500/15",
      spf: "SPF 50+ & UV Shirt",
      burnTime: "10-15 mins",
      tip: "Extra protection needed. Unprotected skin can burn rapidly.",
    };
  }
  return {
    level: "Extreme",
    color: "text-purple-400",
    bg: "bg-purple-500/15",
    spf: "SPF 50+ & Stay Shaded",
    burnTime: "< 10 mins",
    tip: "Take all precautions. Avoid direct sun exposure between 10 AM and 4 PM.",
  };
}

// Fitness "Best Running Hours" Algorithm
export interface WorkoutHourScore {
  hourIndex: number;
  timeLabel: string;
  score: number; // 0 - 100
  grade: "Ideal" | "Good" | "Fair" | "Challenging" | "Avoid";
  temp: number;
  feelsLike: number;
  humidity: number;
  rainChance: number;
  windSpeed: number;
  uv: number;
  isDay: boolean;
  notes: string;
}

export function computeBestWorkoutHours(weather: AggregatedWeatherData): WorkoutHourScore[] {
  const hourly = weather.hourly;
  if (!hourly || !hourly.time || hourly.time.length === 0) return [];

  const results: WorkoutHourScore[] = [];
  const limit = Math.min(24, hourly.time.length);

  for (let i = 0; i < limit; i++) {
    const timeStr = hourly.time[i];
    const temp = hourly.temperature_2m[i];
    const feelsLike = hourly.apparent_temperature[i];
    const humidity = hourly.relative_humidity_2m[i];
    const rainChance = hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0;
    const windSpeed = hourly.wind_speed_10m[i];
    const uv = hourly.uv_index ? hourly.uv_index[i] : 0;
    const isDay = hourly.is_day ? hourly.is_day[i] === 1 : true;

    // Start with 100 base score
    let score = 100;

    // Ideal running temp is 12°C - 20°C
    if (temp < 0) score -= 30;
    else if (temp < 8) score -= 15;
    else if (temp > 28) score -= (temp - 28) * 4;
    else if (temp > 23) score -= (temp - 23) * 2;

    // High humidity penalty
    if (humidity > 80 && temp > 22) score -= 15;
    else if (humidity > 90) score -= 10;

    // Rain probability penalty
    if (rainChance > 60) score -= 40;
    else if (rainChance > 30) score -= 20;
    else if (rainChance > 15) score -= 8;

    // Wind penalty
    if (windSpeed > 35) score -= 30;
    else if (windSpeed > 25) score -= 15;

    // UV penalty for midday
    if (uv > 8) score -= 20;
    else if (uv > 5) score -= 10;

    score = Math.max(10, Math.min(100, Math.round(score)));

    let grade: WorkoutHourScore["grade"] = "Ideal";
    let notes = "Perfect weather for long distance running, cycling, or calisthenics.";

    if (score >= 85) {
      grade = "Ideal";
      notes = "Prime conditions: Crisp temperature, low wind, and clear path.";
    } else if (score >= 70) {
      grade = "Good";
      notes = "Very good workout window. Maintain standard hydration.";
    } else if (score >= 50) {
      grade = "Fair";
      notes = temp > 25 ? "Warm conditions. Carry extra water and electrolytes." : "Breezy or cool. Dress in light layers.";
    } else if (score >= 30) {
      grade = "Challenging";
      notes = rainChance > 40 ? "Rain likely. Wear waterproof gear or stick to treadmill." : "High heat / humidity strain.";
    } else {
      grade = "Avoid";
      notes = "Extreme weather, heavy precipitation, or excessive heat. Indoor training recommended.";
    }

    const date = new Date(timeStr);
    const timeLabel = date.toLocaleTimeString([], { hour: "numeric", hour12: true });

    results.push({
      hourIndex: i,
      timeLabel,
      score,
      grade,
      temp,
      feelsLike,
      humidity,
      rainChance,
      windSpeed,
      uv,
      isDay,
      notes,
    });
  }

  return results;
}

// Marine & Surf Condition Analyzer
export function getSurfAdvisory(weather: AggregatedWeatherData) {
  const marine = weather.marine;
  const wind = weather.current.wind_speed_10m;
  const temp = weather.current.temperature_2m;
  const uv = weather.hourly?.uv_index?.[0] || 4;

  let waveHeight = marine?.hourly?.wave_height?.[0] || 0.8;
  let wavePeriod = marine?.hourly?.wave_period?.[0] || 8.0;
  let seaTemp = marine?.hourly?.sea_surface_temperature?.[0] || Math.max(16, temp - 2);

  let surfQuality = "Good Clean Swell";
  let rating = 7.5;
  let swimSafety = "Safe for swimming";
  let wetsuit = "Rashguard / Boardshorts";

  if (waveHeight > 2.5) {
    surfQuality = "Heavy Overhead Waves";
    rating = 8.5;
    swimSafety = "Caution: Strong shorebreak & undertows for swimmers";
  } else if (waveHeight > 1.4) {
    surfQuality = "Great Fun Surf";
    rating = 8.0;
    swimSafety = "Moderate surf. Swim in designated lifeguarded zones";
  } else if (waveHeight < 0.5) {
    surfQuality = "Flat / Gentle Ripples";
    rating = 4.5;
    swimSafety = "Calm waters: Excellent for paddleboarding and leisurely swimming";
  }

  if (seaTemp < 15) wetsuit = "4/3mm Fullsuit + Booties";
  else if (seaTemp < 19) wetsuit = "3/2mm Springsuit or Neoprene top";
  else if (seaTemp < 23) wetsuit = "1-2mm Shorty or Thermal Vest";
  else wetsuit = "Boardshorts / Swimsuit only";

  return {
    waveHeight: waveHeight.toFixed(1),
    wavePeriod: wavePeriod.toFixed(0),
    seaTemp: seaTemp.toFixed(1),
    surfQuality,
    rating,
    swimSafety,
    wetsuit,
    uvIndex: uv,
    windKmh: Math.round(wind),
    tides: [
      { time: "05:42 AM", type: "Low Tide", height: "0.4m" },
      { time: "11:58 AM", type: "High Tide", height: "1.8m" },
      { time: "06:14 PM", type: "Low Tide", height: "0.5m" },
      { time: "11:45 PM", type: "High Tide", height: "1.7m" },
    ],
  };
}

// Dynamic Smart Packing Suggestions Generator
export function generatePackingList(weather: AggregatedWeatherData, destinationCity: string = "Destination"): PackingItem[] {
  const current = weather.current;
  const daily = weather.daily;
  const maxRain = daily?.precipitation_probability_max ? Math.max(...daily.precipitation_probability_max.slice(0, 5)) : 20;
  const minTemp = daily?.temperature_2m_min ? Math.min(...daily.temperature_2m_min.slice(0, 5)) : current.temperature_2m;
  const maxTemp = daily?.temperature_2m_max ? Math.max(...daily.temperature_2m_max.slice(0, 5)) : current.temperature_2m;
  const maxUV = daily?.uv_index_max ? Math.max(...daily.uv_index_max.slice(0, 5)) : 5;

  const items: PackingItem[] = [];

  // Rain gear
  if (maxRain > 40 || current.precipitation > 0) {
    items.push({
      id: "pack-umbrella",
      item: "Windproof Compact Umbrella",
      category: "gear",
      reason: `High precipitation probability (${maxRain}%) in ${destinationCity}.`,
      checked: false,
    });
    items.push({
      id: "pack-raincoat",
      item: "Waterproof Rain Jacket / Shell",
      category: "clothing",
      reason: `Showers expected. Essential for exploring ${destinationCity} comfortably.`,
      checked: false,
    });
    items.push({
      id: "pack-shoes-water",
      item: "Water-resistant walking shoes",
      category: "clothing",
      reason: "Wet streets and puddle resistance for walking tours.",
      checked: false,
    });
  }

  // Cold weather
  if (minTemp < 10) {
    items.push({
      id: "pack-thermal",
      item: "Thermal base layers / innerwear",
      category: "clothing",
      reason: `Temperatures dipping down to ${Math.round(minTemp)}°C.`,
      checked: false,
    });
    items.push({
      id: "pack-fleece",
      item: "Warm Fleece or Insulated Down Jacket",
      category: "clothing",
      reason: "Chilly mornings and brisk evenings.",
      checked: false,
    });
    items.push({
      id: "pack-beanie",
      item: "Wool Beanie & Light Scarf",
      category: "clothing",
      reason: "Head and neck thermal protection during gusts.",
      checked: false,
    });
  }

  // Warm / Sun weather
  if (maxTemp > 24 || maxUV > 5) {
    items.push({
      id: "pack-sunscreen",
      item: "SPF 50+ Broad Spectrum Sunscreen",
      category: "toiletries",
      reason: `UV Index reaching ${maxUV.toFixed(1)}. Prevent midday sunburn.`,
      checked: false,
    });
    items.push({
      id: "pack-sunglasses",
      item: "UV400 Polarized Sunglasses",
      category: "gear",
      reason: "Eye protection against intense daylight glare.",
      checked: false,
    });
    items.push({
      id: "pack-cotton",
      item: "Breathable linen & moisture-wicking shirts",
      category: "clothing",
      reason: `Warm peaks around ${Math.round(maxTemp)}°C.`,
      checked: false,
    });
    items.push({
      id: "pack-bottle",
      item: "Insulated Reusable Water Bottle",
      category: "gear",
      reason: "Stay hydrated during city walking tours.",
      checked: false,
    });
  }

  // General travel essentials
  items.push({
    id: "pack-powerbank",
    item: "10,000mAh Portable Power Bank",
    category: "gear",
    reason: "Navigation & camera usage drain mobile battery fast.",
    checked: false,
  });
  items.push({
    id: "pack-moisturizer",
    item: "Hydrating Lip Balm & Skin Cream",
    category: "toiletries",
    reason: "Protects skin against dry airplane cabins and changing outdoor humidity.",
    checked: false,
  });

  return items;
}

// Generate Simulated Contextual Weather Alerts based on live conditions
export function getContextualAlerts(weather: AggregatedWeatherData, locationName: string): SevereAlert[] {
  const alerts: SevereAlert[] = [];
  const current = weather.current;
  const aqi = weather.air_quality?.current?.us_aqi || 45;
  const wind = current.wind_speed_10m;
  const gusts = current.wind_gusts_10m;
  const temp = current.temperature_2m;
  const rain = current.rain + current.showers;
  const code = current.weather_code;

  if (code === 95 || code === 96 || code === 99) {
    alerts.push({
      id: "alert-thunderstorm",
      severity: "warning",
      title: "Severe Thunderstorm Warning",
      description: `Active cloud-to-ground lightning and torrential downpours detected in ${locationName}. Avoid open fields, beaches, and tall trees.`,
      source: "National Meteorological Center & Mausam Doppler",
      effective: "Immediate",
      expires: "In 2 hours",
      personaTags: ["parents", "beach", "fitness", "event", "commute"],
    });
  }

  if (aqi > 150) {
    alerts.push({
      id: "alert-aqi",
      severity: aqi > 200 ? "warning" : "advisory",
      title: `Air Quality Alert: US AQI ${aqi}`,
      description: `High concentration of particulate matter (PM2.5). Unhealthy for sensitive groups, elderly, and individuals with respiratory conditions.`,
      source: "Air Quality Monitoring Station",
      effective: "Current",
      expires: "Until tomorrow morning",
      personaTags: ["health", "parents", "fitness"],
    });
  }

  if (gusts > 50 || wind > 40) {
    alerts.push({
      id: "alert-wind",
      severity: "watch",
      title: `High Wind Gust Advisory (${Math.round(gusts)} km/h)`,
      description: `Strong turbulent gusts may affect high-profile vehicles on bridges, temporary event canopies, and marine craft.`,
      source: "Severe Weather Radar",
      effective: "Active today",
      expires: "Evening",
      personaTags: ["commute", "event", "beach", "travel"],
    });
  }

  if (temp > 35) {
    alerts.push({
      id: "alert-heat",
      severity: "warning",
      title: `Extreme Heat & Dehydration Risk (${Math.round(temp)}°C)`,
      description: `High heat stress index. Limit direct midday exposure, avoid strenuous outdoor cardio between 12 PM - 4 PM.`,
      source: "Public Health Meteorological Advisory",
      effective: "11:00 AM",
      expires: "06:00 PM",
      personaTags: ["fitness", "parents", "health", "event", "agriculture"],
    });
  } else if (temp < 1) {
    alerts.push({
      id: "alert-frost",
      severity: "advisory",
      title: "Frost & Freeze Hazard for Plants",
      description: `Sub-zero surface temperatures expected. Cover tender garden crops, potted plants, and check exterior water spigots.`,
      source: "Agricultural Weather Bureau",
      effective: "Tonight",
      expires: "Tomorrow 08:00 AM",
      personaTags: ["agriculture", "commute", "parents"],
    });
  }

  if (rain > 15 || code === 82 || code === 65) {
    alerts.push({
      id: "alert-hydroplaning",
      severity: "watch",
      title: "Heavy Rainfall & Wet Road Caution",
      description: `Surface water pooling creating hydroplaning risks for motor vehicles. Allow extra stopping distance and increase headlight visibility.`,
      source: "Highway Patrol & Weather Grid",
      effective: "Current",
      expires: "Next 4 hours",
      personaTags: ["commute", "parents", "travel"],
    });
  }

  return alerts;
}

// Agriculture & Soil Moisture Calculations
export function getAgricultureStats(weather: AggregatedWeatherData) {
  const hourly = weather.hourly;
  const current = weather.current;
  const daily = weather.daily;

  const topSoilMoisture = hourly?.soil_moisture_0_to_1cm?.[0] ? hourly.soil_moisture_0_to_1cm[0] * 100 : 28;
  const midSoilMoisture = hourly?.soil_moisture_1_to_3cm?.[0] ? hourly.soil_moisture_1_to_3cm[0] * 100 : 34;
  const deepSoilMoisture = hourly?.soil_moisture_3_to_9cm?.[0] ? hourly.soil_moisture_3_to_9cm[0] * 100 : 42;
  const soilTemp = hourly?.soil_temperature_0cm?.[0] || current.temperature_2m;
  const et0 = daily?.et0_fao_evapotranspiration?.[0] || 3.8; // mm/day

  const rainSum7d = daily?.precipitation_sum ? daily.precipitation_sum.slice(0, 7).reduce((a, b) => a + b, 0) : 12;

  let wateringStatus = "Optimal Moisture";
  let wateringRecommendation = "No supplemental watering required today. Soil levels are balanced.";
  let frostRisk = "No Frost Risk";

  if (topSoilMoisture < 20 && rainSum7d < 5) {
    wateringStatus = "Dry Topsoil - Irrigation Recommended";
    wateringRecommendation = "Water flowerbeds and shallow-root vegetables deeply in early morning to prevent evaporation.";
  } else if (topSoilMoisture > 55 || rainSum7d > 40) {
    wateringStatus = "Saturated Soil - High Moisture";
    wateringRecommendation = "Pause all drip and sprinkler systems to prevent root rot and fungal dampening.";
  }

  if (current.temperature_2m < 2 || (daily?.temperature_2m_min && daily.temperature_2m_min[0] < 2)) {
    frostRisk = "High Frost Warning Tonight (Cover vulnerable seedlings)";
  } else if (current.temperature_2m < 6) {
    frostRisk = "Low to Mild Cold Stress";
  }

  return {
    topSoilMoisture: Math.round(topSoilMoisture),
    midSoilMoisture: Math.round(midSoilMoisture),
    deepSoilMoisture: Math.round(deepSoilMoisture),
    soilTemp: Math.round(soilTemp),
    et0: et0.toFixed(1),
    rainSum7d: rainSum7d.toFixed(1),
    wateringStatus,
    wateringRecommendation,
    frostRisk,
  };
}

// School & Parent Commute Analyzer
export function getSchoolCommuteInsight(weather: AggregatedWeatherData) {
  const hourly = weather.hourly;
  const morningIdx = 8; // 8:00 AM
  const afternoonIdx = 15; // 3:00 PM

  const morningTemp = hourly?.temperature_2m?.[morningIdx] || weather.current.temperature_2m;
  const morningRain = hourly?.precipitation_probability?.[morningIdx] || 10;
  const morningAQI = weather.air_quality?.current?.us_aqi || 40;

  const afternoonTemp = hourly?.temperature_2m?.[afternoonIdx] || weather.current.temperature_2m + 3;
  const afternoonRain = hourly?.precipitation_probability?.[afternoonIdx] || 15;
  const afternoonUV = hourly?.uv_index?.[afternoonIdx] || 6;

  let morningAttire = "Standard School Uniform / Light Cardigan";
  if (morningTemp < 10) morningAttire = "Warm Winter Coat, Hat & Gloves";
  else if (morningTemp < 17) morningAttire = "Fleece Jacket or School Sweater";
  else if (morningRain > 40) morningAttire = "Rain Booties & Hooded Raincoat";

  let recessSafety = "Safe for Outdoor Play";
  if (morningRain > 50 || afternoonRain > 50) recessSafety = "Indoor Recess Advised (Rain showers)";
  else if (afternoonUV > 8) recessSafety = "Sun Safe Recess (Require Hats & Shade)";
  else if (morningAQI > 150) recessSafety = "Indoor Recess (Elevated Air Pollution)";

  return {
    morningTemp: Math.round(morningTemp),
    morningRain,
    morningAttire,
    afternoonTemp: Math.round(afternoonTemp),
    afternoonRain,
    afternoonUV,
    recessSafety,
    busStopVisibility: hourly?.visibility?.[morningIdx] ? `${(hourly.visibility[morningIdx] / 1000).toFixed(1)} km` : "Good (> 10 km)",
  };
}

// Commuter Traffic & Visibility Analyzer
export function getCommuteRoadInsight(weather: AggregatedWeatherData) {
  const current = weather.current;
  const visMeters = weather.hourly?.visibility?.[0] || 10000;
  const rain = current.rain + current.showers;
  const wind = current.wind_speed_10m;

  let roadStatus = "Dry & Normal Driving Conditions";
  let hazardScore = 15; // 0-100 hazard

  if (current.weather_code === 45 || current.weather_code === 48 || visMeters < 1500) {
    roadStatus = "Dense Fog - Severely Reduced Visibility";
    hazardScore = 75;
  } else if (current.snowfall > 0 || current.weather_code >= 71) {
    roadStatus = "Snow / Sleet Slush - Slippery Roads";
    hazardScore = 85;
  } else if (rain > 5 || current.weather_code === 65 || current.weather_code === 82) {
    roadStatus = "Heavy Rain - Hydroplaning & Spray Risk";
    hazardScore = 65;
  } else if (rain > 0.5) {
    roadStatus = "Damp / Wet Asphalt - Moderate Caution";
    hazardScore = 40;
  }

  return {
    roadStatus,
    hazardScore,
    visibilityKm: (visMeters / 1000).toFixed(1),
    windGustsKmh: Math.round(current.wind_gusts_10m),
    suggestedSpeedReduction: hazardScore > 60 ? "Reduce highway speed by 20%" : hazardScore > 30 ? "Drive with headlights on" : "Normal traffic flow",
    bestMorningWindow: "06:30 AM - 07:15 AM (Before peak congestion & rain band)",
    bestEveningWindow: "05:00 PM - 05:45 PM",
  };
}

// Event Planner Weather Comfort Index
export function getEventComfortIndex(weather: AggregatedWeatherData) {
  const current = weather.current;
  const temp = current.temperature_2m;
  const humidity = current.relative_humidity_2m;
  const wind = current.wind_speed_10m;
  const rainProb = weather.hourly?.precipitation_probability?.[0] || 10;

  // Calculate Thom's Discomfort Index (DI)
  const di = temp - (0.55 - 0.0055 * humidity) * (temp - 14.5);

  let comfortRating = "Highly Comfortable";
  let score = 92;
  let recommendation = "Ideal weather for outdoor weddings, rooftop dinners, and festival stages.";

  if (di > 28 || temp > 33) {
    comfortRating = "Hot & Sultry";
    score = 45;
    recommendation = "Provide misting fans, shaded canopies, and plentiful chilled water stations.";
  } else if (di < 15 || temp < 10) {
    comfortRating = "Brisk & Chilly";
    score = 55;
    recommendation = "Rent outdoor patio flame heaters and offer cozy blankets for guests.";
  } else if (rainProb > 40) {
    comfortRating = "Rain Contingency Needed";
    score = 40;
    recommendation = "High probability of rain. Secure an enclosed marquee tent or reserve indoor backup venue.";
  }

  return {
    comfortRating,
    score,
    recommendation,
    discomfortIndex: di.toFixed(1),
    windThreshold: wind > 25 ? "Caution: Anchor lightweight party tents & backdrop decor securely" : "Safe for standard gazebos and inflatables",
    goldenHourPhotography: "06:15 PM - 07:05 PM (Warm natural backlight)",
  };
}

export interface MetricDetail {
  label: string;
  value: string;
  status?: "good" | "warning" | "alert";
}

export interface PersonaVerdict {
  status: "GO" | "CAUTION" | "WAIT";
  headline: string;
  recommendation: string;
  score: number; // 0 - 100
  primaryFactor: string;
  whyThis: string[];
  metrics: MetricDetail[];
}

export function getVerdict(
  persona: PersonaType,
  data: AggregatedWeatherData,
  userNote?: string,
  healthNoteInput: HealthNote | string[] | string = "none"
): PersonaVerdict {
  // Normalize healthNote input
  let healthNote: HealthNote = "none";
  if (Array.isArray(healthNoteInput)) {
    const valid = healthNoteInput.find((h: any) => String(h).toLowerCase() !== "none");
    healthNote = (valid ? String(valid).toLowerCase().replace(/\s+/g, "_") : "none") as HealthNote;
  } else if (typeof healthNoteInput === "string") {
    const normalized = healthNoteInput.toLowerCase().replace(/\s+/g, "_");
    if (["none", "asthma", "skin_sensitivity", "allergies", "heart_condition", "other"].includes(normalized)) {
      healthNote = normalized as HealthNote;
    } else {
      healthNote = "none";
    }
  }

  const current = data.current;
  const temp = current.temperature_2m;
  const humidity = current.relative_humidity_2m ?? 50;
  const aqi = data.air_quality?.current?.us_aqi ?? 45;
  const rainProb = data.hourly?.precipitation_probability?.[0] ?? (current.precipitation > 0 ? 80 : 10);
  const wind = current.wind_speed_10m;
  const uv = data.hourly?.uv_index?.[0] ?? data.daily?.uv_index_max?.[0] ?? 4;
  const vis = data.hourly?.visibility?.[0] ? data.hourly.visibility[0] / 1000 : 10;

  const isAsthma = healthNote === "asthma";
  const isSkin = healthNote === "skin_sensitivity";
  const isAllergies = healthNote === "allergies";
  const isHeart = healthNote === "heart_condition";
  const isOther = healthNote === "other";

  const baseMetrics: MetricDetail[] = [
    { label: "Temperature", value: `${Math.round(temp)}°C`, status: temp > 35 || temp < 2 ? "warning" : "good" },
    { label: "US AQI", value: `${aqi}`, status: aqi > 150 ? "alert" : aqi > 100 ? "warning" : "good" },
    { label: "Rain Probability", value: `${rainProb}%`, status: rainProb > 50 ? "warning" : "good" },
    { label: "UV Index", value: `${uv.toFixed(1)}`, status: uv > 8 ? "alert" : uv > 5 ? "warning" : "good" },
    { label: "Wind Speed", value: `${Math.round(wind)} km/h`, status: wind > 35 ? "warning" : "good" },
  ];

  if (persona === "fitness") {
    let score = 90;
    const whyThis: string[] = [];

    // Temperature & Heat strain
    if (temp > 32) {
      score -= (temp - 30) * 4;
      whyThis.push(`High ambient temperature of ${Math.round(temp)}°C increases thermal and cardiovascular stress.`);
    } else if (temp < 5) {
      score -= 20;
      whyThis.push(`Cold surface temperature of ${Math.round(temp)}°C requires insulated gear.`);
    }

    // Health condition specific penalties
    if (isAsthma) {
      if (aqi > 75) {
        score -= (aqi - 60) * 0.75;
        whyThis.push(`Elevated AQI (${aqi}) with Asthma flagged: fine particulate matter irritates bronchial airways during aerobic breathing.`);
      }
    } else if (isHeart) {
      if (temp > 28 || (temp > 25 && humidity > 65)) {
        score -= (temp - 24) * 5;
        whyThis.push(`Thermal index (${Math.round(temp)}°C, ${humidity}% humidity) increases cardiac workload; pacing is critical.`);
      }
      if (temp < 8) {
        score -= 25;
        whyThis.push(`Cold air (${Math.round(temp)}°C) can trigger peripheral vasoconstriction; warm up thoroughly.`);
      }
    } else if (isAllergies) {
      if (aqi > 80) {
        score -= (aqi - 70) * 0.5;
        whyThis.push(`Airborne particulates (AQI ${aqi}) can aggravate upper respiratory allergies during outdoor running.`);
      }
    } else if (isSkin) {
      if (uv > 5) {
        score -= (uv - 4) * 6;
        whyThis.push(`UV Index of ${uv.toFixed(1)} with sensitive skin flagged: solar radiation accelerates skin irritation.`);
      }
    } else if (aqi > 150) {
      score -= (aqi - 120) * 0.5;
      whyThis.push(`Unhealthy air quality (AQI ${aqi}) reduces aerobic efficiency.`);
    }

    if (rainProb > 40) {
      score -= rainProb * 0.5;
      whyThis.push(`High precipitation probability (${rainProb}%) causes wet/slick running tracks.`);
    }

    score = Math.max(10, Math.min(100, Math.round(score)));

    // Condition-specific WAIT triggers
    if (isAsthma && aqi > 125) {
      return {
        status: "WAIT",
        headline: "Indoor Cardio Recommended",
        recommendation: `WAIT — AQI is Unhealthy (${aqi}); since you flagged asthma, move your workout indoors to protect airway health.`,
        score,
        primaryFactor: "Asthma Airway Protection",
        whyThis,
        metrics: baseMetrics,
      };
    }

    if (isHeart && (temp > 34 || (temp > 31 && humidity > 70))) {
      return {
        status: "WAIT",
        headline: "High Thermal Strain — Rest Indoors",
        recommendation: `WAIT — Ambient heat is ${Math.round(temp)}°C with ${humidity}% humidity; since you flagged a heart condition, avoid strenuous outdoor cardio to prevent cardiac strain.`,
        score,
        primaryFactor: "Cardiovascular Heat Stress",
        whyThis,
        metrics: baseMetrics,
      };
    }

    if (score < 45 || rainProb > 75 || aqi > 160) {
      return {
        status: "WAIT",
        headline: "Indoor Workout Recommended",
        recommendation: aqi > 120
          ? `Unfavorable outdoor air quality (AQI ${aqi}). Move workout indoors or use treadmill.`
          : "Unfavorable outdoor conditions. Postpone outdoor run or use treadmill.",
        score,
        primaryFactor: rainProb > 50 ? "Precipitation" : aqi > 120 ? "Air Quality Threshold" : "Thermal Stress",
        whyThis,
        metrics: baseMetrics,
      };
    }

    // Condition-specific CAUTION triggers
    if (isAsthma && aqi > 80) {
      return {
        status: "CAUTION",
        headline: "Airway Caution for Runners",
        recommendation: `CAUTION — AQI is Moderate (${aqi}); since you flagged asthma, an early morning run is safer than this evening. Keep your inhaler handy.`,
        score,
        primaryFactor: "Asthma & Particulate Sensitivity",
        whyThis,
        metrics: baseMetrics,
      };
    }

    if (isHeart && (temp > 28 || (temp > 26 && humidity > 60) || temp < 8)) {
      return {
        status: "CAUTION",
        headline: "Cardiovascular Thermal Caution",
        recommendation: `CAUTION — Elevated thermal load (${Math.round(temp)}°C, ${humidity}% humidity); since you flagged a heart condition, avoid intense outdoor workouts during peak afternoon hours and stay well hydrated.`,
        score,
        primaryFactor: "Heart & Heat Regulation",
        whyThis,
        metrics: baseMetrics,
      };
    }

    if (isSkin && uv > 4.5) {
      return {
        status: "CAUTION",
        headline: "UV Advisory for Sensitive Skin",
        recommendation: `CAUTION — UV Index is ${uv.toFixed(1)}; since you flagged skin sensitivity, apply SPF 50+ sunscreen before stepping outside and wear a cap.`,
        score,
        primaryFactor: "UV Solar Radiation",
        whyThis,
        metrics: baseMetrics,
      };
    }

    if (isAllergies && (aqi > 75 || temp > 28)) {
      return {
        status: "CAUTION",
        headline: "Allergen Advisory for Runners",
        recommendation: `CAUTION — Airborne allergen activity is elevated; since you flagged allergies, consider taking antihistamines before outdoor running.`,
        score,
        primaryFactor: "Pollen & Allergen Count",
        whyThis,
        metrics: baseMetrics,
      };
    }

    if (isOther && (aqi > 90 || temp > 30)) {
      return {
        status: "CAUTION",
        headline: "Moderate Health Caution",
        recommendation: `CAUTION — Atmospheric parameters may impact your health condition; monitor your exertion levels closely.`,
        score,
        primaryFactor: "Individual Health Threshold",
        whyThis,
        metrics: baseMetrics,
      };
    }

    if (score < 75 || temp > 29) {
      return {
        status: "CAUTION",
        headline: "Moderate Outdoor Conditions",
        recommendation: "Hot conditions today — consider running during the cooler morning window.",
        score,
        primaryFactor: "Thermal Comfort",
        whyThis,
        metrics: baseMetrics,
      };
    }

    return {
      status: "GO",
      headline: "Ideal Running & Workout Window",
      recommendation: "Atmospheric and track conditions are optimal for endurance running, cycling, and calisthenics.",
      score,
      primaryFactor: "Crisp & Clear Weather",
      whyThis: whyThis.length > 0 ? whyThis : ["Clear path and comfortable temperature range for cardio."],
      metrics: baseMetrics,
    };
  }

  if (persona === "health") {
    let score = 95;
    const whyThis: string[] = [];

    if (isAsthma) {
      if (aqi > 75) {
        score -= (aqi - 60) * 0.8;
        whyThis.push(`AQI ${aqi} exceeds optimal respiratory threshold for asthma and airway sensitivity.`);
      }
    } else if (isSkin) {
      if (uv > 4.5) {
        score -= (uv - 3.5) * 10;
        whyThis.push(`Elevated UV index (${uv.toFixed(1)}) triggers rapid skin erythema and photo-sensitivity.`);
      }
    } else if (isHeart) {
      if (temp > 30 || temp < 7) {
        score -= 25;
        whyThis.push(`Extreme thermal conditions (${Math.round(temp)}°C) impact vascular tone and cardiac workload.`);
      }
    } else if (isAllergies) {
      if (aqi > 75) {
        score -= (aqi - 65) * 0.7;
        whyThis.push(`Elevated particulate and pollen count can trigger mucosal allergy symptoms.`);
      }
    } else if (aqi > 100) {
      score -= (aqi - 90) * 0.5;
      whyThis.push(`Air quality index of ${aqi} indicates moderate particulate pollution.`);
    }

    score = Math.max(10, Math.min(100, Math.round(score)));

    // WAIT triggers
    if (isAsthma && aqi > 120) {
      return {
        status: "WAIT",
        headline: "Air Quality Alert — Asthma Advisory",
        recommendation: `WAIT — AQI is Unhealthy (${aqi}); since you flagged asthma, limit prolonged outdoor exposure and keep indoor air filters active.`,
        score,
        primaryFactor: "Respiratory AQI Threshold",
        whyThis,
        metrics: baseMetrics,
      };
    }

    if (isHeart && (temp > 35 || temp < 4)) {
      return {
        status: "WAIT",
        headline: "Thermal Extremes — Heart Advisory",
        recommendation: `WAIT — Ambient temperature is ${Math.round(temp)}°C; since you flagged a heart condition, stay in climate-controlled indoor spaces to avoid cardiac strain.`,
        score,
        primaryFactor: "Cardiovascular Thermal Stress",
        whyThis,
        metrics: baseMetrics,
      };
    }

    if (aqi > 150) {
      return {
        status: "WAIT",
        headline: "Air Quality Alert — Limit Exposure",
        recommendation: "Air quality is poor today — consider limiting prolonged outdoor activity and running indoor filtration.",
        score,
        primaryFactor: "Particulate Matter PM2.5",
        whyThis,
        metrics: baseMetrics,
      };
    }

    // CAUTION triggers
    if (isAsthma && aqi > 75) {
      return {
        status: "CAUTION",
        headline: "Respiratory Caution for Asthma",
        recommendation: `CAUTION — AQI is Moderate (${aqi}); since you flagged asthma, keep your rescue inhaler handy and avoid heavy outdoor exertion.`,
        score,
        primaryFactor: "Asthma Sensitivity",
        whyThis,
        metrics: baseMetrics,
      };
    }

    if (isSkin && uv > 4.0) {
      return {
        status: "CAUTION",
        headline: "Sensitive Skin UV Advisory",
        recommendation: `CAUTION — UV Index is ${uv.toFixed(1)}; since you flagged skin sensitivity, apply SPF 50+ sunscreen before stepping outside and seek midday shade.`,
        score,
        primaryFactor: "Solar UV Radiation",
        whyThis,
        metrics: baseMetrics,
      };
    }

    if (isHeart && (temp > 29 || temp < 9)) {
      return {
        status: "CAUTION",
        headline: "Cardiovascular Health Advisory",
        recommendation: `CAUTION — Thermal conditions are elevated (${Math.round(temp)}°C); since you flagged a heart condition, avoid intense exertion in peak heat and stay well-hydrated.`,
        score,
        primaryFactor: "Thermal Cardiac Strain",
        whyThis,
        metrics: baseMetrics,
      };
    }

    if (isAllergies && (aqi > 70 || temp > 27)) {
      return {
        status: "CAUTION",
        headline: "Pollen & Allergen Advisory",
        recommendation: `CAUTION — Seasonal pollen activity is active; since you flagged allergies, consider taking antihistamines before extended outdoor exposure.`,
        score,
        primaryFactor: "Pollen & Allergen Activity",
        whyThis,
        metrics: baseMetrics,
      };
    }

    if (isOther && (aqi > 80 || temp > 30)) {
      return {
        status: "CAUTION",
        headline: "Health Advisory Note",
        recommendation: `CAUTION — Weather parameters may affect your health condition; monitor local air quality and temperature shifts closely.`,
        score,
        primaryFactor: "Personal Health Advisory",
        whyThis,
        metrics: baseMetrics,
      };
    }

    if (aqi > 80) {
      return {
        status: "CAUTION",
        headline: "Sensitive Groups Advisory",
        recommendation: "Air quality is not ideal for prolonged outdoor activity.",
        score,
        primaryFactor: "Air Quality (AQI)",
        whyThis,
        metrics: baseMetrics,
      };
    }

    return {
      status: "GO",
      headline: "Excellent Air & Environmental Quality",
      recommendation: "Clean air and balanced ambient moisture. Safe for all sensitive demographic groups.",
      score,
      primaryFactor: "Clean Atmospheric Flow",
      whyThis: ["Low pollutant concentration (PM2.5/PM10) and low allergen levels."],
      metrics: baseMetrics,
    };
  }

  if (persona === "beach") {
    const waveH = data.marine?.hourly?.wave_height?.[0] ?? 0.8;
    const whyThis: string[] = [];
    let score = 88;

    if (waveH > 2.2) {
      score -= 40;
      whyThis.push(`Strong swell height of ${waveH.toFixed(1)}m creates dangerous undertows and shorebreaks.`);
    }
    if (rainProb > 40) {
      score -= 30;
      whyThis.push(`Precipitation probability (${rainProb}%) indicates possible seaside squalls.`);
    }
    if (wind > 30) {
      score -= 20;
      whyThis.push(`Gusty coastal winds of ${Math.round(wind)} km/h.`);
    }

    score = Math.max(10, Math.min(100, Math.round(score)));

    if (waveH > 2.2 || rainProb > 60 || current.weather_code === 95) {
      return {
        status: "WAIT",
        headline: "Rough Marine & Shore Conditions",
        recommendation: "Strong waves expected today — check conditions before heading to the beach or stay near lifeguarded zones.",
        score,
        primaryFactor: "Wave Swell & Undertow",
        whyThis,
        metrics: [
          { label: "Wave Swell", value: `${waveH.toFixed(1)} m`, status: waveH > 2.0 ? "alert" : "good" },
          ...baseMetrics.slice(0, 4),
        ],
      };
    }

    if (waveH > 1.4 || wind > 25 || uv > 8) {
      return {
        status: "CAUTION",
        headline: "Moderate Surf & High UV",
        recommendation: "Moderate waves and strong sun. Stay hydrated and apply broad spectrum sunscreen.",
        score,
        primaryFactor: "Surf Energy & Solar Intensity",
        whyThis,
        metrics: baseMetrics,
      };
    }

    return {
      status: "GO",
      headline: "Ideal Beach & Watersports Day",
      recommendation: "Gentle ripples, comfortable sea temperature, and clean coastal skies.",
      score,
      primaryFactor: "Calm Coastal Waters",
      whyThis: ["Safe tidal range, gentle breeze, and clear horizon."],
      metrics: baseMetrics,
    };
  }

  if (persona === "travel") {
    const whyThis: string[] = [];
    let score = 90;

    if (rainProb > 50 || current.precipitation > 2) {
      score -= 35;
      whyThis.push(`Rain probability of ${rainProb}% may cause roadway spray, pooling, and transit delays.`);
    }
    if (vis < 3) {
      score -= 30;
      whyThis.push(`Low surface visibility (${vis.toFixed(1)} km) impacting highway speeds.`);
    }
    if (wind > 40) {
      score -= 25;
      whyThis.push(`Crosswind gusts up to ${Math.round(wind)} km/h.`);
    }

    score = Math.max(10, Math.min(100, Math.round(score)));

    if (score < 50 || current.weather_code === 95 || vis < 1.5) {
      return {
        status: "WAIT",
        headline: "Travel Delays Likely",
        recommendation: "Rain and storms may affect travel later today — allow extra time for your journey and verify flight/train status.",
        score,
        primaryFactor: "Surface Visibility & Storms",
        whyThis,
        metrics: baseMetrics,
      };
    }

    if (score < 75 || rainProb > 30) {
      return {
        status: "CAUTION",
        headline: "Allow Extra Transit Buffer",
        recommendation: "Rain may affect travel later today — allow extra time for your journey.",
        score,
        primaryFactor: "Intermittent Rain Showers",
        whyThis,
        metrics: baseMetrics,
      };
    }

    return {
      status: "GO",
      headline: "Smooth Travel & Transit Expected",
      recommendation: "Clear routes, high highway visibility, and on-time transit conditions.",
      score,
      primaryFactor: "Clear Transport Corridor",
      whyThis: ["High road visibility (> 10 km) and calm regional winds."],
      metrics: baseMetrics,
    };
  }

  if (persona === "parents") {
    const whyThis: string[] = [];
    let score = 92;

    if (rainProb > 40) {
      score -= 30;
      whyThis.push(`Morning rain chance of ${rainProb}% requires rain gear for school drop-offs.`);
    }
    if (aqi > 120 || ((isAsthma || isAllergies) && aqi > 85)) {
      score -= 30;
      whyThis.push(`Air quality (AQI ${aqi}) not ideal for prolonged playground exertion.`);
    }
    if (temp < 8) {
      score -= 20;
      whyThis.push(`Morning chill (${Math.round(temp)}°C) requires winter coat and warm accessories.`);
    }

    score = Math.max(10, Math.min(100, Math.round(score)));

    if (score < 60) {
      return {
        status: "CAUTION",
        headline: "Indoor Recess & Layered Attire Advised",
        recommendation: (isAsthma || isAllergies) && aqi > 85
          ? `CAUTION — AQI is ${aqi}; since you flagged ${isAsthma ? "asthma" : "allergies"}, advise indoor recess during peak dust/smog hours.`
          : "Pack waterproof jacket and prepare for indoor recess due to weather/air quality.",
        score,
        primaryFactor: "Commute & Playground Safety",
        whyThis,
        metrics: baseMetrics,
      };
    }

    return {
      status: "GO",
      headline: "Safe & Pleasant School Day",
      recommendation: "Standard uniforms suitable; playground conditions are dry and comfortable.",
      score,
      primaryFactor: "Pleasant Morning & Afternoon",
      whyThis: ["Low rain risk during bell times and comfortable ambient temperatures."],
      metrics: baseMetrics,
    };
  }

  if (persona === "agriculture") {
    const soilMoisture = (data.hourly?.soil_moisture_0_to_1cm?.[0] ?? 0.35) * 100;
    const whyThis: string[] = [];
    let score = 88;

    if (temp < 2) {
      score -= 40;
      whyThis.push(`Near-freezing temperature (${Math.round(temp)}°C) creates frost hazard for tender crops.`);
    }
    if (soilMoisture < 20 && rainProb < 20) {
      score -= 20;
      whyThis.push("Topsoil moisture is low (< 20%); irrigation required.");
    } else if (soilMoisture > 60) {
      score -= 20;
      whyThis.push("Soil is saturated (> 60%); pause artificial watering.");
    }

    score = Math.max(10, Math.min(100, Math.round(score)));

    if (temp < 2) {
      return {
        status: "WAIT",
        headline: "Frost Alert — Protect Seedlings",
        recommendation: "Cover vulnerable garden beds and potted plants overnight against frost burn.",
        score,
        primaryFactor: "Sub-zero Frost Hazard",
        whyThis,
        metrics: baseMetrics,
      };
    }

    if (score < 75) {
      return {
        status: "CAUTION",
        headline: "Irrigation Adjustment Required",
        recommendation: soilMoisture < 20 ? "Water flowerbeds early in the morning to prevent evaporation." : "Pause irrigation to avoid waterlogging.",
        score,
        primaryFactor: "Soil Hydration Index",
        whyThis,
        metrics: baseMetrics,
      };
    }

    return {
      status: "GO",
      headline: "Optimal Sowing & Gardening Window",
      recommendation: "Balanced soil moisture and gentle daylight promote healthy vegetative growth.",
      score,
      primaryFactor: "Balanced Agro-Climate",
      whyThis: ["Adequate soil moisture and moderate evapotranspiration."],
      metrics: baseMetrics,
    };
  }

  if (persona === "commute") {
    const roadInsight = getCommuteRoadInsight(data);
    const whyThis: string[] = [];
    let score = 100 - roadInsight.hazardScore;

    if (roadInsight.hazardScore > 50) {
      whyThis.push(roadInsight.roadStatus);
      return {
        status: "CAUTION",
        headline: "Slow Traffic & Reduced Speed Advised",
        recommendation: roadInsight.suggestedSpeedReduction,
        score,
        primaryFactor: "Road Surface Friction",
        whyThis,
        metrics: baseMetrics,
      };
    }

    return {
      status: "GO",
      headline: "Clear Highways & Normal Transit",
      recommendation: "Roadways are dry with good visibility and standard stopping distance.",
      score,
      primaryFactor: "Dry Asphalt & Clear Visibility",
      whyThis: ["Clear driving conditions across primary arterial routes."],
      metrics: baseMetrics,
    };
  }

  if (persona === "event") {
    const eventIndex = getEventComfortIndex(data);
    const whyThis: string[] = [];
    let score = eventIndex.score;

    if (score < 60) {
      whyThis.push(eventIndex.comfortRating);
      return {
        status: "CAUTION",
        headline: "Event Contingency Recommended",
        recommendation: eventIndex.recommendation,
        score,
        primaryFactor: "Discomfort Index & Rain Probability",
        whyThis,
        metrics: baseMetrics,
      };
    }

    return {
      status: "GO",
      headline: "Excellent Outdoor Gathering Weather",
      recommendation: eventIndex.recommendation,
      score,
      primaryFactor: "Thermal Balance",
      whyThis: ["Comfortable Discomfort Index and low wind threshold for marquees."],
      metrics: baseMetrics,
    };
  }

  // Default "all"
  return {
    status: aqi > 150 || current.weather_code === 95 ? "CAUTION" : "GO",
    headline: "Daily Weather Outlook",
    recommendation: "Atmospheric metrics are stable across all local observation sectors.",
    score: 85,
    primaryFactor: "General Overview",
    whyThis: ["Standard seasonal meteorological patterns."],
    metrics: baseMetrics,
  };
}

// Personalized Smart Summary deterministic generator
export function getPersonalizedSmartSummary(
  weather: AggregatedWeatherData,
  preferences: UserPreferences,
  alerts: SevereAlert[] = []
): string {
  // 1. Check severe alerts first
  if (alerts.length > 0) {
    const topAlert = alerts[0];
    return `${topAlert.title}: ${topAlert.description.slice(0, 100)}...`;
  }

  const current = weather.current;
  const temp = current.temperature_2m;
  const aqi = weather.air_quality?.current?.us_aqi ?? 45;
  const rainProb = weather.hourly?.precipitation_probability?.[0] ?? 0;
  const waveHeight = weather.marine?.hourly?.wave_height?.[0] ?? 0.8;
  const uv = weather.hourly?.uv_index?.[0] ?? weather.daily?.uv_index_max?.[0] ?? 4;
  const healthNote = preferences.healthNote || "none";

  // 2. Health-specific priority callouts
  if (healthNote === "asthma" && aqi > 80) {
    return `AQI is Moderate (${aqi}); since you flagged asthma, keep your rescue inhaler on hand and limit heavy outdoor cardio.`;
  }
  if (healthNote === "skin_sensitivity" && uv > 4.5) {
    return `UV Index is ${uv.toFixed(1)}; since you flagged skin sensitivity, apply SPF 50+ sunscreen and wear protective layers.`;
  }
  if (healthNote === "heart_condition" && (temp > 30 || temp < 8)) {
    return `Thermal stress detected (${Math.round(temp)}°C); since you flagged a heart condition, avoid intense outdoor workouts and stay in climate-controlled spaces.`;
  }
  if (healthNote === "allergies" && aqi > 75) {
    return `Airborne particulate & allergen activity is elevated; consider antihistamines if planning outdoor tasks.`;
  }

  // 3. Persona matches
  if (preferences.personas.includes("fitness")) {
    if (temp > 30) {
      return "Hot conditions today — consider running during the cooler morning window.";
    }
    if (rainProb > 45) {
      return "Rain showers likely today — plan outdoor workouts during dry intervals.";
    }
    if (temp < 10) {
      return "Chilly air today — dress in thermal layers for your morning jog.";
    }
    return "Prime running conditions today — crisp temperatures and low wind.";
  }

  if (preferences.personas.includes("beach")) {
    if (waveHeight > 2.0) {
      return "Strong waves expected today — check conditions before heading to the beach.";
    }
    if (temp > 28) {
      return "Warm sunny beach day ahead — keep broad spectrum sunscreen handy.";
    }
    return "Gentle swell and safe tidal conditions across local beaches.";
  }

  if (preferences.personas.includes("travel") || preferences.personas.includes("commute")) {
    if (rainProb > 40 || current.rain > 1) {
      return "Rain may affect travel later today — allow extra time for your journey.";
    }
    if (current.weather_code === 45 || (weather.hourly?.visibility?.[0] && weather.hourly.visibility[0] < 2000)) {
      return "Dense mist reducing highway visibility — maintain safe stopping distance.";
    }
    return "Smooth travel conditions today with clear routes and high visibility.";
  }

  if (preferences.personas.includes("parents")) {
    if (rainProb > 35) {
      return "Intermittent rain possible during school hours — pack a light umbrella or raincoat.";
    }
    if (temp < 12) {
      return "Crisp morning for the school run — sweaters or light jackets recommended.";
    }
    return "Clear weather today — safe and comfortable for school commute and outdoor recess.";
  }

  if (preferences.personas.includes("health")) {
    if (aqi <= 50) {
      return "Clean, fresh air quality today — perfect for all outdoor and family activities.";
    }
    return `Current AQI is ${aqi} (${aqi > 100 ? "Unhealthy" : "Moderate"}) — air filters recommended indoors.`;
  }

  // Default general summary
  if (temp > 33) {
    return "High temperatures today — stay hydrated and seek shade during midday hours.";
  }
  if (rainProb > 40) {
    return "Rain showers forecast today — keep an umbrella handy when stepping outside.";
  }
  return "Stable meteorological conditions across your area with pleasant skies.";
}

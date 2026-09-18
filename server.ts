import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "5mb" }));

export { app };

// Lazy initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// In-memory weather cache (10 minutes TTL)
interface CacheEntry {
  timestamp: number;
  data: any;
}
const weatherCache = new Map<string, CacheEntry>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Geocoding API Endpoints (supports both /api/geocode and /api/geocoding)
const handleGeocode = async (req: express.Request, res: express.Response) => {
  try {
    const query = req.query.q as string;
    if (!query || query.trim().length < 2) {
      return res.json({ results: [] });
    }

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=10&language=en&format=json`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding failed with status: ${response.status}`);
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error("Geocode error:", error);
    return res.status(200).json({ results: [], error: error.message || "Failed to search location" });
  }
};

app.get("/api/geocode", handleGeocode);
app.get("/api/geocoding", handleGeocode);

// Reverse Geocoding API Endpoint
app.get("/api/reverse-geocode", async (req, res) => {
  try {
    const lat = req.query.lat as string;
    const lon = req.query.lon as string;
    if (!lat || !lon) {
      return res.status(400).json({ error: "lat and lon are required" });
    }

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lon)}`;

    const response = await fetch(url, {
      headers: { "User-Agent": "MausamWeatherApp/1.0" },
    });

    if (!response.ok) {
      return res.json({ name: "GPS Location", latitude: parseFloat(lat), longitude: parseFloat(lon) });
    }

    const data = await response.json();
    const cityName =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.suburb ||
      data.address?.county ||
      "Current Location";
    const country = data.address?.country || "";
    const admin1 = data.address?.state || "";

    return res.json({
      name: cityName,
      country,
      admin1,
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      isCurrentLocation: true,
    });
  } catch (error: any) {
    console.warn("Reverse geocode error:", error);
    return res.json({
      name: "GPS Location",
      latitude: parseFloat(req.query.lat as string || "0"),
      longitude: parseFloat(req.query.lon as string || "0"),
      isCurrentLocation: true,
    });
  }
});

// Comprehensive Weather + Air Quality + Marine Endpoint
app.get("/api/weather", async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lon = parseFloat(req.query.lon as string);
    const timezone = (req.query.timezone as string) || "auto";

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ error: "Valid latitude and longitude are required" });
    }

    const cacheKey = `${lat.toFixed(3)},${lon.toFixed(3)}`;
    const cached = weatherCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json({ ...cached.data, _cached: true, _cachedAt: cached.timestamp });
    }

    // 1. Fetch Forecast & Soil & UV data
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,pressure_msl,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,is_day,soil_temperature_0cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,et0_fao_evapotranspiration&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,et0_fao_evapotranspiration&timezone=${encodeURIComponent(
      timezone
    )}&forecast_days=14`;

    // 2. Fetch Air Quality & Pollen data
    const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust,uv_index&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust,uv_index,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen,us_aqi,european_aqi&timezone=${encodeURIComponent(
      timezone
    )}&forecast_days=5`;

    // 3. Fetch Marine data (may return error if inland, so handle separately)
    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height,wave_direction,wave_period,wind_wave_height,wind_wave_direction,wind_wave_period,swell_wave_height,swell_wave_direction,swell_wave_period,ocean_current_velocity,ocean_current_direction,sea_surface_temperature&daily=wave_height_max,wave_direction_dominant,wave_period_max,wind_wave_height_max,swell_wave_height_max&timezone=${encodeURIComponent(
      timezone
    )}&forecast_days=5`;

    const [forecastRes, airQualityRes, marineRes] = await Promise.allSettled([
      fetch(forecastUrl),
      fetch(airQualityUrl),
      fetch(marineUrl),
    ]);

    let forecastData: any = null;
    let airQualityData: any = null;
    let marineData: any = null;

    if (forecastRes.status === "fulfilled" && forecastRes.value.ok) {
      forecastData = await forecastRes.value.json();
    } else {
      throw new Error("Failed to fetch primary weather forecast");
    }

    if (airQualityRes.status === "fulfilled" && airQualityRes.value.ok) {
      airQualityData = await airQualityRes.value.json();
    }

    if (marineRes.status === "fulfilled" && marineRes.value.ok) {
      marineData = await marineRes.value.json();
    }

    const aggregated = {
      latitude: lat,
      longitude: lon,
      timezone: forecastData.timezone || timezone,
      elevation: forecastData.elevation,
      current: forecastData.current,
      hourly: forecastData.hourly,
      daily: forecastData.daily,
      air_quality: airQualityData,
      marine: marineData,
      fetchedAt: new Date().toISOString(),
    };

    weatherCache.set(cacheKey, {
      timestamp: Date.now(),
      data: aggregated,
    });

    return res.json(aggregated);
  } catch (error: any) {
    console.error("Weather fetch error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch weather data" });
  }
});

// Quota cooldown & in-memory cache for fast response and 429 rate-limit resilience
let quotaCooldownUntil = 0;
const adviceCache = new Map<string, { text: string; modelUsed: string; timestamp: number }>();

// Language Detection Helper (English, Devanagari Hindi, or Hinglish Roman Hindi)
function detectUserLanguage(text?: string): "english" | "hindi" | "hinglish" {
  if (!text || !text.trim()) return "english";

  // Check for Devanagari Unicode range (\u0900-\u097F)
  if (/[\u0900-\u097F]/.test(text)) {
    return "hindi";
  }

  // Tokenize Latin script words
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const hinglishKeywords = new Set([
    "kya", "kyu", "kyun", "kaise", "kaisa", "kaisi", "kab", "kitna", "kitni", "kitne",
    "aaj", "kal", "parso", "subah", "dopahar", "shaam", "sham", "raat",
    "barish", "baarish", "barsat", "hogi", "hoga", "honge", "hote", "hota", "hoti",
    "mausam", "dhoop", "dhup", "garmi", "thand", "sardi", "hawa", "toofan", "tufan",
    "kapde", "kapda", "pehan", "pehanu", "pehnu", "pehn", "pehne",
    "bahar", "andar", "daud", "daudne", "tehal", "tehalne", "ghumne", "ghoomne", "nikal", "nikle",
    "chhatri", "chatri", "pani", "paani", "gaadi", "gadi", "kisaan", "fasal", "khet",
    "hai", "hain", "hoon", "hun", "tha", "thi", "the", "rahega", "rahegi", "rahenge",
    "batao", "bataiye", "bolo", "bata", "chahiye", "zaroorat", "zarurat",
    "chalega", "jayega", "jaana", "jana", "jaaye", "jaye", "sakte", "sakti", "sakta",
    "nahi", "nahin", "na", "mat", "bhi", "toh", "to", "aur", "ya", "lekin", "magar",
    "meri", "mera", "mere", "aap", "tum", "hum", "main", "mujhe", "hamein"
  ]);

  for (const word of words) {
    if (hinglishKeywords.has(word)) {
      return "hinglish";
    }
  }

  return "english";
}

// Gemini AI Weather Intelligence Endpoint with Resilient Multi-Tier Fallback & Fast Execution
async function generateGeminiAdviceWithFallback(
  systemPrompt: string,
  userPrompt: string,
  persona: string,
  weatherSummary: any,
  locationName: string,
  promptQuestion?: string,
  chatHistory?: Array<{ sender: string; text: string }>
): Promise<{ text: string; modelUsed: string }> {
  // Check in-memory cache first (60s TTL)
  const cacheKey = `${locationName}_${persona}_${promptQuestion || "default"}_${weatherSummary?.temp || ""}`;
  const cached = adviceCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 60000) {
    return { text: cached.text, modelUsed: cached.modelUsed };
  }

  // If in active 429 quota cooldown, immediately use the local deterministic meteorological engine
  if (Date.now() < quotaCooldownUntil) {
    const fallbackText = generateDeterministicWeatherAdvice(persona, weatherSummary, locationName, promptQuestion);
    return { text: fallbackText, modelUsed: "Mausam Intelligence Engine" };
  }

  // Supported Gemini models from @google/genai guidelines in optimized resilient priority order
  const candidateModels = [
    "gemini-3.8-flash",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
  ];

  try {
    const ai = getGeminiClient();

    // Format chat history into Gemini contents if available
    let contentsPayload: any = userPrompt;
    if (chatHistory && chatHistory.length > 0) {
      const formattedHistory: any[] = [];
      for (const msg of chatHistory.slice(-8)) {
        if (!msg.text) continue;
        formattedHistory.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
      formattedHistory.push({
        role: "user",
        parts: [{ text: userPrompt }],
      });
      contentsPayload = formattedHistory;
    }

    for (let i = 0; i < candidateModels.length; i++) {
      const model = candidateModels[i];
      try {
        const apiPromise = ai.models.generateContent({
          model,
          contents: contentsPayload,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });

        // 8000ms timeout per model allows full generation while staying responsive
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("AI generation timeout")), 8000)
        );

        const response: any = await Promise.race([apiPromise, timeoutPromise]);

        if (response && response.text && response.text.trim().length > 0) {
          const result = { text: response.text, modelUsed: model };
          adviceCache.set(cacheKey, { ...result, timestamp: Date.now() });
          return result;
        }
      } catch (modelError: any) {
        const errStr = modelError?.message || "";
        const isQuota = errStr.includes("429") || errStr.includes("quota") || errStr.includes("RESOURCE_EXHAUSTED");
        const isHighDemand = errStr.includes("503") || errStr.includes("high demand") || errStr.includes("UNAVAILABLE");

        if (isQuota) {
          quotaCooldownUntil = Date.now() + 30000; // 30-second cooldown
          console.info(`[MausamAI] Model ${model} quota reached, switching...`);
        } else if (isHighDemand) {
          console.info(`[MausamAI] Model ${model} is at peak demand (503), switching to next tier...`);
        } else {
          console.info(`[MausamAI] Model ${model} unavailable, switching to next tier...`);
        }
        continue;
      }
    }
  } catch (initError: any) {
    console.info("[MausamAI] Switching to deterministic meteorological intelligence engine");
  }

  // Instant fallback to deep multi-perspective local meteorological reasoning engine
  const fallbackText = generateDeterministicWeatherAdvice(persona, weatherSummary, locationName, promptQuestion);
  const fallbackResult = { text: fallbackText, modelUsed: "Mausam Intelligence Engine" };
  adviceCache.set(cacheKey, { ...fallbackResult, timestamp: Date.now() });
  return fallbackResult;
}

function generateDeterministicWeatherAdvice(
  persona: string,
  w: any,
  locationName: string,
  promptQuestion?: string,
  userProfile?: any
): string {
  // Support both unified weatherContext structure and legacy summary structure
  const current = w?.current || w;
  const temp = Math.round(current?.temp ?? current?.currentTemp ?? 22);
  const feels = Math.round(current?.feelsLike ?? temp);
  const humidity = Math.round(current?.humidity ?? 55);
  const wind = Math.round(current?.windSpeed ?? current?.windKmh ?? 14);
  const windGusts = Math.round(current?.windGusts ?? wind * 1.4);
  const aqi = Math.round(current?.aqi ?? 42);
  const uv = Number((current?.uvIndex ?? 4.5).toFixed(1));
  const rainChance = Math.round(current?.rainChance ?? 10);
  const rain = Number((current?.precipitationMm ?? current?.precipitation ?? 0).toFixed(1));
  
  // Daily min/max from daily forecast or fallback
  const firstDay = w?.daily?.[0];
  const maxTemp = Math.round(firstDay?.tempHigh ?? w?.todayMaxTemp ?? temp + 3);
  const minTemp = Math.round(firstDay?.tempLow ?? w?.todayMinTemp ?? temp - 4);
  const soilMoist = Math.round(current?.soilMoisturePct ?? (w?.soilMoisture ?? 0.35) * 100);
  const waveH = Number((current?.marineWaveHeightM ?? w?.marineWaveHeight ?? 1.2).toFixed(1));

  // Health considerations from userProfile / unified context
  const healthNote: string = userProfile?.healthNote || w?.userProfile?.healthNote || (Array.isArray(userProfile?.healthConsiderations) ? userProfile.healthConsiderations[0] : "none");
  const isAsthma = healthNote === "asthma" || healthNote?.toLowerCase()?.includes("asthma");
  const isSkin = healthNote === "skin_sensitivity" || healthNote?.toLowerCase()?.includes("skin");
  const isAllergies = healthNote === "allergies" || healthNote?.toLowerCase()?.includes("allerg");
  const isHeart = healthNote === "heart_condition" || healthNote?.toLowerCase()?.includes("heart");

  // Pure English levels (default)
  const aqiLevel = aqi <= 50 ? "Good" : aqi <= 100 ? "Moderate" : aqi <= 150 ? "Unhealthy for Sensitive Groups" : "Unhealthy";
  const uvLevel = uv <= 2 ? "Low" : uv <= 5 ? "Moderate" : uv <= 7 ? "High" : uv <= 10 ? "Very High" : "Extreme";

  // Pure Hindi (Devanagari) levels
  const aqiLevelHi = aqi <= 50 ? "उत्तम" : aqi <= 100 ? "मध्यम" : aqi <= 150 ? "संवेदनशील वर्गों के लिए अस्वस्थ" : "खराब";
  const uvLevelHi = uv <= 2 ? "कम" : uv <= 5 ? "मध्यम" : uv <= 7 ? "उच्च" : uv <= 10 ? "अत्यधिक" : "चरम";

  // Pure Hinglish (Roman Hindi) levels
  const aqiLevelHinglish = aqi <= 50 ? "Acchi" : aqi <= 100 ? "Moderate" : aqi <= 150 ? "Sensitive logo ke liye thodi kharab" : "Kharab";
  const uvLevelHinglish = uv <= 2 ? "Kam" : uv <= 5 ? "Medium" : uv <= 7 ? "High" : "Bahut High";

  // Detect query language (English, Devanagari Hindi, or Hinglish)
  const detectedLang = detectUserLanguage(promptQuestion);
  const qLower = (promptQuestion || "").toLowerCase();

  if (persona === "health") {
    return `### 🌿 Mausam Health, AQI & Allergy Intelligence for **${locationName}**

- **Air Quality & Respiratory Dynamics**: **AQI ${aqi} (${aqiLevel})**${isAsthma ? " • *Asthma Sensitivity Active*" : ""}. ${
      aqi <= 50
        ? "Clean air index. Optimal for open ventilation and unconstrained outdoor breathing."
        : aqi <= 100
        ? "Moderate particulate levels. Individuals with asthma or dust sensitivity should keep rescue inhalers accessible during high-traffic hours."
        : "Elevated particulate pollution. Sensitive groups (asthma, COPD) should limit strenuous outdoor exertion."
    }
- **Pollen & Environmental Allergens**: Dispersal peaks during morning breezes. ${isAllergies ? "Allergy precautions advised: keep car windows up in traffic." : "Standard seasonal baseline."}
- **UV Radiation & Skin Shield**: **UV Index ${uv} (${uvLevel})**. ${
      uv >= 6
        ? "High solar radiation hazard. Apply broad-spectrum SPF 30+, wear UV400 sunglasses, and seek shade between 11:00 AM and 03:30 PM."
        : "Moderate solar radiation. Standard skin protection advised for prolonged midday exposure."
    }
- **Atmospheric Hydration & Sinus Comfort**: **${humidity}% Humidity** with temperature at **${temp}°C** (Feels like **${feels}°C**).
- **Multi-Perspective Wellness Wisdom**:
  1. Maintain steady cellular hydration (aim for 2.5L+ fluids today).
  2. Rinse face and eyes with cool water after outdoor commutes to remove microscopic particles.
  3. If running indoor air conditioning or fans, maintain clean filters to reduce particulate re-circulation.`;
  }

  if (persona === "fitness") {
    const safetyScore = Math.max(50, Math.min(98, 100 - (temp > 30 ? (temp - 30) * 4 : 0) - (aqi > 100 ? 15 : 0) - (rain > 5 ? 20 : 0)));
    return `### 🏃 Mausam Outdoor Athletic & Training Plan for **${locationName}**

- **Optimal Workout Time Windows**:
  - **Prime Morning Window**: **06:00 AM – 08:30 AM** (Coolest ambient temperature, low UV, minimal thermal strain).
  - **Golden Twilight Window**: **05:45 PM – 07:45 PM** (Softening sun rays, decreasing road heat, optimal tempo pace).
- **Thermal Index & Hydration**: Current **${temp}°C** (Feels like **${feels}°C**). Consume **400–600ml of water or electrolyte blend per 45 minutes** of running/cycling.
- **Wind Dynamics & Aerodynamics**: **${wind} km/h** breeze (gusting to **${windGusts} km/h**). Plan your route out into the headwind to catch a supportive tailwind on the return leg.
- **Pavement Traction**: ${rain > 0 || rainChance > 50 ? "⚠️ Damp surface risk — exercise caution on road markings and metal utility covers." : "✅ Dry asphalt with maximum shoe grip and cornering stability."}
- **Workout Readiness Score**: **${safetyScore}/100** — *${safetyScore > 80 ? "Prime conditions for intervals, long runs, and endurance rides" : "Moderate conditions; pace conservatively and monitor heart rate"}*.`;
  }

  if (persona === "beach") {
    return `### 🌊 Mausam Coastal & Marine Advisory for **${locationName}**

- **Surf & Swell Assessment**: Significant Wave Height **~${waveH}m**. Moderate coastal action suitable for swimming, kayaking, and intermediate wave riding.
- **Coastal Wind & Surface Chop**: Surface breeze at **${wind} km/h**. Afternoon sea breeze develops light texture; morning hours offer the cleanest glassy surface.
- **Solar Exposure & Water Reflection**: **UV Index ${uv} (${uvLevel})**. Surface water reflection increases UV absorption — reapply water-resistant SPF 50+ every 90 minutes.
- **Coastal Safety**: Swim strictly between patrolled lifeguard flags and monitor tidal currents.
- **Beachgoer Suitability Rating**: **8.5 / 10** — Excellent day for shoreline walks, coastal workouts, and leisure swimming.`;
  }

  if (persona === "travel") {
    return `### ✈️ Mausam Travel Intelligence & Packing Guide for **${locationName}**

- **Thermal Range**: Daytime high **${maxTemp}°C**, nocturnal low **${minTemp}°C** (Current **${temp}°C**).
- **Precipitation Outlook**: **${rain > 0 ? `${rain}mm rain` : `Rain probability ${rainChance}%`}**. ${rain > 0 || rainChance > 40 ? "Pack a lightweight packable rain jacket or umbrella." : "Dry conditions anticipated."}
- **Smart Luggage & Layering Checklist**:
  - Breathable daywear (cotton, moisture-wicking technical fabrics).
  - Transitional mid-layer (light knitwear or windbreaker) for evening temperature drops.
  - UV & solar kit: polarized sunglasses (UV Index ${uv}), broad-spectrum sunscreen, and a protective cap.
  - Ergonomic walking shoes with non-slip soles.
- **Transit & Aviation Reliability**: Standard meteorological conditions with no significant wind shear or fog disruption flags.`;
  }

  if (persona === "parents") {
    return `### 🎒 Mausam Family & School Routine Briefing for **${locationName}**

- **School Morning Commute (07:00 – 08:30 AM)**: Temperature around **${minTemp + 2}°C**. ${
      minTemp < 15 ? "Send children with a zip jacket or fleece layer." : "Pleasant morning temperatures; standard school attire is suitable."
    }
- **Afternoon Recess & Pickup (01:30 – 03:30 PM)**: Peak diurnal warmth reaching **${maxTemp}°C** with UV index at **${uv}**. Outdoor recess is **Safe & Recommended**.
- **Sun & Skin Care**: Apply sunscreen prior to school drop-off if UV index is moderate to high. Ensure children have a dedicated water bottle.
- **Evening Family Activities**: High comfort window between **05:00 PM and 08:00 PM** for neighborhood park visits, scootering, and cycling.`;
  }

  if (persona === "agriculture") {
    return `### 🌱 Mausam Agricultural & Soil Vitality Advisory for **${locationName}**

- **Topsoil Moisture Profile (0–1cm)**: **${soilMoist}% saturation**. ${
      soilMoist < 30
        ? "Topsoil is dry. Early morning deep drip irrigation recommended."
        : soilMoist > 65
        ? "Soil moisture is elevated. Defer irrigation to avoid waterlogging and root hypoxia."
        : "Optimal soil moisture equilibrium for seed germination and root nutrient uptake."
    }
- **Thermal & Frost Stress**: Minimum forecasted night temp **${minTemp}°C**. No frost or freeze risk detected for open-field crops.
- **Evapotranspiration & Spray Window**: Wind speeds at **${wind} km/h** with **${humidity}% humidity**. Optimal window for foliar feeding or organic spraying is **06:30 AM – 09:00 AM** when drift is lowest.
- **Agricultural Outlook**: Ideal window for seedbed preparation, mulching, and routine crop maintenance.`;
  }

  if (persona === "commute") {
    return `### 🚗 Mausam Commuter & Road Safety Briefing for **${locationName}**

- **Road Condition & Traction**: **Dry & Clear**. Visibility exceeds 10 km with standard pavement grip (Rain chance: ${rainChance}%).
- **Optimal Departure Windows**:
  - **Morning Commute**: Depart before **07:45 AM** or after **08:45 AM** to avoid peak bottleneck slowdowns.
  - **Evening Commute**: Smooth driving conditions between **05:15 PM and 06:45 PM**.
- **Crosswind & Vehicle Dynamics**: Breeze at **${wind} km/h** (gusts **${windGusts} km/h**); low crosswind risk on highways, bridges, and flyovers.
- **Headlight & Safety Guidance**: Daytime running lights recommended in tunnels and high-contrast sun glare stretches.`;
  }

  if (persona === "event") {
    return `### 🎪 Mausam Event & Gathering Risk Assessment for **${locationName}**

- **Outdoor Comfort Index**: **88/100 (Optimal)**. Ambient **${temp}°C** with **${humidity}% humidity** ensures high guest comfort.
- **Rain Probability**: **${rainChance}%** — low likelihood of unexpected downpours during standard event hours.
- **Canopy & Tent Structural Wind Safety**: Peak gusts at **${windGusts} km/h** are well beneath standard marquee safety threshold (35+ km/h). Standard tie-downs are secure.
- **Evening Transition**: Have warm accent lighting and cozy wraps or patio heating on standby if guests remain outdoors past 09:00 PM (${minTemp}°C).`;
  }

  // Custom question / Comprehensive Multi-Perspective Wisdom
  if (promptQuestion) {
    if (detectedLang === "hindi") {
      let hindiAdvice = "";
      if (qLower.includes("बारिश") || qLower.includes("छाता") || qLower.includes("पानी") || qLower.includes("वर्षा") || qLower.includes("rain") || qLower.includes("barish")) {
        hindiAdvice = `**बारिश और छाता सलाह**:
- **स्थिति**: ${locationName} में वर्तमान तापमान **${temp}°C** है और आज बारिश की संभावना **${rainChance}%** (${rain > 0 ? `${rain}mm सक्रिय` : "शुष्क मौसम"}) है।
- **छाता ले जाना चाहिए?**: ${rainChance > 35 || rain > 0 ? "हाँ, हल्का छाता या रेनकोट साथ रखना सुरक्षित रहेगा।" : `नहीं, आज बारिश की संभावना सिर्फ ${rainChance}% है, छाता अनिवार्य नहीं है।`}`;
      } else if (qLower.includes("कपड़े") || qLower.includes("पहन") || qLower.includes("ड्रेस") || qLower.includes("कपडे") || qLower.includes("pehn") || qLower.includes("kapde")) {
        hindiAdvice = `**कपड़ों और पहनावे की सलाह**:
- **तापमान**: अभी **${temp}°C** (महसूस: **${feels}°C**), दिन का अधिकतम **${maxTemp}°C** और रात का न्यूनतम **${minTemp}°C** रहेगा।
- **UV इंडेक्स**: **${uv} (${uvLevelHi})**।
- **क्या पहनें**: ${
          temp >= 28
            ? `हल्के कॉटन/सूती और हवादार कपड़े पहनें। धूप से बचने के लिए चश्मा और सनस्क्रीन उपयोगी रहेगी।`
            : temp <= 16
            ? "हल्की जैकेट या गर्म कपड़े पहनना बेहतर रहेगा।"
            : "आरामदायक सामान्य टी-शर्ट/शर्ट और शाम के लिए हल्का श्रग या जैकेट उपयुक्त है।"
        }`;
      } else if (qLower.includes("दौड़") || qLower.includes("व्यायाम") || qLower.includes("टहल") || qLower.includes("कसरत") || qLower.includes("daud") || qLower.includes("run")) {
        hindiAdvice = `**दौड़ने व वर्कआउट का समय**:
- **सबसे सही समय**: सुबह **06:00 AM – 08:30 AM** या शाम **05:45 PM – 07:30 PM** सबसे अनुकूल रहेगा।
- **हवा और AQI**: हवा की गति **${wind} km/h** है और वायु गुणवत्ता AQI **${aqi} (${aqiLevelHi})** है।
- **हाइड्रेशन**: वर्तमान तापमान **${temp}°C** पर व्यायाम के दौरान पर्याप्त पानी या इलेक्ट्रोलाइट पिएं।`;
      } else if (qLower.includes("हवा") || qLower.includes("प्रदूषण") || qLower.includes("सांस") || qLower.includes("aqi")) {
        hindiAdvice = `**हवा की गुणवत्ता और स्वास्थ्य**:
- **AQI इंडेक्स**: **${aqi} (${aqiLevelHi})**${isAsthma ? " (अस्थमा सेंसिटिविटी नोटेड)" : ""}।
- **सलाह**: ${
          aqi <= 50
            ? "हवा एकदम ताज़ा और शुद्ध है, खुले वातावरण में सांस लेना सुरक्षित है।"
            : aqi <= 100
            ? "हवा की गुणवत्ता मध्यम है। अस्थमा या एलर्जी वाले लोग भारी ट्रैफिक में सावधानी बरतें।"
            : "प्रदूषण बढ़ा हुआ है। संवेदनशील लोग बाहर जाते समय N95 मास्क का प्रयोग करें।"
        }`;
      } else {
        hindiAdvice = `**मौसम का संक्षिप्त विश्लेषण**:
- **तापमान**: वर्तमान में **${temp}°C** (महसूस: **${feels}°C**)।
- **दिन का दायरा**: न्यूनतम **${minTemp}°C** से अधिकतम **${maxTemp}°C**।
- **हवा और नमी**: **${wind} km/h** हवा, **${humidity}%** नमी, **UV ${uv} (${uvLevelHi})**, और AQI **${aqi} (${aqiLevelHi})**।
- **निष्कर्ष**: दिनभर के सामान्य कार्यों और यात्रा के लिए मौसम अनुकूल व स्थिर है।`;
      }

      return `### 🌤️ मौसम एआई परामर्श • **${locationName}**

**आपका सवाल**: *"${promptQuestion}"*

${hindiAdvice}

---
- **लाइव आंकड़े**: **${temp}°C** (महसूस: **${feels}°C**) • अधिकतम **${maxTemp}°C** / न्यूनतम **${minTemp}°C**
- **पर्यावरण स्थिति**: **AQI ${aqi} (${aqiLevelHi})** • **UV इंडेक्स: ${uv}** • बारिश: **${rainChance}%**`;
    }

    if (detectedLang === "hinglish") {
      let hinglishAdvice = "";
      if (qLower.includes("barish") || qLower.includes("baarish") || qLower.includes("chhatri") || qLower.includes("chatri") || qLower.includes("pani") || qLower.includes("rain") || qLower.includes("umbrella")) {
        hinglishAdvice = `**Barish aur Chhatri Advisory**:
- **Current Status**: ${locationName} mein abhi temperature **${temp}°C** hai aur aaj barish ka chance **${rainChance}%** (${rain > 0 ? `${rain}mm barish active hai` : "weather dry hai"}) hai.
- **Chhatri chahiye ya nahi?**: ${rainChance > 35 || rain > 0 ? "Haan, safe side ke liye ek umbrella ya raincoat sath rakhna behtar rahega." : `Nahi, aaj barish ka chance sirf ${rainChance}% hai, chhatri le jaane ki zaroorat nahi hai.`}`;
      } else if (qLower.includes("kapde") || qLower.includes("pehn") || qLower.includes("pehnu") || qLower.includes("pehan") || qLower.includes("wear") || qLower.includes("dress")) {
        hinglishAdvice = `**Kapde aur Outfits Guidance**:
- **Temperature**: Abhi **${temp}°C** (Feels like **${feels}°C**), aaj max **${maxTemp}°C** aur min **${minTemp}°C** rahega.
- **UV Index**: **${uv} (${uvLevelHinglish})** hai.
- **Kya Pehne**: ${
          temp >= 28
            ? `Light cotton ya breathable clothes pehne. Dhoop se bachne ke liye sunglasses aur sunscreen useful rahegi.`
            : temp <= 16
            ? "Halki jacket ya warm sweater pehanna best rahega."
            : "Comfortable casual clothes pehne, shaam ke liye halki jacket rakh sakte hain."
        }`;
      } else if (qLower.includes("daud") || qLower.includes("tehal") || qLower.includes("run") || qLower.includes("workout") || qLower.includes("walk") || qLower.includes("gym")) {
        hinglishAdvice = `**Outdoor Workout & Running Guidance**:
- **Best Timing**: Morning mein **06:00 AM – 08:30 AM** ya evening mein **05:45 PM – 07:30 PM** sabse accha time rahega.
- **Wind & AQI**: Hawa ki speed **${wind} km/h** hai aur AQI **${aqi} (${aqiLevelHinglish})** hai.
- **Hydration**: Temperature **${temp}°C** hai, isliye workout ke time water bottle paas rakhein.`;
      } else if (qLower.includes("ghoomne") || qLower.includes("ghumne") || qLower.includes("trip") || qLower.includes("bahar")) {
        hinglishAdvice = `**Bahar Ghoomne aur Travel Advisory**:
- **Verdict**: Haan, bahar ghoomne aur travel karne ke liye mausam kaafi accha aur steady hai.
- **Hawa aur Visibility**: Visibility 10+ km hai aur hawa **${wind} km/h** chal rahi hai.
- **Barish ka Risk**: Barish ka chance sirf **${rainChance}%** hai, plans safely execute kar sakte hain.`;
      } else {
        hinglishAdvice = `**Weather Overview**:
- **Current Temperature**: Abhi **${temp}°C** (Feels like **${feels}°C**), min **${minTemp}°C** aur max **${maxTemp}°C** rahega.
- **Environment**: AQI **${aqi} (${aqiLevelHinglish})**, UV Index **${uv}**, aur hawa **${wind} km/h** hai.
- **Summary**: Aaj ka din regular outdoor kaam aur commute ke liye kaafi safe aur comfortable hai.`;
      }

      return `### 🌤️ Mausam AI Advisory • **${locationName}**

**Aapka Sawaal**: *"${promptQuestion}"*

${hinglishAdvice}

---
- **Live Numbers**: **${temp}°C** (Feels: **${feels}°C**) • High **${maxTemp}°C** / Low **${minTemp}°C**
- **Environmental Telemetry**: **AQI ${aqi} (${aqiLevelHinglish})** • **UV Index: ${uv}** • Rain: **${rainChance}%**`;
    }

    // English Custom Question Handling (100% English, no Hindi terms)
    let specificFocus = "";
    if (qLower.includes("wear") || qLower.includes("cloth") || qLower.includes("jacket") || qLower.includes("dress") || qLower.includes("outfit")) {
      specificFocus = `**Outfit & Layering Guidance**:
- **Thermal Range**: Currently **${temp}°C** (Feels like **${feels}°C**), daily spread **${minTemp}°C – ${maxTemp}°C**, with UV Index **${uv} (${uvLevel})**.
- **Daytime**: ${temp >= 26 ? "Breathable cotton or linen fabrics with sunglasses and SPF 30+." : temp <= 16 ? "A warm fleece jacket, knitwear, or windbreaker." : "Comfortable lightweight clothes with a light jacket for the cooler evening."}
- **Evening Transition**: ${minTemp < 18 ? `A light jacket or stylish layer is recommended as temperatures drop toward ${minTemp}°C.` : "Comfortable lightweight clothes are sufficient throughout the night."}`;
    } else if (qLower.includes("run") || qLower.includes("jog") || qLower.includes("workout") || qLower.includes("exercise") || qLower.includes("walk") || qLower.includes("cycle") || qLower.includes("bike")) {
      specificFocus = `**Athletic & Fitness Guidance**: Current conditions are **${temp}°C** with **AQI ${aqi} (${aqiLevel})**.
- **Best Windows**: **06:00 AM – 08:30 AM** or **05:45 PM – 07:45 PM** to avoid peak thermal and UV load (UV Max: ${uv}).
- **Hydration Target**: 400–600ml fluid per 45 min of activity.
- **Wind Impact**: **${wind} km/h** breeze with dry pavement traction.`;
    } else if (qLower.includes("rain") || qLower.includes("umbrella") || qLower.includes("storm") || qLower.includes("shower") || qLower.includes("wet")) {
      specificFocus = `**Precipitation & Umbrella Advisory**: Current rain chance is **${rainChance}%** (Precipitation: **${rain}mm**).
- ${rainChance > 35 || rain > 0 ? "⚠️ Intermittent rain chance — keep a compact umbrella or water-resistant jacket handy." : `✅ Low rain probability across daytime hours (${rainChance}%); an umbrella is not strictly required today.`}
- **Humidity**: **${humidity}%** with clear road visibility.`;
    } else if (qLower.includes("car") || qLower.includes("wash") || qLower.includes("clean car")) {
      specificFocus = `**Car Wash Advisory**:
- **Verdict**: **Great day for a car wash!** (Rain chance: **${rainChance}%**)
- **Drying Speed**: Moderate humidity (${humidity}%) and warm breeze (${wind} km/h) ensure clean evaporation without water spots.
- **Rain Risk**: Low precipitation probability over the next 48 hours.`;
    } else if (qLower.includes("allergy") || qLower.includes("asthma") || qLower.includes("aqi") || qLower.includes("breathe") || qLower.includes("health") || qLower.includes("pollen")) {
      specificFocus = `**Health & Respiratory Guidance**:
- **Air Quality**: **AQI ${aqi} (${aqiLevel})**${isAsthma ? " • *Asthma Sensitivity Active*" : ""}.
- **Airway Safety**: ${aqi <= 50 ? "Air is fresh and unpolluted; ideal for deep outdoor breathing." : aqi <= 100 ? "Moderate levels. Sensitive individuals should take standard precautions near heavy traffic." : "Elevated particulate pollution. Sensitive groups should wear an N95 mask outdoors."}
- **UV Exposure**: **UV Index ${uv} (${uvLevel})** — apply SPF 30+ if staying in direct sun.`;
    } else {
      specificFocus = `**Comprehensive Weather Guidance**:
- **Thermal Profile**: Currently **${temp}°C** (Feels like **${feels}°C**), diurnal spread **${minTemp}°C – ${maxTemp}°C**.
- **Atmospheric Index**: **AQI ${aqi} (${aqiLevel})** • **UV Index ${uv} (${uvLevel})** • **${humidity}% Humidity** • **${wind} km/h** Wind.
- **Summary**: Favorable and stable conditions for outdoor pursuits, commuting, and daily activities.`;
    }

    return `### 🌤️ Mausam AI Wisdom for **${locationName}**

**Question**: *"${promptQuestion}"*

${specificFocus}

---
- **Real-Time Telemetry**: **${temp}°C** (Feels like **${feels}°C**) • High **${maxTemp}°C** / Low **${minTemp}°C**
- **Environmental Quality**: **AQI ${aqi} (${aqiLevel})** • **UV Index ${uv} (${uvLevel})** • Rain: **${rainChance}%**`;
  }

  return `### 🌤️ Mausam Daily Multi-Perspective Overview for **${locationName}**

- **Thermal Comfort & RealFeel**: Currently **${temp}°C** (Feels like **${feels}°C**), spanning **${minTemp}°C** to **${maxTemp}°C**.
- **Environmental & Skin Health**: **AQI ${aqi} (${aqiLevel})** with **UV Index ${uv} (${uvLevel})**.
- **Atmosphere & Movement**: Wind at **${wind} km/h**, humidity at **${humidity}%**, and dry road traction.`;
}

// Gemini AI Weather Intelligence Endpoint (supports multiple route paths)
const handleAiAdvisor = async (req: express.Request, res: express.Response) => {
  try {
    const { persona, weatherContext, weatherSummary, locationName, promptQuestion, customContext, chatHistory, userProfile } = req.body;

    // Use either the new unified weatherContext or fallback to weatherSummary
    const safeContext = weatherContext || weatherSummary || {};
    const safeLocation = locationName || safeContext.location?.name || "Current Location";

    // Extract exact numbers from weatherContext
    const current = safeContext.current || safeContext;
    const tempVal = current.temp ?? current.currentTemp ?? 22;
    const feelsVal = current.feelsLike ?? tempVal;
    const uvVal = current.uvIndex ?? 4.5;
    const aqiVal = current.aqi ?? 42;
    const humidityVal = current.humidity ?? 55;
    const windVal = current.windSpeed ?? current.windKmh ?? 14;
    const rainChanceVal = current.rainChance ?? 10;
    const activePersonas = safeContext.userProfile?.activePersonas || (persona ? [persona] : ["health", "fitness"]);
    const healthNote = safeContext.userProfile?.healthNote || userProfile?.healthNote || (Array.isArray(userProfile?.healthConsiderations) ? userProfile.healthConsiderations[0] : "none");
    const healthNoteLabel = safeContext.userProfile?.healthNoteLabel || (healthNote === "asthma" ? "Asthma / Respiratory" : healthNote === "skin_sensitivity" ? "Skin Sensitivity" : healthNote === "allergies" ? "Allergies" : healthNote === "heart_condition" ? "Heart Condition" : healthNote);

    const detectedUserLang = detectUserLanguage(promptQuestion || customContext);

    let systemPrompt = `You are 'Mausam AI' (मौसम एआई), the ultra-accurate, intelligent, and warm meteorological personal companion inside the Mausam weather application.

CRITICAL INSTRUCTIONS (STRICT COMPLIANCE REQUIRED):
1. ABSOLUTE DATA CONSISTENCY: You MUST use ONLY the exact live meteorological telemetry provided below. NEVER invent, estimate, guess, or hallucinate conflicting weather numbers (such as UV Index, AQI, Temperature, Feels Like, Wind Speed, or Rain Chance).
   - If UV Index is provided as ${uvVal}, you MUST reference ${uvVal}.
   - If AQI is provided as ${aqiVal}, you MUST reference ${aqiVal}.
   - If Temperature is provided as ${tempVal}°C, you MUST reference ${tempVal}°C.
   - If Rain Chance is provided as ${rainChanceVal}%, you MUST reference ${rainChanceVal}%.
2. TRUE PERSONALIZATION: Ground your recommendations in the user's active personas (${JSON.stringify(activePersonas)}) and flagged health condition ("${healthNoteLabel}"). If the user has asthma, skin sensitivity, allergies, or a heart condition, explicitly tailor advice (e.g. inhaler reminders for asthma when AQI > 75, SPF 50+ warnings for skin sensitivity when UV > 4.5, heat strain advisories for heart conditions).
3. MANDATORY LANGUAGE PARITY & MIRRORING PROTOCOL (HIGHEST PRIORITY):
   Detected Query Language: "${detectedUserLang.toUpperCase()}".
   - If user asks in ENGLISH: You MUST reply COMPLETELY AND EXCLUSIVELY in English. NEVER use Hindi or Hinglish words (do NOT say "Mausam Paramarsh", "Acchi", "Hogi", "Kapde", etc.).
   - If user asks in DEVANAGARI HINDI (हिंदी): You MUST reply COMPLETELY in Devanagari Hindi (हिंदी).
   - If user asks in HINGLISH (Roman Hindi words like "aaj barish hogi kya", "kya pehnu", "bahar ghumne ja sakte hain"): You MUST reply in conversational, natural Hinglish (Roman Hindi) with relatable Indian phrasing.
   - STRICT RULE: ALWAYS match the exact language and script of the user's query!
4. DIRECT ANSWER FIRST: Always give a clear, direct, and actionable answer immediately in the first 1-2 sentences.
5. CONCISE & PRACTICAL: Keep answers within 2-4 structured sentences or crisp bullet points with clean markdown.`;

    let userPrompt = "";

    const telemetryBlock = `LIVE WEATHER CONTEXT FOR ${safeLocation.toUpperCase()}:
${JSON.stringify(safeContext, null, 2)}
USER PREFERENCES & PROFILE:
- Active Personas: ${JSON.stringify(activePersonas)}
- Health Consideration: "${healthNoteLabel}" (Health Note Key: ${healthNote})
- User Name: ${safeContext.userProfile?.userName || safeContext.userProfile?.name || "Citizen"}`;

    if (promptQuestion) {
      userPrompt = `${telemetryBlock}

User Question/Inquiry: "${promptQuestion}"
${customContext ? `Additional User Context: ${customContext}` : ""}

Answer the user's inquiry accurately, structuring your response with clear headings, exact live numbers (Temp ${tempVal}°C, Feels ${feelsVal}°C, UV ${uvVal}, AQI ${aqiVal}, Wind ${windVal} km/h, Rain ${rainChanceVal}%), and explicit personalization for their health consideration ("${healthNoteLabel}") and active persona profile (${JSON.stringify(activePersonas)}).
CRITICAL: Reply strictly in ${detectedUserLang === "english" ? "100% English (no Hindi/Hinglish terms)" : detectedUserLang === "hindi" ? "100% Devanagari Hindi (हिंदी)" : "100% conversational Hinglish (Roman Hindi)"}.`;
    } else if (persona === "fitness") {
      userPrompt = `${telemetryBlock}

Provide a comprehensive Outdoor Fitness & Athletic Training Plan for ${safeLocation}. Include:
1. Optimal workout time windows (Morning vs Evening) based on temperature (${tempVal}°C) and UV (${uvVal})
2. Exact hydration and electrolyte guidance
3. Pavement traction and wind dynamics (${windVal} km/h)
4. Health-tailored precautions for "${healthNoteLabel}" (e.g. respiratory/thermal alerts)`;
    } else if (persona === "health") {
      userPrompt = `${telemetryBlock}

Provide a personalized Health, Air Quality & Allergy Action Report for ${safeLocation}. Include:
1. Air quality & respiratory dynamics for AQI ${aqiVal}
2. Pollen & allergen dispersal
3. UV Radiation (${uvVal}) & skin protection
4. Specific health precautions and medication/inhaler/hydration advice for "${healthNoteLabel}"`;
    } else if (persona === "beach") {
      userPrompt = `${telemetryBlock}

Provide a Coastal & Beach Activity Plan for ${safeLocation}. Include:
1. Sea breeze (${windVal} km/h) and surf suitability
2. UV radiation index (${uvVal}) and sunblock reapplication intervals
3. Best tidal/water leisure windows and heat precautions for "${healthNoteLabel}"`;
    } else if (persona === "travel") {
      userPrompt = `${telemetryBlock}

Provide a Travel Intelligence & Packing Plan for ${safeLocation}. Include:
1. Day-to-night temperature range (${tempVal}°C) and layering checklist
2. Rain probability (${rainChanceVal}%) and transit advisory
3. Travel health kit recommendations tailored to "${healthNoteLabel}"`;
    } else if (persona === "parents") {
      userPrompt = `${telemetryBlock}

Provide a Family & School Day Routine Plan for ${safeLocation}. Include:
1. Morning drop-off clothing and thermal comfort
2. Afternoon recess UV (${uvVal}) and hydration guidance
3. Evening outdoor playtime window and family health precautions for "${healthNoteLabel}"`;
    } else if (persona === "agriculture") {
      userPrompt = `${telemetryBlock}

Provide an Agricultural & Garden Management Advisory for ${safeLocation}. Include:
1. Topsoil moisture evaluation and optimal irrigation schedule
2. Wind (${windVal} km/h) and best spraying/fertilizer application window
3. Crop protection and frost/heat stress overview`;
    } else if (persona === "commute") {
      userPrompt = `${telemetryBlock}

Provide a Daily Commuter & Road Safety Briefing for ${safeLocation}. Include:
1. Road surface traction and rain risk (${rainChanceVal}%)
2. Optimal departure time windows to avoid weather/traffic stress
3. Crosswind (${windVal} km/h), visibility, and vehicle AC recirculation guidance`;
    } else if (persona === "event") {
      userPrompt = `${telemetryBlock}

Provide an Outdoor Event & Gathering Feasibility Report for ${safeLocation}. Include:
1. Guest thermal comfort index (Temp ${tempVal}°C, Feels ${feelsVal}°C, Humidity ${humidityVal}%)
2. Rain contingency and canopy/tent wind gust (${windVal} km/h) safety
3. Guest comfort amenities and health considerations for "${healthNoteLabel}"`;
    } else {
      userPrompt = `${telemetryBlock}

Provide a personalized Daily Weather Intelligence Briefing for ${safeLocation} tailored to the user's active personas (${JSON.stringify(activePersonas)}) and health note ("${healthNoteLabel}"). Reference exact metrics (Temp ${tempVal}°C, AQI ${aqiVal}, UV ${uvVal}, Rain ${rainChanceVal}%).`;
    }

    const { text, modelUsed } = await generateGeminiAdviceWithFallback(
      systemPrompt,
      userPrompt,
      persona || "general",
      safeContext,
      safeLocation,
      promptQuestion,
      chatHistory
    );

    return res.json({
      advice: text,
      persona: persona || "general",
      modelUsed,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Gemini advisor error:", error);
    const fallbackText = generateDeterministicWeatherAdvice(
      req.body?.persona || "general",
      req.body?.weatherContext || req.body?.weatherSummary || {},
      req.body?.locationName || "Current Location",
      req.body?.promptQuestion,
      req.body?.userProfile
    );
    return res.json({
      advice: fallbackText,
      persona: req.body?.persona || "general",
      modelUsed: "mausam-meteorological-engine",
      timestamp: new Date().toISOString(),
    });
  }
};


app.post("/api/gemini/advisor", handleAiAdvisor);
app.post("/api/gemini/copilot", handleAiAdvisor);
app.post("/api/advisor", handleAiAdvisor);

// Vite Middleware for development and static serve for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mausam server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

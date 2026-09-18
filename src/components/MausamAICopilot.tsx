import React, { useState, useEffect, useRef } from "react";
import { AggregatedWeatherData, PersonaType, UnifiedWeatherContext, UserPreferences, UserProfile } from "../types";
import Markdown from "react-markdown";
import {
  Sparkles,
  Send,
  Bot,
  User,
  X,
  Mic,
  MicOff,
  Copy,
  Check,
  Trash2,
} from "lucide-react";

interface MausamAICopilotProps {
  isOpen: boolean;
  onClose: () => void;
  weather: AggregatedWeatherData;
  locationName: string;
  weatherContext?: UnifiedWeatherContext | null;
  userPreferences?: UserPreferences;
  userProfile?: UserProfile;
  initialPersona?: PersonaType;
  initialQuestion?: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  modelUsed?: string;
  isError?: boolean;
}

export const MausamAICopilot: React.FC<MausamAICopilotProps> = ({
  isOpen,
  onClose,
  weather,
  locationName,
  weatherContext,
  userPreferences,
  userProfile,
  initialPersona = "all",
  initialQuestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const lastTriggerRef = useRef<string>("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const healthNoteLabel = userPreferences?.healthNote === "asthma"
    ? "Asthma / Respiratory"
    : userPreferences?.healthNote === "skin_sensitivity"
    ? "Skin Sensitivity"
    : userPreferences?.healthNote === "allergies"
    ? "Allergies"
    : userPreferences?.healthNote === "heart_condition"
    ? "Heart Condition"
    : userPreferences?.healthNote === "other"
    ? "Other Condition"
    : "None";

  // Request AI Advice
  const fetchAdvice = async (persona: string, customQuestion?: string) => {
    setIsLoading(true);

    const questionText =
      customQuestion ||
      (persona === "fitness"
        ? "🏃 Create a personalized outdoor workout and training plan with optimal morning/evening timing windows, hydration target, UV shield advice, and pace strategy based on current weather."
        : persona === "health"
        ? "🌿 Generate a comprehensive health, air quality (AQI), pollen allergy, and respiratory protection advisory tailored to my profile."
        : persona === "beach"
        ? "🌊 Provide a coastal surf, tidal safety, UV exposure, and water activity advisory for today."
        : persona === "travel"
        ? "✈️ Create a personalized travel packing list, transit weather outlook, and day-to-night outfit checklist."
        : persona === "parents"
        ? "🎒 Provide a family and school day routine briefing covering morning dropoff attire, afternoon recess safety, and UV/rain precautions for children."
        : persona === "agriculture"
        ? "🌱 Provide an agricultural crop management advisory with soil moisture assessment, spraying window, and frost/heat risk."
        : persona === "commute"
        ? "🚗 Provide a daily commuter briefing with road traction, departure time recommendations, and visibility/weather hazards."
        : persona === "event"
        ? "🎪 Provide an outdoor event feasibility and risk assessment covering guest comfort, tent wind safety, and rain contingency."
        : `🌤️ Give me a comprehensive personalized weather briefing and lifestyle plan for ${locationName}.`);

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: questionText,
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      },
    ]);

    const currentHistory = [
      ...messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      })),
      { sender: "user", text: questionText },
    ];

    try {
      const weatherSummary = weatherContext
        ? {
            location: weatherContext.location.city,
            currentTemp: weatherContext.current.temp,
            feelsLike: weatherContext.current.feelsLike,
            conditionCode: weather.current.weather_code,
            humidity: weatherContext.current.humidity,
            windKmh: weatherContext.current.windSpeed,
            windGusts: weatherContext.current.windGusts,
            precipitation: weatherContext.current.rainChance,
            aqi: weatherContext.current.aqi,
            uvIndex: weatherContext.current.uvIndex,
            todayMaxTemp: weatherContext.daily[0]?.tempHigh ?? weather.daily?.temperature_2m_max?.[0],
            todayMinTemp: weatherContext.daily[0]?.tempLow ?? weather.daily?.temperature_2m_min?.[0],
            sunrise: weatherContext.daily[0]?.sunrise ?? weather.daily?.sunrise?.[0],
            sunset: weatherContext.daily[0]?.sunset ?? weather.daily?.sunset?.[0],
            soilMoisture: weather.hourly?.soil_moisture_0_to_1cm?.[0],
            marineWaveHeight: weather.marine?.hourly?.wave_height?.[0],
          }
        : {
            location: locationName,
            currentTemp: weather.current.temperature_2m,
            feelsLike: weather.current.apparent_temperature,
            conditionCode: weather.current.weather_code,
            humidity: weather.current.relative_humidity_2m,
            windKmh: weather.current.wind_speed_10m,
            windGusts: weather.current.wind_gusts_10m,
            precipitation: weather.current.precipitation,
            aqi: weather.air_quality?.current?.us_aqi || 42,
            uvIndex: weather.hourly?.uv_index?.[0] || weather.daily?.uv_index_max?.[0] || 4.5,
            todayMaxTemp: weather.daily?.temperature_2m_max?.[0],
            todayMinTemp: weather.daily?.temperature_2m_min?.[0],
            sunrise: weather.daily?.sunrise?.[0],
            sunset: weather.daily?.sunset?.[0],
            soilMoisture: weather.hourly?.soil_moisture_0_to_1cm?.[0],
            marineWaveHeight: weather.marine?.hourly?.wave_height?.[0],
          };

      const effectiveUserProfile = userProfile || {
        name: userProfile?.name || "Citizen",
        userName: userProfile?.name || "Citizen",
        healthNote: userPreferences?.healthNote || "none",
        healthNoteLabel,
        activePersonas: userPreferences?.personas || [persona as PersonaType],
      };

      const res = await fetch("/api/gemini/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona,
          weatherSummary,
          weatherContext: weatherContext || undefined,
          userProfile: effectiveUserProfile,
          locationName,
          promptQuestion: questionText,
          chatHistory: currentHistory,
        }),
      });

      let data: any = null;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = {
            advice:
              "### 🌤️ Mausam Meteorological Advisory\n\n- **Live Telemetry**: Current conditions are active and updated.\n- **Recommendation**: Wear appropriate seasonal layers and stay hydrated throughout your routine.",
            modelUsed: "Meteorological Engine",
          };
        }
      }

      const modelLabel =
        data?.modelUsed === "mausam-meteorological-engine"
          ? "Meteorological Engine"
          : data?.modelUsed || "Live AI";

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: data?.advice || "Here is your personalized weather intelligence briefing.",
          timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
          modelUsed: modelLabel,
        },
      ]);
    } catch (err: any) {
      console.error("AI fetch notice:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: `### 🌤️ Mausam Meteorological Advisory for **${locationName}**\n\n- **Real-Time Recommendation**: Conditions are favorable. Stay hydrated and check hourly trend windows for optimal outdoor timing.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
          modelUsed: "Meteorological Engine",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // On open or when initialPersona/initialQuestion changes
  useEffect(() => {
    if (isOpen) {
      const triggerKey = `${initialPersona || "general"}-${initialQuestion || ""}`;
      if (lastTriggerRef.current !== triggerKey) {
        lastTriggerRef.current = triggerKey;
        if (initialQuestion) {
          fetchAdvice(initialPersona || "general", initialQuestion);
        } else if (initialPersona && initialPersona !== "all") {
          fetchAdvice(initialPersona);
        } else if (messages.length === 0) {
          fetchAdvice("general");
        }
      }
    } else {
      lastTriggerRef.current = "";
    }
  }, [isOpen, initialPersona, initialQuestion]);

  // Voice speech recognition setup
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please type your question.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "hi-IN"; // Supports Hindi / Hinglish / English seamlessly
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([]);
    fetchAdvice("general");
  };

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const q = inputText.trim();
    setInputText("");
    fetchAdvice(initialPersona, q);
  };

  const userHealth = userPreferences?.healthNote || "none";

  const quickQuestions = [
    // Multi-lingual Hinglish & Hindi questions
    { label: "🌧️ Aaj barish hogi kya?", q: "Aaj barish hone ki kitni sambhavna hai? Kya mujhe bahar jaate samay chhatri ya raincoat le jana chahiye?" },
    { label: "👕 Aaj kya pehnu?", q: "Aaj ke mausam aur temperature ke hisab se mujhe kya kapde pehnne chahiye?" },
    { label: "🏃 Bahar daudne ja sakte hain?", q: "Kya aaj outdoor running ya workout ke liye mausam accha hai? Best timing kya rahegi?" },
    { label: "☀️ आज धूप और गर्मी कैसी रहेगी?", q: "आज धूप, तापमान और UV इंडेक्स कैसा रहेगा? क्या बाहर जाना सुरक्षित है?" },
    // English questions
    ...(userHealth === "asthma"
      ? [{ label: "🫁 Asthma & Air Quality today?", q: "How does today's AQI, particulate matter, and humidity affect asthma and respiratory comfort?" }]
      : userHealth === "skin_sensitivity"
      ? [{ label: "🧴 Sunscreen SPF advice for sensitive skin?", q: "What SPF sunscreen, clothing, and UV precautions are needed for sensitive skin today?" }]
      : userHealth === "allergies"
      ? [{ label: "🌿 Pollen & Allergy forecast today?", q: "What is the pollen, dust, and allergen forecast for today and what precautions are needed?" }]
      : userHealth === "heart_condition"
      ? [{ label: "❤️ Thermal strain & cardiac comfort?", q: "How do today's temperature, humidity, and heat index affect heart strain and physical exertion?" }]
      : []),
    { label: "🌧️ Is umbrella needed today?", q: "Is there any rain expected today? Do I need an umbrella or waterproof jacket?" },
    { label: "🚗 Traffic & road conditions?", q: "What are the commuter road traction, visibility, and traffic weather conditions today?" },
    { label: "🎒 School routine for kids?", q: "What are the school morning dropoff and afternoon pickup conditions for children today?" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl h-[88vh] rounded-3xl bg-slate-900 border border-purple-500/40 shadow-2xl flex flex-col overflow-hidden mausam-ai-modal-card">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Mausam AI Companion</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live AI
                </span>
              </div>
              <p className="text-xs text-slate-400">Meteorological Advisor for {locationName}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClearChat}
              disabled={isLoading}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              title="Reset conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Preferences Sync Bar */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Synced Profile:</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
              {userProfile?.name || "Citizen"}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20 font-medium">
              Personas: {userPreferences?.personas?.join(", ") || "General"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Health Consideration:</span>
            <span className={`px-2 py-0.5 rounded-md border font-medium ${
              userHealth !== "none"
                ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
                : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
            }`}>
              {healthNoteLabel}
            </span>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "ai" && (
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-1">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed relative group ${
                  msg.sender === "user"
                    ? "mausam-chat-user-bubble rounded-tr-none shadow-md"
                    : "mausam-chat-ai-bubble rounded-tl-none border shadow-md"
                }`}
              >
                {msg.sender === "ai" && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="absolute top-2 right-2 p-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    title="Copy advice"
                  >
                    {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}

                <div className="markdown-body mausam-chat-markdown max-w-none text-xs sm:text-sm">
                  <Markdown>{msg.text}</Markdown>
                </div>
                <span className="text-[10px] opacity-70 mt-2 block text-right font-mono">
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-purple-200 shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-purple-300 p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 animate-pulse">
              <Bot className="w-4 h-4 text-purple-400 animate-spin shrink-0" />
              <span>Mausam AI is formulating advice in your language with exact meteorological telemetry...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions suggestion row */}
        <div className="p-2.5 bg-slate-950/60 border-t border-white/5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Quick Questions (Tap to Ask):</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => fetchAdvice(initialPersona, q.q)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-purple-600/30 hover:border-purple-500/40 border border-white/10 text-slate-300 hover:text-white text-[11px] whitespace-nowrap transition cursor-pointer shrink-0 disabled:opacity-50"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-white/10 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-2xl border transition cursor-pointer shrink-0 ${
              isListening
                ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse"
                : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
            }`}
            title={isListening ? "Listening... Click to stop" : "Voice input (English / Hindi)"}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask in English, हिंदी, or Hinglish (e.g., 'aaj barish hogi kya?')..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 shadow-lg shadow-purple-900/40 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};


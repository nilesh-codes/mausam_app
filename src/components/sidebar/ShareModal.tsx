import React, { useState } from "react";
import { AggregatedWeatherData, GeoLocation } from "../../types";
import { Share2, X, Copy, Check, MessageSquare, Send, Sparkles } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  weather: AggregatedWeatherData | null;
  location: GeoLocation;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  weather,
  location,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const current = weather?.current;
  const temp = Math.round(current?.temperature_2m ?? 30);
  const feelsLike = Math.round(current?.apparent_temperature ?? 32);
  const humidity = Math.round(current?.relative_humidity_2m ?? 60);
  const wind = Math.round(current?.wind_speed_10m ?? 12);
  const aqi = weather?.air_quality?.current?.us_aqi ?? 65;

  const weatherBulletinText = `🌦️ Mausam Weather Intelligence Report
📍 Location: ${location.name}, ${location.admin1 || location.country || "India"}
🌡️ Temperature: ${temp}°C (Feels like ${feelsLike}°C)
💧 Humidity: ${humidity}%
💨 Wind Speed: ${wind} km/h
🍃 Air Quality Index: ${aqi} (AQI)

Check real-time Doppler radar & agro advisories on Mausam App.`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(weatherBulletinText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Weather in ${location.name} - Mausam`,
          text: weatherBulletinText,
          url: window.location.href,
        });
      } catch (e) {
        handleCopyText();
      }
    } else {
      handleCopyText();
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(weatherBulletinText)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-white/20 shadow-2xl p-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Share Weather Bulletin</h3>
              <p className="text-xs text-slate-400">Share Real-Time Snapshot with Family & Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Snapshot Preview Card */}
        <div className="py-4 space-y-3">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-900/40 to-slate-950 border border-sky-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400">{location.name}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Live Snapshot</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white">{temp}°C</span>
              <span className="text-xs text-slate-300">Feels {feelsLike}°C</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-[11px] text-slate-300 pt-1 border-t border-white/5">
              <span>💧 {humidity}% RH</span>
              <span>💨 {wind} km/h</span>
              <span>🍃 AQI {aqi}</span>
            </div>
          </div>

          {/* Formatted Text Box */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-white/5">
            <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap select-all">
              {weatherBulletinText}
            </pre>
          </div>

          {/* Share Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleWhatsAppShare}
              className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" /> Share on WhatsApp
            </button>

            <button
              onClick={handleNativeShare}
              className="py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied Bulletin!" : "Copy / Share Link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

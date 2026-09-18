import React, { useState, useEffect } from "react";
import { GeoLocation } from "../types";
import { Search, MapPin, X, Loader2, Star, Trash2, Navigation } from "lucide-react";

interface LocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (loc: GeoLocation) => void;
  savedLocations: GeoLocation[];
  onSaveLocation: (loc: GeoLocation) => void;
  onRemoveLocation: (loc: GeoLocation) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
}

export const LocationSearchModal: React.FC<LocationSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  savedLocations,
  onSaveLocation,
  onRemoveLocation,
  onUseCurrentLocation,
  isLocating,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(query.trim())}`);
        if (!res.ok) {
          throw new Error(`Search service returned status ${res.status}`);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          // Direct fallback to open-meteo if proxy returned non-JSON
          const directRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
              query.trim()
            )}&count=10&language=en&format=json`
          );
          if (directRes.ok) {
            const directData = await directRes.json();
            setResults(directData.results || []);
            return;
          }
          throw new Error("Invalid response format");
        }
        const data = await res.json();
        setResults(data.results || []);
      } catch (err: any) {
        console.warn("Geocoding notice:", err);
        // Direct client fallback
        try {
          const directRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
              query.trim()
            )}&count=10&language=en&format=json`
          );
          if (directRes.ok) {
            const directData = await directRes.json();
            setResults(directData.results || []);
            return;
          }
        } catch {
          // Ignore secondary error
        }
        setSearchError("Unable to load search results. Please try again.");
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-white/20 shadow-2xl p-5 text-white max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold">Search Location</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative my-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, state or country (e.g., Tokyo, London, Sydney)..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* GPS Geolocation Quick Button */}
        <button
          onClick={() => {
            onUseCurrentLocation();
            onClose();
          }}
          disabled={isLocating}
          className="w-full mb-3 py-2.5 px-4 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
        >
          <Navigation className={`w-4 h-4 text-sky-400 ${isLocating ? "animate-spin" : ""}`} />
          <span>{isLocating ? "Acquiring GPS Fix..." : "Use Current GPS Location"}</span>
        </button>

        {/* Results / Saved List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {isSearching && (
            <div className="flex items-center justify-center py-8 text-xs text-slate-400 gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              <span>Searching meteorological stations across globe...</span>
            </div>
          )}

          {searchError && (
            <div className="py-4 text-center text-xs text-rose-400">{searchError}</div>
          )}

          {/* Search Query Results */}
          {!isSearching && query.length >= 2 && results.length === 0 && !searchError && (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching locations found for "{query}".
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block px-1 mb-1">
                Search Results
              </span>
              {results.map((loc, idx) => (
                <div
                  key={`${loc.name}-${loc.latitude}-${idx}`}
                  onClick={() => {
                    onSelectLocation(loc);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-400 shrink-0 group-hover:bg-sky-500/30 transition">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">{loc.name}</span>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {loc.admin1 ? `${loc.admin1}, ` : ""}
                        {loc.country || "Global Station"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSaveLocation(loc);
                    }}
                    className="p-2 text-slate-400 hover:text-amber-400 transition"
                    title="Save to favorites"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Saved / Recent Locations when no search is active */}
          {query.length < 2 && (
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block px-1 mb-1">
                Saved & Suggested Locations
              </span>
              {savedLocations.map((loc) => (
                <div
                  key={`${loc.name}-${loc.latitude}`}
                  onClick={() => {
                    onSelectLocation(loc);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-400 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">{loc.name}</span>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {loc.admin1 ? `${loc.admin1}, ` : ""}
                        {loc.country}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveLocation(loc);
                    }}
                    className="p-2 text-slate-500 hover:text-rose-400 transition"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

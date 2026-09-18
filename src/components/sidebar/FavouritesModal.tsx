import React, { useState } from "react";
import { GeoLocation } from "../../types";
import { Heart, X, MapPin, Trash2, Plus, Check } from "lucide-react";

interface FavouritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedLocations: GeoLocation[];
  currentLocation: GeoLocation;
  onSelectLocation: (loc: GeoLocation) => void;
  onDeleteLocation: (loc: GeoLocation) => void;
  onOpenSearch: () => void;
}

export const FavouritesModal: React.FC<FavouritesModalProps> = ({
  isOpen,
  onClose,
  savedLocations,
  currentLocation,
  onSelectLocation,
  onDeleteLocation,
  onOpenSearch,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-white/20 shadow-2xl p-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-rose-500/30" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Favourite Locations</h3>
              <p className="text-xs text-slate-400">Quick Switch & Monitored Cities</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Add */}
        <div className="py-3">
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-900/30 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add New City / District
          </button>
        </div>

        {/* Saved List */}
        <div className="space-y-2">
          {savedLocations.length === 0 ? (
            <p className="text-center py-6 text-xs text-slate-400">No saved locations yet.</p>
          ) : (
            savedLocations.map((loc) => {
              const isActive = loc.name === currentLocation.name && Math.abs(loc.latitude - currentLocation.latitude) < 0.01;
              return (
                <div
                  key={`${loc.name}-${loc.latitude}`}
                  className={`p-3 rounded-2xl flex items-center justify-between border transition ${
                    isActive ? "bg-rose-500/20 border-rose-400/50" : "bg-slate-800/60 border-white/5 hover:bg-slate-800"
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelectLocation(loc);
                      onClose();
                    }}
                    className="flex items-center gap-3 text-left flex-1 min-w-0 cursor-pointer group"
                  >
                    <div className={`p-2 rounded-xl ${isActive ? "bg-rose-500 text-white" : "bg-slate-700 text-slate-300"}`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold text-white block group-hover:text-rose-300 transition truncate">
                        {loc.name}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate block">
                        {loc.admin1 ? `${loc.admin1}, ` : ""}{loc.country || "India"}
                      </span>
                    </div>
                  </button>

                  <div className="flex items-center gap-1">
                    {isActive && (
                      <span className="text-[10px] uppercase font-bold text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-500/30 mr-1">
                        Active
                      </span>
                    )}
                    <button
                      onClick={() => onDeleteLocation(loc)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                      title="Remove from favourites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

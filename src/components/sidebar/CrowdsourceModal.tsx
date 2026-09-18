import React, { useState } from "react";
import { CrowdsourceObservation, GeoLocation, UserProfile } from "../../types";
import { OfflineStorage } from "../../utils/offlineCache";
import {
  Users,
  X,
  Send,
  ThumbsUp,
  CheckCircle,
  MapPin,
  AlertCircle,
  PlusCircle,
  Sparkles,
  Award,
} from "lucide-react";

interface CrowdsourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: GeoLocation;
  userProfile: UserProfile;
  onUpdateProfile?: (profile: UserProfile) => void;
  onOpenPerks?: () => void;
}

export const CrowdsourceModal: React.FC<CrowdsourceModalProps> = ({
  isOpen,
  onClose,
  location,
  userProfile,
  onUpdateProfile,
  onOpenPerks,
}) => {
  const [observations, setObservations] = useState<CrowdsourceObservation[]>(() =>
    OfflineStorage.getCrowdsourceObservations()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [perksRewardToast, setPerksRewardToast] = useState<string | null>(null);

  // Form state
  const [category, setCategory] = useState<CrowdsourceObservation["category"]>("Light Rain");
  const [intensity, setIntensity] = useState<CrowdsourceObservation["intensity"]>("Moderate");
  const [description, setDescription] = useState("");
  const [reportedLocation, setReportedLocation] = useState(location.name);

  if (!isOpen) return null;

  const categories: CrowdsourceObservation["category"][] = [
    "Light Rain",
    "Heavy Rain",
    "Thunderstorm",
    "Hailstorm",
    "Dense Fog",
    "Waterlogging",
    "Strong Wind",
    "Clear & Sunny",
  ];

  const handleUpvote = (id: string) => {
    const updated = observations.map((obs) =>
      obs.id === id ? { ...obs, upvotes: obs.upvotes + 1 } : obs
    );
    setObservations(updated);
    OfflineStorage.saveCrowdsourceObservations(updated);

    // Award upvote perk only if logged in
    if (userProfile.isLoggedIn) {
      const res = OfflineStorage.awardPerkPoints(5, "Helpful Ground Truth Upvote", userProfile);
      if (res.success && onUpdateProfile) {
        onUpdateProfile({ ...userProfile, points: res.newTotal });
      }
      setPerksRewardToast("👍 +5 Observer Perks earned for peer verification!");
    } else {
      setPerksRewardToast("👍 Upvote recorded! (Sign in to earn Observer Perks)");
    }
    setTimeout(() => setPerksRewardToast(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const place = reportedLocation.trim() || location.name;
    const newObs: CrowdsourceObservation = {
      id: `cs-${Date.now()}`,
      timestamp: "Just now",
      locationName: place,
      category,
      intensity,
      description: description.trim() || `Observed ${category} in ${place}.`,
      reporterName: userProfile.isLoggedIn ? `${userProfile.name} (${userProfile.role})` : "Citizen Observer",
      verified: true,
      upvotes: 1,
    };

    const updated = [newObs, ...observations];
    setObservations(updated);
    OfflineStorage.saveCrowdsourceObservations(updated);

    // Award +50 Perks points only if logged in
    if (userProfile.isLoggedIn) {
      const res = OfflineStorage.awardPerkPoints(
        50,
        `Ground Weather Report: ${category} in ${place}`,
        userProfile
      );
      if (res.success && onUpdateProfile) {
        onUpdateProfile({ ...userProfile, points: res.newTotal });
      }
      setPerksRewardToast("🎉 +50 Observer Perks awarded for your ground observation report!");
    } else {
      setPerksRewardToast("📢 Observation submitted! (Sign in to earn +50 Observer Perks)");
    }
    setTimeout(() => setPerksRewardToast(null), 4500);

    setDescription("");
    setShowAddForm(false);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl p-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Crowd Source Weather</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  Citizen Science
                </span>
              </div>
              <p className="text-xs text-slate-400">IMD Citizen Ground Observation Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Perks Toast Notification */}
        {perksRewardToast && (
          <div className="my-2 p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/10 border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              {perksRewardToast}
            </span>
            {onOpenPerks && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPerks();
                }}
                className="text-[11px] underline text-amber-300 hover:text-amber-100 cursor-pointer ml-2"
              >
                View Vault
              </button>
            )}
          </div>
        )}

        {/* Action & Perks Incentive Banner */}
        <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <p className="text-xs text-slate-300">
              Real-time ground reports submitted by registered citizen observers.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                <Award className="w-3 h-3 text-amber-400" /> Earn +50 Observer Perks / Report
              </span>
              <span className="text-[11px] text-slate-400">+5 for verifying</span>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-900/30 transition cursor-pointer shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            {showAddForm ? "View Feed" : "Report Weather (+50 pts)"}
          </button>
        </div>

        {/* Add Observation Form */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-slate-800/80 border border-purple-500/30 mb-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Submit Ground Observation
            </h4>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Weather Phenomenon</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border transition cursor-pointer ${
                      category === cat
                        ? "bg-purple-600 text-white border-purple-400 font-bold"
                        : "bg-slate-900 text-slate-400 border-white/5 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Intensity</label>
                <div className="flex gap-1">
                  {(["Low", "Moderate", "Severe"] as const).map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setIntensity(lvl)}
                      className={`flex-1 py-1 rounded-lg text-[11px] font-medium border transition cursor-pointer ${
                        intensity === lvl
                          ? "bg-purple-600 text-white border-purple-400 font-bold"
                          : "bg-slate-900 text-slate-400 border-white/5"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Area / Landmark</label>
                <input
                  type="text"
                  value={reportedLocation}
                  onChange={(e) => setReportedLocation(e.target.value)}
                  placeholder="e.g. Connaught Place"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Ground Observation Details</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe current road conditions, visibility, wind gusts, or precipitation intensity..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Submit to IMD Observation Grid
            </button>
          </form>
        )}

        {/* Observations Feed */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Citizen Observation Stream</h4>
          {observations.map((obs) => (
            <div
              key={obs.id}
              className="p-3.5 rounded-2xl bg-slate-800/60 border border-white/5 flex flex-col gap-2 hover:border-purple-500/30 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {obs.category}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    obs.intensity === "Severe" ? "bg-rose-500/20 text-rose-300" : obs.intensity === "Moderate" ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"
                  }`}>
                    {obs.intensity}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">{obs.timestamp}</span>
              </div>

              <p className="text-xs text-slate-200">{obs.description}</p>

              <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-purple-400" />
                  <span className="text-slate-300 font-medium">{obs.locationName}</span>
                  <span className="text-slate-500">• {obs.reporterName}</span>
                  {obs.verified && (
                    <span title="Verified by IMD Ground Truth Algorithm">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 inline" />
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleUpvote(obs.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer text-[11px]"
                >
                  <ThumbsUp className="w-3 h-3 text-purple-400" />
                  <span>{obs.upvotes} Helpful</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

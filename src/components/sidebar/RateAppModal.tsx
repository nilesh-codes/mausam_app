import React, { useState } from "react";
import { Star, X, CheckCircle2, Heart, MessageSquareHeart } from "lucide-react";

interface RateAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RateAppModal: React.FC<RateAppModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(["Accurate Forecasts", "Great Radar"]);

  if (!isOpen) return null;

  const tags = [
    "Accurate Forecasts",
    "Great Radar",
    "Lightning Alerts",
    "Agromet Advisories",
    "Beautiful UI",
    "Fast Offline Mode",
  ];

  const toggleTag = (t: string) => {
    if (selectedTags.includes(t)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== t));
    } else {
      setSelectedTags([...selectedTags, t]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-white/20 shadow-2xl p-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Rate Mausam App</h3>
              <p className="text-xs text-slate-400">Share your feedback with the IMD development team</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3 animate-fadeIn">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Thank You for Your Feedback!</h4>
            <p className="text-xs text-slate-300">
              Your review helps us continuously improve India's national weather forecasting service.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4">
            {/* Stars Rating Row */}
            <div className="flex flex-col items-center gap-1.5 py-2">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-2xl transition transform hover:scale-125 cursor-pointer"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (hoverRating || rating) >= star
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-300">
                {rating === 5 ? "Excellent (5/5)" : rating === 4 ? "Very Good (4/5)" : `${rating} Stars`}
              </span>
            </div>

            {/* Quick Feature Tags */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">What did you like most?</label>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => {
                  const isSel = selectedTags.includes(t);
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => toggleTag(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                        isSel
                          ? "bg-amber-500/20 text-amber-300 border-amber-400/40 font-bold"
                          : "bg-slate-800 text-slate-400 border-white/5 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback text area */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Detailed comments or feature requests (Optional)</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what you think or suggest new radar stations or agro alerts..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-900/30 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <MessageSquareHeart className="w-4 h-4" /> Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import {
  UserProfile,
  PerkQuest,
  PerkReward,
  PerkRankUser,
  DailyPerksState,
  GeoLocation,
  PersonaType,
} from "../../types";
import {
  OfflineStorage,
  getPerkLevelInfo,
  DEFAULT_PERKS_QUESTS,
  DEFAULT_PERKS_REWARDS,
  MOCK_NATIONAL_LEADERBOARD,
  GUEST_PERKS_STATE,
} from "../../utils/offlineCache";
import {
  Award,
  Flame,
  CheckCircle2,
  Trophy,
  Gift,
  History,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  HelpCircle,
  X,
  Share2,
  Download,
  Check,
  Users,
  Radio,
  Zap,
  Sprout,
  Compass,
  ArrowRight,
  Copy,
  Lock,
  LogIn,
} from "lucide-react";

interface ObserverPerksModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  currentLocation?: GeoLocation;
  onOpenCrowdsource?: () => void;
  onOpenRadar?: () => void;
  onOpenAI?: () => void;
  onOpenPersona?: (persona: PersonaType) => void;
  onOpenLogin?: () => void;
}

const TRIVIA_QUESTIONS = [
  {
    id: 1,
    question: "Which meteorological instrument is used to measure atmospheric pressure?",
    options: ["Anemometer", "Barometer", "Hygrometer", "Pyranometer"],
    correctIndex: 1,
    explanation: "A Barometer measures atmospheric pressure in hectopascals (hPa) or millibars.",
  },
  {
    id: 2,
    question: "Which cloud type is characterized by tall anvil shapes that produce severe thunderstorms and hail?",
    options: ["Cumulonimbus", "Altostratus", "Cirrocumulus", "Stratocumulus"],
    correctIndex: 0,
    explanation: "Cumulonimbus clouds are towering convective clouds associated with thunderstorms and severe rainfall.",
  },
  {
    id: 3,
    question: "The Indian South-West Monsoon typically makes its initial landfall along which coast?",
    options: ["Coromandel Coast", "Malabar Coast (Kerala)", "Konkan Coast", "Utkal Coast"],
    correctIndex: 1,
    explanation: "The South-West Monsoon branch arrives over the Malabar Coast of Kerala around June 1.",
  },
];

export const ObserverPerksModal: React.FC<ObserverPerksModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  currentLocation,
  onOpenCrowdsource,
  onOpenRadar,
  onOpenAI,
  onOpenPersona,
  onOpenLogin,
}) => {
  const [activeTab, setActiveTab] = useState<"quests" | "ranking" | "rewards" | "history">("quests");
  const [rankingSubTab, setRankingSubTab] = useState<"national" | "state" | "monthly">("national");
  const [selectedRewardCategory, setSelectedRewardCategory] = useState<string>("all");

  const activeUser = userProfile?.isLoggedIn
    ? userProfile
    : OfflineStorage.getUserProfile();
  const isLoggedIn = !!activeUser.isLoggedIn;
  const currentPoints = isLoggedIn ? (activeUser.points ?? 0) : 0;
  const levelInfo = getPerkLevelInfo(currentPoints);

  const [perksState, setPerksState] = useState<DailyPerksState>(() =>
    OfflineStorage.getPerksState(activeUser)
  );

  useEffect(() => {
    if (isOpen) {
      const refreshed = userProfile?.isLoggedIn
        ? userProfile
        : OfflineStorage.getUserProfile();
      setPerksState(OfflineStorage.getPerksState(refreshed));
    }
  }, [isOpen, userProfile]);

  const [quests, setQuests] = useState<PerkQuest[]>(DEFAULT_PERKS_QUESTS);
  const [rewards, setRewards] = useState<PerkReward[]>(DEFAULT_PERKS_REWARDS);

  // Trivia State
  const [currentTriviaIndex, setCurrentTriviaIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isTriviaSubmitted, setIsTriviaSubmitted] = useState(false);

  // Active Reward Redemption Modal / Preview
  const [redeemedRewardSuccess, setRedeemedRewardSuccess] = useState<PerkReward | null>(null);
  const [viewCertificateReward, setViewCertificateReward] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  if (!isOpen) return null;

  const notifyPerksAwarded = (amount: number, reason: string) => {
    if (!isLoggedIn) {
      setNotificationBanner("🔒 Sign in or register an account to earn Observer Perks.");
      setTimeout(() => setNotificationBanner(null), 3500);
      return;
    }
    const res = OfflineStorage.awardPerkPoints(amount, reason, activeUser);
    if (res.success) {
      setPerksState(res.state);
      onUpdateProfile({ ...activeUser, points: res.newTotal });
      setNotificationBanner(`🎉 +${amount} Observer Perks earned for "${reason}"!`);
      setTimeout(() => setNotificationBanner(null), 4000);
    }
  };

  // Handle Daily Checkin
  const handleCheckIn = () => {
    if (!isLoggedIn) {
      setNotificationBanner("🔒 Sign In Required: Daily streaks and check-in perks are only awarded to signed-in Observers.");
      setTimeout(() => setNotificationBanner(null), 4000);
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];
    if (perksState.lastCheckInDate === todayStr && perksState.completedQuestIds.includes("quest_checkin")) {
      setNotificationBanner("You have already claimed today's check-in bonus!");
      setTimeout(() => setNotificationBanner(null), 3000);
      return;
    }

    const newStreak = (perksState.streakDays || 0) + 1;
    const bonus = newStreak % 7 === 0 ? 50 : 25;
    const completed = Array.from(new Set([...perksState.completedQuestIds, "quest_checkin"]));

    const res = OfflineStorage.awardPerkPoints(
      bonus,
      `Daily Check-in Streak Day ${newStreak}`,
      activeUser
    );

    if (res.success) {
      const updatedState: DailyPerksState = {
        ...res.state,
        streakDays: newStreak,
        lastCheckInDate: todayStr,
        completedQuestIds: completed,
      };
      OfflineStorage.savePerksState(updatedState, activeUser);
      setPerksState(updatedState);
      onUpdateProfile({ ...activeUser, points: res.newTotal });

      setQuests((prev) =>
        prev.map((q) => (q.id === "quest_checkin" ? { ...q, isCompleted: true, actionLabel: "Claimed" } : q))
      );

      setNotificationBanner(`🔥 ${newStreak}-Day Streak Active! +${bonus} Observer Perks claimed.`);
      setTimeout(() => setNotificationBanner(null), 4000);
    }
  };

  // Handle Quest Action Click
  const handleQuestAction = (quest: PerkQuest) => {
    if (quest.isCompleted) return;

    if (!isLoggedIn) {
      setNotificationBanner("🔒 Sign In Required: Please sign in or register to complete quests and collect perks.");
      setTimeout(() => setNotificationBanner(null), 4000);
      return;
    }

    if (quest.actionType === "checkin") {
      handleCheckIn();
      return;
    }

    if (quest.actionType === "quiz") {
      // Switch focus or scroll to trivia
      return;
    }

    if (quest.actionType === "crowdsource" && onOpenCrowdsource) {
      onClose();
      onOpenCrowdsource();
      return;
    }

    if (quest.actionType === "radar" && onOpenRadar) {
      onClose();
      onOpenRadar();
      return;
    }

    if (quest.actionType === "ai" && onOpenAI) {
      onClose();
      onOpenAI();
      return;
    }

    // Generic completion
    notifyPerksAwarded(quest.points, quest.title);
    const completed = Array.from(new Set([...perksState.completedQuestIds, quest.id]));
    const updatedState = { ...perksState, completedQuestIds: completed };
    OfflineStorage.savePerksState(updatedState, userProfile);
    setPerksState(updatedState);

    setQuests((prev) =>
      prev.map((q) => (q.id === quest.id ? { ...q, isCompleted: true, actionLabel: "Completed" } : q))
    );
  };

  // Handle Trivia Submission
  const handleTriviaAnswer = () => {
    if (selectedOption === null || isTriviaSubmitted) return;
    setIsTriviaSubmitted(true);

    const question = TRIVIA_QUESTIONS[currentTriviaIndex];
    if (selectedOption === question.correctIndex) {
      if (!isLoggedIn) {
        setNotificationBanner("🔒 Correct! Sign in or register to claim your +30 Perks for answering science trivia.");
        setTimeout(() => setNotificationBanner(null), 4000);
        return;
      }

      notifyPerksAwarded(30, "Meteorological Science Trivia Master");
      const completed = Array.from(new Set([...perksState.completedQuestIds, "quest_quiz"]));
      const updatedState = { ...perksState, completedQuestIds: completed };
      OfflineStorage.savePerksState(updatedState, activeUser);
      setPerksState(updatedState);

      setQuests((prev) =>
        prev.map((q) => (q.id === "quest_quiz" ? { ...q, isCompleted: true, actionLabel: "Completed (+30)" } : q))
      );
    }
  };

  // Handle Reward Redemption
  const handleRedeemReward = (reward: PerkReward) => {
    if (!isLoggedIn) {
      setNotificationBanner("🔒 Sign In Required: Please sign in or register to redeem rewards and digital certificates.");
      setTimeout(() => setNotificationBanner(null), 4000);
      return;
    }

    if (perksState.redeemedRewardIds?.includes(reward.id)) {
      if (reward.category === "certificate") {
        setViewCertificateReward(true);
      } else {
        setRedeemedRewardSuccess(reward);
      }
      return;
    }

    if (currentPoints < reward.costPoints) {
      setNotificationBanner(`⚠️ You need ${reward.costPoints - currentPoints} more Perks to redeem "${reward.title}".`);
      setTimeout(() => setNotificationBanner(null), 3500);
      return;
    }

    const res = OfflineStorage.redeemPerkReward(reward, activeUser);
    if (res.success) {
      setPerksState(res.state);
      onUpdateProfile({ ...activeUser, points: res.newTotal });
      setRedeemedRewardSuccess(reward);
      setNotificationBanner(`🎉 Successfully redeemed "${reward.title}"!`);
      setTimeout(() => setNotificationBanner(null), 4000);
    } else {
      setNotificationBanner(res.error || "Failed to redeem reward.");
      setTimeout(() => setNotificationBanner(null), 3500);
    }
  };

  const copyCodeToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Combine leaderboard with current user
  const currentUserEntry: PerkRankUser = {
    rank: 10,
    name: activeUser.name || "Aarav Sharma",
    district: activeUser.district || currentLocation?.name || "New Delhi",
    state: activeUser.state || currentLocation?.admin1 || "Delhi",
    points: currentPoints,
    levelTitle: levelInfo.title,
    avatar: activeUser.avatar || "🇮🇳",
    verified: true,
    isCurrentUser: true,
    trend: "up",
  };

  const leaderboardUsers: PerkRankUser[] = [
    ...MOCK_NATIONAL_LEADERBOARD.slice(0, 9),
    currentUserEntry,
  ]
    .sort((a, b) => b.points - a.points)
    .map((u, idx) => ({
      ...u,
      rank: idx + 1,
      isCurrentUser: u.isCurrentUser || u.name === userProfile.name,
    }));

  const filteredRewards = rewards.filter((r) => {
    if (selectedRewardCategory === "all") return true;
    return r.category === selectedRewardCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl overflow-hidden text-white">
        {/* Top Notification Toast */}
        {notificationBanner && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 border border-amber-300 animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span>{notificationBanner}</span>
          </div>
        )}

        {/* 1. Modal Header Banner */}
        <div className="relative p-4 sm:p-5 bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 border-b border-white/10 overflow-hidden shrink-0">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer z-10"
            title="Close Perks Dashboard"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-8 sm:pr-0">
            {/* Title & Brand */}
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-bold text-lg shadow-lg shadow-amber-500/20 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                    Observer Perks & Rewards
                    <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Season 2026
                    </span>
                  </h2>
                  <p className="text-[11px] text-slate-300 line-clamp-1">
                    Daily meteorological missions, ground reports & verified recognitions
                  </p>
                </div>
              </div>
            </div>

            {/* Current Balance Card */}
            <div className="flex items-center gap-3 self-start sm:self-auto bg-slate-900/90 border border-amber-400/30 px-3.5 py-1.5 rounded-2xl shadow-inner backdrop-blur-xl shrink-0">
              {isLoggedIn ? (
                <>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-amber-300/90 tracking-wider block">
                      Available Perks
                    </span>
                    <span className="text-lg sm:text-xl font-black font-mono text-amber-300 flex items-center gap-1 justify-end">
                      <Award className="w-4 h-4 text-amber-400" />
                      {currentPoints.toLocaleString()}
                    </span>
                  </div>

                  <div className="h-7 w-px bg-white/10" />

                  {/* Daily Streak */}
                  <div className="text-left">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                      Streak
                    </span>
                    <span className="text-sm font-bold font-mono text-orange-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                      {perksState.streakDays || 0}d
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 py-0.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-amber-300 tracking-wider block">
                      Guest Observer
                    </span>
                    <span className="text-[11px] font-semibold text-slate-300">
                      Sign in to earn & collect
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tier Progress Bar */}
          <div className="mt-3 pt-2.5 border-t border-white/10">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="text-base">{isLoggedIn ? levelInfo.badge : "🔒"}</span>
                <span className={`text-xs ${isLoggedIn ? levelInfo.textColor : "text-slate-400"}`}>
                  {isLoggedIn ? `Level ${levelInfo.level}: ${levelInfo.title}` : "Guest Mode (Perks Locked)"}
                </span>
                {isLoggedIn && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300 font-mono">
                    {levelInfo.multiplier} Multiplier
                  </span>
                )}
              </div>
              <span className="text-slate-400 font-mono text-[11px]">
                {isLoggedIn ? `${currentPoints} / ${levelInfo.nextTierPoints} pts` : "0 pts (Sign in to activate)"}
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-white/5">
              <div
                className={`h-full rounded-full ${
                  isLoggedIn ? `bg-gradient-to-r ${levelInfo.color}` : "bg-slate-700"
                } transition-all duration-500`}
                style={{ width: `${isLoggedIn ? Math.max(8, levelInfo.progressPct) : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Guest Notification Banner */}
        {!isLoggedIn && (
          <div className="mx-3 sm:mx-5 my-2 p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-200">Sign In Required for Perks</h4>
                <p className="text-[11px] text-slate-300">
                  Perk points collection, streak tracking, and rewards redemption are only active for signed-in Citizen Observers.
                </p>
              </div>
            </div>
            {onOpenLogin && (
              <button
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-bold hover:brightness-110 transition shadow flex items-center gap-1.5 shrink-0 cursor-pointer self-end sm:self-auto"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In / Register
              </button>
            )}
          </div>
        )}

        {/* 2. Navigation Tabs - Always Visible Segmented Control */}
        <div className="sticky top-0 z-20 shrink-0 bg-slate-950/95 backdrop-blur-xl border-y border-amber-500/20 p-2 sm:px-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab("quests")}
              className={`py-2 px-2.5 sm:px-3 text-xs font-bold transition rounded-xl flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                activeTab === "quests"
                  ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/25 ring-1 ring-amber-300 font-extrabold"
                  : "bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5"
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 shrink-0 ${activeTab === "quests" ? "text-slate-950" : "text-amber-400"}`} />
              <span className="truncate">Daily Quests</span>
            </button>

            <button
              onClick={() => setActiveTab("ranking")}
              className={`py-2 px-2.5 sm:px-3 text-xs font-bold transition rounded-xl flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                activeTab === "ranking"
                  ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/25 ring-1 ring-amber-300 font-extrabold"
                  : "bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5"
              }`}
            >
              <Trophy className={`w-3.5 h-3.5 shrink-0 ${activeTab === "ranking" ? "text-slate-950" : "text-amber-400"}`} />
              <span className="truncate">Leaderboard</span>
            </button>

            <button
              onClick={() => setActiveTab("rewards")}
              className={`py-2 px-2.5 sm:px-3 text-xs font-bold transition rounded-xl flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                activeTab === "rewards"
                  ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/25 ring-1 ring-amber-300 font-extrabold"
                  : "bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5"
              }`}
            >
              <Gift className={`w-3.5 h-3.5 shrink-0 ${activeTab === "rewards" ? "text-slate-950" : "text-amber-400"}`} />
              <span className="truncate">Rewards Vault</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`py-2 px-2.5 sm:px-3 text-xs font-bold transition rounded-xl flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/25 ring-1 ring-amber-300 font-extrabold"
                  : "bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5"
              }`}
            >
              <History className={`w-3.5 h-3.5 shrink-0 ${activeTab === "history" ? "text-slate-950" : "text-amber-400"}`} />
              <span className="truncate">Perks Ledger</span>
            </button>
          </div>
        </div>

        {/* 3. Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* ================= TAB 1: DAILY QUESTS ================= */}
          {activeTab === "quests" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Daily Streak Check-in Hero Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-850 to-orange-950/60 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0">
                    <Flame className="w-6 h-6 fill-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      Daily Observer Activity Streak
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-bold">
                        {perksState.streakDays} Days in a Row
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Check in daily to build your streak. Reach Day 7 to earn a 50 Perks streak bonus!
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCheckIn}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-orange-500/25 transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {perksState.completedQuestIds.includes("quest_checkin") ? "Claimed for Today (+25)" : "Claim Today (+25)"}
                </button>
              </div>

              {/* Quests Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Daily Meteorological Missions
                  </h3>
                  <span className="text-xs text-slate-400">
                    {quests.filter((q) => perksState.completedQuestIds.includes(q.id) || q.isCompleted).length} / {quests.length} Completed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quests.map((quest) => {
                    const isDone = perksState.completedQuestIds.includes(quest.id) || quest.isCompleted;
                    return (
                      <div
                        key={quest.id}
                        className={`p-3.5 rounded-2xl border transition flex flex-col justify-between gap-3 ${
                          isDone
                            ? "bg-slate-900/40 border-emerald-500/20 text-slate-400"
                            : "bg-slate-850/90 border-white/10 hover:border-amber-400/40 shadow-sm"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="flex items-start gap-2.5">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                isDone
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              }`}
                            >
                              {isDone ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                <Award className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <h4 className={`text-xs font-bold ${isDone ? "text-slate-300 line-through" : "text-white"}`}>
                                {quest.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                                {quest.description}
                              </p>
                            </div>
                          </div>

                          <span className={`text-xs font-mono font-bold shrink-0 px-2 py-0.5 rounded-md ${
                            isDone ? "bg-emerald-950/40 text-emerald-300" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}>
                            +{quest.points} pts
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="text-[10px] uppercase font-bold text-slate-500">
                            {quest.category}
                          </span>

                          <button
                            onClick={() => handleQuestAction(quest)}
                            disabled={isDone}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                              isDone
                                ? "bg-white/5 text-emerald-400 cursor-default"
                                : "bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/20"
                            }`}
                          >
                            {isDone ? "Claimed" : quest.actionLabel || "Start Quest"}
                            {!isDone && <ChevronRight className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Daily Meteorology Trivia Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-850 to-slate-900 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Daily Atmospheric Science Trivia
                      </h4>
                      <p className="text-[11px] text-slate-300">Answer correctly to earn +30 bonus Observer Perks</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-indigo-300 px-2 py-0.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                    +30 Perks
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-3">
                  <p className="text-xs font-semibold text-white">
                    Q{currentTriviaIndex + 1}: {TRIVIA_QUESTIONS[currentTriviaIndex].question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TRIVIA_QUESTIONS[currentTriviaIndex].options.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === TRIVIA_QUESTIONS[currentTriviaIndex].correctIndex;
                      let btnStyle = "bg-slate-850 text-slate-300 border-white/10 hover:border-indigo-400/40";

                      if (isTriviaSubmitted) {
                        if (isCorrect) {
                          btnStyle = "bg-emerald-950/80 text-emerald-200 border-emerald-500 font-bold";
                        } else if (isSelected) {
                          btnStyle = "bg-rose-950/80 text-rose-200 border-rose-500";
                        }
                      } else if (isSelected) {
                        btnStyle = "bg-indigo-600 text-white border-indigo-400 font-bold";
                      }

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => !isTriviaSubmitted && setSelectedOption(idx)}
                          disabled={isTriviaSubmitted}
                          className={`p-2.5 rounded-xl text-xs text-left border transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span>{option}</span>
                          {isTriviaSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {isTriviaSubmitted && (
                    <div className="p-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-slate-300 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white">Science Insight: </span>
                        {TRIVIA_QUESTIONS[currentTriviaIndex].explanation}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const next = (currentTriviaIndex + 1) % TRIVIA_QUESTIONS.length;
                        setCurrentTriviaIndex(next);
                        setSelectedOption(null);
                        setIsTriviaSubmitted(false);
                      }}
                      className="text-xs text-slate-400 hover:text-white transition cursor-pointer flex items-center gap-1"
                    >
                      Next Question <ChevronRight className="w-3 h-3" />
                    </button>

                    {!isTriviaSubmitted && (
                      <button
                        type="button"
                        onClick={handleTriviaAnswer}
                        disabled={selectedOption === null}
                        className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition cursor-pointer"
                      >
                        Submit Answer (+30)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: PERKS RANKING & LEADERBOARDS ================= */}
          {activeTab === "ranking" && (
            <div className="space-y-4 animate-fadeIn">
              {/* Filter Pills */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/80 border border-white/5">
                  <button
                    onClick={() => setRankingSubTab("national")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      rankingSubTab === "national"
                        ? "bg-amber-500 text-slate-950 shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    National Grid
                  </button>
                  <button
                    onClick={() => setRankingSubTab("state")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      rankingSubTab === "state"
                        ? "bg-amber-500 text-slate-950 shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {userProfile.state || "Delhi"} State
                  </button>
                  <button
                    onClick={() => setRankingSubTab("monthly")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      rankingSubTab === "monthly"
                        ? "bg-amber-500 text-slate-950 shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    August Champions
                  </button>
                </div>

                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Users className="w-3 h-3 text-sky-400" /> 14,820 Active Citizen Observers
                </span>
              </div>

              {/* Leaderboard Table List */}
              <div className="rounded-2xl bg-slate-850/80 border border-white/10 overflow-hidden shadow-xl">
                <div className="p-3 bg-slate-900 border-b border-white/10 grid grid-cols-12 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
                  <div className="col-span-6 sm:col-span-6">Observer & District</div>
                  <div className="col-span-4 sm:col-span-3 text-right">Perks Points</div>
                  <div className="hidden sm:block sm:col-span-2 text-right">Tier</div>
                </div>

                <div className="divide-y divide-white/5">
                  {leaderboardUsers.map((user) => {
                    const isTop1 = user.rank === 1;
                    const isTop2 = user.rank === 2;
                    const isTop3 = user.rank === 3;

                    return (
                      <div
                        key={`${user.rank}-${user.name}`}
                        className={`p-3 grid grid-cols-12 items-center transition ${
                          user.isCurrentUser
                            ? "bg-sky-950/60 border-l-4 border-sky-400 shadow-inner"
                            : "hover:bg-slate-800/50"
                        }`}
                      >
                        {/* Rank Badge */}
                        <div className="col-span-2 sm:col-span-1 flex items-center justify-center font-bold">
                          {isTop1 ? (
                            <span className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-xs shadow-md shadow-amber-400/30">
                              🥇 1
                            </span>
                          ) : isTop2 ? (
                            <span className="w-7 h-7 rounded-xl bg-slate-300 text-slate-950 flex items-center justify-center text-xs shadow-md">
                              🥈 2
                            </span>
                          ) : isTop3 ? (
                            <span className="w-7 h-7 rounded-xl bg-amber-700 text-amber-100 flex items-center justify-center text-xs shadow-md">
                              🥉 3
                            </span>
                          ) : (
                            <span className="text-xs font-mono text-slate-400">#{user.rank}</span>
                          )}
                        </div>

                        {/* Name & Location */}
                        <div className="col-span-6 sm:col-span-6 flex items-center gap-2.5 min-w-0 pr-2">
                          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-base shrink-0">
                            {user.avatar}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className={`text-xs font-bold truncate ${user.isCurrentUser ? "text-sky-300" : "text-white"}`}>
                                {user.name}
                              </span>
                              {user.isCurrentUser && (
                                <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                                  You
                                </span>
                              )}
                              {user.verified && (
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate">
                              {user.district}, {user.state}
                            </p>
                          </div>
                        </div>

                        {/* Perks points */}
                        <div className="col-span-4 sm:col-span-3 text-right">
                          <span className="text-xs sm:text-sm font-mono font-bold text-amber-300 flex items-center justify-end gap-1">
                            <Award className="w-3.5 h-3.5 text-amber-400 inline" />
                            {user.points.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {user.trend === "up" ? (
                              <span className="text-emerald-400 flex items-center justify-end gap-0.5">
                                <TrendingUp className="w-2.5 h-2.5" /> +4 ranks
                              </span>
                            ) : user.trend === "down" ? (
                              <span className="text-rose-400 flex items-center justify-end gap-0.5">
                                <TrendingDown className="w-2.5 h-2.5" /> -1 rank
                              </span>
                            ) : (
                              <span className="text-slate-500 flex items-center justify-end gap-0.5">
                                <Minus className="w-2.5 h-2.5" /> Steady
                              </span>
                            )}
                          </span>
                        </div>

                        {/* Level Tier */}
                        <div className="hidden sm:block sm:col-span-2 text-right">
                          <span className="text-[11px] font-semibold text-slate-300 truncate block">
                            {user.levelTitle}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: REWARDS VAULT & REDEEM ================= */}
          {activeTab === "rewards" && (
            <div className="space-y-4 animate-fadeIn">
              {/* Category Filter */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {[
                    { id: "all", label: "All Rewards" },
                    { id: "certificate", label: "Official E-Certs" },
                    { id: "feature", label: "App Pro Features" },
                    { id: "badge", label: "Badges" },
                    { id: "eco", label: "Green India Eco" },
                    { id: "merchandise", label: "IMD Souvenirs" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedRewardCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                        selectedRewardCategory === cat.id
                          ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                          : "bg-slate-800 text-slate-300 hover:text-white border border-white/5"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-slate-400 font-mono">
                  Balance: <strong className="text-amber-300">{currentPoints} Perks</strong>
                </span>
              </div>

              {/* Rewards Grid (Microsoft Rewards Style) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredRewards.map((reward) => {
                  const isRedeemed = perksState.redeemedRewardIds.includes(reward.id);
                  const canAfford = currentPoints >= reward.costPoints;

                  return (
                    <div
                      key={reward.id}
                      className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-3 relative overflow-hidden ${
                        isRedeemed
                          ? "bg-gradient-to-br from-emerald-950/40 via-slate-850 to-slate-900 border-emerald-500/40 shadow-md"
                          : canAfford
                          ? "bg-gradient-to-br from-slate-850 to-slate-900 border-amber-400/40 hover:border-amber-400 shadow-lg hover:shadow-amber-500/10"
                          : "bg-slate-850/60 border-white/5 opacity-80"
                      }`}
                    >
                      {/* Top Pill */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                          {reward.badgeLabel || reward.category}
                        </span>

                        <span className="text-xs font-mono font-extrabold text-amber-300 flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          {reward.costPoints} Perks
                        </span>
                      </div>

                      {/* Content */}
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          {reward.title}
                          {isRedeemed && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </h4>
                        <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                          {reward.subtitle}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                        {isRedeemed ? (
                          <button
                            onClick={() => {
                              if (reward.category === "certificate") {
                                setViewCertificateReward(true);
                              } else {
                                setRedeemedRewardSuccess(reward);
                              }
                            }}
                            className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            {reward.category === "certificate" ? "View & Print Certificate" : "View Voucher Details"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRedeemReward(reward)}
                            disabled={!canAfford}
                            className={`w-full py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 shadow ${
                              canAfford
                                ? "bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-amber-500/25"
                                : "bg-slate-800 text-slate-400 border border-white/5 cursor-not-allowed"
                            }`}
                          >
                            <Gift className="w-3.5 h-3.5" />
                            {canAfford ? "Redeem Reward" : `Need ${reward.costPoints - currentPoints} More Perks`}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= TAB 4: PERKS LEDGER / HISTORY ================= */}
          {activeTab === "history" && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Recent Perks Transactions
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Total Active: {currentPoints} pts
                </span>
              </div>

              <div className="divide-y divide-white/5 rounded-2xl bg-slate-850/80 border border-white/10 overflow-hidden">
                {perksState.history && perksState.history.length > 0 ? (
                  perksState.history.map((hist) => (
                    <div key={hist.id} className="p-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            hist.type === "earn"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-purple-500/20 text-purple-400"
                          }`}
                        >
                          {hist.type === "earn" ? (
                            <Award className="w-4 h-4" />
                          ) : (
                            <Gift className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{hist.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{hist.timestamp}</p>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg ${
                          hist.type === "earn"
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                            : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {hist.points > 0 ? `+${hist.points}` : hist.points} pts
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No transactions yet. Complete daily quests or report weather in crowdsource to earn Perks!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 4. Footer info */}
        <div className="p-3.5 bg-slate-950 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> IMD Citizen Science Directorate Verified
          </span>
          <button
            onClick={() => setActiveTab("rewards")}
            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition cursor-pointer"
          >
            Redeem Perks <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ================= MODAL: REDEEMED REWARD SUCCESS / VOUCHER ================= */}
      {redeemedRewardSuccess && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-amber-500/40 text-white shadow-2xl space-y-4">
            <button
              onClick={() => setRedeemedRewardSuccess(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center text-3xl mx-auto shadow-xl shadow-amber-500/25">
                🎉
              </div>
              <h3 className="text-lg font-bold text-white">{redeemedRewardSuccess.title}</h3>
              <p className="text-xs text-slate-300">{redeemedRewardSuccess.description}</p>
            </div>

            {/* Voucher Code Box */}
            <div className="p-4 rounded-2xl bg-slate-800/90 border border-white/10 space-y-2 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Official Voucher Token
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-base font-mono font-bold text-amber-300 tracking-widest px-3 py-1 rounded-xl bg-slate-950 border border-amber-400/30">
                  {redeemedRewardSuccess.code || "IMD-PERK-ACTIVE"}
                </span>
                <button
                  onClick={() => copyCodeToClipboard(redeemedRewardSuccess.code || "IMD-PERK-ACTIVE")}
                  className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white transition cursor-pointer"
                  title="Copy Code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copiedCode && <p className="text-[10px] text-emerald-400">Token copied to clipboard!</p>}
            </div>

            <button
              onClick={() => setRedeemedRewardSuccess(null)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg transition cursor-pointer"
            >
              Done & Continue
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: OFFICIAL IMD OBSERVER CERTIFICATE VIEW ================= */}
      {viewCertificateReward && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl p-6 rounded-3xl bg-slate-900 border border-amber-500/40 text-white shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setViewCertificateReward(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Printable Certificate Frame */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-amber-50/95 via-stone-100 to-amber-50/95 text-slate-900 border-4 border-double border-amber-700/60 shadow-2xl space-y-4 text-center select-none relative overflow-hidden">
              {/* Watermark Emblem */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-9xl">
                🇮🇳
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-extrabold tracking-widest text-amber-900 uppercase">
                  Government of India • Ministry of Earth Sciences
                </p>
                <h3 className="text-xl sm:text-2xl font-serif font-black text-amber-950 tracking-tight">
                  India Meteorological Department
                </h3>
                <p className="text-xs font-serif italic text-amber-800">
                  National Citizen Weather Observation Network (Mausam Seva)
                </p>
              </div>

              <div className="w-24 h-0.5 bg-amber-700/40 mx-auto my-2" />

              <p className="text-xs uppercase tracking-widest text-slate-600 font-bold">
                Certificate of Recognition
              </p>

              <p className="text-xs text-slate-700">This is proudly awarded to</p>

              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-amber-950 underline decoration-amber-600 decoration-1 underline-offset-8">
                {userProfile.name || "Aarav Sharma"}
              </h2>

              <p className="text-xs text-slate-700 max-w-lg mx-auto leading-relaxed pt-2">
                for active atmospheric vigilance, ground truth weather crowdsourcing, and meteorological contributions representing{" "}
                <strong className="text-slate-900">{userProfile.district || "New Delhi"}, {userProfile.state || "Delhi"}</strong> in the National Mausam Observer Grid.
              </p>

              <div className="pt-4 flex items-center justify-between text-left border-t border-amber-800/20 text-[11px] text-slate-700">
                <div>
                  <p className="font-mono text-[10px] font-bold text-amber-900">CERT ID: IMD-OBS-2026-4821</p>
                  <p className="text-[10px] text-slate-500">Issued: August 2026</p>
                </div>

                <div className="text-right">
                  <p className="font-serif font-bold text-slate-900">Director General of Meteorology</p>
                  <p className="text-[10px] text-amber-900 font-semibold">IMD Citizen Science Wing</p>
                </div>
              </div>
            </div>

            {/* Certificate Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-4 h-4" /> Print / Save PDF
              </button>
              <button
                onClick={() => setViewCertificateReward(false)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg transition cursor-pointer"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

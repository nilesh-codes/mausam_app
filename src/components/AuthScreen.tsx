import React, { useState } from "react";
import { UserProfile } from "../types";
import { OfflineStorage } from "../utils/offlineCache";
import {
  ShieldCheck,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  User,
  MapPin,
  Award,
  ChevronRight,
  CloudSun,
  Flame,
} from "lucide-react";

interface AuthScreenProps {
  onAuthSuccess: (profile: UserProfile) => void;
  onContinueGuest: () => void;
}

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Delhi",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const ROLES: Array<UserProfile["role"]> = [
  "Citizen",
  "Farmer",
  "Pilot",
  "Disaster Manager",
  "Scientist",
];

const AVATARS = ["🇮🇳", "🌾", "✈️", "🌦️", "⚡", "🛰️", "🧭", "👨‍🌾", "👩‍🔬", "🌊"];

const DEMO_USER = {
  email: "demo@mausam.imd.gov.in",
  password: "mausam123",
  name: "Aarav Sharma",
  role: "Citizen" as const,
  state: "Delhi",
  district: "New Delhi",
  avatar: "🇮🇳",
  points: 420,
};

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onAuthSuccess,
  onContinueGuest,
}) => {
  // Tab: "login" | "register"
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Sign In Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form States
  const [regName, setRegName] = useState("");
  const [regEmailOrPhone, setRegEmailOrPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regState, setRegState] = useState("Delhi");
  const [regDistrict, setRegDistrict] = useState("New Delhi");
  const [regRole, setRegRole] = useState<UserProfile["role"]>("Citizen");
  const [regAvatar, setRegAvatar] = useState("🇮🇳");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Feedback banner state
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // 1. One-click Quick Demo Observer Login
  const handleQuickDemoLogin = () => {
    const { profile } = OfflineStorage.loginUserAccount(DEMO_USER.email, {
      name: DEMO_USER.name,
      emailOrPhone: DEMO_USER.email,
      state: DEMO_USER.state,
      district: DEMO_USER.district,
      role: DEMO_USER.role,
      avatar: DEMO_USER.avatar,
      points: DEMO_USER.points,
    });

    setFeedback({
      type: "success",
      text: `Welcome, ${profile.name}! Signed in with ${profile.points} Observer Perks active.`,
    });

    setTimeout(() => {
      onAuthSuccess(profile);
    }, 600);
  };

  // 2. Handle Manual Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailTrimmed = loginEmail.trim().toLowerCase();

    if (!emailTrimmed) {
      setFeedback({
        type: "error",
        text: "Please enter your email or mobile number.",
      });
      return;
    }

    if (!loginPassword) {
      setFeedback({
        type: "error",
        text: "Please enter your account password.",
      });
      return;
    }

    // Demo account check
    if (emailTrimmed === DEMO_USER.email.toLowerCase() || emailTrimmed === "demo") {
      if (
        loginPassword !== DEMO_USER.password &&
        loginPassword !== "123456" &&
        loginPassword.length < 4
      ) {
        setFeedback({
          type: "error",
          text: `Demo password is "${DEMO_USER.password}"`,
        });
        return;
      }

      const { profile } = OfflineStorage.loginUserAccount(DEMO_USER.email, {
        name: DEMO_USER.name,
        emailOrPhone: DEMO_USER.email,
        state: DEMO_USER.state,
        district: DEMO_USER.district,
        role: DEMO_USER.role,
        avatar: DEMO_USER.avatar,
        points: DEMO_USER.points,
      });

      setFeedback({
        type: "success",
        text: `Welcome back, ${profile.name}! Authenticated successfully (${profile.points} Perks restored).`,
      });

      setTimeout(() => {
        onAuthSuccess(profile);
      }, 600);
      return;
    }

    // Custom user login
    const formattedName =
      emailTrimmed.split("@")[0].charAt(0).toUpperCase() +
      emailTrimmed.split("@")[0].slice(1).replace(/[._]/g, " ");

    const { profile } = OfflineStorage.loginUserAccount(loginEmail.trim(), {
      name: formattedName || "Citizen Observer",
      state: "Delhi",
      district: "New Delhi",
      role: "Citizen",
      avatar: "🇮🇳",
    });

    setFeedback({
      type: "success",
      text: `Welcome back, ${profile.name}! Signed in successfully (${profile.points} Perks restored).`,
    });

    setTimeout(() => {
      onAuthSuccess(profile);
    }, 600);
  };

  // 3. Handle Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!regName.trim()) {
      setFeedback({
        type: "error",
        text: "Please enter your full name.",
      });
      return;
    }

    if (!regEmailOrPhone.trim()) {
      setFeedback({
        type: "error",
        text: "Please enter your email or mobile number.",
      });
      return;
    }

    if (regPassword.length < 4) {
      setFeedback({
        type: "error",
        text: "Password must be at least 4 characters long.",
      });
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setFeedback({
        type: "error",
        text: "Passwords do not match! Please check and retry.",
      });
      return;
    }

    const newUser: UserProfile = {
      name: regName.trim(),
      emailOrPhone: regEmailOrPhone.trim(),
      state: regState,
      district: regDistrict.trim() || "Headquarters",
      role: regRole,
      avatar: regAvatar,
      isLoggedIn: true,
      memberSince: "August 2026",
      points: 150, // Welcome signup bonus
    };

    const { profile } = OfflineStorage.registerUserAccount(newUser);

    setFeedback({
      type: "success",
      text: `Account created successfully! +150 Perks Welcome Bonus awarded to ${profile.name}.`,
    });

    setTimeout(() => {
      onAuthSuccess(profile);
    }, 600);
  };

  return (
    <div
      id="auth-screen-container"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 flex flex-col items-center justify-start sm:justify-center p-3 sm:p-6 py-8 animate-fadeIn"
    >
      {/* Ambient background glows */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md my-auto flex flex-col rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl backdrop-blur-2xl text-white overflow-hidden">
        {/* Portal Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 border-b border-white/10 text-center">
          {/* Logo & National Insignia */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 shadow-xl shadow-sky-500/25 flex items-center justify-center text-2xl">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                🌦️
              </div>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white">
                  Mausam
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  IMD Portal
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                National Meteorological Intelligence
              </p>
            </div>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1">
            {activeTab === "login"
              ? "Sign In to Your Observer Account"
              : "Register as a Citizen Observer"}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            {activeTab === "login"
              ? "Access verified hyper-local forecasts, live radars, and collected Observer Perks."
              : "Create your verified profile to unlock daily quests, streaks, and reward redemptions."}
          </p>

          {/* Unified Mode Toggle */}
          <div className="mt-4 flex rounded-2xl bg-slate-950/70 p-1 border border-white/10">
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => {
                setActiveTab("login");
                setFeedback(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "login"
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
            <button
              id="auth-tab-register"
              type="button"
              onClick={() => {
                setActiveTab("register");
                setFeedback(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "register"
                  ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Register (+150 Perks)
            </button>
          </div>
        </div>

        {/* Feedback notification toast */}
        {feedback && (
          <div className="px-5 pt-4">
            <div
              className={`p-3 rounded-2xl text-xs flex items-start gap-2.5 border animate-fadeIn ${
                feedback.type === "success"
                  ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
                  : feedback.type === "error"
                  ? "bg-rose-950/60 border-rose-500/40 text-rose-200"
                  : "bg-sky-950/60 border-sky-500/40 text-sky-200"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : feedback.type === "error" ? (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 leading-relaxed">{feedback.text}</div>
            </div>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="p-5 space-y-4">
          {/* ================= SIGN IN TAB ================= */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fadeIn">
              {/* Quick 1-Click Demo Login Banner */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-500/30 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-amber-200 truncate">
                      Quick Observer Demo
                    </h4>
                    <p className="text-[11px] text-slate-300 truncate">
                      Aarav Sharma • 420 Perks • Level 2 Scout
                    </p>
                  </div>
                </div>

                <button
                  id="btn-quick-demo-login"
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-bold hover:brightness-110 transition shadow flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  1-Click Sign In
                </button>
              </div>

              {/* Email / Mobile */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  Email or Registered Mobile
                </label>
                <input
                  id="auth-login-email"
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. demo@mausam.imd.gov.in or 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500 transition"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-sky-400" />
                  Password
                </label>
                <div className="relative">
                  <input
                    id="auth-login-password"
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500 transition pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                id="auth-login-submit"
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In as Observer
              </button>
            </form>
          )}

          {/* ================= REGISTER TAB ================= */}
          {activeTab === "register" && (
            <form
              onSubmit={handleRegisterSubmit}
              className="space-y-3.5 animate-fadeIn"
            >
              {/* Welcome Bonus Notice */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-transparent border border-amber-500/30 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                    +150 Observer Perks Signup Bonus!
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Immediately unlocked for streaks, quizzes, and ground report rewards.
                  </p>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  Full Name
                </label>
                <input
                  id="auth-reg-name"
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Priya Patel"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              {/* Email / Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  Email or Mobile Number
                </label>
                <input
                  id="auth-reg-email"
                  type="text"
                  value={regEmailOrPhone}
                  onChange={(e) => setRegEmailOrPhone(e.target.value)}
                  placeholder="e.g. priya.patel@gmail.com or 9820012345"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-sky-400" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="auth-reg-password"
                      type={showRegPassword ? "text" : "password"}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 4 characters"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition pr-9"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showRegPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="auth-reg-confirm"
                    type={showRegPassword ? "text" : "password"}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition"
                    required
                  />
                </div>
              </div>

              {/* State & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    State
                  </label>
                  <select
                    id="auth-reg-state"
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-white/15 text-white text-xs focus:outline-none focus:border-indigo-500 transition"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s} className="bg-slate-900 text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    District / City
                  </label>
                  <input
                    id="auth-reg-district"
                    type="text"
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    placeholder="e.g. Pune, Mumbai, Jaipur"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Observer Role & Avatar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Primary Role
                  </label>
                  <select
                    id="auth-reg-role"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserProfile["role"])}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-white/15 text-white text-xs focus:outline-none focus:border-indigo-500 transition"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r} className="bg-slate-900 text-white">
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Avatar Insignia
                  </label>
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    {AVATARS.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setRegAvatar(av)}
                        className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center shrink-0 transition ${
                          regAvatar === av
                            ? "bg-indigo-600 ring-2 ring-indigo-400 scale-110"
                            : "bg-slate-800/80 hover:bg-slate-700"
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Registration */}
              <button
                id="auth-reg-submit"
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <UserPlus className="w-4 h-4" />
                Register & Claim +150 Perks
              </button>
            </form>
          )}

          {/* Continue as Guest option */}
          <div className="pt-2 border-t border-white/10 text-center">
            <button
              id="auth-continue-guest-btn"
              type="button"
              onClick={onContinueGuest}
              className="text-xs text-slate-400 hover:text-white transition cursor-pointer inline-flex items-center gap-1"
            >
              <span>Continue as Guest Observer</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <p className="text-[10px] text-slate-500 mt-0.5">
              (Perks collection and leaderboard rankings require a signed-in account)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

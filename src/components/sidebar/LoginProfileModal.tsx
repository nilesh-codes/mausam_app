import React, { useState, useEffect } from "react";
import { UserProfile } from "../../types";
import { OfflineStorage } from "../../utils/offlineCache";
import {
  User,
  X,
  Check,
  ShieldCheck,
  MapPin,
  Award,
  LogOut,
  LogIn,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Edit3,
  Mail,
  Sparkles,
} from "lucide-react";

interface LoginProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
  currentProfile?: UserProfile;
  onUpdateProfile?: (profile: UserProfile) => void;
  onSaveProfile?: (profile: UserProfile) => void;
  onOpenPerks?: () => void;
  onLogout?: () => void;
  onOpenAuth?: () => void;
}

const DEMO_USER = {
  email: "demo@mausam.imd.gov.in",
  password: "mausam123",
  name: "Aarav Sharma",
  role: "Citizen" as const,
  state: "Delhi",
  district: "New Delhi",
  avatar: "🇮🇳",
  points: 420,
  memberSince: "August 2026",
};

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

const AVATARS_LIST = ["🇮🇳", "🌾", "✈️", "🌦️", "⚡", "🛰️", "🧭", "👨‍🌾", "👩‍🔬", "🌊", "🚁", "🌲"];

export const LoginProfileModal: React.FC<LoginProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  currentProfile,
  onUpdateProfile,
  onSaveProfile,
  onOpenPerks,
  onLogout,
  onOpenAuth,
}) => {
  const activeProfile = currentProfile || userProfile || {
    name: "Guest Observer",
    emailOrPhone: "",
    state: "Delhi",
    district: "New Delhi",
    role: "Citizen" as const,
    avatar: "🇮🇳",
    isLoggedIn: false,
    points: 0,
  };

  const notifyChange = (updated: UserProfile) => {
    if (onSaveProfile) onSaveProfile(updated);
    if (onUpdateProfile) onUpdateProfile(updated);
  };

  // View state: "login" | "register" | "profile" | "edit"
  const [activeTab, setActiveTab] = useState<"login" | "register" | "profile" | "edit">(
    activeProfile.isLoggedIn ? "profile" : "login"
  );

  // Sync tab with login state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (activeProfile.isLoggedIn) {
        setActiveTab("profile");
      } else {
        setActiveTab("login");
      }
      setFeedbackMsg(null);
    }
  }, [isOpen, activeProfile.isLoggedIn]);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register / Edit Form States
  const [regName, setRegName] = useState("");
  const [regEmailOrPhone, setRegEmailOrPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regState, setRegState] = useState("Delhi");
  const [regDistrict, setRegDistrict] = useState("New Delhi");
  const [regRole, setRegRole] = useState<UserProfile["role"]>("Citizen");
  const [regAvatar, setRegAvatar] = useState("🇮🇳");

  // Feedback banner state
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  if (!isOpen) return null;

  // Auto-fill single demo account
  const handleAutoFillDemo = () => {
    setLoginEmail(DEMO_USER.email);
    setLoginPassword(DEMO_USER.password);
    setFeedbackMsg({
      type: "info",
      text: `Demo credentials filled (${DEMO_USER.email}). Click 'Sign In' to continue.`,
    });
  };

  // Handle Manual Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailTrimmed = loginEmail.trim().toLowerCase();

    if (!emailTrimmed) {
      setFeedbackMsg({ type: "error", text: "Please enter your email or mobile number." });
      return;
    }

    if (!loginPassword) {
      setFeedbackMsg({ type: "error", text: "Please enter your password." });
      return;
    }

    // Check if it's the demo account
    if (emailTrimmed === DEMO_USER.email.toLowerCase() || emailTrimmed === "demo") {
      if (loginPassword !== DEMO_USER.password && loginPassword !== "123456" && loginPassword.length < 4) {
        setFeedbackMsg({
          type: "error",
          text: `Incorrect demo password! Please use: "${DEMO_USER.password}"`,
        });
        return;
      }

      // Load stored account with user's previous points & perks history
      const { profile: loggedProfile } = OfflineStorage.loginUserAccount(DEMO_USER.email, {
        name: DEMO_USER.name,
        emailOrPhone: DEMO_USER.email,
        state: DEMO_USER.state,
        district: DEMO_USER.district,
        role: DEMO_USER.role,
        avatar: DEMO_USER.avatar,
        points: DEMO_USER.points,
      });

      notifyChange(loggedProfile);
      setFeedbackMsg({
        type: "success",
        text: `Welcome back, ${loggedProfile.name}! Authenticated successfully (${loggedProfile.points} Perks restored).`,
      });
      setActiveTab("profile");
      return;
    }

    // Custom user login: restore previous points & perks history
    const formattedName =
      emailTrimmed.split("@")[0].charAt(0).toUpperCase() +
      emailTrimmed.split("@")[0].slice(1).replace(/[._]/g, " ");

    const { profile: loggedProfile } = OfflineStorage.loginUserAccount(loginEmail.trim(), {
      name: formattedName || "Citizen Observer",
      state: "Delhi",
      district: "New Delhi",
      role: "Citizen",
      avatar: "🇮🇳",
    });

    notifyChange(loggedProfile);
    setFeedbackMsg({
      type: "success",
      text: `Welcome back, ${loggedProfile.name}! Successfully signed in (${loggedProfile.points} Perks restored).`,
    });
    setActiveTab("profile");
  };

  // Handle Registration Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setFeedbackMsg({ type: "error", text: "Please enter your full name." });
      return;
    }
    if (!regEmailOrPhone.trim()) {
      setFeedbackMsg({ type: "error", text: "Please enter your email or mobile number." });
      return;
    }
    if (regPassword.length < 4) {
      setFeedbackMsg({ type: "error", text: "Password must be at least 4 characters long." });
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setFeedbackMsg({ type: "error", text: "Passwords do not match! Please check and retry." });
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

    const { profile: registeredProfile } = OfflineStorage.registerUserAccount(newUser);
    notifyChange(registeredProfile);
    setFeedbackMsg({
      type: "success",
      text: `Account created successfully with +150 Perks Welcome Bonus! Welcome ${registeredProfile.name}.`,
    });
    setActiveTab("profile");
  };

  // Handle Profile Update (Edit Mode)
  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...activeProfile,
      name: regName.trim() || activeProfile.name,
      emailOrPhone: regEmailOrPhone.trim() || activeProfile.emailOrPhone,
      state: regState,
      district: regDistrict.trim() || activeProfile.district,
      role: regRole,
      avatar: regAvatar,
      isLoggedIn: true,
    };
    OfflineStorage.saveUserProfile(updated);
    notifyChange(updated);
    setFeedbackMsg({
      type: "success",
      text: "Profile updated successfully!",
    });
    setActiveTab("profile");
  };

  // Handle Log Out
  const handleLogout = () => {
    const guest = OfflineStorage.logoutUser();
    notifyChange(guest);
    onClose();
    if (onLogout) {
      onLogout();
    } else if (onOpenAuth) {
      onOpenAuth();
    } else {
      setActiveTab("login");
      setFeedbackMsg({
        type: "info",
        text: "You have been logged out and switched to Guest mode (Perks locked).",
      });
    }
  };

  // Open Edit Mode
  const handleOpenEdit = () => {
    setRegName(activeProfile.name);
    setRegEmailOrPhone(activeProfile.emailOrPhone || "");
    setRegState(activeProfile.state || "Delhi");
    setRegDistrict(activeProfile.district || "New Delhi");
    setRegRole(activeProfile.role || "Citizen");
    setRegAvatar(activeProfile.avatar || "🇮🇳");
    setActiveTab("edit");
    setFeedbackMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-white/20 shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/20 flex items-center justify-center text-xl">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                {activeProfile.isLoggedIn ? activeProfile.avatar : "🇮🇳"}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {activeProfile.isLoggedIn
                    ? activeTab === "edit"
                      ? "Edit Profile"
                      : "Observer Account"
                    : activeTab === "register"
                    ? "Register Account"
                    : "Citizen Sign In"}
                </h3>
                {activeProfile.isLoggedIn && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                IMD India Meteorological Observer Portal
              </p>
            </div>
          </div>
          <button
            id="modal-close-login-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers if not logged in */}
        {!activeProfile.isLoggedIn && (
          <div className="flex border-b border-white/10 bg-slate-950/40 p-1.5 gap-1.5 shrink-0">
            <button
              id="tab-login-mode"
              type="button"
              onClick={() => {
                setActiveTab("login");
                setFeedbackMsg(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "login"
                  ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </button>
            <button
              id="tab-register-mode"
              type="button"
              onClick={() => {
                setActiveTab("register");
                setFeedbackMsg(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "register"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> Register
            </button>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Feedback banner */}
          {feedbackMsg && (
            <div
              className={`p-3 rounded-2xl text-xs flex items-start gap-2.5 border animate-fadeIn ${
                feedbackMsg.type === "success"
                  ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
                  : feedbackMsg.type === "error"
                  ? "bg-rose-950/60 border-rose-500/40 text-rose-200"
                  : "bg-sky-950/60 border-sky-500/40 text-sky-200"
              }`}
            >
              {feedbackMsg.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : feedbackMsg.type === "error" ? (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 leading-relaxed">{feedbackMsg.text}</div>
            </div>
          )}

          {/* ================= 1. ACTIVE PROFILE DASHBOARD ================= */}
          {activeProfile.isLoggedIn && activeTab === "profile" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/90 via-slate-800/60 to-slate-900 border border-sky-500/30 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500/30 to-indigo-500/30 border border-sky-400/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
                    {activeProfile.avatar}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base font-bold text-white flex items-center gap-1.5 truncate">
                      {activeProfile.name}
                      <span title="Verified Observer">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      </span>
                    </h4>
                    <p className="text-xs text-sky-300 font-medium mt-0.5 truncate">
                      {activeProfile.role} • {activeProfile.district}, {activeProfile.state}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono truncate">
                      {activeProfile.emailOrPhone || "verified.observer@imd.gov.in"}
                    </p>
                  </div>
                </div>

                {/* Observer metrics */}
                <div className="mt-4 pt-3.5 border-t border-white/10 grid grid-cols-2 gap-2 text-center">
                  <div
                    onClick={() => {
                      if (onOpenPerks) {
                        onClose();
                        onOpenPerks();
                      }
                    }}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-amber-500/20 hover:border-amber-400/50 hover:bg-slate-900/90 transition cursor-pointer group"
                    title="Open Observer Perks & Rewards Center"
                  >
                    <span className="text-[10px] uppercase font-bold text-amber-300/80 block group-hover:text-amber-300">
                      Observer Perks
                    </span>
                    <span className="text-sm font-mono font-bold text-amber-300 flex items-center justify-center gap-1 mt-0.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      {activeProfile.points || 250} pts
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Ground Reports</span>
                    <span className="text-sm font-mono font-bold text-sky-400 mt-0.5 block">Active Contributor</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 flex items-center gap-2.5 text-xs">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block">Registered Location</span>
                  <span className="font-semibold text-slate-200 truncate block">
                    {activeProfile.district}, {activeProfile.state}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  id="profile-edit-btn"
                  type="button"
                  onClick={handleOpenEdit}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/10 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-sky-400" /> Edit Profile
                </button>
                <button
                  id="profile-logout-btn"
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/30 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log Out
                </button>
              </div>
            </div>
          )}

          {/* ================= 2. MANUAL LOGIN FORM ================= */}
          {!activeProfile.isLoggedIn && activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 animate-fadeIn">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="login-email-input"
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. demo@mausam.imd.gov.in"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="login-password-input"
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-white/20 bg-slate-800 text-sky-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-900/40 transition cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>

              {/* Single Demo Account Helper Box */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs bg-slate-800/40 p-2.5 rounded-xl border border-white/5">
                <div className="min-w-0 pr-2">
                  <span className="text-[11px] font-bold text-slate-300 block">Demo User Account</span>
                  <span className="text-[10px] text-slate-400 font-mono truncate block">
                    {DEMO_USER.email} / {DEMO_USER.password}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillDemo}
                  className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 font-semibold text-[11px] transition cursor-pointer shrink-0"
                >
                  Auto Fill
                </button>
              </div>
            </form>
          )}

          {/* ================= 3. REGISTRATION FORM ================= */}
          {!activeProfile.isLoggedIn && activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3 animate-fadeIn">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
                <input
                  id="register-name-input"
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Email or Mobile Number</label>
                <input
                  id="register-email-input"
                  type="text"
                  value={regEmailOrPhone}
                  onChange={(e) => setRegEmailOrPhone(e.target.value)}
                  placeholder="e.g. priya.sharma@gmail.com"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
                  <input
                    id="register-pass-input"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 4 chars"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Confirm Password</label>
                  <input
                    id="register-confirm-pass-input"
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Retype password"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">State / UT</label>
                  <select
                    id="register-state-select"
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">District / City</label>
                  <input
                    id="register-district-input"
                    type="text"
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    placeholder="e.g. Pune, Jaipur"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Observer Role</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["Citizen", "Farmer", "Pilot", "Scientist", "Disaster Manager"] as const).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRegRole(r)}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition cursor-pointer text-center ${
                        regRole === r
                          ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30"
                          : "bg-slate-800/80 text-slate-400 border-white/5 hover:text-white"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Avatar</label>
                <div className="flex flex-wrap gap-1.5">
                  {AVATARS_LIST.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setRegAvatar(av)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-base transition cursor-pointer border ${
                        regAvatar === av
                          ? "bg-indigo-500/30 border-indigo-400 scale-105 shadow"
                          : "bg-slate-800 border-white/10 hover:bg-slate-700"
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="register-submit-btn"
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-900/40 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" /> Create Account
                </button>
              </div>
            </form>
          )}

          {/* ================= 4. EDIT PROFILE FORM ================= */}
          {activeProfile.isLoggedIn && activeTab === "edit" && (
            <form onSubmit={handleUpdateProfileSubmit} className="space-y-3 animate-fadeIn">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Display Name</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Enter full name"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Email or Phone</label>
                <input
                  type="text"
                  value={regEmailOrPhone}
                  onChange={(e) => setRegEmailOrPhone(e.target.value)}
                  placeholder="Enter email or phone"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">State / UT</label>
                  <select
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:border-sky-500"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">District</label>
                  <input
                    type="text"
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    placeholder="Enter district"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Role</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["Citizen", "Farmer", "Pilot", "Scientist", "Disaster Manager"] as const).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRegRole(r)}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition cursor-pointer text-center ${
                        regRole === r
                          ? "bg-sky-500 text-white border-sky-400 shadow-md"
                          : "bg-slate-800 text-slate-400 border-white/5 hover:text-white"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Avatar</label>
                <div className="flex flex-wrap gap-1.5">
                  {AVATARS_LIST.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setRegAvatar(av)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-base transition cursor-pointer border ${
                        regAvatar === av
                          ? "bg-sky-500/30 border-sky-400 scale-105 shadow"
                          : "bg-slate-800 border-white/10 hover:bg-slate-700"
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-white/10 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-900/30 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

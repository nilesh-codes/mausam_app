import { AppLanguage } from "../types";

export interface TranslationDict {
  appTitle: string;
  appSubtitle: string;
  logIn: string;
  notLoggedIn: string;
  loggedInAs: string;
  live: string;
  agrometProducts: string;
  aviation: string;
  crowdSource: string;
  cyclone: string;
  lightning: string;
  radar: string;
  rainAlert: string;
  routeNowCast: string;
  disasterAlerts: string;
  english: string;
  language: string;
  preferencesAndUnits: string;
  favourites: string;
  notification: string;
  share: string;
  rateApp: string;
  faq: string;
  searchCity: string;
  currentLocation: string;
  feelsLike: string;
  humidity: string;
  windSpeed: string;
  pressure: string;
  uvIndex: string;
  airQuality: string;
  dailyForecast: string;
  hourlyForecast: string;
  radarMap: string;
  refresh: string;
}

export const LANGUAGES: { code: AppLanguage; label: string; nativeName: string }[] = [
  { code: "en", label: "English", nativeName: "English" },
  { code: "hi", label: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", label: "Bengali", nativeName: "বাংলা" },
  { code: "ta", label: "Tamil", nativeName: "தமிழ்" },
  { code: "te", label: "Telugu", nativeName: "తెలుగు" },
  { code: "mr", label: "Marathi", nativeName: "मराठी" },
  { code: "gu", label: "Gujarati", nativeName: "ગુજરાતી" },
];

export const TRANSLATIONS: Record<AppLanguage, TranslationDict> = {
  en: {
    appTitle: "Mausam",
    appSubtitle: "National Weather & Climate Service",
    logIn: "Log in",
    notLoggedIn: "You are not logged in",
    loggedInAs: "Logged in as",
    live: "Live",
    agrometProducts: "Agromet Products",
    aviation: "Aviation",
    crowdSource: "Crowd Source",
    cyclone: "Cyclone",
    lightning: "Lightning",
    radar: "Radar",
    rainAlert: "Rain Alert",
    routeNowCast: "Route Now Cast",
    disasterAlerts: "Disaster Alerts",
    english: "English",
    language: "Language",
    preferencesAndUnits: "Preferences & Units",
    favourites: "Favourites",
    notification: "Notification",
    share: "Share",
    rateApp: "Rate App",
    faq: "FAQ",
    searchCity: "Search city, district, or pin code...",
    currentLocation: "Current Location",
    feelsLike: "Feels Like",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
    pressure: "Pressure",
    uvIndex: "UV Index",
    airQuality: "Air Quality",
    dailyForecast: "7-Day Daily Forecast",
    hourlyForecast: "24-Hour Hourly Forecast",
    radarMap: "Live Weather Radar",
    refresh: "Refresh",
  },
  hi: {
    appTitle: "मौसम",
    appSubtitle: "राष्ट्रीय मौसम एवं जलवायु सेवा",
    logIn: "लॉग इन करें",
    notLoggedIn: "आप लॉग इन नहीं हैं",
    loggedInAs: "के रूप में लॉग इन हैं",
    live: "लाइव",
    agrometProducts: "कृषि मौसम उत्पाद",
    aviation: "विमानन मौसम",
    crowdSource: "नागरिक मौसम रिपोर्ट",
    cyclone: "चक्रवात चेतावनी",
    lightning: "दामिनी तड़ित चेतावनी",
    radar: "डॉप्लर रडार",
    rainAlert: "वर्षा चेतावनी",
    routeNowCast: "मार्ग मौसम तत्काल सूचना",
    disasterAlerts: "आपदा चेतावनी (Disaster Alerts)",
    english: "हिन्दी",
    language: "भाषा",
    preferencesAndUnits: "प्राथमिकताएं एवं इकाइयाँ",
    favourites: "पसंदीदा स्थान",
    notification: "अधिसूचनाएं",
    share: "शेयर करें",
    rateApp: "ऐप को रेट करें",
    faq: "अक्सर पूछे जाने वाले प्रश्न",
    searchCity: "शहर या जिला खोजें...",
    currentLocation: "वर्तमान स्थान",
    feelsLike: "अनुभूत तापमान",
    humidity: "आर्द्रता",
    windSpeed: "हवा की गति",
    pressure: "वायुदाब",
    uvIndex: "यूवी सूचकांक",
    airQuality: "वायु गुणवत्ता",
    dailyForecast: "7-दिवसीय दैनिक पूर्वानुमान",
    hourlyForecast: "24-घंटे का प्रति घंटा पूर्वानुमान",
    radarMap: "लाइव मौसम रडार",
    refresh: "ताज़ा करें",
  },
  bn: {
    appTitle: "মৌসুম",
    appSubtitle: "জাতীয় আবহাওয়া ও জলবায়ু সেবা",
    logIn: "লগ ইন করুন",
    notLoggedIn: "আপনি লগ ইন করেননি",
    loggedInAs: "লগ ইন আছেন",
    live: "লাইভ",
    agrometProducts: "কৃষি আবহাওয়া পণ্য",
    aviation: "বিমান চলাচল আবহাওয়া",
    crowdSource: "নাগরিক আবহাওয়া রিপোর্ট",
    cyclone: "ঘূর্ণিঝড় সতর্কতা",
    lightning: "বজ্রপাত সতর্কতা",
    radar: "রাডার কম্পোজিট",
    rainAlert: "বৃষ্টির সতর্কতা",
    routeNowCast: "রুট আবহাওয়া পূর্বাভাস",
    disasterAlerts: "দুর্যোগ সতর্কতা (Disaster Alerts)",
    english: "বাংলা",
    language: "ভাষা",
    preferencesAndUnits: "পছন্দ ও একক",
    favourites: "প্রিয় স্থানসমূহ",
    notification: "বিজ্ঞপ্তি",
    share: "শেয়ার করুন",
    rateApp: "রেটিং দিন",
    faq: "সাধারণ জিজ্ঞাসা",
    searchCity: "শহর বা জেলা খুঁজুন...",
    currentLocation: "বর্তমান অবস্থান",
    feelsLike: "অনুভূত তাপমাত্রা",
    humidity: "আর্দ্রতা",
    windSpeed: "বাতাসের গতি",
    pressure: "বায়ুচাপ",
    uvIndex: "ইউভি ইনডেক্স",
    airQuality: "বায়ুর মান",
    dailyForecast: "৭ দিনের পূর্বাভাস",
    hourlyForecast: "২৪ ঘণ্টার পূর্বাভাস",
    radarMap: "লাইভ আবহাওয়া রাডার",
    refresh: "রিফ্রেশ",
  },
  ta: {
    appTitle: "மௌசம்",
    appSubtitle: "தேசிய வானிலை மற்றும் காலநிலை சேவை",
    logIn: "உள்நுழைக",
    notLoggedIn: "நீங்கள் உள்நுழையவில்லை",
    loggedInAs: "உள்நுழைந்துள்ளீர்",
    live: "நேரலை",
    agrometProducts: "வேளாண் வானிலை தகவல்கள்",
    aviation: "விமானப் போக்குவரத்து வானிலை",
    crowdSource: "மக்கள் வானிலை அறிக்கை",
    cyclone: "புயல் எச்சரிக்கை",
    lightning: "மின்னல் எச்சரிக்கை",
    radar: "டாப்ளர் ரேடார்",
    rainAlert: "மழை எச்சரிக்கை",
    routeNowCast: "பயண வழி வானிலை",
    disasterAlerts: "பேரிடர் எச்சரிக்கைகள் (Disaster Alerts)",
    english: "தமிழ்",
    language: "மொழி",
    preferencesAndUnits: "அமைப்புகள் & அளவீடுகள்",
    favourites: "விருப்பமான இடங்கள்",
    notification: "அறிவிப்புகள்",
    share: "பகிர்",
    rateApp: "மதிப்பீடு செய்க",
    faq: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    searchCity: "நகரத்தைத் தேடுக...",
    currentLocation: "தற்போதைய இடம்",
    feelsLike: "உணரும் வெப்பநிலை",
    humidity: "ஈரப்பதம்",
    windSpeed: "காற்று வேகம்",
    pressure: "வளிமண்டல அழுத்தம்",
    uvIndex: "புற ஊதா குறியீடு",
    airQuality: "காற்று தரம்",
    dailyForecast: "7 நாள் வானிலை முன்னறிவிப்பு",
    hourlyForecast: "24 மணி நேர முன்னறிவிப்பு",
    radarMap: "நேரலை ரேடார்",
    refresh: "புதுப்பி",
  },
  te: {
    appTitle: "మౌసమ్",
    appSubtitle: "జాతీయ వాతావరణ మరియు శీతోష్ణస్థితి సేవ",
    logIn: "లాగిన్ అవ్వండి",
    notLoggedIn: "మీరు లాగిన్ అవ్వలేదు",
    loggedInAs: "లాగిన్ అయ్యారు",
    live: "లైవ్",
    agrometProducts: "వ్యవసాయ వాతావరణ సమాచారం",
    aviation: "విమానయాన వాతావరణం",
    crowdSource: "ప్రజా వాతావరణ నివేదిక",
    cyclone: "తుఫాను హెచ్చరిక",
    lightning: "పిడుగుపాటు హెచ్చరిక",
    radar: "డాప్లర్ రాడార్",
    rainAlert: "వర్ష హెచ్చరిక",
    routeNowCast: "రూట్ వాతావరణ సమాచారం",
    disasterAlerts: "విపత్తు హెచ్చరికలు (Disaster Alerts)",
    english: "తెలుగు",
    language: "భాష",
    preferencesAndUnits: "ప్రాధాన్యతలు & యూనిట్లు",
    favourites: "ఇష్టమైన ప్రదేశాలు",
    notification: "నోటిఫికేషన్లు",
    share: "షేర్ చేయండి",
    rateApp: "యాప్‌ను రేట్ చేయండి",
    faq: "తరచుగా అడిగే ప్రశ్నలు",
    searchCity: "నగరాన్ని శోధించండి...",
    currentLocation: "ప్రస్తుత ప్రదేశం",
    feelsLike: "అనిపించే ఉష్ణోగ్రత",
    humidity: "తేమ",
    windSpeed: "గాలి వేగం",
    pressure: "వాయు పీడనం",
    uvIndex: "UV సూచిక",
    airQuality: "గాలి నాణ్యత",
    dailyForecast: "7 రోజుల సూచన",
    hourlyForecast: "24 గంటల సూచన",
    radarMap: "లైవ్ రాడార్",
    refresh: "రిఫ్రెష్",
  },
  mr: {
    appTitle: "मौसम",
    appSubtitle: "राष्ट्रीय हवामान व हवामानशास्त्र सेवा",
    logIn: "लॉग इन करा",
    notLoggedIn: "तुम्ही लॉग इन केलेले नाही",
    loggedInAs: "लॉग इन केले आहे",
    live: "थेट",
    agrometProducts: "कृषी हवामान उत्पादने",
    aviation: "विमान वाहतूक हवामान",
    crowdSource: "नागरीक हवामान नोंद",
    cyclone: "चक्रीवादळ इशारा",
    lightning: "विजांचा इशारा (दामिनी)",
    radar: "डॉप्लर रडार",
    rainAlert: "पाऊस अलर्ट",
    routeNowCast: "मार्ग हवामान अंदाज",
    disasterAlerts: "आपत्ती इशारा (Disaster Alert)",
    english: "मराठी",
    language: "भाषा",
    preferencesAndUnits: "प्राधान्ये आणि एकके",
    favourites: "आवडती ठिकाणे",
    notification: "सूचना",
    share: "शेअर करा",
    rateApp: "अ‍ॅपला रेटिंग द्या",
    faq: "वारंवार विचारले जाणारे प्रश्न",
    searchCity: "शहर शोधा...",
    currentLocation: "सध्याचे ठिकाण",
    feelsLike: "जाणवणारे तापमान",
    humidity: "आर्द्रता",
    windSpeed: "वाऱ्याचा वेग",
    pressure: "हवेचा दाब",
    uvIndex: "यूव्ही निर्देशांक",
    airQuality: "हवेची गुणवत्ता",
    dailyForecast: "७ दिवसांचा अंदाज",
    hourlyForecast: "२४ तासांचा अंदाज",
    radarMap: "थेट हवामान रडार",
    refresh: "ताजे करा",
  },
  gu: {
    appTitle: "મૌસમ",
    appSubtitle: "રાષ્ટ્રીય હવામાન અને આબોહવા સેવા",
    logIn: "લૉગ ઇન કરો",
    notLoggedIn: "તમે લૉગ ઇન નથી",
    loggedInAs: "તરીકે લૉગ ઇન છો",
    live: "લાઇવ",
    agrometProducts: "કૃષિ હવામાન ઉત્પાદનો",
    aviation: "વિમાન સેવા હવામાન",
    crowdSource: "લોકોના હવામાન અહેવાલ",
    cyclone: "વાવાઝોડું ચેતવણી",
    lightning: "વીજળી ચેતવણી",
    radar: "ડોપ્લર રડાર",
    rainAlert: "વરસાદ ચેતવણી",
    routeNowCast: "રૂટ હવામાન આગાહી",
    disasterAlerts: "આપત્તિ ચેતવણી (Disaster Alerts)",
    english: "ગુજરાતી",
    language: "ભાષા",
    preferencesAndUnits: "પસંદગીઓ અને એકમો",
    favourites: "મનપસંદ સ્થળો",
    notification: "સૂચનાઓ",
    share: "શેર કરો",
    rateApp: "રેટ કરો",
    faq: "વારંવાર પૂછાતા પ્રશ્નો",
    searchCity: "શહેર શોધો...",
    currentLocation: "વર્તમાન સ્થળ",
    feelsLike: "અનુભવાતું તાપમાન",
    humidity: "ભેજ",
    windSpeed: "પવનની ગતિ",
    pressure: "વાતાવરણીય દબાણ",
    uvIndex: "યુવી ઇન્ડેક્સ",
    airQuality: "હવાની ગુણવત્તા",
    dailyForecast: "૭ દિવસની આગાહી",
    hourlyForecast: "૨૪ કલાકની આગાહી",
    radarMap: "લાઇવ રડાર",
    refresh: "રિફ્રેશ",
  },
};

export const getTranslation = (lang: AppLanguage = "en"): TranslationDict => {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
};

export const getTimeOfDayGreeting = (lang: AppLanguage = "en", date = new Date()): string => {
  const hour = date.getHours();
  const greetings: Record<AppLanguage, { morning: string; afternoon: string; evening: string; night: string }> = {
    en: {
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening",
      night: "Good evening",
    },
    hi: {
      morning: "शुभ प्रभात",
      afternoon: "शुभ दोपहर",
      evening: "शुभ संध्या",
      night: "नमस्ते",
    },
    bn: {
      morning: "শুভ সকাল",
      afternoon: "শুভ অপরাহ্ন",
      evening: "শুভ সন্ধ্যা",
      night: "নমস্কার",
    },
    ta: {
      morning: "காலை வணக்கம்",
      afternoon: "மதிய வணக்கம்",
      evening: "மாலை வணக்கம்",
      night: "வணக்கம்",
    },
    te: {
      morning: "శుభోదయం",
      afternoon: "శుభ మధ్యాహ్నం",
      evening: "శుభ సాయంత్రం",
      night: "నమస్కారం",
    },
    mr: {
      morning: "शुभ प्रभात",
      afternoon: "शुभ दुपार",
      evening: "शुभ संध्याकाळ",
      night: "नमस्कार",
    },
    gu: {
      morning: "શુભ સવાર",
      afternoon: "શુભ બપોર",
      evening: "શુભ સંધ્યા",
      night: "નમસ્તે",
    },
  };

  const current = greetings[lang] || greetings.en;
  if (hour >= 5 && hour < 12) return current.morning;
  if (hour >= 12 && hour < 17) return current.afternoon;
  if (hour >= 17 && hour < 22) return current.evening;
  return current.night;
};


import React from "react";
import {
  Sun,
  SunMedium,
  Moon,
  MoonStar,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudSunRain,
  CloudLightning,
  CloudHail,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Compass,
  Gauge,
  Sunrise,
  Sunset,
  Sparkles,
  Waves,
  HeartPulse,
  Activity,
  Luggage,
  Baby,
  Sprout,
  Car,
  CalendarCheck,
  Plane,
  AlertTriangle,
  Umbrella,
  ShieldCheck,
  CheckCircle,
  RefreshCw,
  Search,
  SlidersHorizontal,
  MapPin,
  Clock,
  ChevronRight,
  ChevronDown,
  Info,
  Send,
  Bot,
  User,
  Plus,
  Trash2,
  Share2,
  Navigation,
  Flame,
  Zap,
} from "lucide-react";

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = "w-6 h-6", size }) => {
  const iconProps = { className, ...(size ? { size } : {}) };

  switch (name) {
    case "Sun":
      return <Sun {...iconProps} />;
    case "SunMedium":
      return <SunMedium {...iconProps} />;
    case "Moon":
      return <Moon {...iconProps} />;
    case "MoonStar":
      return <MoonStar {...iconProps} />;
    case "Cloud":
      return <Cloud {...iconProps} />;
    case "CloudSun":
      return <CloudSun {...iconProps} />;
    case "CloudMoon":
      return <CloudMoon {...iconProps} />;
    case "CloudFog":
      return <CloudFog {...iconProps} />;
    case "CloudDrizzle":
      return <CloudDrizzle {...iconProps} />;
    case "CloudRain":
      return <CloudRain {...iconProps} />;
    case "CloudRainWind":
      return <CloudRainWind {...iconProps} />;
    case "CloudSnow":
      return <CloudSnow {...iconProps} />;
    case "Snowflake":
      return <Snowflake {...iconProps} />;
    case "CloudSunRain":
      return <CloudSunRain {...iconProps} />;
    case "CloudLightning":
      return <CloudLightning {...iconProps} />;
    case "CloudHail":
      return <CloudHail {...iconProps} />;
    case "Wind":
      return <Wind {...iconProps} />;
    case "Droplets":
      return <Droplets {...iconProps} />;
    case "Thermometer":
      return <Thermometer {...iconProps} />;
    case "Eye":
      return <Eye {...iconProps} />;
    case "Compass":
      return <Compass {...iconProps} />;
    case "Gauge":
      return <Gauge {...iconProps} />;
    case "Sunrise":
      return <Sunrise {...iconProps} />;
    case "Sunset":
      return <Sunset {...iconProps} />;
    case "Sparkles":
      return <Sparkles {...iconProps} />;
    case "Waves":
      return <Waves {...iconProps} />;
    case "HeartPulse":
      return <HeartPulse {...iconProps} />;
    case "Activity":
      return <Activity {...iconProps} />;
    case "Luggage":
      return <Luggage {...iconProps} />;
    case "Baby":
      return <Baby {...iconProps} />;
    case "Sprout":
      return <Sprout {...iconProps} />;
    case "Car":
      return <Car {...iconProps} />;
    case "CalendarCheck":
      return <CalendarCheck {...iconProps} />;
    case "Plane":
      return <Plane {...iconProps} />;
    case "AlertTriangle":
      return <AlertTriangle {...iconProps} />;
    case "Umbrella":
      return <Umbrella {...iconProps} />;
    case "ShieldCheck":
      return <ShieldCheck {...iconProps} />;
    case "CheckCircle":
      return <CheckCircle {...iconProps} />;
    case "RefreshCw":
      return <RefreshCw {...iconProps} />;
    case "Search":
      return <Search {...iconProps} />;
    case "SlidersHorizontal":
      return <SlidersHorizontal {...iconProps} />;
    case "MapPin":
      return <MapPin {...iconProps} />;
    case "Clock":
      return <Clock {...iconProps} />;
    case "ChevronRight":
      return <ChevronRight {...iconProps} />;
    case "ChevronDown":
      return <ChevronDown {...iconProps} />;
    case "Info":
      return <Info {...iconProps} />;
    case "Send":
      return <Send {...iconProps} />;
    case "Bot":
      return <Bot {...iconProps} />;
    case "User":
      return <User {...iconProps} />;
    case "Plus":
      return <Plus {...iconProps} />;
    case "Trash2":
      return <Trash2 {...iconProps} />;
    case "Share2":
      return <Share2 {...iconProps} />;
    case "Navigation":
      return <Navigation {...iconProps} />;
    case "Flame":
      return <Flame {...iconProps} />;
    case "Zap":
      return <Zap {...iconProps} />;
    default:
      return <Sun {...iconProps} />;
  }
};

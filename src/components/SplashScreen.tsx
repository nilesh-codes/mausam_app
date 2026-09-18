import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CloudSun } from "lucide-react";

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onCompleteRef.current?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="mausam-startup-splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white overflow-hidden p-6"
        >
          {/* Subtle atmospheric ambient glow matching dashboard theme */}
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-sky-600/10 via-indigo-600/10 to-purple-600/10 blur-3xl pointer-events-none" />

          {/* Center Content */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center text-center max-w-sm w-full mx-auto"
          >
            {/* Existing project emblem container */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 p-0.5 shadow-2xl shadow-sky-500/20 flex items-center justify-center mb-5">
              <div className="w-full h-full bg-slate-950/85 backdrop-blur-md rounded-[22px] flex items-center justify-center">
                <CloudSun className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
              </div>
            </div>

            {/* 1. Large title */}
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-serif mb-2">
              Mausam
            </h1>

            {/* 3. Bold subtitle */}
            <h2 className="text-base sm:text-lg font-bold tracking-wide text-sky-400 mb-1">
              Unified Mobile App
            </h2>

            {/* 4. Smaller text */}
            <p className="text-xs sm:text-sm font-medium text-slate-400 tracking-wider">
              India Meteorological Department
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

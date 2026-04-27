import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 6 seconds splash
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Allow exit animation
    }, 6000);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 800);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0.1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 bg-[#00f3ff] rounded-full blur-[200px] pointer-events-none"
          />
          
          <div className="relative w-full max-w-xs px-6">
            {/* Progress Bar Container */}
            <div className="w-full space-y-2">
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="h-full bg-[#00f3ff] shadow-[0_0_15px_#00f3ff]"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

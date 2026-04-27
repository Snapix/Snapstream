import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { BlurText } from "./BlurText";
import { PlayCircle } from "lucide-react";

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
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0.2 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 bg-primary rounded-full blur-[150px]"
          />
          
          <div className="relative flex flex-col items-center justify-center w-full max-w-sm px-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="w-24 h-24 sm:w-32 sm:h-32 mb-8 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,191,255,0.6)] bg-black/50 border border-white/5 relative flex items-center justify-center"
            >
              <PlayCircle className="w-12 h-12 text-primary fill-current drop-shadow-lg z-10" />
              <div className="absolute inset-0 bg-primary/20 blur-md" />
            </motion.div>
            
            <div className="text-3xl sm:text-4xl font-black tracking-wider text-white font-serif uppercase mb-12">
              <BlurText text="Loading Entertainment" delay={200} animateBy="words" />
            </div>

            {/* Progress Bar Container */}
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between gap-1 text-zinc-400 font-mono text-xs uppercase tracking-widest">
                <span>Initializing Engine</span>
                <span>{Math.min(progress, 100)}%</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="h-full bg-primary shadow-[0_0_10px_#00bfff]"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

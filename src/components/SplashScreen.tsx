import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Allow exit animation
    }, 2500);
    return () => clearTimeout(timer);
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
          
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="w-24 h-24 sm:w-32 sm:h-32 mb-6 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,191,255,0.6)] bg-black/50 border border-white/5 relative flex items-center justify-center"
            >
              <img src="/icon.jpeg" alt="SnapStream Logo" className="w-full h-full object-cover z-10" onError={(e) => e.currentTarget.style.display = 'none'} />
              <div className="absolute inset-0 bg-primary/20 blur-md" />
            </motion.div>
            <motion.h1
              initial={{ scale: 0.8, opacity: 0, letterSpacing: "1em" }}
              animate={{ scale: 1, opacity: 1, letterSpacing: "0.1em" }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="text-5xl sm:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-primary to-accent-purple drop-shadow-[0_0_30px_rgba(0,191,255,0.5)] italic uppercase"
            >
              SnapStream
            </motion.h1>
            
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 0.6 }}
              transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
              className="h-px bg-gradient-to-r from-transparent via-white to-transparent mt-4"
            />
            
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="text-zinc-500 font-medium tracking-[0.3em] uppercase text-xs mt-6"
            >
              Entering the Digital Theater
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

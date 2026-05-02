import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 20 + 20;
      if (currentProgress > 100) {
        currentProgress = 100;
        setProgress(currentProgress);
        clearInterval(interval);
        setTimeout(onComplete, 200); // Wait a fraction at 100%
      } else {
        setProgress(currentProgress);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      key="splash"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        {/* SnapStream Logo Text */}
        <div className="flex space-x-1 overflow-hidden font-bold tracking-tighter text-6xl md:text-8xl mb-8">
          {['S', 'N', 'A', 'P', 'S', 'T', 'R', 'E', 'A', 'M'].map((letter, i) => (
            <motion.span
              key={i}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: i * 0.05,
                ease: [0.2, 0.6, 0.3, 1]
              }}
              className={i < 4 ? "text-[#00f3ff]" : "text-white"}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Fake Loading Bar */}
        <div className="w-64 md:w-96 h-1 mt-4 relative bg-white/10 rounded overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-[#00f3ff]"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.2 }}
          />
        </div>
        
        <motion.div 
          className="mt-4 text-[#00f3ff]/60 text-sm tracking-widest uppercase font-mono"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          Loading... {Math.floor(progress)}%
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const TOTAL_DURATION_MS = 3200;

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [visible,  setVisible]  = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase,    setPhase]    = useState<'loading' | 'done'>('loading');

  useEffect(() => {
    const start = performance.now();

    // Smooth progress via rAF
    let rafId: number;
    const tick = () => {
      const elapsed = performance.now() - start;
      const pct = Math.min(elapsed / TOTAL_DURATION_MS, 1);
      setProgress(pct);
      if (pct < 1) rafId = requestAnimationFrame(tick);
      else         setPhase('done');
    };
    rafId = requestAnimationFrame(tick);

    // Dismiss splash
    const exitTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 600);
    }, TOTAL_DURATION_MS + 400);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          {/* ── Ambient glow bg ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1.8 }}
            transition={{ duration: 2.5, ease: 'easeOut' }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,243,255,.07) 0%, transparent 70%)',
            }}
          />

          {/* Secondary purple glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 40% 40% at 70% 60%, rgba(180,75,255,.05) 0%, transparent 60%)',
            }}
          />

          {/* ── Logo mark ────────────────────────────────────── */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative mb-10 flex flex-col items-center"
          >
            {/* Glow ring */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 -m-8 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(0,243,255,.15) 0%, transparent 70%)' }}
            />

            {/* Icon */}
            <div className="relative w-20 h-20 rounded-2xl glass-card flex items-center justify-center mb-6 border-[#00f3ff]/15">
              <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden>
                <defs>
                  <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f3ff" />
                    <stop offset="100%" stopColor="#00aaff" />
                  </linearGradient>
                </defs>
                <polygon
                  points="8,4 32,20 8,36"
                  fill="url(#sg)"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(0,243,255,.8))' }}
                />
              </svg>
            </div>

            {/* Wordmark */}
            <motion.h1
              initial={{ letterSpacing: '0.3em', opacity: 0 }}
              animate={{ letterSpacing: '0.05em', opacity: 1 }}
              transition={{ delay: 0.3, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-4xl sm:text-5xl font-black text-white italic uppercase font-display"
              style={{
                textShadow: '0 0 40px rgba(0,243,255,.4), 0 0 80px rgba(0,243,255,.15)',
                background: 'linear-gradient(135deg, #fff 0%, #00f3ff 50%, rgba(255,255,255,.8) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              SnapStream
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-xs font-semibold tracking-[0.25em] text-zinc-500 uppercase mt-2"
            >
              Infinite streaming
            </motion.p>
          </motion.div>

          {/* ── Progress track ───────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.5 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="relative w-48 sm:w-64"
          >
            {/* Track */}
            <div className="h-px w-full bg-white/[.06] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress * 100}%`,
                  background: 'linear-gradient(to right, #00f3ff, rgba(0,243,255,.6))',
                  boxShadow: '0 0 8px rgba(0,243,255,.6)',
                }}
                transition={{ duration: 0.05, ease: 'linear' }}
              />
            </div>

            {/* Percentage */}
            <div className="mt-3 flex justify-between items-center">
              <span className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase">
                {phase === 'done' ? 'Ready' : 'Loading'}
              </span>
              <span className="text-[10px] font-bold text-[#00f3ff]/60 tabular-nums">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </motion.div>

          {/* ── Scan line effect ─────────────────────────────── */}
          <motion.div
            className="absolute inset-x-0 pointer-events-none"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 2.5, ease: 'linear', delay: 0.3 }}
            style={{
              height: '2px',
              background: 'linear-gradient(to right, transparent, rgba(0,243,255,.1), transparent)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

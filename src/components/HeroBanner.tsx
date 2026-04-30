import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Play, Plus, ChevronDown, Star } from 'lucide-react';
import { Media } from '../services/tmdb';
import { Particles } from './ui/particles';
import { TMDB_IMAGE_BASE_URL } from '../constants';

interface HeroBannerProps {
  movies?: Media[];
  movie?: Media | null;
}

const SLIDE_DURATION = 9000;

/**
 * Cinematic hero banner.
 * ✓ Ken Burns via CSS transform only (GPU)
 * ✓ Spring stagger animations
 * ✓ setInterval cleanup
 * ✓ Progress indicator dots
 * ✓ Blurred poster bg for depth
 */
export const HeroBanner = memo(function HeroBanner({ movies, movie }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress,     setProgress]     = useState(0);

  const displayMovies = movies?.length ? movies : movie ? [movie] : [];

  /* ── Auto-advance with progress bar ─────────────────────── */
  useEffect(() => {
    if (displayMovies.length <= 1) return;
    const startTime = performance.now();

    const tick = () => {
      const elapsed = (performance.now() - startTime) % SLIDE_DURATION;
      setProgress(elapsed / SLIDE_DURATION);
    };

    let animRef: number;
    const rafId = requestAnimationFrame(function loop() {
      tick();
      animRef = requestAnimationFrame(loop);
    });
    animRef = rafId;

    const slideTimer = setInterval(() => {
      setCurrentIndex(i => (i + 1) % displayMovies.length);
    }, SLIDE_DURATION);

    return () => {
      cancelAnimationFrame(animRef);
      clearInterval(slideTimer);
    };
  }, [displayMovies.length]);

  const goTo = useCallback((idx: number) => {
    setCurrentIndex(idx);
    setProgress(0);
  }, []);

  /* ── Loading skeleton ────────────────────────────────────── */
  if (!displayMovies.length) {
    return (
      <div className="relative w-full h-[65vh] sm:h-[85vh] bg-[#060810] overflow-hidden">
        <div className="skeleton absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#00f3ff]/30 border-t-[#00f3ff] animate-spin" />
        </div>
      </div>
    );
  }

  const film = displayMovies[currentIndex];
  const year = (film.release_date || film.first_air_date)?.split('-')[0];
  const matchPct = Math.round((film.vote_average || 0) * 10);

  return (
    <div className="relative w-full h-[65vh] sm:h-[85vh] overflow-hidden bg-black">

      {/* ── Backdrop images ───────────────────────────────── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={film.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
          style={{ willChange: 'transform, opacity' }}
        >
          {/* Blurred background plate for depth */}
          <img
            src={`${TMDB_IMAGE_BASE_URL}${film.backdrop_path}`}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-3xl opacity-30 pointer-events-none select-none"
            loading="eager"
          />

          {/* Ken Burns main image — GPU transform only */}
          <motion.img
            src={`${TMDB_IMAGE_BASE_URL}${film.backdrop_path}`}
            alt={film.title || film.name}
            loading="eager"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-top select-none pointer-events-none"
            animate={{ scale: 1.05 }}
            transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
            style={{ willChange: 'transform' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Cinematic gradient layers ─────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Left fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent" />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        {/* Top vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
        {/* Cinematic color grade */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00f3ff]/[.03] to-transparent" />
      </div>

      <Particles
        className="absolute inset-0 z-0 opacity-40 mix-blend-screen"
        quantity={60}
        ease={80}
        color="#ffffff"
        refresh
      />

      {/* ── Main content ─────────────────────────────────── */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col justify-end pb-14 sm:pb-20">

        <AnimatePresence mode="wait">
          <motion.div
            key={film.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.7, ease: [0.21,0.47,0.32,0.98] }}
            className="max-w-2xl"
          >
            {/* Trending badge */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="pill pill-danger">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Trending #{currentIndex + 1}
              </span>
              <span className="pill pill-ghost">
                {film.media_type === 'tv' ? 'TV Series' : 'Film'}
              </span>
              {year && (
                <span className="text-xs font-semibold text-zinc-400 tracking-wider">
                  {year}
                </span>
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.21,0.47,0.32,0.98] }}
              className="text-4xl sm:text-6xl md:text-7xl font-black leading-none tracking-tight text-white mb-4 font-display"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,.8)' }}
            >
              {film.title || film.name}
            </motion.h1>

            {/* Metadata row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="rating-badge">
                <Star className="w-3 h-3 fill-[#ffd700]" />
                {matchPct}% Match
              </div>
              <span className="text-xs font-bold text-zinc-400 border border-zinc-700 px-2 py-0.5 rounded-[3px]">
                4K UHD
              </span>
              <span className="text-xs font-bold text-zinc-400 border border-zinc-700 px-2 py-0.5 rounded-[3px]">
                HDR
              </span>
            </motion.div>

            {/* Overview */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-zinc-300 text-sm sm:text-base leading-relaxed line-clamp-3 sm:line-clamp-4 mb-8 max-w-lg"
              style={{ textShadow: '0 1px 8px rgba(0,0,0,.7)' }}
            >
              {film.overview}
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.34,1.56,0.64,1] }}
              className="flex items-center flex-wrap gap-3"
            >
              <Link to={`/watch/${film.media_type || 'movie'}/${film.id}`}>
                <motion.button
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="
                    flex items-center gap-2.5 px-7 py-3.5 rounded-xl
                    bg-[#00f3ff] text-black font-black text-sm tracking-wide
                    shadow-[0_0_30px_rgba(0,243,255,.5),inset_0_1px_0_rgba(255,255,255,.4)]
                    hover:shadow-[0_0_50px_rgba(0,243,255,.7),inset_0_1px_0_rgba(255,255,255,.5)]
                    transition-shadow
                  "
                  style={{ willChange: 'transform' }}
                >
                  <Play className="w-5 h-5 fill-black" />
                  Play Now
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="
                  flex items-center gap-2 px-6 py-3.5 rounded-xl
                  glass-heavy
                  text-white font-bold text-sm
                  border border-white/[.08]
                  hover:border-white/[.15] hover:bg-white/[.06]
                  transition-all
                "
                style={{ willChange: 'transform' }}
              >
                <Plus className="w-4 h-4" />
                Watchlist
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* ── Slide indicators ─────────────────────────────── */}
        {displayMovies.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-5 right-6 sm:right-10 flex items-center gap-2"
          >
            {displayMovies.slice(0, 8).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className="relative h-1 rounded-full overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00f3ff]"
                style={{ width: idx === currentIndex ? 28 : 14, background: 'rgba(255,255,255,.2)' }}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={idx === currentIndex}
              >
                {idx === currentIndex && (
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-[#00f3ff] rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.1, ease: 'linear' }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* ── Scroll hint ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1"
      >
        <span className="text-[10px] font-bold tracking-[.2em] text-zinc-500 uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-zinc-600" />
        </motion.div>
      </motion.div>
    </div>
  );
});

import { useRef, useCallback, memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Media } from '../services/tmdb';
import { MovieCard } from './MovieCard';
import { FadeContent } from './FadeContent';

interface MovieRowProps {
  title:   string;
  movies:  Media[];
  isLarge?: boolean;
}

/**
 * Optimized movie row.
 * ✓ React.memo — no rerender when parent re-renders for other rows
 * ✓ useCallback on scroll handlers
 * ✓ Fade-in via FadeContent (IntersectionObserver, fires once)
 * ✓ Native smooth scroll (no jank)
 * ✓ CSS mask fade on edges
 */
export const MovieRow = memo(function MovieRow({ title, movies, isLarge = false }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const slide = useCallback((direction: 'left' | 'right') => {
    const el = rowRef.current;
    if (!el) return;
    const amount = direction === 'left'
      ? -el.clientWidth + 80
      :  el.clientWidth - 80;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  }, []);

  const slideLeft  = useCallback(() => slide('left'),  [slide]);
  const slideRight = useCallback(() => slide('right'), [slide]);

  if (!movies?.length) return null;

  const isLive    = title.includes('Trending') || title.includes('Continue');
  const isContinue = title.includes('Continue');

  return (
    <FadeContent className="relative group/row py-2 select-none" delay={0.05}>

      {/* ── Section header ──────────────────────────────── */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-4">
        <h3 className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
          {/* Accent bar */}
          <span
            className="w-1 h-5 rounded-full flex-shrink-0"
            style={{
              background: isContinue
                ? 'linear-gradient(to bottom, #00f3ff, #0080ff)'
                : isLive
                  ? 'linear-gradient(to bottom, #ff4444, #ff8800)'
                  : 'linear-gradient(to bottom, rgba(255,255,255,.3), rgba(255,255,255,.05))',
              boxShadow: isLive ? '0 0 8px rgba(255,50,50,.5)' : undefined,
            }}
          />
          {title}
          {isLive && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
          )}
        </h3>

        {/* View all (optional) */}
        <button className="text-[11px] font-semibold text-zinc-500 hover:text-[#00f3ff] transition-colors tracking-wide uppercase opacity-0 group-hover/row:opacity-100">
          View All →
        </button>
      </div>

      {/* ── Scroll track ─────────────────────────────────── */}
      <div className="relative flex items-center">
        {/* Left arrow */}
        <motion.button
          onClick={slideLeft}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'absolute left-0 z-30 h-full w-10 sm:w-12 hidden sm:flex items-center justify-center',
            'bg-gradient-to-r from-black/90 to-transparent',
            'opacity-0 group-hover/row:opacity-100 transition-opacity duration-300',
            'text-zinc-300 hover:text-white'
          )}
          aria-label="Scroll left"
          style={{ willChange: 'transform' }}
        >
          <div className="w-8 h-8 rounded-full glass-card flex items-center justify-center border border-white/[.06]">
            <ChevronLeft className="w-4 h-4" />
          </div>
        </motion.button>

        {/* Scrollable list */}
        <div
          ref={rowRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 pb-4 pt-1 row-fade-x"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {movies.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.4, ease: [0.25,0.46,0.45,0.94] }}
              style={{ scrollSnapAlign: 'start', willChange: 'transform, opacity' }}
            >
              <MovieCard media={m} isLarge={isLarge} />
            </motion.div>
          ))}
        </div>

        {/* Right arrow */}
        <motion.button
          onClick={slideRight}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'absolute right-0 z-30 h-full w-10 sm:w-12 hidden sm:flex items-center justify-center',
            'bg-gradient-to-l from-black/90 to-transparent',
            'opacity-0 group-hover/row:opacity-100 transition-opacity duration-300',
            'text-zinc-300 hover:text-white'
          )}
          aria-label="Scroll right"
          style={{ willChange: 'transform' }}
        >
          <div className="w-8 h-8 rounded-full glass-card flex items-center justify-center border border-white/[.06]">
            <ChevronRight className="w-4 h-4" />
          </div>
        </motion.button>
      </div>
    </FadeContent>
  );
});

// cn helper inline to avoid extra import
function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

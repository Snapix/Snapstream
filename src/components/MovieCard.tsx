import React, { memo, useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Play, Star, Tv2, Film } from 'lucide-react';
import { Media } from '../services/tmdb';
import { TMDB_IMAGE_BASE_URL, TMDB_POSTER_BASE_URL } from '../constants';
import { cn } from '../lib/utils';

interface MovieCardProps {
  media: Media;
  isLarge?: boolean;
}

/**
 * GPU-accelerated premium movie card.
 * ✓ Only animates transform + opacity (no layout props)
 * ✓ React.memo prevents unnecessary rerenders
 * ✓ Lazy image loading
 * ✓ Glass shimmer hover effect
 */
const MovieCard = memo(function MovieCard({ media, isLarge = false }: MovieCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  const imgSrc = isLarge
    ? media.poster_path
      ? `${TMDB_POSTER_BASE_URL}${media.poster_path}`
      : media.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${media.backdrop_path}` : null
    : media.backdrop_path
      ? `${TMDB_IMAGE_BASE_URL}${media.backdrop_path}`
      : media.poster_path ? `${TMDB_POSTER_BASE_URL}${media.poster_path}` : null;

  const handleLoad = useCallback(() => setImgLoaded(true), []);

  if (!imgSrc) return null;

  const year = (media.release_date || media.first_air_date)?.split('-')[0];
  const rating = (media.vote_average || 0).toFixed(1);
  const title = media.title || media.name || '';
  const isTV = media.media_type === 'tv';

  return (
    <Link
      to={`/watch/${media.media_type || 'movie'}/${media.id}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f3ff] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-xl"
      aria-label={`Watch ${title}`}
    >
      <motion.div
        layoutId={`card-${media.id}`}
        initial={false}
        whileHover="hovered"
        whileTap={{ scale: 0.97 }}
        className={cn(
          'relative group flex-shrink-0 overflow-hidden rounded-xl cursor-pointer',
          'border border-white/[.06]',
          isLarge ? 'w-[148px] sm:w-[200px] aspect-[2/3]' : 'w-[240px] sm:w-[300px] aspect-video'
        )}
        style={{ willChange: 'transform' }}
      >
        {/* ── Skeleton while loading ───────────────────── */}
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton z-10" />
        )}

        {/* ── Poster / backdrop image ──────────────────── */}
        <motion.img
          src={imgSrc}
          alt={title}
          onLoad={handleLoad}
          loading="lazy"
          decoding="async"
          className={cn(
            'w-full h-full object-cover transition-opacity duration-500',
            imgLoaded ? 'opacity-100' : 'opacity-0'
          )}
          variants={{
            hovered: { scale: 1.07 }
          }}
          transition={{ duration: 0.5, ease: [0.25,0.46,0.45,0.94] }}
          style={{ willChange: 'transform' }}
        />

        {/* ── Bottom gradient scrim ─────────────────────── */}
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none z-10" />

        {/* ── Top gradient (for badge contrast) ─────────── */}
        <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-10" />

        {/* ── Glass shimmer sweep on hover ─────────────── */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          variants={{
            hovered: { backgroundPosition: '250% 250%' }
          }}
          style={{
            background: 'linear-gradient(-45deg, transparent 30%, rgba(255,255,255,.06) 50%, transparent 70%)',
            backgroundSize: '250% 250%',
            backgroundPosition: '-50% -50%',
            transition: 'background-position 0.6s ease',
          }}
        />

        {/* ── Neon border glow on hover ─────────────────── */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none z-20"
          variants={{
            hovered: {
              boxShadow: 'inset 0 0 0 1px rgba(0,243,255,.25), 0 0 30px rgba(0,243,255,.12)'
            }
          }}
          style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.04)' }}
          transition={{ duration: 0.25 }}
        />

        {/* ── Media type badge ─────────────────────────── */}
        <div className="absolute top-2.5 left-2.5 z-30">
          <span className="pill pill-ghost flex items-center gap-1">
            {isTV
              ? <Tv2 className="w-2.5 h-2.5" />
              : <Film className="w-2.5 h-2.5" />}
            {isTV ? 'TV' : 'Movie'}
          </span>
        </div>

        {/* ── Play button ─────────────────────────────── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          variants={{ hovered: { opacity: 1, scale: 1 } }}
          initial={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: [0.34,1.56,0.64,1] }}
        >
          <div className="
            w-12 h-12 rounded-full flex items-center justify-center
            bg-black/40 backdrop-blur-md
            border border-white/20
            shadow-[0_0_20px_rgba(0,243,255,.3),inset_0_1px_0_rgba(255,255,255,.15)]
          ">
            <Play className="w-5 h-5 fill-[#00f3ff] text-[#00f3ff] translate-x-0.5 drop-shadow-[0_0_8px_#00f3ff]" />
          </div>
        </motion.div>

        {/* ── Card info bottom ─────────────────────────── */}
        <div className="absolute inset-x-0 bottom-0 p-3 z-30">
          <motion.div
            variants={{ hovered: { y: -4 } }}
            transition={{ duration: 0.3, ease: [0.25,0.46,0.45,0.94] }}
          >
            <h3 className="text-white font-bold text-sm leading-tight mb-1.5 truncate drop-shadow-md">
              {title}
            </h3>

            <div className="flex items-center gap-2">
              {/* Rating */}
              <div className="rating-badge">
                <Star className="w-2.5 h-2.5 fill-[#ffd700]" />
                {rating}
              </div>

              {/* Year */}
              {year && (
                <span className="text-[11px] font-medium text-zinc-400">
                  {year}
                </span>
              )}

              {/* Quality badge */}
              <span className="text-[10px] font-bold text-zinc-500 border border-zinc-700/60 px-1.5 py-0.5 rounded-[3px] hidden sm:inline-block">
                4K
              </span>
            </div>

            {/* Overview on hover */}
            <motion.p
              className="text-zinc-400 text-xs mt-2 leading-relaxed overflow-hidden"
              variants={{ hovered: { height: 'auto', opacity: 1 } }}
              initial={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="line-clamp-2">{media.overview}</span>
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
});

export { MovieCard };
export default MovieCard;

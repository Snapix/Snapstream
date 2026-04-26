import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Play, Info, Star } from 'lucide-react';
import { Media } from '../services/tmdb';
import { TMDB_IMAGE_BASE_URL, TMDB_POSTER_BASE_URL } from '../constants';
import { cn } from '../lib/utils';

interface MovieCardProps {
  media: Media;
  isLarge?: boolean;
}

export function MovieCard({ media, isLarge = false }: MovieCardProps) {
  const imageUrl = media.poster_path 
    ? `${isLarge ? TMDB_IMAGE_BASE_URL : TMDB_POSTER_BASE_URL}${isLarge ? media.poster_path : media.backdrop_path || media.poster_path}`
    : media.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${media.backdrop_path}` : null;

  if (!imageUrl) return null;

  return (
    <Link to={`/watch/${media.media_type || 'movie'}/${media.id}`}>
      <motion.div
        whileHover={{ 
          scale: 1.05, 
          zIndex: 40,
          rotateY: 5,
          rotateX: -5,
          boxShadow: "0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(168, 85, 247, 0.3)"
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{ perspective: 1000 }}
        className={cn(
          "relative group rounded-xl overflow-hidden bg-white/5 border border-white/10 ring-1 ring-white/5 transition-all flex-shrink-0 origin-center cursor-pointer",
          isLarge ? "w-[160px] sm:w-[220px] aspect-[2/3]" : "w-[260px] sm:w-[320px] aspect-video"
        )}
      >
        <img
          src={imageUrl}
          alt={media.title || media.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Progress Bar (Simulated) */}
        {!isLarge && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.random() * 80 + 10}%` }}
              className="h-full bg-primary" 
            />
          </div>
        )}
        
        {/* Permanent Bottom Shadow for readability */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
        
        {/* Play Icon - Centered on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
          <motion.div
            initial={{ scale: 0.5 }}
            whileHover={{ scale: 1 }}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center"
          >
            <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
          </motion.div>
        </div>
        
        {/* Movie Info - Always visible at bottom */}
        <div className="absolute bottom-3 left-3 right-3 z-20">
          <h3 className="text-white font-bold text-sm sm:text-base mb-1 truncate drop-shadow-md">
            {media.title || media.name}
          </h3>
          
          <div className="flex items-center gap-2 opacity-80 text-[10px] sm:text-xs">
            <div className="flex items-center gap-1 text-green-400 font-bold">
              <Star className="w-3 h-3 fill-current" />
              <span>{(media.vote_average || 0).toFixed(1)}</span>
            </div>
            <span className="text-zinc-300">
              {(media.release_date || media.first_air_date)?.split('-')[0]}
            </span>
            <span className="border border-zinc-500 px-1 rounded-[2px] scale-90">4K</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

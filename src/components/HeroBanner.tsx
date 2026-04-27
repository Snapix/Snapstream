import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { Media } from '../services/tmdb';
import { TMDB_IMAGE_BASE_URL } from '../constants';
import { LiquidButton } from './LiquidButton';
import { BlurText } from './BlurText';

interface HeroBannerProps {
  movies?: Media[];
  movie?: Media | null;
}

export function HeroBanner({ movies, movie }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayMovies = movies && movies.length > 0 
    ? movies 
    : movie 
      ? [movie] 
      : [];

  useEffect(() => {
    if (displayMovies.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayMovies.length);
    }, 10000); // 10 seconds

    return () => clearInterval(intervalId);
  }, [displayMovies.length]);

  if (displayMovies.length === 0) {
    return (
      <div className="w-full h-[60vh] sm:h-[80vh] bg-black animate-pulse flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentMovie = displayMovies[currentIndex];

  return (
    <div className="relative w-full h-[70vh] sm:h-[85vh] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={`${TMDB_IMAGE_BASE_URL}${currentMovie.backdrop_path}`}
            alt={currentMovie.title || currentMovie.name}
            className="w-full h-full object-cover object-top"
          />
          
          {/* Lighter gradients to blend with background while keeping poster visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12 sm:pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-2xl"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="bg-red-600 text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">
                TRENDING
              </span>
              <span className="text-sm text-gray-300 font-medium tracking-widest uppercase drop-shadow-md">
                #{currentIndex + 1} in {currentMovie.media_type === 'tv' ? 'TV Shows' : 'Movies'} Today
              </span>
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-none tracking-tight text-white mb-4 text-shadow-lg">
              <BlurText text={currentMovie.title || currentMovie.name || ""} delay={0.3} />
            </h1>
            
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 line-clamp-3 sm:line-clamp-4 max-w-xl text-shadow-md drop-shadow-lg font-medium">
              {currentMovie.overview}
            </p>
            
            <div className="flex items-center gap-4">
              <Link to={`/watch/${currentMovie.media_type || 'movie'}/${currentMovie.id}`}>
                <LiquidButton className="w-full">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                  Play Now
                </LiquidButton>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-8 py-3 rounded-md font-bold hover:bg-white/20 hover:border-primary transition-all shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
              >
                <Info className="w-5 h-5 sm:w-6 sm:h-6" />
                More Info
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

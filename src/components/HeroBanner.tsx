import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { Media } from '../services/tmdb';
import { TMDB_IMAGE_BASE_URL } from '../constants';
import { BorderGlow } from './BorderGlow';

interface HeroBannerProps {
  movie: Media | null;
}

export function HeroBanner({ movie }: HeroBannerProps) {
  if (!movie) {
    return (
      <div className="w-full h-[60vh] sm:h-[80vh] bg-zinc-900 animate-pulse flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[70vh] sm:h-[85vh] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={`${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}`}
            alt={movie.title || movie.name}
            className="w-full h-full object-cover object-top"
          />
          
          {/* Gradients to blend with background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12 sm:pb-24">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-2xl"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="bg-red-600 text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">
              ORIGINAL
            </span>
            <span className="text-sm text-gray-300 font-medium tracking-widest uppercase drop-shadow-md">
              #1 in Movies Today
            </span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-none tracking-tight text-white mb-4 text-shadow-lg">
            {movie.title || movie.name}
          </h1>
          
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8 line-clamp-3 sm:line-clamp-4 max-w-xl text-shadow-md drop-shadow-lg">
            {movie.overview}
          </p>
          
          <div className="flex items-center gap-4">
            <Link to={`/watch/movie/${movie.id}`}>
              <BorderGlow className="rounded-md overflow-hidden">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-white text-black w-full px-8 py-3 rounded-md font-bold hover:bg-gray-200 transition-colors relative z-10"
                >
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-black" />
                  Play Now
                </motion.button>
              </BorderGlow>
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-md font-bold hover:bg-white/30 transition-colors"
            >
              <Info className="w-5 h-5 sm:w-6 sm:h-6" />
              More Info
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

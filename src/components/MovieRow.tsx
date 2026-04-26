import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Media } from '../services/tmdb';
import { MovieCard } from './MovieCard';

import { BorderGlow } from './BorderGlow';
import { BlurText } from './BlurText';
import { FadeContent } from './FadeContent';

interface MovieRowProps {
  title: string;
  movies: Media[];
  isLarge?: boolean;
}

export function MovieRow({ title, movies, isLarge = false }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const slide = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth + 100 : scrollLeft + clientWidth - 100;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <FadeContent className="relative group py-4">
      <h3 className="text-lg font-bold mb-4 px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-white">
        <BlurText text={title} />
        {(title.includes('Trending') || title.includes('Continue')) && (
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
        )}
      </h3>
      
      <div className="relative flex items-center">
        {/* Left Arrow */}
        <button
          onClick={() => slide('left')}
          className="absolute left-0 z-40 bg-black/50 backdrop-blur-md h-full w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 text-white"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-scroll scrollbar-hide px-4 sm:px-6 lg:px-8 pb-12 pt-4 scroll-smooth transition-all"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {title.includes('Continue') ? (
                <BorderGlow className="rounded-xl overflow-hidden shrink-0 block">
                  <MovieCard media={movie} isLarge={isLarge} />
                </BorderGlow>
              ) : (
                <MovieCard media={movie} isLarge={isLarge} />
              )}
            </motion.div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => slide('right')}
          className="absolute right-0 z-40 bg-black/50 backdrop-blur-md h-full w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 text-white"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </FadeContent>
  );
}

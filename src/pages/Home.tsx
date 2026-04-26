import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HeroBanner } from '../components/HeroBanner';
import { MovieRow } from '../components/MovieRow';
import { fetchTrendingMovies, fetchPopularTV, fetchTopRated, Media } from '../services/tmdb';

export function Home() {
  const [trending, setTrending] = useState<Media[]>([]);
  const [popularTV, setPopularTV] = useState<Media[]>([]);
  const [topRated, setTopRated] = useState<Media[]>([]);
  const [heroMovie, setHeroMovie] = useState<Media | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [trendingRes, tvRes, topRes] = await Promise.all([
          fetchTrendingMovies(),
          fetchPopularTV(),
          fetchTopRated(),
        ]);
        
        setTrending(trendingRes);
        setPopularTV(tvRes);
        setTopRated(topRes);
        
        // Pick a random movie for the hero banner
        if (trendingRes.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(5, trendingRes.length));
          setHeroMovie(trendingRes[randomIndex]);
        }
      } catch (error) {
        console.error('Failed to load initial data', error);
      }
    };
    loadData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pb-20"
    >
      <HeroBanner movie={heroMovie} />
      
      <div className="flex flex-col gap-8 -mt-24 sm:-mt-32 z-20 relative">
        <MovieRow title="Trending Now" movies={trending} isLarge />
        <MovieRow title="Popular TV Shows" movies={popularTV} />
        <MovieRow title="Top Rated Classics" movies={topRated} />
      </div>
    </motion.div>
  );
}

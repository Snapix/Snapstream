import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeroBanner } from '../components/HeroBanner';
import { MovieRow } from '../components/MovieRow';
import { fetchTrendingMovies, fetchPopularTV, fetchTopRated, fetchAnime, Media } from '../services/tmdb';

export function Home() {
  const [trending, setTrending] = useState<Media[]>([]);
  const [popularTV, setPopularTV] = useState<Media[]>([]);
  const [topRated, setTopRated] = useState<Media[]>([]);
  const [anime, setAnime] = useState<Media[]>([]);
  const [recent, setRecent] = useState<Media[]>([]);

  useEffect(() => {
    // Load local storage recent
    const recentRaw = localStorage.getItem('snapstream_recent');
    if (recentRaw) {
      try {
        setRecent(JSON.parse(recentRaw));
      } catch(e) {}
    }

    const loadData = async () => {
      try {
        const [trendingRes, tvRes, topRes, animeRes] = await Promise.all([
          fetchTrendingMovies(),
          fetchPopularTV(),
          fetchTopRated(),
          fetchAnime()
        ]);
        setTrending(trendingRes);
        setPopularTV(tvRes);
        setTopRated(topRes);
        setAnime(animeRes);
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
      className="pb-20 relative"
    >
      <HeroBanner movies={trending.slice(0, 10)} />
      
      <div className="flex flex-col gap-8 z-20 relative min-h-[50vh] mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-8"
          >
            {recent.length > 0 && <MovieRow title="Continue Watching" movies={recent} isLarge />}
            <MovieRow title="Trending Movies" movies={trending} isLarge={recent.length === 0} />
            <MovieRow title="Popular TV Shows" movies={popularTV} />
            <MovieRow title="Top Rated Movies" movies={topRated} />
            <MovieRow title="Anime" movies={anime} />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}


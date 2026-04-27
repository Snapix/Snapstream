import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeroBanner } from '../components/HeroBanner';
import { MovieRow } from '../components/MovieRow';
import { fetchTrendingMovies, fetchPopularTV, fetchTopRated, fetchAnime, fetchCartoons, Media } from '../services/tmdb';

const FILTERS = ['All', 'Anime', 'TV Shows', 'Series', 'Cartoons', 'Movies'];

export function Home() {
  const [trending, setTrending] = useState<Media[]>([]);
  const [popularTV, setPopularTV] = useState<Media[]>([]);
  const [topRated, setTopRated] = useState<Media[]>([]);
  const [anime, setAnime] = useState<Media[]>([]);
  const [cartoons, setCartoons] = useState<Media[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
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
        const [trendingRes, tvRes, topRes, animeRes, cartoonsRes] = await Promise.all([
          fetchTrendingMovies(),
          fetchPopularTV(),
          fetchTopRated(),
          fetchAnime(),
          fetchCartoons()
        ]);
        
        setTrending(trendingRes);
        setPopularTV(tvRes);
        setTopRated(topRes);
        setAnime(animeRes);
        setCartoons(cartoonsRes);
      } catch (error) {
        console.error('Failed to load initial data', error);
      }
    };
    loadData();
  }, []);

  const getFilteredRows = () => {
    switch(activeFilter) {
      case 'Anime':
        return (
          <>
            <MovieRow title="Mainstream Anime" movies={anime} isLarge />
            <MovieRow title="Popular Anime" movies={popularTV.filter(m => m.genre_ids?.includes(16))} />
          </>
        );
      case 'Cartoons':
        return (
            <>
                <MovieRow title="Top Cartoons" movies={cartoons} isLarge />
                <MovieRow title="Family Favorites" movies={topRated.filter(m => m.genre_ids?.includes(16) || m.genre_ids?.includes(10751))} />
            </>
        );
      case 'TV Shows':
      case 'Series':
        return (
          <>
            <MovieRow title="Popular TV Shows" movies={popularTV} isLarge />
            <MovieRow title="Top Rated TV" movies={topRated} />
          </>
        );
      case 'Movies':
        return (
          <>
            <MovieRow title="Trending Movies" movies={trending} isLarge />
            <MovieRow title="Top Rated Movies" movies={topRated} />
          </>
        );
      case 'Trending':
        return (
          <>
            <MovieRow title="Trending Now" movies={trending} isLarge />
            <MovieRow title="Hot TV" movies={popularTV} />
          </>
        );
      case 'Home':
      case 'All':
      default:
        return (
          <>
            {recent.length > 0 && <MovieRow title="Continue Watching" movies={recent} isLarge />}
            <MovieRow title="Trending Now" movies={trending} isLarge={recent.length === 0} />
            <MovieRow title="Popular TV Shows" movies={popularTV} />
            <MovieRow title="Top Rated Classics" movies={topRated} />
          </>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pb-20 relative"
    >
      <HeroBanner movies={trending.slice(0, 10)} />

      {/* Sticky Content Filters */}
      <div className="sticky top-16 sm:top-20 z-40 bg-[#0A0F1F]/80 backdrop-blur-xl border-y border-white/5 py-3 mb-8 -mt-8 sm:-mt-12 overflow-hidden shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-1 mask-fade-x">
            {FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeFilter === filter 
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(0,191,255,0.4)] border border-primary/50' 
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-8 z-20 relative min-h-[50vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-8"
          >
            {getFilteredRows()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

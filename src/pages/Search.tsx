import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { searchMedia, Media, INAPPROPRIATE_KEYWORDS } from '../services/tmdb';
import { MovieCard } from '../components/MovieCard';
import { Search as SearchIcon, AlertTriangle } from 'lucide-react';

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInappropriate, setIsInappropriate] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setIsInappropriate(false);
        return;
      }
      
      const isQueryInappropriate = INAPPROPRIATE_KEYWORDS.some(k => query.toLowerCase().includes(k));
      if (isQueryInappropriate) {
        setIsInappropriate(true);
        setResults([]);
        return;
      } else {
        setIsInappropriate(false);
      }

      setIsLoading(true);
      try {
        const data = await searchMedia(query);
        setResults(data);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl text-zinc-400 font-medium">
          Search results for <span className="text-white">"{query}"</span>
        </h1>
      </div>

      {isInappropriate ? (
        <div className="flex flex-col items-center justify-center h-64 text-red-500">
          <AlertTriangle className="w-16 h-16 mb-4" />
          <p className="text-xl font-bold">Inappropriate Content</p>
          <p className="text-sm mt-2 text-zinc-400">Your search contains inappropriate keywords and cannot be displayed.</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {results.map((media, index) => (
            <motion.div
              key={media.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex justify-center"
            >
              {/* Force standard size for grid */}
              <div className="w-full">
                <MovieCard media={media} isLarge />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
          <SearchIcon className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-xl">No results found.</p>
          <p className="text-sm mt-2">Try searching for a different keyword</p>
        </div>
      )}
    </motion.div>
  );
}

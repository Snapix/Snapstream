import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { fetchMovieDetails, fetchSimilar, Media } from '../services/tmdb';
import { MovieRow } from '../components/MovieRow';

export function Watch() {
  const { type, id } = useParams<{ type: 'movie' | 'tv'; id: string }>();
  const navigate = useNavigate();
  const [details, setDetails] = useState<Media | null>(null);
  const [similar, setSimilar] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const [detailsData, similarData] = await Promise.all([
          fetchMovieDetails(id, type),
          fetchSimilar(id, type)
        ]);
        setDetails(detailsData);
        setSimilar(similarData);
      } catch (error) {
        console.error('Failed to load movie details', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Scroll to top when exploring details
    window.scrollTo(0, 0);
    loadDetails();
  }, [id, type]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <h2>Content not found</h2>
      </div>
    );
  }

  // Construct player URL with parameters for customization
  const embedUrl = type === 'tv' 
    ? `https://vidlink.pro/tv/${id}/1/1?primaryColor=e50914&autoplay=true` 
    : `https://vidlink.pro/movie/${id}?primaryColor=e50914&autoplay=true`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black"
    >
      {/* Immersive Overlay Back Button */}
      <div className="fixed top-24 left-8 z-50">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-zinc-300 hover:text-white transition-all hover:scale-105 active:scale-95 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Exit Theater</span>
        </button>
      </div>

      {/* Video Player - Full viewport cinema mode */}
      <div className="w-full h-screen bg-black relative flex items-center justify-center">
        {/* Ambient background light */}
        <div className="absolute inset-0 bg-primary/5 blur-[120px] pointer-events-none" />
        
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          referrerPolicy="no-referrer"
          className="w-full h-full relative z-10"
          title={details.title || details.name}
        ></iframe>
      </div>

      {/* Details Section - Scrolled down */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {details.title || details.name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-zinc-400 mb-6">
              <span className="text-green-400 font-semibold">{Math.round(details.vote_average * 10)}% Match</span>
              <span>{(details.release_date || details.first_air_date)?.split('-')[0]}</span>
              {/* Optional UI elements could go here */}
            </div>
            <p className="text-zinc-300 sm:text-lg leading-relaxed max-w-3xl">
              {details.overview}
            </p>
          </div>
        </div>
      </div>

      {/* Similar Movies Row */}
      {similar.length > 0 && (
        <div className="pb-20">
          <MovieRow title="More Like This" movies={similar} />
        </div>
      )}
    </motion.div>
  );
}

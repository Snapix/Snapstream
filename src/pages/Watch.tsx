import { useEffect, useState, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play } from 'lucide-react';
import { fetchMovieDetails, fetchSimilar, Media } from '../services/tmdb';
import { MovieRow } from '../components/MovieRow';
import { BlurText } from '../components/BlurText';
import { NeonGradientCard } from '../components/ui/neon-gradient-card';
import { Particles } from '../components/ui/particles';
import Magnet from '../components/ui/Magnet';
import LightRays from '../components/ui/LightRays';

const PlayerWrapper = lazy(() => import('../components/PlayerWrapper').then(m => ({ default: m.PlayerWrapper })));

export function Watch() {
  const { type, id } = useParams<{ type: 'movie' | 'tv'; id: string }>();
  const navigate = useNavigate();
  const [details, setDetails] = useState<Media | null>(null);
  const [similar, setSimilar] = useState<Media[]>([]);
  const [providers, setProviders] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Track season/episode for TV
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

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

        // Fetch streaming providers for accurate count
        try {
          const { fetchProviders } = await import('../services/tmdb');
          const providersData = await fetchProviders(id, type);
          setProviders(providersData);
        } catch (e) {
           console.warn('Could not fetch providers', e);
        }

        // Save to Continue Watching
        const recentRaw = localStorage.getItem('snapstream_recent');
        const recent: Media[] = recentRaw ? JSON.parse(recentRaw) : [];
        const filtered = recent.filter(m => m.id !== detailsData.id);
        const newRecent = [detailsData, ...filtered].slice(0, 10);
        localStorage.setItem('snapstream_recent', JSON.stringify(newRecent));
        
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
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(0,243,255,0.5)]" />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <h2 className="font-display text-2xl font-bold">Content not found</h2>
      </div>
    );
  }

  // Use default vidlink URL with custom primary color to match theme
  const embedUrl = type === 'tv' 
    ? `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=00f3ff&autoplay=false`
    : `https://vidlink.pro/movie/${id}?primaryColor=00f3ff&autoplay=false`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black pt-24 sm:pt-28 pb-20"
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95 group shadow-xl"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm tracking-wide uppercase">Exit Theater</span>
        </button>
      </div>

      {/* Conditional Rendering: Player vs Preview Backdrop */}
      {isPlaying ? (
        <motion.div 
          layoutId={`card-container-${id}`}
          className="w-full flex justify-center py-0 sm:py-6"
        >
          <div className="w-full max-w-[1600px] mx-auto sm:px-6">
            <Suspense fallback={<div className="w-full aspect-video bg-black/80 flex items-center justify-center border border-white/10 rounded-xl"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"/></div>}>
              <PlayerWrapper 
                embedUrl={embedUrl}
                title={details.title || details.name || ''}
                type={type || 'movie'}
                season={season}
                episode={episode}
                onEpisodeChange={(s, e) => {
                  setSeason(s);
                  setEpisode(e);
                }}
              />
            </Suspense>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          layoutId={`card-container-${id}`}
          className="relative w-full h-[50vh] sm:h-[60vh] bg-black"
        >
          {details.backdrop_path && (
            <>
              <img 
                src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
                alt={details.title || details.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </>
          )}
          <Particles className="absolute inset-0 z-0 opacity-50 mix-blend-screen" quantity={60} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <LightRays 
               raysOrigin="top-center"
               raysColor="#00f3ff"
               lightSpread={0.8}
               rayLength={1.5}
               pulsating={true}
               followMouse={false}
               className="opacity-50 mix-blend-screen"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Magnet padding={50} magnetStrength={3} disabled={false}>
              <button 
                onClick={() => setIsPlaying(true)}
                className="flex items-center gap-3 bg-[#00f3ff] text-black px-8 py-4 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,243,255,0.4)]  pointer-events-auto"
              >
                <Play className="w-5 h-5 fill-black" />
                WATCH NOW
              </button>
            </Magnet>
          </div>
        </motion.div>
      )}

      {/* Details Section - Scrolled down */}
      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-7xl mx-auto px-6 sm:px-12 py-12"
      >
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 font-display text-glow">
              {details.title || details.name}
            </h1>
            <div className="flex items-center gap-4 text-sm font-semibold uppercase tracking-wider mb-6">
              <span className="text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">{Math.round(details.vote_average * 10)}% Match</span>
              <span className="text-zinc-400">{(details.release_date || details.first_air_date)?.split('-')[0]}</span>
              <span className="text-zinc-400 border border-zinc-700 px-2 rounded-sm bg-black/50">4K UHD</span>
            </div>
            <p className="text-zinc-300 sm:text-lg leading-relaxed max-w-3xl drop-shadow-md mb-8">
              {details.overview}
            </p>

            {/* Server & Language Info Block */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <div className="w-2 h-2 rounded-full bg-[#00f3ff] animate-pulse" />
                <span className="font-semibold text-sm tracking-wide text-zinc-300">
                  AVAILABLE SERVERS: <span className="text-white font-bold">{providers?.flatrate?.length || providers?.rent?.length || providers?.buy?.length || 'No streams available'}</span>
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <div className="w-2 h-2 rounded-full bg-[#b44bff] animate-pulse" />
                <span className="font-semibold text-sm tracking-wide text-zinc-300">
                  AVAILABLE LANGUAGES: <span className="text-white font-bold">{details.original_language ? '1+' : '1'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Series & Seasons Details */}
      {details.seasons && details.seasons.length > 0 && (
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-7xl mx-auto px-6 sm:px-12 py-8 mt-4 mb-16"
        >
          <NeonGradientCard borderRadius={24} borderSize={2} neonColors={{ firstColor: "#b44bff", secondColor: "#00f3ff" }}>
            <div className="p-2 sm:p-4">
              <BlurText text="Seasons & Episodes" className="text-2xl font-bold mb-6 font-display text-glow" />
              
              <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2 mask-fade-x">
                {details.seasons.filter(s => s.season_number > 0).map(s => (
                  <button
                    key={s.season_number}
                    onClick={() => { setSeason(s.season_number); setEpisode(1); }}
                    className={`px-6 py-2 rounded-full font-semibold border transition-all shrink-0 ${
                      season === s.season_number 
                        ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(0,243,255,0.4)]' 
                        : 'bg-black/50 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div 
                  key={season}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-8"
                >
                  {Array.from({ length: details.seasons.find(s => s.season_number === season)?.episode_count || 0 }).map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => { setEpisode(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`group flex flex-col items-center justify-center p-6 rounded-2xl border transition-all ${
                        episode === i + 1
                          ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(0,243,255,0.2)] scale-[1.02]'
                          : 'bg-black/50 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 mb-3 group-hover:scale-110 transition-transform">
                        <Play className={`w-4 h-4 translate-x-0.5 ${episode === i + 1 ? 'fill-primary text-primary' : 'fill-zinc-400 text-zinc-400 group-hover:fill-white group-hover:text-white'}`} />
                      </div>
                      <span className="font-display font-medium tracking-wide">Episode {i + 1}</span>
                    </button>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </NeonGradientCard>
        </motion.div>
      )}

      {/* Similar Movies Row */}
      {similar.length > 0 && (
        <div className="pb-20">
          <MovieRow title="More Like This" movies={similar} />
        </div>
      )}
    </motion.div>
  );
}

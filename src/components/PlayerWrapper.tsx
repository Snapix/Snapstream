import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize, Minimize, Settings, FastForward, Rewind, Play, Pause, Languages } from 'lucide-react';
import { cn } from '../lib/utils';

// Helper to disable animations globally when playing
export const subscribeToPlayState = (callback: (isPlaying: boolean) => void) => {
  const listener = (e: Event) => callback((e as CustomEvent).detail);
  window.addEventListener('snapstream-play-state', listener);
  return () => window.removeEventListener('snapstream-play-state', listener);
};

export const setGlobalPlayState = (isPlaying: boolean) => {
  window.dispatchEvent(new CustomEvent('snapstream-play-state', { detail: isPlaying }));
};


interface PlayerWrapperProps {
  embedUrl: string;
  title: string;
  type: 'movie' | 'tv';
  season?: number;
  episode?: number;
  onEpisodeChange?: (s: number, e: number) => void;
}

export function PlayerWrapper({ 
  embedUrl, 
  title, 
  type, 
  season = 1, 
  episode = 1,
  onEpisodeChange 
}: PlayerWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true); // Assuming auto-play starts
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  // Update global state for performance mode
  useEffect(() => {
    setGlobalPlayState(isPlaying);
    return () => setGlobalPlayState(false);
  }, [isPlaying]);

  // Handle Fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen().catch(console.error);
    } else {
      await document.exitFullscreen().catch(console.error);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch(e.key.toLowerCase()) {
        case 'f':
          toggleFullscreen();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(p => !p);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Control fading
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      return;
    }
    
    const timeout = setTimeout(() => {
      if (!showSettings) setShowControls(false);
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls, showSettings]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full bg-black flex items-center justify-center overflow-hidden transition-all duration-500",
        isFullscreen ? "h-screen" : "aspect-video max-h-[80vh] rounded-xl shadow-[0_0_50px_rgba(0,191,255,0.15)] ring-1 ring-white/10"
      )}
      onMouseMove={() => setShowControls(true)}
      onClick={() => {
        // Toggle play on mobile/desktop tap
        setIsPlaying(!isPlaying);
        setShowControls(true);
      }}
    >
      {/* Background glow when not fullscreen */}
      {!isFullscreen && (
        <div className="absolute inset-0 bg-primary/5 blur-[120px] pointer-events-none" />
      )}

      {/* The actual player iframe */}
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        referrerPolicy="no-referrer"
        className={cn(
          "relative z-10 w-full h-full",
          !isPlaying && "opacity-80" // dim slightly when paused via wrapper
        )}
        title={title}
      />

      {/* Wrapper Controls UI - overlays the iframe slightly. Native Vidking controls are inside, but we add our glass wrapper elements */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between"
          >
            {/* Top Bar */}
            <div className="w-full p-4 sm:p-6 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start">
              <div className="flex flex-col">
                <h2 className="text-white font-bold text-lg sm:text-2xl drop-shadow-lg font-display">{title}</h2>
                {type === 'tv' && (
                  <span className="text-primary font-medium text-sm drop-shadow-md">Season {season} • Episode {episode}</span>
                )}
              </div>
              
              <div className="flex items-center gap-3 pointer-events-auto">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
                  className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95 border border-white/10"
                >
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Tap zones for double-tap (Mobile) - Left and Right for FF/RW */}
            <div className="absolute inset-0 flex justify-between px-10 items-center pointer-events-none">
                <div 
                  className="w-1/3 h-full pointer-events-auto" 
                  onDoubleClick={(e) => { e.stopPropagation(); /* trigger RW */ }}
                />
                <div 
                  className="w-1/3 h-full flex justify-center items-center pointer-events-none"
                >
                  {/* Big center play/pause indicator */}
                  <AnimatePresence>
                    {!isPlaying && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        className="w-20 h-20 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20"
                      >
                        <Play className="w-10 h-10 text-white fill-current translate-x-1" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div 
                  className="w-1/3 h-full pointer-events-auto" 
                  onDoubleClick={(e) => { e.stopPropagation(); /* trigger FF */ }}
                />
            </div>

            {/* Bottom Bar */}
            <div className="w-full p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex justify-between items-end pointer-events-auto">
              <div className="flex items-center gap-4">
                {/* Custom Wrapper Play button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
                  className="p-3 bg-primary hover:bg-primary/80 rounded-full text-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,191,255,0.4)]"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
                </button>
                
                {/* Next episode button if TV */}
                {type === 'tv' && onEpisodeChange && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEpisodeChange(season, episode + 1); }}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white font-medium text-sm transition-all border border-white/10"
                  >
                    Next Episode
                    <FastForward className="w-4 h-4 fill-current" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                  className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95 border border-white/10"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-4 sm:right-6 top-20 sm:top-24 w-64 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 z-40 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-bold mb-4 font-display border-b border-white/10 pb-2">Stream Settings</h3>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Server</span>
                <select className="bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary">
                  <option>Auto (Vidking)</option>
                  <option>Server 1</option>
                  <option>Server 2</option>
                </select>
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Quality</span>
                <select className="bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary">
                  <option>Auto</option>
                  <option>1080p</option>
                  <option>720p</option>
                </select>
              </div>
              
              {type === 'tv' && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Season & Episode</span>
                  <div className="flex gap-2">
                     <input 
                      type="number" 
                      min={1} 
                      value={season} 
                      onChange={(e) => onEpisodeChange?.(parseInt(e.target.value) || 1, episode)}
                      className="w-1/2 bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white outline-none"
                      placeholder="Season"
                    />
                    <input 
                      type="number" 
                      min={1} 
                      value={episode}
                      onChange={(e) => onEpisodeChange?.(season, parseInt(e.target.value) || 1)}
                      className="w-1/2 bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white outline-none"
                      placeholder="Episode"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setShowSettings(false)}
              className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors border border-white/10"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

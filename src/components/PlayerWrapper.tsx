import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize, Minimize, Settings, FastForward, Rewind, Play, Pause, Languages } from 'lucide-react';
import { cn } from '../lib/utils';

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
  const [showControls, setShowControls] = useState(false); // only show top/bottom occasionally or on hover
  const [showSettings, setShowSettings] = useState(false);
  
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
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  let hideTimeout: NodeJS.Timeout;
  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      if (!showSettings) {
        setShowControls(false);
      }
    }, 4000);
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full bg-black flex items-center justify-center overflow-hidden transition-all duration-500 group",
        isFullscreen ? "h-screen" : "aspect-video max-h-[80vh] rounded-xl shadow-[0_0_50px_rgba(0,191,255,0.15)] ring-1 ring-white/10"
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => !showSettings && setShowControls(false)}
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
        className="relative z-10 w-full h-full"
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
            <div className="w-full p-3 sm:p-4 md:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex flex-wrap justify-between items-start gap-4 pointer-events-auto transition-all duration-300">
              <div className="flex flex-col max-w-[70%] pointer-events-none">
                <h2 className="text-white font-bold text-base sm:text-lg md:text-2xl drop-shadow-lg font-display truncate">{title}</h2>
                {type === 'tv' && (
                  <span className="text-primary font-medium text-xs sm:text-sm drop-shadow-md">Season {season} • Episode {episode}</span>
                )}
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
                  className="flex items-center justify-center min-w-[40px] h-[40px] sm:min-w-[48px] sm:h-[48px] md:min-w-[56px] md:h-[56px] bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all hover:scale-105 active:scale-95 border border-white/10"
                >
                  <Settings className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] md:w-[24px] md:h-[24px]" />
                </button>
              </div>
            </div>

            {/* Bottom Bar ONLY for next episode & fullscreen. Play/Pause removed to let native iframe handle it */}
            <div className="w-full p-3 sm:p-4 md:p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-wrap justify-between items-end gap-4 pointer-events-none transition-all duration-300">
              <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto">
                {/* Next episode button if TV */}
                {type === 'tv' && onEpisodeChange && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEpisodeChange(season, episode + 1); }}
                    className="flex items-center gap-2 px-4 h-[40px] sm:h-[48px] md:h-[56px] bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white font-medium text-xs sm:text-sm md:text-base transition-all border border-white/10"
                  >
                    <span className="hidden sm:inline">Next Episode</span>
                    <span className="sm:hidden">Next</span>
                    <FastForward className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] fill-current" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                  title="Fullscreen"
                  className="flex items-center justify-center min-w-[40px] h-[40px] sm:min-w-[48px] sm:h-[48px] md:min-w-[56px] md:h-[56px] bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95 border border-white/10"
                >
                  {isFullscreen ? <Minimize className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] md:w-[24px] md:h-[24px]" /> : <Maximize className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] md:w-[24px] md:h-[24px]" />}
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
              {type === 'tv' && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Season & Episode</span>
                  <div className="flex gap-2">
                     <input 
                      type="number" 
                      min={1} 
                      value={season} 
                      onChange={(e) => onEpisodeChange?.(parseInt(e.target.value) || 1, episode)}
                      className="w-1/2 bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-primary"
                      placeholder="Season"
                    />
                    <input 
                      type="number" 
                      min={1} 
                      value={episode}
                      onChange={(e) => onEpisodeChange?.(season, parseInt(e.target.value) || 1)}
                      className="w-1/2 bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-primary"
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

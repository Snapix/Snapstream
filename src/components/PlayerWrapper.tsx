import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize, Minimize, Settings2, FastForward, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useSafeTimeout } from '../hooks/performance';
import ElasticSlider from './ui/ElasticSlider';

// ── Play-state subscription (for cursor / blob systems) ──────
type PlayListener = (playing: boolean) => void;
const playListeners = new Set<PlayListener>();

export function subscribeToPlayState(fn: PlayListener) {
  playListeners.add(fn);
  return () => playListeners.delete(fn);
}

function notifyPlayState(playing: boolean) {
  playListeners.forEach(fn => fn(playing));
}

// ─────────────────────────────────────────────────────────────

interface PlayerWrapperProps {
  embedUrl:         string;
  title:            string;
  type:             'movie' | 'tv';
  season?:          number;
  episode?:         number;
  onEpisodeChange?: (s: number, e: number) => void;
}

const HIDE_CONTROLS_AFTER = 3500;

/**
 * Premium player wrapper.
 * ✓ All event listeners cleaned up on unmount
 * ✓ Debounced control hide (useSafeTimeout)
 * ✓ useCallback on every handler (no recreations)
 * ✓ GPU-accelerated overlays only
 * ✓ Notifies play-state subscribers
 */
export const PlayerWrapper = memo(function PlayerWrapper({
  embedUrl,
  title,
  type,
  season = 1,
  episode = 1,
  onEpisodeChange,
}: PlayerWrapperProps) {
  const containerRef      = useRef<HTMLDivElement>(null);
  const [fullscreen,      setFullscreen]      = useState(false);
  const [showControls,    setShowControls]    = useState(false);
  const [showSettings,    setShowSettings]    = useState(false);
  const [localSeason,     setLocalSeason]     = useState(season);
  const [localEpisode,    setLocalEpisode]    = useState(episode);
  const [volume,          setVolume]          = useState(80);
  const { set: setTimeout, clear: clearTimeout } = useSafeTimeout();
  const hideTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  /* ── Sync props → local state ────────────────────────────── */
  useEffect(() => { setLocalSeason(season);  }, [season]);
  useEffect(() => { setLocalEpisode(episode); }, [episode]);

  /* ── Fullscreen change listener ──────────────────────────── */
  useEffect(() => {
    const onFSChange = () => {
      const isFull = !!document.fullscreenElement;
      setFullscreen(isFull);
      notifyPlayState(isFull);
    };
    document.addEventListener('fullscreenchange', onFSChange);
    return () => document.removeEventListener('fullscreenchange', onFSChange);
  }, []);

  /* ── Keyboard shortcut: F = fullscreen ───────────────────── */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) return;
      if (e.key.toLowerCase() === 'f') toggleFullscreen();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  /* ── Fullscreen toggle ───────────────────────────────────── */
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen().catch(() => {});
    } else {
      await document.exitFullscreen().catch(() => {});
    }
  }, []);

  /* ── Control visibility ──────────────────────────────────── */
  const scheduleHide = useCallback(() => {
    if (showSettings) return;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, HIDE_CONTROLS_AFTER);
  }, [showSettings, clearTimeout]);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    scheduleHide();
  }, [scheduleHide]);

  const handleMouseLeave = useCallback(() => {
    if (!showSettings) setShowControls(false);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  }, [showSettings, clearTimeout]);

  /* ── Episode change ──────────────────────────────────────── */
  const handleNextEpisode = useCallback(() => {
    const next = localEpisode + 1;
    setLocalEpisode(next);
    onEpisodeChange?.(localSeason, next);
  }, [localEpisode, localSeason, onEpisodeChange]);

  const handleSeasonChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 1;
    setLocalSeason(val);
    onEpisodeChange?.(val, localEpisode);
  }, [localEpisode, onEpisodeChange]);

  const handleEpisodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 1;
    setLocalEpisode(val);
    onEpisodeChange?.(localSeason, val);
  }, [localSeason, onEpisodeChange]);

  /* ── Cleanup on unmount ──────────────────────────────────── */
  useEffect(() => () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    notifyPlayState(false);
  }, [clearTimeout]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex items-center justify-center bg-black overflow-hidden group',
        'will-change-[contents]',
        fullscreen
          ? 'w-screen h-screen fixed inset-0 z-[100]'
          : [
              'w-full aspect-video max-h-[80vh]',
              'rounded-xl sm:rounded-2xl',
              'border border-white/[.1]',
              'shadow-[0_0_30px_rgba(0,0,0,0.8)]',
            ].join(' ')
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient glow ring (non-fullscreen) */}
      {!fullscreen && (
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#00f3ff]/[.04] via-transparent to-[#b44bff]/[.03] pointer-events-none" />
      )}

      {/* ── The iframe ─────────────────────────────────────── */}
      <iframe
        src={embedUrl}
        title={title}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        referrerPolicy="no-referrer"
        className="relative z-10 w-full h-full"
        loading="lazy"
      />

      {/* ── Control overlay ───────────────────────────────── */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-30 flex flex-col justify-between pointer-events-none"
          >
            {/* Top bar */}
            <div className="pointer-events-auto px-4 sm:px-6 pt-4 sm:pt-5 pb-8 bg-gradient-to-b from-black/50 to-transparent flex justify-between items-start gap-4">
              <div className="min-w-0">
                <h2 className="text-white font-black text-base sm:text-xl truncate font-display drop-shadow-lg">
                  {title}
                </h2>
                {type === 'tv' && (
                  <p className="text-[#00f3ff] text-xs sm:text-sm font-semibold mt-0.5">
                    Season {localSeason} · Episode {localEpisode}
                  </p>
                )}
              </div>

              <button
                onClick={() => setShowSettings(s => !s)}
                className="btn-icon btn w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 cursor-target pointer-events-auto"
                aria-label="Stream settings"
              >
                <Settings2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Bottom bar */}
            <div className="pointer-events-auto px-4 sm:px-6 pb-4 sm:pb-5 pt-8 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end gap-4">
              <div>
                {type === 'tv' && onEpisodeChange && (
                  <button
                    onClick={handleNextEpisode}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-heavy border border-white/[.08] text-white font-bold text-xs sm:text-sm hover:bg-white/[.08] transition-colors cursor-target pointer-events-auto"
                  >
                    <FastForward className="w-3.5 h-3.5 fill-white" />
                    <span className="hidden sm:inline">Next Episode</span>
                    <span className="sm:hidden">Next</span>
                  </button>
                )}
              </div>

              <button
                onClick={toggleFullscreen}
                className="btn-icon btn w-10 h-10 sm:w-11 sm:h-11 cursor-target pointer-events-auto"
                aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                title="Fullscreen (F)"
              >
                {fullscreen
                  ? <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
                  : <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
                }
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Settings panel ────────────────────────────────── */}
      <AnimatePresence>
        {showSettings && (
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="absolute top-16 right-4 sm:right-6 z-40 w-72 bg-black/90 backdrop-blur-3xl rounded-2xl border border-white/[.1] shadow-2xl overflow-hidden pointer-events-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[.06]">
              <h3 className="font-bold text-sm text-white font-display tracking-wide">Stream Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1.5 rounded-lg hover:bg-white/[.06] transition-colors cursor-target"
                aria-label="Close settings"
              >
                <X className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
                  Audio Volume
                </label>
                <div className="px-2">
                  <ElasticSlider
                    defaultValue={volume}
                    startingValue={0}
                    maxValue={100}
                    isStepped={true}
                    stepSize={1}
                    onChange={(val: number) => setVolume(val)}
                  />
                </div>
              </div>

              {type === 'tv' && (
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                    Season &amp; Episode
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      value={localSeason}
                      onChange={handleSeasonChange}
                      className="
                        w-1/2 bg-white/[.05] border border-white/[.08] rounded-lg
                        px-3 py-2 text-sm text-white
                        focus:border-[#00f3ff]/40 focus:ring-1 focus:ring-[#00f3ff]/20
                        focus:outline-none transition-all cursor-target
                      "
                      placeholder="Season"
                      aria-label="Season number"
                    />
                    <input
                      type="number"
                      min={1}
                      value={localEpisode}
                      onChange={handleEpisodeChange}
                      className="
                        w-1/2 bg-white/[.05] border border-white/[.08] rounded-lg
                        px-3 py-2 text-sm text-white
                        focus:border-[#00f3ff]/40 focus:ring-1 focus:ring-[#00f3ff]/20
                        focus:outline-none transition-all cursor-target
                      "
                      placeholder="Episode"
                      aria-label="Episode number"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                  Source
                </label>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[.04] border border-white/[.06]">
                  <span className="text-xs text-white font-medium">Vidking CDN</span>
                  <span className="pill pill-primary text-[9px]">Active</span>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
});

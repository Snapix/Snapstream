import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, X, Bell, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useDebounce } from '../hooks/performance';

const NAV_LINKS = [
  { label: 'Home',     href: '/' },
  { label: 'Movies',   href: '/?filter=Movies' },
  { label: 'TV Shows', href: '/?filter=TV+Shows' },
  { label: 'Anime',    href: '/?filter=Anime' },
];

/**
 * Liquid glass navbar.
 * ✓ Debounced search (no request flood)
 * ✓ Event listener cleanup
 * ✓ GPU-only transitions
 * ✓ Glassmorphism specular highlight
 */
export const Navbar = memo(function Navbar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate   = useNavigate();
  const location   = useLocation();

  /* ── scroll handler ─────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── open search: focus input ────────────────────────────── */
  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
    setSearchQuery('');
  }, [searchOpen]);

  /* ── debounced navigate ─────────────────────────────────── */
  const doNavigate = useCallback((q: string) => {
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  }, [navigate]);

  const debouncedNavigate = useDebounce(doNavigate, 420);

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    debouncedNavigate(val);
  }, [debouncedNavigate]);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  }, [searchQuery, navigate]);

  /* ── close on escape ─────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className={cn(
          'fixed top-0 inset-x-0 z-50 h-16 sm:h-20 transition-all duration-300 will-change-[background,box-shadow]',
          scrolled
            ? 'bg-black/65 backdrop-blur-2xl border-b border-white/[.04] shadow-[0_8px_32px_rgba(0,0,0,.5),0_1px_0_rgba(255,255,255,.04)_inset]'
            : 'bg-gradient-to-b from-black/70 to-transparent'
        )}
      >
        {/* Specular top edge highlight */}
        {scrolled && (
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[.06] to-transparent pointer-events-none" />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center gap-4 lg:gap-8">

          {/* ── Logo ─────────────────────────────────────── */}
          <Link
            to="/"
            className="flex items-center gap-2.5 flex-shrink-0 group"
            aria-label="SnapStream Home"
          >
            {/* Logo mark */}
            <div className="relative w-8 h-8 flex-shrink-0">
              <div className="absolute inset-0 rounded-lg bg-[#00f3ff]/15 blur-md group-hover:bg-[#00f3ff]/25 transition-colors" />
              <div className="relative w-full h-full rounded-lg bg-gradient-to-br from-[#00f3ff]/30 to-[#00f3ff]/5 border border-[#00f3ff]/20 flex items-center justify-center">
                <svg viewBox="0 0 20 20" className="w-4 h-4 fill-[#00f3ff] drop-shadow-[0_0_6px_#00f3ff]" aria-hidden>
                  <polygon points="4,2 16,10 4,18" />
                </svg>
              </div>
            </div>

            <span className="text-xl sm:text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-[#00f3ff] to-white/70 font-display italic uppercase hidden sm:block group-hover:drop-shadow-[0_0_12px_rgba(0,243,255,.5)] transition-all">
              SnapStream
            </span>
          </Link>

          {/* ── Nav links (desktop) ───────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1 flex-shrink-0" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = location.pathname === href || (href !== '/' && location.search.includes(label.replace(' ', '+')));
              return (
                <Link
                  key={label}
                  to={href}
                  className={cn(
                    'relative px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200',
                    isActive
                      ? 'text-white'
                      : 'text-zinc-400 hover:text-zinc-100'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-md bg-white/[.06] border border-white/[.06]"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ── Spacer ───────────────────────────────────── */}
          <div className="flex-1" />

          {/* ── Search ───────────────────────────────────── */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Desktop inline search */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative hidden md:flex items-center"
            >
              <Search className="absolute left-3 w-3.5 h-3.5 text-zinc-400 pointer-events-none z-10" aria-hidden />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleQueryChange}
                placeholder="Search movies, shows, anime…"
                className={cn(
                  'search-input pl-9 pr-4 py-2 h-9 text-sm',
                  'transition-all duration-300',
                  'w-44 focus:w-64',
                )}
                aria-label="Search"
              />
            </form>

            {/* Mobile search icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="btn-icon btn md:hidden w-9 h-9"
              aria-label="Open search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notification bell */}
            <button
              className="btn-icon btn relative w-9 h-9 hidden sm:flex"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#00f3ff] shadow-[0_0_6px_#00f3ff]" />
            </button>

            {/* Profile avatar */}
            <button
              className="relative w-8 h-8 rounded-full overflow-hidden border border-white/15 hover:border-[#00f3ff]/50 transition-all shadow-[0_0_0_2px_transparent] hover:shadow-[0_0_0_2px_rgba(0,243,255,.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f3ff]"
              aria-label="Profile menu"
            >
              <img
                src="https://ui-avatars.com/api/?name=G+S&background=040812&color=00f3ff&size=80&bold=true&format=svg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Full-screen mobile search overlay ─────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex flex-col"
            style={{ backdropFilter: 'blur(24px)', background: 'rgba(0,0,0,.85)' }}
          >
            <div className="flex items-center gap-3 px-4 pt-safe pt-6 pb-4 border-b border-white/[.06]">
              <Search className="w-5 h-5 text-zinc-400 flex-shrink-0" aria-hidden />
              <form onSubmit={handleSearchSubmit} className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleQueryChange}
                  placeholder="Search movies, shows, anime…"
                  className="w-full bg-transparent border-none outline-none text-lg text-white placeholder-zinc-500 font-medium"
                  aria-label="Mobile search"
                />
              </form>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 rounded-full hover:bg-white/[.06] transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            {!searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="px-6 py-8 text-center"
              >
                <p className="text-zinc-500 text-sm">Start typing to search…</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

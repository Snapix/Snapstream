import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, X, Bell, ChevronDown, User as UserIcon, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { AuroraText } from './ui/aurora-text';
import { useDebounce } from '../hooks/performance';
import { useAuth } from '../context/AuthContext';

import GlassSurface from './ui/GlassSurface';

const NAV_LINKS = [
  { label: 'Home',     href: '/' },
  { label: 'About',    href: '#about' }, // We'll intercept this
];


/**
 * Liquid glass navbar.
 * ✓ Debounced search (no request flood)
 * ✓ Event listener cleanup
 * ✓ GPU-only transitions
 * ✓ Glassmorphism specular highlight
 */
export const Navbar = memo(function Navbar({ onOpenAbout }: { onOpenAbout?: () => void }) {
  const [scrolled,     setScrolled]     = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [menuOpen,     setMenuOpen]     = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate   = useNavigate();
  const location   = useLocation();
  const { user, signInWithGoogle, logout } = useAuth();

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

  /* ── close on escape or click outside ───────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOutside);
    };
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
            ? 'bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,.5)]'
            : 'bg-black/20 backdrop-blur-md border-b border-transparent'
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
              className="flex items-center flex-shrink-0 group"
            aria-label="SnapStream Home"
          >
            <AuroraText className="px-2 py-1 text-xl sm:text-3xl font-black tracking-tighter font-display italic uppercase drop-shadow-[0_0_8px_rgba(0,243,255,.4)] group-hover:drop-shadow-[0_0_15px_rgba(0,243,255,.6)] transition-all" colors={["#ffffff", "#00f3ff", "#ffffff"]}>
              SnapStream
            </AuroraText>
          </Link>

          {/* ── Nav links (desktop) ───────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1 flex-shrink-0" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = location.pathname === href || (href !== '/' && location.search.includes(label.replace(' ', '+')));
              return (
                <Link
                  key={label}
                  to={href}
                  onClick={(e) => {
                    if (href === '#about') {
                      e.preventDefault();
                      onOpenAbout?.();
                    }
                  }}
                  className={cn(
                    'group relative px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200',
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
            <div className="hidden md:block relative">
              <GlassSurface width={searchOpen || searchQuery ? 256 : 176} height={36} borderRadius={18} opacity={0.6}>
                <form
                  onSubmit={handleSearchSubmit}
                  className="relative flex items-center w-full h-full"
                >
                  <Search className="absolute left-3 w-3.5 h-3.5 text-zinc-400 pointer-events-none z-10" aria-hidden />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleQueryChange}
                    onFocus={() => setSearchOpen(true)}
                    onBlur={() => setSearchOpen(false)}
                    placeholder="Search movies..."
                    className={cn(
                      'search-input pl-9 pr-4 py-2 w-full h-full text-sm bg-transparent border-none outline-none text-white',
                      'transition-all duration-300',
                    )}
                    aria-label="Search"
                  />
                </form>
              </GlassSurface>
            </div>

            {/* Mobile search icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="btn-icon btn md:hidden w-9 h-9"
              aria-label="Open search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Profile Menu */}
            <div className="relative" ref={menuRef}>
              {user ? (
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="relative w-8 h-8 rounded-full overflow-hidden border border-white/15 hover:border-[#00f3ff]/50 transition-all shadow-[0_0_0_2px_transparent] hover:shadow-[0_0_0_2px_rgba(0,243,255,.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f3ff]"
                  aria-label="Profile menu"
                >
                  <img
                    src="/profile.jpeg"
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/></svg>"; }}
                  />
                </button>
              ) : (
                <button
                  onClick={() => signInWithGoogle()}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              <AnimatePresence>
                {menuOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden z-[100]"
                  >
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-semibold text-white truncate">{user.displayName}</p>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="p-1">
                      <Link
                        to="/settings"
                        onClick={() => setMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <SettingsIcon className="w-4 h-4" />
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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

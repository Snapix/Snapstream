import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, User, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-black/80 backdrop-blur-md shadow-lg" : "bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center rotate-[-10deg] group-hover:rotate-0 transition-transform duration-500 shadow-[0_0_20px_rgba(229,9,20,0.4)]">
              <PlayCircle className="w-6 h-6 text-white fill-current" />
            </div>
            <span className="text-2xl sm:text-3xl font-black tracking-tighter italic uppercase text-white font-display group-hover:text-glow transition-all">
              Snapstream
            </span>
          </Link>
          
          <nav className="hidden md:flex gap-8 text-sm font-semibold tracking-wide uppercase">
            {['Home', 'Movies', 'TV Shows', 'My List'].map((item) => (
              <Link 
                key={item}
                to="/" 
                className={cn(
                  "transition-all relative group py-2",
                  location.pathname === '/' && item === 'Home' ? 'text-white' : 'text-zinc-500 hover:text-white'
                )}
              >
                {item}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                  location.pathname === '/' && item === 'Home' ? 'w-full' : 'w-0 group-hover:w-full'
                )} />
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <AnimatePresence>
            {isSearchOpen ? (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSearch}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  autoFocus
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 border border-white/10 text-white text-sm rounded-full pl-10 pr-4 py-1.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 w-[200px] sm:w-[250px] transition-all"
                  onBlur={() => {
                    if (!searchQuery) setIsSearchOpen(false);
                  }}
                />
                <Search className="absolute left-3 w-4 h-4 text-zinc-400" />
              </motion.form>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(true)}
                className="text-white p-1"
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>
            )}
          </AnimatePresence>

          <button className="text-white hover:text-zinc-300 transition-colors hidden sm:block">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-purple-600 to-red-500 flex items-center justify-center cursor-pointer">
            <User className="w-5 h-5 text-white/80" />
          </div>
        </div>
      </div>
    </motion.header>
  );
}

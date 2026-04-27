import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, PlayCircle } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 grid grid-cols-3 items-center">
        {/* Left: Logo and Nav */}
        <div className="flex items-center gap-10 justify-start">
          <Link to="/" className="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95">
            <span className="text-2xl sm:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-primary to-accent-purple font-display italic uppercase group-hover:text-glow transition-all">
              SnapStream
            </span>
          </Link>
          
          <nav className="hidden lg:flex gap-6 text-sm font-semibold tracking-wide uppercase">
            {['Home', 'Movies', 'TV Shows'].map((item) => (
              <Link 
                key={item}
                to="/" 
                className={cn(
                  "transition-all relative group py-2",
                  location.pathname === '/' && item === 'Home' ? 'text-white' : 'text-zinc-500 hover:text-white'
                )}
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: Search */}
        <div className="flex justify-center w-full max-w-lg mx-auto">
          <form
             onSubmit={handleSearch}
             className="relative flex items-center w-full"
           >
             <input
               type="text"
               placeholder="Search movies, tv shows, anime..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="bg-white/5 border border-white/10 text-white text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 w-full transition-all backdrop-blur-md hover:bg-white/10"
             />
             <Search className="absolute left-3 w-4 h-4 text-zinc-400" />
           </form>
        </div>

        {/* Right: Actions/Profile */}
        <div className="flex items-center justify-end gap-4 sm:gap-6">
           <button className="w-8 h-8 rounded-full overflow-hidden border border-white/20 hover:border-primary transition-colors shadow-[0_0_10px_rgba(0,243,255,0.1)]">
              <img 
                src="https://ui-avatars.com/api/?name=G+S&background=000&color=00f3ff&size=100&bold=true" 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
           </button>
        </div>
      </div>
    </motion.header>
  );
}

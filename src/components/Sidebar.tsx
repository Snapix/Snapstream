import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Film, Tv, Search, Info, User as UserIcon, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { AuroraText } from './ui/aurora-text';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  onOpenAbout: () => void;
}

export const Sidebar = memo(function Sidebar({ onOpenAbout }: SidebarProps) {
  const location = useLocation();
  const { user, signInWithGoogle, logout } = useAuth();

  const NAV_LINKS = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Movies', href: '/?filter=Movies', icon: Film },
    { label: 'TV Shows', href: '/?filter=TV+Shows', icon: Tv },
    { label: 'Search', href: '/search', icon: Search },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-20 bg-black/95 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col hidden lg:flex items-center py-6">
      <Link
        to="/"
        className="mb-8 flex items-center group cursor-pointer"
        aria-label="SnapStream Home"
        title="SnapStream"
      >
        <AuroraText className="text-3xl font-black font-display italic uppercase drop-shadow-[0_0_8px_rgba(0,243,255,.4)] group-hover:drop-shadow-[0_0_15px_rgba(0,243,255,.6)] transition-all" colors={["#ffffff", "#00f3ff", "#ffffff"]}>
          S
        </AuroraText>
      </Link>

      <nav className="flex-1 flex flex-col items-center space-y-4 w-full pt-4">
        {NAV_LINKS.map(({ label, href, icon: Icon }) => {
          const isActive = location.pathname === href || (href !== '/' && location.search.includes(label.replace(' ', '+')));
          return (
            <Link
              key={label}
              to={href}
              title={label}
              className={cn(
                'p-3.5 rounded-2xl transition-all duration-300 relative group overflow-hidden',
                isActive ? 'text-black bg-[#00f3ff] shadow-[0_0_20px_rgba(0,243,255,0.4)] scale-110' : 'text-zinc-500 hover:text-white hover:bg-white/10 hover:scale-105'
              )}
            >
              <Icon className="w-6 h-6 relative z-10" />
            </Link>
          );
        })}

        <button
          onClick={onOpenAbout}
          title="About"
          className="mt-4 p-3.5 rounded-2xl text-zinc-500 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
        >
          <Info className="w-6 h-6" />
        </button>
      </nav>

      <div className="mt-auto w-full flex flex-col items-center pt-6 border-t border-white/10 gap-4">
        {user ? (
          <>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 hover:border-[#00f3ff] transition-colors">
              <img
                src="/profile.jpeg"
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/></svg>"; }}
              />
            </div>
            <button 
              onClick={logout}
              className="p-2.5 text-zinc-500 hover:text-red-400 hover:bg-white/10 rounded-xl transition-all hover:scale-105"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </>
        ) : (
          <button
            onClick={signInWithGoogle}
            title="Sign In"
            className="p-3.5 rounded-2xl bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 text-[#00f3ff] transition-all duration-300 border border-[#00f3ff]/20 hover:scale-105 hover:shadow-[0_0_15px_rgba(0,243,255,0.2)]"
          >
            <UserIcon className="w-6 h-6" />
          </button>
        )}
      </div>
    </aside>
  );
});

import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Film, Tv, Search, Info, User as UserIcon, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
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
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-black border-r border-white/10 z-50 flex flex-col hidden lg:flex">
      <div className="p-6">
        <Link
          to="/"
          className="flex items-center group cursor-pointer"
          aria-label="SnapStream Home"
        >
          <AuroraText className="text-2xl font-black tracking-tighter font-display italic uppercase drop-shadow-[0_0_8px_rgba(0,243,255,.4)] group-hover:drop-shadow-[0_0_15px_rgba(0,243,255,.6)] transition-all" colors={["#ffffff", "#00f3ff", "#ffffff"]}>
            SnapStream
          </AuroraText>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {NAV_LINKS.map(({ label, href, icon: Icon }) => {
          const isActive = location.pathname === href || (href !== '/' && location.search.includes(label.replace(' ', '+')));
          return (
            <Link
              key={label}
              to={href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative group overflow-hidden',
                isActive ? 'text-black bg-[#00f3ff] shadow-[0_0_20px_rgba(0,243,255,0.3)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-black" : "text-zinc-400 group-hover:text-white")} />
              <span className="relative z-10">{label}</span>
            </Link>
          );
        })}

        <button
          onClick={onOpenAbout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200 text-left"
        >
          <Info className="w-5 h-5 text-zinc-400" />
          <span>About</span>
        </button>
      </nav>

      <div className="p-4 mt-auto border-t border-white/10">
        {user ? (
          <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-white/20">
                <img
                  src="/profile.jpeg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-white truncate">{user.displayName || 'User'}</p>
                <p className="text-xs text-zinc-500 truncate mt-0.5">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-zinc-400 hover:text-red-400 hover:bg-white/5 rounded-full transition-colors flex-shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-2 bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 text-[#00f3ff] px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border border-[#00f3ff]/20"
          >
            <UserIcon className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </aside>
  );
});

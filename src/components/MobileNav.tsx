import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Film, Tv, Search } from 'lucide-react';
import { cn } from '../lib/utils';

interface MobileNavProps {
  onOpenAbout: () => void;
}

export function MobileNav({ onOpenAbout }: MobileNavProps) {
  const location = useLocation();

  const NAV_LINKS = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Movies', href: '/?filter=Movies', icon: Film },
    { label: 'TV Shows', href: '/?filter=TV+Shows', icon: Tv },
    { label: 'Search', href: '/search', icon: Search },
    { label: 'About', href: '#', icon: () => <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 z-50 lg:hidden pb-safe">
      <div className="flex items-center justify-around p-2">
        {NAV_LINKS.map(({ label, href, icon: Icon }) => {
          if (label === 'About') {
            return (
               <button
                key={label}
                onClick={onOpenAbout}
                className="flex flex-col items-center justify-center p-2 rounded-xl min-w-[64px] text-zinc-500 hover:text-zinc-300"
              >
                <Icon />
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            )
          }

          const isActive = location.pathname === href || (href !== '/' && location.search.includes(label.replace(' ', '+')));
          return (
            <Link
              key={label}
              to={href}
              className={cn(
                'flex flex-col items-center justify-center p-2 rounded-xl min-w-[64px]',
                isActive ? 'text-[#00f3ff]' : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

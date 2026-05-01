/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Watch } from './pages/Watch';
import { Settings as SettingsPage } from './pages/Settings';

import { AboutModal } from './components/AboutModal';
import { useState, useEffect } from 'react';

import ReactBitsDock from './components/ui/ReactBitsDock';
import { Home as HomeIcon, Film, Tv, Search as SearchIcon, Settings } from 'lucide-react';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      {/* @ts-ignore React Router types sometimes omit 'key' */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/watch/:type/:id" element={<Watch />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <Router>
      <div className="relative min-h-screen text-white font-sans selection:bg-[#00f3ff]/30 selection:text-white flex flex-col overflow-x-hidden bg-black">
          <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

          <div className="relative z-10 flex flex-col flex-1 pb-[80px]">
            <Navbar />
            <main className="flex-1">
              <AnimatedRoutes />
            </main>
            
            {/* Simple Footer */}
            <footer className="py-12 px-6 flex flex-col items-center justify-center text-center text-zinc-600 text-xs border-t border-white/5 relative z-10 bg-black/40">
              <p className="font-medium text-zinc-500 mb-2 font-display tracking-wider">SNAPSTREAM ENTERTAINMENT</p>
              <p className="mb-4">© {new Date().getFullYear()} Infinite streaming for cinematic souls. Educational build.</p>
              <button 
                onClick={() => setIsAboutOpen(true)}
                className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(0,243,255,0.1)] hover:shadow-[0_0_20px_rgba(0,243,255,0.3)]"
              >
                About Creator
              </button>
            </footer>

            {/* Bottom floating Dock */}
            <div className="fixed bottom-4 left-0 right-0 z-[100] flex justify-center text-black dark:text-white">
              <ReactBitsDock 
                items={[
                  { icon: <HomeIcon className="w-5 h-5 text-zinc-300" />, label: 'Home', onClick: () => window.location.href = '/' },
                  { icon: <Film className="w-5 h-5 text-zinc-300" />, label: 'Movies', onClick: () => window.location.href = '/?filter=Movies' },
                  { icon: <Tv className="w-5 h-5 text-zinc-300" />, label: 'TV Shows', onClick: () => window.location.href = '/?filter=TV+Shows' },
                  { icon: <SearchIcon className="w-5 h-5 text-zinc-300" />, label: 'Search', onClick: () => window.location.href = '/search' },
                  { icon: <Settings className="w-5 h-5 text-zinc-300" />, label: 'Settings', onClick: () => window.location.href = '/settings' }
                ]}
                className="bg-black/80 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,243,255,0.15)]"
                panelHeight={68}
                baseItemSize={50}
                magnification={70}
              />
            </div>

          </div>
      </div>
    </Router>
  );
}


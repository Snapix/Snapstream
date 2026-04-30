/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Watch } from './pages/Watch';

import { SplashScreen } from './components/SplashScreen';
import { AboutModal } from './components/AboutModal';
import { useState, useEffect } from 'react';

import { SmoothCursor } from './components/ui/smooth-cursor';
import { Dock, DockIcon } from './components/ui/dock';
import { Home as HomeIcon, Film, Tv, Search as SearchIcon, Settings } from 'lucide-react';
import { ClickSpark } from './components/ClickSpark';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      {/* @ts-expect-error React Router types incorrectly omit 'key' which is required for AnimatePresence */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/watch/:type/:id" element={<Watch />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <Router>
      <div className="relative min-h-screen text-white font-sans selection:bg-accent-purple/30 selection:text-white flex flex-col overflow-x-hidden bg-black">
        <ClickSpark sparkColor="#00f3ff" sparkCount={12} sparkSize={15}>
          <SmoothCursor />
          <AnimatePresence>
            {showSplash && (
              <SplashScreen onComplete={() => setShowSplash(false)} />
            )}
          </AnimatePresence>
          
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
            <div className="fixed bottom-4 left-0 right-0 z-[100] pointer-events-none flex justify-center">
              <div className="pointer-events-auto">
                <Dock 
                  direction="middle" 
                  className="bg-black/40 border-white/10 dark:bg-black/40 backdrop-blur-xl supports-backdrop-blur:bg-black/40 supports-backdrop-blur:dark:bg-black/40 shadow-[0_8px_32px_rgba(0,243,255,0.15)]"
                  iconSize={48}
                  iconMagnification={64}
                >
                  <DockIcon onClick={() => window.location.href = '/'}>
                    <HomeIcon className="w-5 h-5 text-zinc-300 group-hover:text-white" />
                  </DockIcon>
                  <DockIcon onClick={() => window.location.href = '/?filter=Movies'}>
                    <Film className="w-5 h-5 text-zinc-300 group-hover:text-white" />
                  </DockIcon>
                  <DockIcon onClick={() => window.location.href = '/?filter=TV+Shows'}>
                    <Tv className="w-5 h-5 text-zinc-300 group-hover:text-white" />
                  </DockIcon>
                  <DockIcon onClick={() => window.location.href = '/search'}>
                    <SearchIcon className="w-5 h-5 text-zinc-300 group-hover:text-white" />
                  </DockIcon>
                  <DockIcon onClick={() => setIsAboutOpen(true)}>
                    <Settings className="w-5 h-5 text-zinc-300 group-hover:text-white" />
                  </DockIcon>
                </Dock>
              </div>
            </div>

          </div>
        </ClickSpark>
      </div>
    </Router>
  );
}


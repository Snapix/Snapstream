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
import { Cursor } from './components/Cursor';
import { useState, useEffect } from 'react';
import { subscribeToPlayState } from './components/PlayerWrapper';

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
  const [isPerformanceMode, setIsPerformanceMode] = useState(false);

  useEffect(() => {
    return subscribeToPlayState(setIsPerformanceMode);
  }, []);

  return (
    <Router>
      <div className={`relative min-h-screen bg-[#0A0F1F] text-white font-sans selection:bg-accent-purple/30 selection:text-white flex flex-col overflow-x-hidden ${isPerformanceMode ? '' : 'bg-mesh'}`}>
        <Cursor />
        <AnimatePresence>
          {showSplash && (
            <SplashScreen onComplete={() => setShowSplash(false)} />
          )}
        </AnimatePresence>
        
        <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

        <div className="relative z-10 flex flex-col flex-1">
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
              className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 hover:text-white transition-all duration-300"
            >
              About Creator
            </button>
          </footer>
        </div>
      </div>
    </Router>
  );
}


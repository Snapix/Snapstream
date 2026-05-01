/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Watch } from './pages/Watch';
import { Settings as SettingsPage } from './pages/Settings';

import { AboutModal } from './components/AboutModal';
import { useState } from 'react';

import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { BlobCursor } from './components/BlobCursor';
import PixelTrail from './components/ui/PixelTrail';

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
      <div className="relative min-h-screen text-white font-sans selection:bg-[#00f3ff]/30 selection:text-white flex overflow-hidden bg-black">
          <BlobCursor color="#00f3ff" />
          <div className="absolute inset-0 pointer-events-none z-0">
             <PixelTrail pixelSize={16} fadeDuration={1500} pixelColor="#00f3ff" />
          </div>
          
          <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

          <Sidebar onOpenAbout={() => setIsAboutOpen(true)} />

          <div className="relative z-10 flex flex-col flex-1 pb-[80px] sm:pb-0 h-screen overflow-y-auto">
            <main className="flex-1 w-full max-w-[100vw]">
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
          </div>

          <MobileNav onOpenAbout={() => setIsAboutOpen(true)} />
      </div>
    </Router>
  );
}


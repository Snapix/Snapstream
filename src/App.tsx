/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import React, { useState, useEffect, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { Backgrounds } from './components/Backgrounds';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Watch } from './pages/Watch';
import { Settings as SettingsPage } from './pages/Settings';

import { SplashScreen } from './components/SplashScreen';
import { AboutModal } from './components/AboutModal';
import { DisclaimerModal } from './components/DisclaimerModal';

import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';

const CustomCursor = React.lazy(() => import('./components/ui/CustomCursor'));

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
  const [showSplash, setShowSplash] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    const dontShowAgain = localStorage.getItem('snapstream_disclaimer_hidden');
    if (dontShowAgain !== 'true') {
      setShowDisclaimer(true);
    }
  };

  const handleDisclaimerAccept = (dontShowAgain: boolean) => {
    if (dontShowAgain) {
      localStorage.setItem('snapstream_disclaimer_hidden', 'true');
    }
    setShowDisclaimer(false);
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>
      <Router>
        <div className="relative min-h-screen text-white font-sans selection:bg-[#00f3ff]/30 selection:text-white flex overflow-hidden bg-black">
            <Backgrounds />
            {isDesktop && (
              <Suspense fallback={null}>
                <CustomCursor />
              </Suspense>
            )}
            <DisclaimerModal 
              isOpen={showDisclaimer} 
              onClose={() => setShowDisclaimer(false)} 
              onAccept={handleDisclaimerAccept} 
            />
            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
            <Navbar onOpenAbout={() => setIsAboutOpen(true)} />
            <div className="relative z-10 flex flex-col flex-1 h-screen overflow-y-auto pt-0">
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
        </div>
      </Router>
    </>
  );
}


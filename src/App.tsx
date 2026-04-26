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
import { useState } from 'react';

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

  return (
    <Router>
      <div className="relative min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600 selection:text-white flex flex-col overflow-x-hidden bg-mesh">
        <AnimatePresence>
          {showSplash && (
            <SplashScreen onComplete={() => setShowSplash(false)} />
          )}
        </AnimatePresence>

        <div className="relative z-10 flex flex-col flex-1">
          <Navbar />
          <main className="flex-1">
            <AnimatedRoutes />
          </main>
          
          {/* Simple Footer */}
          <footer className="py-12 px-6 text-center text-zinc-600 text-xs border-t border-white/5 relative z-10 bg-black/40">
            <p className="font-medium text-zinc-500 mb-2">SNAPSTREAM ENTERTAINMENT</p>
            <p>© {new Date().getFullYear()} Infinite streaming for cinematic souls. Educational build.</p>
          </footer>
        </div>
      </div>
    </Router>
  );
}


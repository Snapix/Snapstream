import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export function DisclaimerModal({ 
  isOpen, 
  onClose,
  onAccept
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onAccept: (dontShowAgain: boolean) => void;
}) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="relative w-full max-w-md bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent opacity-50" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-zinc-400" />
            </button>
            
            <div className="p-6 sm:p-8">
              <h3 className="text-xl font-display font-bold text-white mb-4">Notice</h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                This platform streams movies and shows using mirror servers. Availability and playback quality may vary. New content servers are updated regularly. Thank you for your patience.
              </p>
              
              <label className="flex items-center gap-3 cursor-pointer mb-6 group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${dontShowAgain ? 'bg-[#00f3ff] border-[#00f3ff]' : 'border-white/20 group-hover:border-white/40'}`}>
                  {dontShowAgain && <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                />
                <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Do not show again</span>
              </label>

              <button
                onClick={() => onAccept(dontShowAgain)}
                className="w-full py-3 bg-[#00f3ff] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all active:scale-95"
              >
                Understood
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

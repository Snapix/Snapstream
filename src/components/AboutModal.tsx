import { motion, AnimatePresence } from "motion/react";
import { X, Instagram, Youtube, Globe } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center pointer-events-none p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%", opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full sm:max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
          >
            {/* Top decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/20 to-transparent" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-5 h-5 text-zinc-300" />
            </button>

            <div className="p-8 flex flex-col items-center text-center mt-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_30px_rgba(0,191,255,0.3)] mb-6 bg-black/50 relative flex items-center justify-center">
                <img src="/profile.jpeg" alt="Creator: Snappy - Girish" className="w-full h-full object-cover z-10" onError={(e) => e.currentTarget.style.display = 'none'} />
                <div className="absolute inset-0 bg-primary/20 blur-md" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2 font-display">Creator: Snappy - Girish</h2>
              <p className="text-sm font-medium text-primary mb-4">Powered using Vidking backend</p>
              
              <p className="text-xs text-zinc-500 mb-8 max-w-[250px]">
                Made for people who hate paid streaming platforms
              </p>

              <div className="w-full flex flex-col gap-3">
                <a 
                  href="https://www.instagram.com/snapix_yt?igsh=MTVpOHE5cHVsdXV1cA==" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group text-sm font-medium"
                >
                  <Instagram className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform" />
                  Instagram
                </a>
                <a 
                  href="https://www.threads.com/@snapix_yt" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group text-sm font-medium"
                >
                  <span className="text-xl font-bold leading-none text-zinc-300 group-hover:scale-110 transition-transform">@</span>
                  Threads
                </a>
                <a 
                  href="https://youtube.com/@snapix_yt" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group text-sm font-medium"
                >
                  <Youtube className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                  YouTube
                </a>
                <a 
                  href="https://touchlesstouch.vercel.app" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-gradient-to-r from-primary/20 to-accent-purple/20 hover:from-primary/30 hover:to-accent-purple/30 border border-primary/20 transition-all group text-sm font-medium mt-2"
                >
                  <Globe className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
                  Check out TouchlessTouch
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

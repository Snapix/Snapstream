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
            className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden pointer-events-auto bg-black border border-white/10"
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
              <div className="w-24 h-24 rounded-full overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,243,255,0.3)] mb-6 bg-black/50 relative flex items-center justify-center group z-10">
                <img 
                  src="/profile.jpeg" 
                  alt="Creator: Snappy - Girish" 
                  className="w-full h-full object-cover z-10 transition-transform duration-500 group-hover:scale-110" 
                  onError={(e) => { e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/></svg>"; }}
                />
                <div className="absolute inset-0 bg-[#00f3ff]/20 blur-md pointer-events-none" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2 font-display z-10">
                Creator: Snappy - Girish
              </h2>
              
              <p className="text-sm font-medium text-primary mb-4 z-10 relative">Powered using Vidking backend</p>
              
              <p className="text-xs text-zinc-500 mb-8 max-w-[250px] z-10 relative">
                Made for people who hate paid streaming platforms
              </p>

              <div className="w-full flex flex-col gap-3 z-10 relative">
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

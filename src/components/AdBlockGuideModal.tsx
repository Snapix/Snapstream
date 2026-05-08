import { X, ShieldAlert, Wifi, MonitorSmartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdBlockGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdBlockGuideModal({ isOpen, onClose }: AdBlockGuideModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/30">
                    <ShieldAlert className="w-8 h-8 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-display text-white">Block Ads & Popups Globally</h2>
                    <p className="text-zinc-400 text-sm mt-1">Recommended for the best streaming experience</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-zinc-400 hover:text-white" />
                </button>
              </div>

              <div className="space-y-6 text-zinc-300 leading-relaxed">
                <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-2">What is AdGuard DNS?</h3>
                  <p className="text-sm">
                    AdGuard DNS is a free, privacy-focused service that blocks ads, trackers, and malicious domains at the network level without installing any apps. By changing your device DNS, you will naturally block popup ads from third-party video players.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4 text-white">
                    <MonitorSmartphone className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Setup instructions</h3>
                  </div>

                  <div className="space-y-6">
                    {/* Android */}
                    <div className="bg-black/50 border border-white/5 p-4 rounded-xl">
                      <h4 className="font-semibold text-white mb-3 tracking-wide">Android</h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-300">
                        <li>Go to <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white text-xs">Settings &gt; Network & Internet &gt; Private DNS</span></li>
                        <li>Select <strong>"Private DNS provider hostname"</strong>.</li>
                        <li>Type <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-primary text-xs">dns.adguard-dns.com</span></li>
                        <li>Tap Save. Popups are now blocked!</li>
                      </ol>
                    </div>

                    {/* Windows */}
                    <div className="bg-black/50 border border-white/5 p-4 rounded-xl">
                      <h4 className="font-semibold text-white mb-3 tracking-wide">Windows</h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-300">
                        <li>Open Control Panel and go to <strong>Network and Internet</strong>.</li>
                        <li>Click <strong>Network and Sharing Center</strong>.</li>
                        <li>Change adapter settings, right-click your connection, and select Properties.</li>
                        <li>Select IPv4 and change DNS to <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-primary text-xs">94.140.14.14</span> and <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-primary text-xs">94.140.15.15</span></li>
                      </ol>
                    </div>
                    
                    {/* iOS / Mac */}
                    <div className="bg-black/50 border border-white/5 p-4 rounded-xl">
                      <h4 className="font-semibold text-white mb-3 tracking-wide">iOS & MacOS</h4>
                      <p className="text-sm">
                        You can download the free AdGuard app from the App Store to easily enable DNS protection system-wide, securely blocking video player ads.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

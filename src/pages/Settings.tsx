import { useState } from 'react';
import { motion } from 'motion/react';
import { ToggleSwitch } from '../components/ui/ToggleSwitch';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Settings() {
  const navigate = useNavigate();
  const [autoplay, setAutoplay] = useState(false);
  const [highQuality, setHighQuality] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-black pt-24 px-4 sm:px-8 pb-32">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="cursor-target flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <motion.h1 
          className="text-4xl font-bold text-white mb-8 font-display"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Settings
        </motion.h1>

        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Playback</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Autoplay Next Episode</h3>
                  <p className="text-zinc-400 text-sm mt-1">Automatically play the next episode when the current one ends.</p>
                </div>
                <ToggleSwitch checked={autoplay} onChange={setAutoplay} />
              </div>

              <div className="h-px bg-white/10" />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Default to High Quality</h3>
                  <p className="text-zinc-400 text-sm mt-1">Always play videos in the highest available quality.</p>
                </div>
                <ToggleSwitch checked={highQuality} onChange={setHighQuality} />
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Notifications</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Push Notifications</h3>
                  <p className="text-zinc-400 text-sm mt-1">Receive notifications for new episodes and recommendations.</p>
                </div>
                <ToggleSwitch checked={notifications} onChange={setNotifications} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

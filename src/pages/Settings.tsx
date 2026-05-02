import { useState } from 'react';
import { motion } from 'motion/react';
import { ToggleSwitch } from '../components/ui/ToggleSwitch';
import { ArrowLeft, User, Bell, PlaySquare, Shield, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Settings() {
  const navigate = useNavigate();
  const { user, signInWithGoogle, logout } = useAuth();

  // Playback settings
  const [autoplay, setAutoplay] = useState(true);
  const [skipIntro, setSkipIntro] = useState(false);
  const [highQuality, setHighQuality] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);

  // Content settings
  const [language, setLanguage] = useState('en');
  const [subtitles, setSubtitles] = useState('en');

  // Notifications
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  // Parental controls
  const [matureContent, setMatureContent] = useState(true);

  return (
    <div className="min-h-screen bg-black pt-24 px-4 sm:px-8 pb-32">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <motion.h1 
          className="text-4xl sm:text-5xl font-black text-white mb-10 font-display tracking-tighter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Settings
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12">
          {/* Account Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00f3ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-white/10 p-1">
                  <img
                    src="/profile.jpeg"
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => { e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/></svg>"; }}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{user?.displayName || 'Guest User'}</h2>
                  <p className="text-sm text-zinc-400">{user?.email || 'Not signed in'}</p>
                </div>

                {user ? (
                  <button 
                    onClick={logout}
                    className="w-full py-2.5 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all text-sm mt-2"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button 
                    onClick={signInWithGoogle}
                    className="w-full py-2.5 rounded-xl bg-[#00f3ff] text-black font-bold hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all text-sm mt-2"
                  >
                    Sign In with Google
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hidden lg:block">
              <nav className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white font-medium cursor-pointer">
                  <PlaySquare className="w-5 h-5" />
                  Playback & Content
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer">
                  <Bell className="w-5 h-5" />
                  Notifications
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer">
                  <Smartphone className="w-5 h-5" />
                  Devices
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer">
                  <Shield className="w-5 h-5" />
                  Security
                </div>
              </nav>
            </div>
          </motion.div>

          {/* Main Settings Panel */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Playback Section */}
            <section>
              <h3 className="text-sm font-bold text-[#00f3ff] uppercase tracking-widest mb-4">Playback</h3>
              <div className="bg-white/[.02] border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium text-base">Autoplay Next Episode</h4>
                    <p className="text-zinc-500 text-sm mt-1">Automatically play the next episode when current ends.</p>
                  </div>
                  <ToggleSwitch checked={autoplay} onChange={setAutoplay} />
                </div>

                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium text-base">Auto-Skip Intro</h4>
                    <p className="text-zinc-500 text-sm mt-1">Skip TV show intros automatically when detected.</p>
                  </div>
                  <ToggleSwitch checked={skipIntro} onChange={setSkipIntro} />
                </div>

                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium text-base">High Quality Streaming</h4>
                    <p className="text-zinc-500 text-sm mt-1">Play videos in 4K/1080p when available.</p>
                  </div>
                  <ToggleSwitch checked={highQuality} onChange={setHighQuality} />
                </div>
                
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium text-base">Data Saver</h4>
                    <p className="text-zinc-500 text-sm mt-1">Limit resolution to save data on cellular networks.</p>
                  </div>
                  <ToggleSwitch checked={dataSaver} onChange={setDataSaver} />
                </div>

              </div>
            </section>

            {/* Language Section */}
            <section>
              <h3 className="text-sm font-bold text-[#00f3ff] uppercase tracking-widest mb-4">Language & Subtitles</h3>
              <div className="bg-white/[.02] border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium text-base">Audio Language</h4>
                    <p className="text-zinc-500 text-sm mt-1">Default spoken language.</p>
                  </div>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-black border border-white/20 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#00f3ff] transition-colors"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="ja">日本語 (Japanese)</option>
                    <option value="ko">한국어 (Korean)</option>
                  </select>
                </div>

                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium text-base">Subtitles Language</h4>
                    <p className="text-zinc-500 text-sm mt-1">Default subtitle language when available.</p>
                  </div>
                  <select 
                    value={subtitles}
                    onChange={(e) => setSubtitles(e.target.value)}
                    className="bg-black border border-white/20 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#00f3ff] transition-colors"
                  >
                    <option value="off">Off</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="ja">日本語 (Japanese)</option>
                    <option value="ko">한국어 (Korean)</option>
                  </select>
                </div>

              </div>
            </section>

            {/* Content & Family Section */}
            <section>
              <h3 className="text-sm font-bold text-[#00f3ff] uppercase tracking-widest mb-4">Content & Family</h3>
              <div className="bg-white/[.02] border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium text-base">Allow Mature Content</h4>
                    <p className="text-zinc-500 text-sm mt-1">Show movies and series rated R / TV-MA.</p>
                  </div>
                  <ToggleSwitch checked={matureContent} onChange={setMatureContent} />
                </div>
              </div>
            </section>

            {/* Notifications Section */}
            <section>
              <h3 className="text-sm font-bold text-[#00f3ff] uppercase tracking-widest mb-4">Notifications</h3>
              <div className="bg-white/[.02] border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium text-base">Push Notifications</h4>
                    <p className="text-zinc-500 text-sm mt-1">Get alerts for new episodes on your device.</p>
                  </div>
                  <ToggleSwitch checked={pushNotifications} onChange={setPushNotifications} />
                </div>

                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium text-base">Email Updates</h4>
                    <p className="text-zinc-500 text-sm mt-1">Weekly top picks and account alerts.</p>
                  </div>
                  <ToggleSwitch checked={emailNotifications} onChange={setEmailNotifications} />
                </div>

              </div>
            </section>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

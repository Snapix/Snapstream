import { useState, useEffect } from 'react';
import PixelTrail from './ui/PixelTrail';
import Aurora from './ui/Aurora';
import DarkVeil from './ui/DarkVeil';

export function Backgrounds() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  return (
    <>
      {/* Base Aurora Background */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-50">
        <Aurora
          colorStops={["#000511", "#003344", "#001122"]}
          blend={0.5}
          amplitude={1.2}
          speed={0.3}
        />
      </div>

      {/* DarkVeil Overlay for Texture and Scanlines */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-30 mix-blend-overlay">
        <DarkVeil
          hueShift={0}
          noiseIntensity={0.15}
          scanlineIntensity={0.6}
          speed={0.2}
          scanlineFrequency={0.05}
          warpAmount={0.5}
          resolutionScale={1}
        />
      </div>

      {/* Desktop PixelTrail Cursor Effect */}
      {isDesktop && (
        <div className="fixed inset-0 z-[2] pointer-events-none opacity-60">
          <PixelTrail
            gridSize={50}
            trailSize={0.08}
            maxAge={200}
            interpolate={2.7}
            color="#00f3ff"
          />
        </div>
      )}
    </>
  );
}

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
      {/* Desktop PixelTrail Cursor Effect */}
      {isDesktop && (
        <div className="fixed inset-0 z-[0] pointer-events-none opacity-40">
          <PixelTrail
            gridSize={40}
            trailSize={0.05}
            maxAge={200}
            interpolate={2}
            color="#00f3ff"
          />
        </div>
      )}
    </>
  );
}

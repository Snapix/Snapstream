import { useState, useEffect } from 'react';
import PixelTrail from './ui/PixelTrail';
import DotParticles from './ui/DotParticles';

export function Backgrounds() {
  return (
    <>
      {/* Pure Black Base */}
      <div className="fixed inset-0 bg-black z-[-1] pointer-events-none" />
    </>
  );
}

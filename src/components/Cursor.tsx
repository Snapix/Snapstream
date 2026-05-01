import { useEffect, useState, useRef } from 'react';
import { motion, useSpring } from 'motion/react';
import { subscribeToPlayState } from './PlayerWrapper';

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isPerformanceMode, setIsPerformanceMode] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  // Smooth springs for cursor position
  const mouseX = useSpring(0, { stiffness: 500, damping: 28 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 28 });

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Check if pointing at clickable element
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button'
      );
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const unsub = subscribeToPlayState((isPlaying) => {
      setIsPerformanceMode(isPlaying);
    });
    return () => { unsub(); };
  }, []);

  if (isPerformanceMode || !isVisible) return null;

  return (
    <motion.div
      ref={cursorRef}
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[1000] mix-blend-screen"
      style={{
        x: mouseX,
        y: mouseY,
        translateX: '-50%',
        translateY: '-50%'
      }}
    >
      <div 
        className={`w-full h-full rounded-full bg-primary/40 blur-[4px] border border-primary/50 transition-all duration-300 ${
          isPointer ? 'scale-150 bg-primary/60 blur-[2px]' : 'scale-100'
        }`}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#fff]" />
    </motion.div>
  );
}

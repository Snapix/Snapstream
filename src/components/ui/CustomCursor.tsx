import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if it's a mobile/touch device
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || navigator.maxTouchPoints > 0) {
      setIsDesktop(false);
      return;
    }

    const mouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    
    // Add custom class to body to hide default cursor
    document.body.classList.add('hide-cursor-custom');

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('hide-cursor-custom');
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isDesktop) return null;

  return (
    <>
      <style>
        {`
          .hide-cursor-custom, .hide-cursor-custom * {
            cursor: none !important;
          }
        `}
      </style>
      
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#00f3ff] pointer-events-none z-[9999] opacity-70 -ml-4 -mt-4 shadow-[0_0_10px_rgba(0,243,255,0.5)]"
        style={{
          x: springX,
          y: springY,
          opacity: isVisible ? 1 : 0
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          borderColor: isHovering ? 'rgba(0, 243, 255, 0.2)' : 'rgba(0, 243, 255, 1)'
        }}
        transition={{ type: "spring", damping: 15, stiffness: 300, mass: 0.1 }}
      />
      
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[9999] -ml-1 -mt-1 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          opacity: isVisible ? 1 : 0
        }}
        animate={{
          scale: isHovering ? 0 : 1
        }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
      />
    </>
  );
}

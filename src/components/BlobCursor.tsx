import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { subscribeToPlayState } from './PlayerWrapper';

interface BlobCursorProps {
  blobType?: 'circle' | 'square';
  fillColor?: string;
  trailCount?: number;
  useFilter?: boolean;
  fastDuration?: number;
  slowDuration?: number;
}

export function BlobCursor({
  blobType = 'circle',
  fillColor = '#00bfff',
  trailCount = 2,
  useFilter = true,
  fastDuration = 0.1,
  slowDuration = 0.35
}: BlobCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isPointerRef = useRef(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

    // Track play state with subscribeToPlayState directly
    const unsubscribe = subscribeToPlayState((isPlaying) => {
      if (containerRef.current) {
        containerRef.current.style.display = isPlaying ? 'none' : 'block';
      }
    });

    const updateOffset = () => {
      if (!containerRef.current) return { left: 0, top: 0 };
      const rect = containerRef.current.getBoundingClientRect();
      return { left: rect.left, top: rect.top };
    };

    const handleMove = (e: MouseEvent) => {
      const { left, top } = updateOffset();
      const x = e.clientX;
      const y = e.clientY;

      // Check if pointing at clickable element
      const target = e.target as HTMLElement;
      isPointerRef.current = 
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button';

      blobsRef.current.forEach((el, i) => {
        if (!el) return;
        const isLead = i === 0;
        gsap.to(el, {
          x: x - left,
          y: y - top,
          duration: isLead ? fastDuration : slowDuration,
          ease: isLead ? 'power2.out' : 'power3.out',
          scale: isPointerRef.current ? 1.5 : 1,
        });
      });
    };

    window.addEventListener('mousemove', handleMove);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      unsubscribe();
    };
  }, [fastDuration, slowDuration]);

  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return null;

  return (
    <>
      {useFilter && (
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <filter id="blob-filter">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={15} />
            <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -10" />
          </filter>
        </svg>
      )}
      <div 
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-[1000]"
        style={{ filter: useFilter ? 'url(#blob-filter)' : 'none' }}
      >
        {Array.from({ length: trailCount }).map((_, i) => (
          <div
            key={i}
            ref={(el) => { blobsRef.current[i] = el; }}
            className={`absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 bg-[${fillColor}] ${blobType === 'circle' ? 'rounded-full' : ''}`}
            style={{
              width: i === 0 ? 30 : 50,
              height: i === 0 ? 30 : 50,
              backgroundColor: fillColor,
              opacity: i === 0 ? 1 : 0.5,
              willChange: 'transform'
            }}
          />
        ))}
      </div>
    </>
  );
}

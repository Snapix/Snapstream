import { memo } from 'react';
import { cn } from '../lib/utils';

interface PlayerWrapperProps {
  embedUrl:         string;
  title:            string;
  type:             'movie' | 'tv';
  season?:          number;
  episode?:         number;
  onEpisodeChange?: (s: number, e: number) => void;
}

export const PlayerWrapper = memo(function PlayerWrapper({
  embedUrl,
  title,
}: PlayerWrapperProps) {
  return (
    <div
      className={cn(
        'relative w-full aspect-video max-h-[80vh] bg-black overflow-hidden',
        'rounded-xl sm:rounded-2xl',
        'border border-white/[.1]',
        'shadow-[0_0_30px_rgba(0,0,0,0.8)]'
      )}
    >
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        allowFullScreen
        allow="autoplay; fullscreen"
        sandbox="allow-scripts allow-same-origin allow-forms"
        className="absolute inset-0 w-full h-full border-none"
        title={title}
      />
    </div>
  );
});

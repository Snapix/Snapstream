import { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface BorderGlowProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function BorderGlow({ 
  children,
  className,
  glowColor = 'from-primary via-primary/50 to-primary'
}: BorderGlowProps) {
  return (
    <div className={cn("relative group rounded-xl", className)}>
      <div className={cn(
        "absolute -inset-[2px] bg-gradient-to-r rounded-xl opacity-0 group-hover:opacity-100 blur-[8px] transition-all duration-500",
        glowColor
      )} />
      <div className={cn(
        "absolute -inset-[1px] bg-gradient-to-r rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500",
        glowColor
      )} />
      <div className="relative rounded-xl h-full w-full">
        {children}
      </div>
    </div>
  );
}

import React, { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'icon' | 'lg';
  children: ReactNode;
  className?: string;
}

export function LiquidButton({ 
  variant = 'primary', 
  size = 'default', 
  children, 
  className,
  ...props 
}: LiquidButtonProps) {
  const isIcon = size === 'icon';

  return (
    <>
      <svg width="0" height="0" className="absolute hidden">
        <filter id="liquid-filter">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="liquid" />
          <feComposite in="SourceGraphic" in2="liquid" operator="atop" />
        </filter>
      </svg>
      <div 
        className="relative group isolate"
        style={{ filter: 'url(#liquid-filter)' }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "relative flex items-center justify-center font-bold transition-colors overflow-hidden",
            "before:absolute before:-inset-2 before:bg-inherit before:rounded-full before:transition-transform before:duration-300 before:ease-out group-hover:before:scale-110 before:-z-10",
            variant === 'primary' ? "bg-primary text-white" : "bg-white text-black",
            size === 'lg' && "px-10 py-4 text-lg rounded-xl",
            size === 'default' && "px-8 py-3 rounded-xl",
            isIcon && "w-16 h-16 rounded-full",
            className
          )}
          {...props}
        >
          <span className="relative z-10 flex items-center justify-center gap-2 w-full h-full">
            {children}
          </span>
        </motion.button>
      </div>
    </>
  );
}

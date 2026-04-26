import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { cn } from '../lib/utils';

export function BlurText({
  text,
  className,
  delay = 0
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div ref={ref} className={cn("overflow-hidden inline-block", className)}>
      <motion.div
        initial={{ filter: "blur(10px)", opacity: 0, y: 10 }}
        animate={isInView ? { filter: "blur(0px)", opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
        className="inline-block"
      >
        {text}
      </motion.div>
    </div>
  );
}

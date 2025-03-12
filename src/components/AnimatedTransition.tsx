
import React, { ReactNode } from 'react';
import { cn } from "@/lib/utils";

interface AnimatedTransitionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedTransition = ({ 
  children, 
  className,
  delay = 0
}: AnimatedTransitionProps) => {
  return (
    <div 
      className={cn(
        "opacity-0 animate-fade-in",
        className
      )}
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards' 
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;

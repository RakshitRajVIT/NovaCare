import { ReactNode } from 'react';

interface GlassWidgetProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  floating?: boolean;
}

const GlassWidget = ({ 
  children, 
  className = '', 
  delay = 0,
  floating = true 
}: GlassWidgetProps) => {
  return (
    <div 
      className={`
        glass-card p-4 
        ${floating ? 'floating-widget' : ''} 
        haptic-glow
        ${className}
      `}
      style={{
        animationDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

export default GlassWidget;
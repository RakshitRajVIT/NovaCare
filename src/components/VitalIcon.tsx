import { Heart, Activity, Thermometer, Droplets, Brain, Stethoscope } from 'lucide-react';

type VitalType = 'heart' | 'activity' | 'temperature' | 'oxygen' | 'brain' | 'stethoscope';

interface VitalIconProps {
  type: VitalType;
  value?: string;
  label?: string;
  className?: string;
}

const iconMap = {
  heart: Heart,
  activity: Activity,
  temperature: Thermometer,
  oxygen: Droplets,
  brain: Brain,
  stethoscope: Stethoscope,
};

const VitalIcon = ({ type, value, label, className = '' }: VitalIconProps) => {
  const Icon = iconMap[type];

  return (
    <div 
      className={`
        vital-icon
        flex flex-col items-center gap-2 p-3
        cursor-pointer
        ${className}
      `}
    >
      <div 
        className="relative p-3 rounded-xl"
        style={{
          background: 'hsl(210 25% 12% / 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid hsl(200 30% 40% / 0.2)',
        }}
      >
        <Icon 
          className="w-6 h-6 text-primary transition-all duration-300" 
          strokeWidth={1.5}
        />
        
        {/* Glow effect on icon */}
        <div 
          className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, hsl(180 60% 55% / 0.3), transparent)',
          }}
        />
      </div>
      
      {value && (
        <span className="text-sm font-medium text-foreground tabular-nums">
          {value}
        </span>
      )}
      
      {label && (
        <span className="text-xs text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
};

export default VitalIcon;
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface WaveformVisualizerProps {
  isActive: boolean;
  audioData?: Float32Array | null;
  barCount?: number;
  className?: string;
}

const WaveformVisualizer = ({ 
  isActive, 
  audioData = null,
  barCount = 32,
  className = '' 
}: WaveformVisualizerProps) => {
  const [bars, setBars] = useState<number[]>(Array(barCount).fill(0.1));
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isActive) {
      const animate = () => {
        if (audioData && audioData.length > 0) {
          // Use real audio data
          const step = Math.floor(audioData.length / barCount);
          const newBars = Array(barCount).fill(0).map((_, i) => {
            const start = i * step;
            let sum = 0;
            for (let j = start; j < start + step && j < audioData.length; j++) {
              sum += Math.abs(audioData[j]);
            }
            return Math.min(1, (sum / step) * 3 + 0.1);
          });
          setBars(newBars);
        } else {
          // Simulate audio visualization
          setBars(prev => 
            prev.map(() => {
              const base = 0.15 + Math.random() * 0.7;
              return base;
            })
          );
        }
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animate();
    } else {
      setBars(Array(barCount).fill(0.1));
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, audioData, barCount]);

  return (
    <div className={`flex items-center justify-center gap-[2px] h-16 ${className}`}>
      {bars.map((height, index) => (
        <motion.div
          key={index}
          className="w-1 rounded-full"
          style={{
            background: `linear-gradient(180deg, hsl(180 60% 55%), hsl(200 70% 65%))`,
            boxShadow: isActive ? '0 0 8px hsl(180 60% 55% / 0.5)' : 'none',
          }}
          animate={{
            height: `${height * 100}%`,
            opacity: isActive ? 0.7 + height * 0.3 : 0.3,
          }}
          transition={{
            duration: 0.05,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

export default WaveformVisualizer;
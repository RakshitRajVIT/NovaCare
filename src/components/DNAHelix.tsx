interface DNAHelixProps {
  height?: number;
  className?: string;
}

const DNAHelix = ({ height = 160, className = '' }: DNAHelixProps) => {
  const segments = 8;
  
  return (
    <div 
      className={`relative ${className}`}
      style={{ 
        height: `${height}px`,
        width: '60px',
        perspective: '200px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div 
        className="absolute inset-0 animate-dna-rotate"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {Array.from({ length: segments }).map((_, i) => {
          const yPos = (i / segments) * 100;
          const rotation = (i * 45);
          
          return (
            <div
              key={i}
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                top: `${yPos}%`,
                transform: `rotateY(${rotation}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Left strand */}
              <div 
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: '-20px',
                  background: `hsl(180 60% ${55 + i * 3}%)`,
                  boxShadow: `0 0 10px hsl(180 60% 55% / 0.6)`,
                }}
              />
              
              {/* Connection bar */}
              <div 
                className="absolute h-0.5 w-10"
                style={{
                  left: '-17px',
                  top: '5px',
                  background: `linear-gradient(90deg, 
                    hsl(180 60% 55% / 0.8), 
                    hsl(200 70% 65% / 0.4),
                    hsl(180 60% 55% / 0.8)
                  )`,
                }}
              />
              
              {/* Right strand */}
              <div 
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: '20px',
                  background: `hsl(200 70% ${60 + i * 2}%)`,
                  boxShadow: `0 0 10px hsl(200 70% 65% / 0.6)`,
                }}
              />
            </div>
          );
        })}
      </div>
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full animate-pulse-glow"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(180 60% 55% / 0.1), transparent 70%)',
        }}
      />
    </div>
  );
};

export default DNAHelix;
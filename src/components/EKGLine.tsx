interface EKGLineProps {
  width?: number;
  height?: number;
  className?: string;
}

const EKGLine = ({ width = 200, height = 60, className = '' }: EKGLineProps) => {
  // EKG path coordinates
  const ekgPath = `
    M 0 30
    L 20 30
    L 25 30
    L 30 25
    L 35 35
    L 40 10
    L 45 50
    L 50 30
    L 55 30
    L 70 30
    L 75 30
    L 80 25
    L 85 35
    L 90 10
    L 95 50
    L 100 30
    L 105 30
    L 120 30
    L 125 30
    L 130 25
    L 135 35
    L 140 10
    L 145 50
    L 150 30
    L 200 30
  `;

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      className={className}
    >
      <defs>
        <linearGradient id="ekgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(160 70% 50%)" stopOpacity="0.2" />
          <stop offset="50%" stopColor="hsl(160 70% 50%)" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(180 60% 55%)" stopOpacity="0.2" />
        </linearGradient>
        <filter id="ekgGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background glow line */}
      <path
        d={ekgPath}
        fill="none"
        stroke="hsl(160 80% 60%)"
        strokeWidth="4"
        opacity="0.3"
        filter="url(#ekgGlow)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Main EKG line */}
      <path
        d={ekgPath}
        fill="none"
        stroke="url(#ekgGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ekg-line"
        style={{
          strokeDasharray: '1000',
        }}
      />
    </svg>
  );
};

export default EKGLine;
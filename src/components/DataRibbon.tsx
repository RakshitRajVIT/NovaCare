interface DataRibbonProps {
  className?: string;
  vertical?: boolean;
}

const DataRibbon = ({ className = '', vertical = false }: DataRibbonProps) => {
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{
        width: vertical ? '4px' : '100%',
        height: vertical ? '100%' : '4px',
      }}
    >
      {/* Main ribbon */}
      <div 
        className="absolute inset-0 data-ribbon rounded-full"
        style={{
          background: vertical 
            ? 'linear-gradient(180deg, hsl(180 60% 55%), hsl(200 70% 65%))'
            : 'linear-gradient(90deg, hsl(180 60% 55%), hsl(200 70% 65%))',
        }}
      />
      
      {/* Flowing highlight */}
      <div 
        className="absolute rounded-full"
        style={{
          width: vertical ? '100%' : '30%',
          height: vertical ? '30%' : '100%',
          background: 'hsl(0 0% 100% / 0.5)',
          animation: vertical 
            ? 'ribbon-flow-vertical 2s ease-in-out infinite'
            : 'ribbon-flow-horizontal 2s ease-in-out infinite',
        }}
      />
      
      <style>{`
        @keyframes ribbon-flow-horizontal {
          0%, 100% {
            left: -30%;
            opacity: 0;
          }
          50% {
            left: 100%;
            opacity: 1;
          }
        }
        
        @keyframes ribbon-flow-vertical {
          0%, 100% {
            top: -30%;
            opacity: 0;
          }
          50% {
            top: 100%;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default DataRibbon;
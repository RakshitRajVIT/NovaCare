import novaCareBg from '@/assets/nova-care-bg.jpg';

const AmbientBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${novaCareBg})`,
          filter: 'brightness(0.4) saturate(1.2)',
        }}
      />
      
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 30%, hsl(180 60% 55% / 0.08), transparent 60%),
            radial-gradient(ellipse at 20% 80%, hsl(200 70% 65% / 0.06), transparent 50%),
            radial-gradient(ellipse at 80% 70%, hsl(185 75% 50% / 0.05), transparent 50%),
            linear-gradient(180deg, hsl(220 30% 6% / 0.3), hsl(220 30% 6% / 0.9))
          `,
        }}
      />

      {/* Floating ambient particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `hsl(${175 + Math.random() * 30} 60% 55% / ${0.1 + Math.random() * 0.3})`,
            animation: `particle-float ${6 + Math.random() * 8}s ease-in-out infinite`,
            animationDelay: `${-Math.random() * 8}s`,
          }}
        />
      ))}

      {/* Volumetric light beams */}
      <div 
        className="absolute top-0 left-1/4 w-96 h-full"
        style={{
          background: 'linear-gradient(180deg, hsl(180 70% 70% / 0.03), transparent 60%)',
          transform: 'rotate(-15deg)',
          transformOrigin: 'top center',
        }}
      />
      <div 
        className="absolute top-0 right-1/3 w-64 h-full"
        style={{
          background: 'linear-gradient(180deg, hsl(200 60% 60% / 0.02), transparent 50%)',
          transform: 'rotate(10deg)',
          transformOrigin: 'top center',
        }}
      />
    </div>
  );
};

export default AmbientBackground;
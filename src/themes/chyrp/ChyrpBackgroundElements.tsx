import React from 'react';

export const ChyrpBackgroundElements: React.FC = () => {
  return (
    <>
      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary Orb */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse opacity-30" />
        
        {/* Secondary Orb */}
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-br from-accent/8 to-primary/8 rounded-full blur-3xl animate-pulse opacity-20" 
             style={{ animationDelay: '2s' }} />
        
        {/* Tertiary Orb */}
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-br from-primary/6 to-accent/6 rounded-full blur-3xl animate-pulse opacity-15" 
             style={{ animationDelay: '4s' }} />
      </div>

      {/* Geometric Shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating Triangles */}
        <div className="absolute top-20 left-20 w-8 h-8 border-l-2 border-t-2 border-primary/20 rotate-45 animate-float" 
             style={{ animationDelay: '1s' }} />
        <div className="absolute top-40 right-32 w-6 h-6 border-r-2 border-b-2 border-accent/20 rotate-45 animate-float" 
             style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-32 left-1/3 w-4 h-4 border-l-2 border-b-2 border-primary/15 rotate-45 animate-float" 
             style={{ animationDelay: '5s' }} />
        
        {/* Floating Circles */}
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-accent/20 rounded-full animate-float" 
             style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-primary/15 rounded-full animate-float" 
             style={{ animationDelay: '4s' }} />
        <div className="absolute top-2/3 left-1/4 w-4 h-4 bg-accent/10 rounded-full animate-float" 
             style={{ animationDelay: '6s' }} />
      </div>

      {/* Gradient Lines */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-accent/10 to-transparent" />
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/5 to-transparent" />
      </div>

      {/* Particle Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>
    </>
  );
};

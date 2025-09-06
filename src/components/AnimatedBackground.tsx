import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles: Particle[] = [];
    const particleCount = 50;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: `hsl(${Math.random() * 60 + 40}, 70%, 60%)`
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();

        // Draw connections
        particles.forEach((otherParticle, otherIndex) => {
          if (index === otherIndex) return;

          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = (100 - distance) / 100 * 0.1;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export const FloatingShapes = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating circles */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-brand-accent/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-brand-secondary/15 rounded-full blur-lg animate-float" style={{animationDelay: '4s'}}></div>
      
      {/* Floating squares */}
      <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-brand-primary/10 rotate-45 animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-1/3 left-1/3 w-8 h-8 bg-brand-accent/15 rotate-12 animate-float" style={{animationDelay: '3s'}}></div>
      
      {/* Floating triangles */}
      <div className="absolute top-1/4 right-1/3 w-0 h-0 border-l-[20px] border-l-transparent border-b-[35px] border-b-brand-secondary/10 border-r-[20px] border-r-transparent animate-float" style={{animationDelay: '5s'}}></div>
      
      {/* Gradient orbs */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-brand-accent/20 to-brand-secondary/20 rounded-full blur-3xl animate-pulse-soft"></div>
      <div className="absolute bottom-10 left-10 w-60 h-60 bg-gradient-to-tr from-brand-primary/10 to-brand-accent/10 rounded-full blur-3xl animate-pulse-soft" style={{animationDelay: '2s'}}></div>
    </div>
  );
};

export const GradientMesh = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-accent/5 animate-gradient-xy"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-brand-secondary/5 via-transparent to-brand-primary/5 animate-gradient-xy" style={{animationDelay: '5s'}}></div>
    </div>
  );
};

export const AnimatedGrid = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gradient-x 20s ease infinite'
        }}
      />
    </div>
  );
};

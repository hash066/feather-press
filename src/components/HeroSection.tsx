import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Star, Zap, Heart, Play, ChevronDown, FileText, Image, Video } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import { AnimatedBackground, FloatingShapes, GradientMesh } from "./AnimatedBackground";
import { useScrollAnimation, useMousePosition } from "@/hooks/useScrollAnimation";
import { useEffect, useState } from "react";

export const HeroSection = () => {
  const { elementRef, isVisible } = useScrollAnimation(0.1);
  const mousePosition = useMousePosition();
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = (clientX - innerWidth / 2) / innerWidth;
      const y = (clientY - innerHeight / 2) / innerHeight;
      
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      ref={elementRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Enhanced Background Elements */}
      <AnimatedBackground />
      <FloatingShapes />
      <GradientMesh />
      
      {/* Improved Background Image with Better Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          transform: `translate(${mouseOffset.x * 15}px, ${mouseOffset.y * 15}px) scale(1.05)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/95 via-brand-primary/90 to-brand-secondary/95"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-brand-primary/20 to-brand-primary/40"></div>
      </div>
      
      {/* Enhanced Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/10 via-transparent to-brand-secondary/10 animate-gradient-xy"></div>
      
      {/* Improved Content Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          
          {/* Left Content Column */}
          <div className="text-left space-y-8">
            {/* Enhanced Badge */}
            <div className={`inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 transition-all duration-1000 ${isVisible ? 'animate-bounce-in' : 'opacity-0 scale-95'}`}>
              <div className="flex space-x-1">
                <Sparkles className="w-4 h-4 text-brand-accent animate-glow" />
                <Star className="w-4 h-4 text-brand-accent animate-glow" style={{animationDelay: '0.3s'}} />
                <Zap className="w-4 h-4 text-brand-accent animate-glow" style={{animationDelay: '0.6s'}} />
              </div>
              <span className="text-white/95 text-sm font-medium">Ultimate Publishing Platform</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse-soft" />
            </div>
            
            {/* Enhanced Main Title */}
            <div className={`space-y-4 transition-all duration-1000 delay-200 ${isVisible ? 'animate-slide-in-left' : 'opacity-0 -translate-x-10'}`}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-tight">
                <span className="text-reveal block">Feather</span>
                <span className="text-reveal block" style={{animationDelay: '0.5s'}}>Press</span>
              </h1>
              
              {/* Enhanced Subtitle */}
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed">
                The most elegant and powerful blogging platform for creators, writers, and content teams. 
                <span className="text-brand-accent font-semibold block mt-2"> Beautiful by design, extensible by nature.</span>
              </p>
            </div>
            
            {/* Enhanced CTA Buttons */}
            <div className={`flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 transition-all duration-1000 delay-400 ${isVisible ? 'animate-slide-in-left' : 'opacity-0 -translate-x-10'}`}>
              <Button 
                variant="accent" 
                size="lg" 
                className="text-lg px-8 py-4 h-auto btn-enhanced glow-border group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Start Creating
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-accent to-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4 h-auto glass-effect border-white/30 text-white hover:bg-white/20 magnetic-hover group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </Button>
            </div>
            
            {/* Enhanced Features List */}
            <div className={`grid grid-cols-3 gap-6 pt-8 transition-all duration-1000 delay-600 ${isVisible ? 'animate-slide-in-left' : 'opacity-0 -translate-x-10'}`}>
              <div className="glass-effect rounded-xl p-4 text-center group hover:scale-105 transition-all duration-300">
                <div className="w-10 h-10 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-accent/30 transition-colors duration-300">
                  <Zap className="w-5 h-5 text-brand-accent" />
                </div>
                <p className="text-white/80 text-sm font-medium">Lightning Fast</p>
              </div>
              <div className="glass-effect rounded-xl p-4 text-center group hover:scale-105 transition-all duration-300">
                <div className="w-10 h-10 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-accent/30 transition-colors duration-300">
                  <Sparkles className="w-5 h-5 text-brand-accent" />
                </div>
                <p className="text-white/80 text-sm font-medium">Beautiful Design</p>
              </div>
              <div className="glass-effect rounded-xl p-4 text-center group hover:scale-105 transition-all duration-300">
                <div className="w-10 h-10 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-accent/30 transition-colors duration-300">
                  <Star className="w-5 h-5 text-brand-accent" />
                </div>
                <p className="text-white/80 text-sm font-medium">Open Source</p>
              </div>
            </div>
            
            {/* Enhanced Footer Text */}
            <div className={`text-white/70 text-sm transition-all duration-1000 delay-800 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  No credit card required
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  Setup in 2 minutes
                </span>
                <span className="flex items-center text-brand-accent font-medium">
                  <div className="w-2 h-2 bg-brand-accent rounded-full mr-2 animate-pulse" style={{animationDelay: '1s'}}></div>
                  Open Source
                </span>
              </div>
            </div>
          </div>
          
          {/* Right Visual Column */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'animate-slide-in-right' : 'opacity-0 translate-x-10'}`}>
            {/* Main Visual Element */}
            <div className="relative">
              {/* Abstract Shape */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/30 to-brand-secondary/20 rounded-3xl blur-3xl animate-pulse-soft"></div>
              
              {/* Enhanced Abstract Graphic */}
              <div className="relative bg-gradient-to-br from-brand-accent/20 to-brand-accent/10 backdrop-blur-sm rounded-3xl p-12 border border-brand-accent/20 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/10 to-transparent rounded-3xl"></div>
                
                {/* Floating Elements Inside */}
                <div className="relative z-10 space-y-8">
                  <div className="flex justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 animate-float">
                      <FileText className="w-12 h-12 text-white/80" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-secondary/30 to-brand-secondary/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-brand-secondary/20 animate-float" style={{animationDelay: '1s'}}>
                      <Image className="w-8 h-8 text-white/80" />
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-primary/30 to-brand-primary/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-brand-primary/20 animate-float" style={{animationDelay: '2s'}}>
                      <Video className="w-8 h-8 text-white/80" />
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-brand-accent/40 to-brand-accent/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-brand-accent/30 animate-float" style={{animationDelay: '3s'}}>
                      <Sparkles className="w-10 h-10 text-white/90" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-brand-accent/20 rounded-full blur-xl animate-float"></div>
            <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-brand-secondary/20 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 -right-4 w-8 h-8 bg-white/10 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Mouse-following Light Effect */}
      <div 
        className="absolute w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none transition-all duration-500 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transform: `translate(${mouseOffset.x * 30}px, ${mouseOffset.y * 30}px)`
        }}
      />
      
      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-white/60 text-sm font-medium">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-brand-accent/20 rounded-full blur-xl animate-float pulse-glow"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-brand-secondary/15 rounded-full blur-lg animate-float" style={{animationDelay: '4s'}}></div>
    </section>
  );
};
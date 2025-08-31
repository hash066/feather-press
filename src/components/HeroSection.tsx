import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden floating-bg">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 animated-gradient opacity-20"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 hero-gradient opacity-85"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="flex items-center justify-center mb-6 animate-scale-in">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
            <Sparkles className="w-4 h-4 text-brand-accent animate-glow" />
            <span className="text-white/90 text-sm font-medium">Ultimate Publishing Platform</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
          Feather Press
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          The most elegant and powerful blogging platform for creators, writers, and content teams. 
          Beautiful by design, extensible by nature.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Button variant="accent" size="lg" className="text-lg px-8 py-4 h-auto">
            Start Creating
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
            View Demo
          </Button>
        </div>
        
        <div className="mt-12 text-white/70 text-sm">
          No credit card required • Setup in 2 minutes • Open Source
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-brand-accent/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-brand-secondary/15 rounded-full blur-lg animate-float" style={{animationDelay: '4s'}}></div>
    </section>
  );
};
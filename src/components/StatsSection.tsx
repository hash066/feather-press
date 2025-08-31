import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountUp } from "@/hooks/useCountUp";
import { FloatingShapes, GradientMesh } from "./AnimatedBackground";
import { TrendingUp, Users, Globe, Zap } from "lucide-react";

const stats = [
  {
    number: 50000,
    label: "Active Users",
    icon: Users,
    color: "from-blue-400 to-indigo-500",
    delay: 0,
    suffix: "+"
  },
  {
    number: 99.9,
    label: "Uptime",
    icon: Zap,
    color: "from-green-400 to-teal-500",
    delay: 0.2,
    suffix: "%"
  },
  {
    number: 150,
    label: "Countries",
    icon: Globe,
    color: "from-purple-400 to-pink-500",
    delay: 0.4,
    suffix: "+"
  },
  {
    number: 2000000,
    label: "Posts Created",
    icon: TrendingUp,
    color: "from-orange-400 to-red-500",
    delay: 0.6,
    suffix: "+"
  }
];

const StatCard = ({ stat }: { stat: typeof stats[0] }) => {
  const { elementRef, displayValue, isVisible } = useCountUp({
    end: stat.number,
    duration: 2000,
    delay: stat.delay * 1000,
    suffix: stat.suffix
  });

  return (
    <div className="text-center">
      <div className="group relative">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl">
          <div className={`bg-gradient-to-r ${stat.color} h-full w-full rounded-2xl`}></div>
        </div>
        
        {/* Card Content */}
        <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 group-hover:scale-105">
          {/* Icon */}
          <div className="flex items-center justify-center mb-6">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-all duration-500 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-all duration-500"></div>
              <stat.icon className="w-8 h-8 text-white relative z-10 group-hover:rotate-12 transition-transform duration-500" />
            </div>
          </div>
          
          {/* Number with Counter Animation */}
          <div 
            ref={elementRef}
            className="text-4xl md:text-5xl font-bold text-white mb-4 group-hover:text-brand-accent transition-colors duration-300"
          >
            {isVisible ? displayValue : '0'}
          </div>
          
          {/* Label */}
          <div className="text-white/80 font-medium group-hover:text-white transition-colors duration-300">
            {stat.label}
          </div>
          
          {/* Hover Indicator */}
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            <div className={`w-full h-1 bg-gradient-to-r ${stat.color} rounded-full`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StatsSection = () => {
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  return (
    <section ref={elementRef} className="py-24 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <FloatingShapes />
      <GradientMesh />
      
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 via-brand-accent/10 to-brand-secondary/20 animate-gradient-xy"></div>
      
      {/* Particle Effect */}
      <div className="absolute inset-0 particle-bg"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'animate-slide-in-up' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <TrendingUp className="w-4 h-4 text-brand-accent animate-pulse-soft" />
            <span className="text-white font-medium text-sm">Platform Statistics</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
            Trusted by Creators Worldwide
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Join thousands of creators who trust Feather Press to power their content platforms.
          </p>
        </div>
        
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`transition-all duration-1000 ${isVisible ? 'animate-slide-in-up' : 'opacity-0 translate-y-10'}`}
              style={{ animationDelay: `${stat.delay}s` }}
            >
              <StatCard stat={stat} />
            </div>
          ))}
        </div>
        
        {/* Enhanced CTA Section */}
        <div className={`text-center transition-all duration-1000 delay-1000 ${isVisible ? 'animate-slide-in-up' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="btn-enhanced glow-border group bg-gradient-to-r from-brand-accent to-brand-secondary text-white px-10 py-5 rounded-xl text-lg font-medium relative overflow-hidden">
              <span className="relative z-10">Join the Community</span>
              <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse-soft"></div>
            </button>
            <button className="magnetic-hover px-10 py-5 rounded-xl text-lg font-medium border-2 border-white/30 text-white hover:bg-white hover:text-brand-primary transition-all duration-300">
              View Success Stories
            </button>
          </div>
          
          {/* Additional Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-12 h-12 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-brand-accent" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">500ms</div>
              <div className="text-white/70">Average Load Time</div>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-brand-accent" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/70">Customer Support</div>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-6 h-6 text-brand-accent" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">50+</div>
              <div className="text-white/70">Languages Supported</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-brand-accent/20 rounded-full blur-xl animate-float pulse-glow"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-brand-secondary/15 rounded-full blur-lg animate-float" style={{animationDelay: '4s'}}></div>
    </section>
  );
};
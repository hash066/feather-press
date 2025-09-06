import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Zap, 
  Shield, 
  Palette, 
  BarChart3, 
  Users, 
  Globe,
  Smartphone,
  Search
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FloatingShapes, GradientMesh } from "./AnimatedBackground";

const features = [
  {
    title: "Lightning Fast",
    description: "Optimized performance with caching, CDN, and modern web technologies",
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
    delay: 0
  },
  {
    title: "Secure by Default",
    description: "Enterprise-grade security with role-based access and data protection",
    icon: Shield,
    color: "from-green-400 to-blue-500",
    delay: 0.1
  },
  {
    title: "Fully Customizable",
    description: "Themes, plugins, and extensions to match your brand perfectly",
    icon: Palette,
    color: "from-purple-400 to-pink-500",
    delay: 0.2
  },
  {
    title: "Analytics & Insights",
    description: "Detailed analytics to understand your audience and content performance",
    icon: BarChart3,
    color: "from-blue-400 to-indigo-500",
    delay: 0.3
  },
  {
    title: "Community Features",
    description: "Comments, reactions, and social features to engage your audience",
    icon: Users,
    color: "from-indigo-400 to-purple-500",
    delay: 0.4
  },
  {
    title: "SEO Optimized",
    description: "Built-in SEO tools, sitemaps, and search engine optimization",
    icon: Search,
    color: "from-pink-400 to-red-500",
    delay: 0.5
  },
  {
    title: "Mobile Ready",
    description: "Responsive design that looks perfect on any device",
    icon: Smartphone,
    color: "from-red-400 to-orange-500",
    delay: 0.6
  },
  {
    title: "Global Ready",
    description: "Multi-language support and international content management",
    icon: Globe,
    color: "from-orange-400 to-yellow-500",
    delay: 0.7
  },
];

export const FeaturesSection = () => {
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  return (
    <section ref={elementRef} className="py-24 bg-background relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <FloatingShapes />
      <GradientMesh />
      <div className="absolute inset-0 morphing-bg"></div>
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-5">
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
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'animate-slide-in-up' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center space-x-2 bg-brand-accent/10 px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4 text-brand-accent animate-pulse-soft" />
            <span className="text-brand-accent font-medium text-sm">Features</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-content-primary mb-6">
            Built for Modern Publishing
          </h2>
          <p className="text-xl text-content-secondary max-w-4xl mx-auto leading-relaxed">
            Everything you need to create, manage, and grow your content platform. 
            From individual bloggers to enterprise teams.
          </p>
        </div>
        
        {/* Enhanced Features Grid */}
        <div className="content-grid mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`transition-all duration-1000 ${isVisible ? 'animate-slide-in-up' : 'opacity-0 translate-y-10'}`}
              style={{ animationDelay: `${feature.delay}s` }}
            >
              <Card className="card-gradient shadow-soft hover:shadow-strong transition-all duration-500 group card-hover border-0 overflow-hidden relative">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg p-[1px]">
                  <div className={`bg-gradient-to-r ${feature.color} h-full w-full rounded-lg`}></div>
                </div>
                
                {/* Card Content */}
                <div className="relative bg-card rounded-lg p-6 h-full">
                  <CardHeader className="text-center pb-4 border-0">
                    {/* Enhanced Icon Container */}
                    <div className="mx-auto w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center group-hover:scale-110 transition-all duration-500 relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                      <feature.icon className="w-8 h-8 text-brand-primary group-hover:text-brand-accent transition-colors duration-500 relative z-10" />
                    </div>
                    
                    {/* Enhanced Title */}
                    <CardTitle className="text-xl text-content-primary font-display group-hover:text-brand-primary transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="text-center">
                    <p className="text-content-secondary group-hover:text-content-primary transition-colors duration-300 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Hover Indicator */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-1 bg-gradient-to-r from-brand-primary to-brand-accent rounded-full mx-auto"></div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          ))}
        </div>
        
        {/* Enhanced CTA Section */}
        <div className={`text-center transition-all duration-1000 delay-1000 ${isVisible ? 'animate-slide-in-up' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-10 py-5 h-auto btn-enhanced glow-border group"
            >
              <span className="relative z-10">Explore All Features</span>
              <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse-soft"></div>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-10 py-5 h-auto magnetic-hover"
            >
              View Documentation
            </Button>
          </div>
          
          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-primary mb-2 animate-count-up">99.9%</div>
              <div className="text-content-secondary">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-primary mb-2 animate-count-up">50K+</div>
              <div className="text-content-secondary">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-primary mb-2 animate-count-up">24/7</div>
              <div className="text-content-secondary">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
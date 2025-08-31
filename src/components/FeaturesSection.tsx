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

const features = [
  {
    title: "Lightning Fast",
    description: "Optimized performance with caching, CDN, and modern web technologies",
    icon: Zap,
  },
  {
    title: "Secure by Default",
    description: "Enterprise-grade security with role-based access and data protection",
    icon: Shield,
  },
  {
    title: "Fully Customizable",
    description: "Themes, plugins, and extensions to match your brand perfectly",
    icon: Palette,
  },
  {
    title: "Analytics & Insights",
    description: "Detailed analytics to understand your audience and content performance",
    icon: BarChart3,
  },
  {
    title: "Community Features",
    description: "Comments, reactions, and social features to engage your audience",
    icon: Users,
  },
  {
    title: "SEO Optimized",
    description: "Built-in SEO tools, sitemaps, and search engine optimization",
    icon: Search,
  },
  {
    title: "Mobile Ready",
    description: "Responsive design that looks perfect on any device",
    icon: Smartphone,
  },
  {
    title: "Global Ready",
    description: "Multi-language support and international content management",
    icon: Globe,
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 floating-bg"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-brand-accent/5 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-content-primary mb-4">
            Built for Modern Publishing
          </h2>
          <p className="text-xl text-content-secondary max-w-3xl mx-auto">
            Everything you need to create, manage, and grow your content platform. 
            From individual bloggers to enterprise teams.
          </p>
        </div>
        
        <div className="content-grid mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <Card className="card-gradient shadow-soft hover:shadow-medium transition-all duration-500 group hover-scale">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-12 h-12 mb-4 rounded-full bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary/20 transition-all duration-500 animate-float">
                    <feature.icon className="w-6 h-6 text-brand-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <CardTitle className="text-content-primary font-display group-hover:text-brand-primary transition-colors duration-300">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-content-secondary text-center group-hover:text-content-primary transition-colors duration-300">{feature.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        <div className="text-center animate-fade-in" style={{animationDelay: '1.2s'}}>
          <Button variant="hero" size="lg" className="text-lg px-8 py-4 h-auto hover-scale">
            Explore All Features
          </Button>
        </div>
      </div>
    </section>
  );
};
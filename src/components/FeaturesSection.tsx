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
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
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
            <Card key={index} className="card-gradient shadow-soft hover:shadow-medium transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 mb-4 rounded-full bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-brand-primary" />
                </div>
                <CardTitle className="text-content-primary font-display">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-content-secondary text-center">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="hero" size="lg" className="text-lg px-8 py-4 h-auto">
            Explore All Features
          </Button>
        </div>
      </div>
    </section>
  );
};
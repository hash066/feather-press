import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Eye, Heart } from "lucide-react";

const stats = [
  { label: "Active Users", value: "50,000+", icon: Users, trend: "+12%" },
  { label: "Posts Created", value: "2.5M", icon: TrendingUp, trend: "+28%" },
  { label: "Monthly Views", value: "45M", icon: Eye, trend: "+15%" },
  { label: "Engagement Rate", value: "92%", icon: Heart, trend: "+8%" },
];

export const StatsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 animated-gradient opacity-90"></div>
      <div className="absolute top-10 left-1/4 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-10 right-1/4 w-32 h-32 bg-brand-accent/20 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Trusted by Creators Worldwide
          </h2>
          <p className="text-white/90 text-lg">
            Join thousands of content creators who've made Feather Press their home
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center hover:bg-white/20 transition-all duration-500 hover-scale">
                <CardHeader className="pb-2">
                  <div className="mx-auto w-8 h-8 mb-2 rounded-full bg-white/20 flex items-center justify-center animate-float">
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-white">{stat.value}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-white/80 text-sm mb-1">{stat.label}</p>
                  <div className="text-brand-accent text-xs font-medium">{stat.trend} this month</div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
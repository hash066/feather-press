import { ContentTypeCard } from "./ContentTypeCard";
import { InteractiveContentCard } from "./InteractiveContentCard";
import { 
  FileText, 
  Image, 
  Quote, 
  ExternalLink, 
  Video, 
  Music, 
  Upload,
  Code,
  Calendar
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FloatingShapes, GradientMesh } from "./AnimatedBackground";

const contentTypes = [
  {
    title: "Blog Post",
    description: "Rich text articles with markdown support and media embeds",
    icon: FileText,
    color: "from-blue-400 to-indigo-500",
    delay: 0
  },
  {
    title: "Photo Gallery",
    description: "Beautiful image galleries with captions and metadata",
    icon: Image,
    color: "from-purple-400 to-pink-500",
    delay: 0.1
  },
  {
    title: "Quote",
    description: "Inspirational quotes with elegant typography",
    icon: Quote,
    color: "from-yellow-400 to-orange-500",
    delay: 0.2
  },
  {
    title: "Link Share",
    description: "Rich link previews with automatic metadata extraction",
    icon: ExternalLink,
    color: "from-green-400 to-teal-500",
    delay: 0.3
  },
  {
    title: "Video Post",
    description: "Video content with custom players and transcripts",
    icon: Video,
    color: "from-red-400 to-pink-500",
    delay: 0.4
  },
  {
    title: "Audio Post",
    description: "Podcasts and audio content with waveform visualization",
    icon: Music,
    color: "from-indigo-400 to-purple-500",
    delay: 0.5
  },
  {
    title: "File Upload",
    description: "Document sharing with preview and download options",
    icon: Upload,
    color: "from-teal-400 to-cyan-500",
    delay: 0.6
  },
  {
    title: "Code Snippet",
    description: "Syntax-highlighted code with multiple language support",
    icon: Code,
    color: "from-gray-400 to-slate-500",
    delay: 0.7
  },
  {
    title: "Event",
    description: "Schedule and promote events with RSVP functionality",
    icon: Calendar,
    color: "from-orange-400 to-red-500",
    delay: 0.8
  },
];

export const ContentTypesGrid = () => {
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  return (
    <section ref={elementRef} className="py-24 content-gradient relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <FloatingShapes />
      <GradientMesh />
      <div className="absolute inset-0 morphing-bg opacity-30"></div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'gradient-y 25s ease infinite'
          }}
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'animate-slide-in-up' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center space-x-2 bg-brand-accent/10 px-4 py-2 rounded-full mb-6">
            <FileText className="w-4 h-4 text-brand-accent animate-pulse-soft" />
            <span className="text-brand-accent font-medium text-sm">Content Types</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-content-primary mb-6">
            Every Story, Every Format
          </h2>
          <p className="text-xl text-content-secondary max-w-4xl mx-auto leading-relaxed">
            Choose from our comprehensive content types designed for modern storytelling. 
            Each optimized for engagement and beautiful presentation.
          </p>
        </div>
        
        {/* Enhanced Content Grid */}
        <div className="content-grid mb-20">
          {contentTypes.map((type, index) => (
            <div 
              key={index}
              className={`transition-all duration-1000 ${isVisible ? 'animate-slide-in-up' : 'opacity-0 translate-y-10'}`}
              style={{ animationDelay: `${type.delay}s` }}
            >
              <div className="group relative">
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-xl">
                  <div className={`bg-gradient-to-r ${type.color} h-full w-full rounded-xl`}></div>
                </div>
                
                {/* Card Content */}
                <div className="relative bg-card rounded-xl p-6 h-full border border-border/50 hover:border-transparent transition-all duration-500 shadow-soft hover:shadow-strong group-hover:scale-105">
                  {/* Icon with Enhanced Animation */}
                  <div className="flex items-center justify-center mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center group-hover:scale-110 transition-all duration-500 relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-all duration-500"></div>
                      <type.icon className="w-8 h-8 text-white relative z-10 group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                  </div>
                  
                  {/* Title with Enhanced Typography */}
                  <h3 className="text-xl font-display font-bold text-content-primary mb-4 group-hover:text-brand-primary transition-colors duration-300 text-center">
                    {type.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-content-secondary group-hover:text-content-primary transition-colors duration-300 text-center leading-relaxed">
                    {type.description}
                  </p>
                  
                  {/* Hover Indicator */}
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <div className={`w-full h-1 bg-gradient-to-r ${type.color} rounded-full`}></div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-brand-accent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse-soft"></div>
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-brand-secondary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Enhanced CTA Section */}
        <div className={`text-center transition-all duration-1000 delay-1000 ${isVisible ? 'animate-slide-in-up' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="btn-enhanced glow-border group bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-10 py-5 rounded-xl text-lg font-medium relative overflow-hidden">
              <span className="relative z-10">Start Creating Content</span>
              <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse-soft"></div>
            </button>
            <button className="magnetic-hover px-10 py-5 rounded-xl text-lg font-medium border-2 border-brand-primary/30 text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-300">
              View Examples
            </button>
          </div>
          
          {/* Feature Highlights */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-12 h-12 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-6 h-6 text-brand-accent" />
              </div>
              <div className="text-2xl font-bold text-brand-primary mb-2">9+</div>
              <div className="text-content-secondary">Content Types</div>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Image className="w-6 h-6 text-brand-accent" />
              </div>
              <div className="text-2xl font-bold text-brand-primary mb-2">100%</div>
              <div className="text-content-secondary">Responsive</div>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Code className="w-6 h-6 text-brand-accent" />
              </div>
              <div className="text-2xl font-bold text-brand-primary mb-2">∞</div>
              <div className="text-content-secondary">Customizable</div>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-6 h-6 text-brand-accent" />
              </div>
              <div className="text-2xl font-bold text-brand-primary mb-2">Fast</div>
              <div className="text-content-secondary">Performance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
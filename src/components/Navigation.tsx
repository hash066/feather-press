import { Button } from "@/components/ui/button";
import { PenTool, User, Settings, Search } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="w-full bg-background/95 backdrop-blur-sm border-b border-content-subtle sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <PenTool className="w-8 h-8 text-brand-primary" />
            <h1 className="text-2xl font-display font-semibold text-brand-primary">
              Feather Press
            </h1>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-content-secondary hover:text-content-primary transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-content-secondary hover:text-content-primary transition-colors">
              Posts
            </a>
            <a href="#" className="text-content-secondary hover:text-content-primary transition-colors">
              Media
            </a>
            <a href="#" className="text-content-secondary hover:text-content-primary transition-colors">
              Analytics
            </a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-4 h-4" />
            </Button>
            <Button variant="hero" size="lg">
              New Post
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
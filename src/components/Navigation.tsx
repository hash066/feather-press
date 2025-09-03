import { Button } from "@/components/ui/button";
import { PenTool, User, Settings, Search, Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalSearch } from "@/components/GlobalSearch";

export const Navigation = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`w-full sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg' 
        : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Enhanced Logo */}
          <div 
            className="flex items-center space-x-3 group cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <PenTool className="w-8 h-8 text-gray-800 group-hover:text-yellow-600 transition-colors duration-300 animate-float" />
              <div className="absolute inset-0 w-8 h-8 bg-brand-accent/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-800 group-hover:text-yellow-600 transition-colors duration-300">
              Feather Press
            </h1>
          </div>

          {/* Enhanced Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { name: 'Home', href: '/' },
              { name: 'Blog', href: '/blog' },
              { name: 'Quotes', href: '/quotes' },
              { name: 'Gallery', href: '/gallery' },
              { name: 'Videos', href: '/videos' },
              { name: 'About', href: '/about' },
              { name: 'Contact', href: '/contact' }
            ].map((item, index) => (
              <a 
                key={item.name}
                href={item.href} 
                className="relative text-gray-600 hover:text-gray-800 transition-colors duration-300 font-medium group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.name}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></div>
              </a>
            ))}
          </div>

          {/* Enhanced Right Actions */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            {/* Search Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative group hover:bg-yellow-100 transition-all duration-300"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-4 h-4 group-hover:text-yellow-600 transition-colors duration-300" />
              <div className="absolute inset-0 bg-yellow-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </Button>
            
            {/* Settings Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative group hover:bg-yellow-100 transition-all duration-300"
            >
              <Settings className="w-4 h-4 group-hover:text-yellow-600 transition-colors duration-300" />
              <div className="absolute inset-0 bg-yellow-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </Button>
            
            {/* User Info */}
            {user && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 hidden lg:block">
                  Welcome, {user.username}!
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative group hover:bg-red-100 transition-all duration-300"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 group-hover:text-red-600 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-red-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                </Button>
              </div>
            )}
            
            {/* Me Button */}
            <Button 
              variant="default" 
              size="lg" 
              className="relative overflow-hidden group bg-gray-800 hover:bg-gray-900 text-white"
              onClick={() => navigate('/me')}
            >
              <span className="relative z-10 font-medium">Me</span>
            </Button>
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden relative group"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 group-hover:text-yellow-600 transition-colors duration-300" />
              ) : (
                <Menu className="w-5 h-5 group-hover:text-yellow-600 transition-colors duration-300" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Enhanced Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-3 border-t border-gray-200">
            {[
              { name: 'Home', href: '/' },
              { name: 'Blog', href: '/blog' },
              { name: 'Quotes', href: '/quotes' },
              { name: 'Gallery', href: '/gallery' },
              { name: 'Videos', href: '/videos' },
              { name: 'About', href: '/about' },
              { name: 'Contact', href: '/contact' }
            ].map((item, index) => (
              <a 
                key={item.name}
                href={item.href} 
                className="block px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-yellow-50 rounded-lg transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
      
      {/* Enhanced Background Blur */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md -z-10"></div>

      {/* Global Search Dialog */}
      <GlobalSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </nav>
  );
};
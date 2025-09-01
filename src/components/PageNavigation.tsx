import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  PenTool,
  Search,
  Settings,
  User,
  Menu,
  X
} from 'lucide-react';

const PageNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className={`w-full sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg' 
        : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 group cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <PenTool className="w-8 h-8 text-gray-800 group-hover:text-gray-600 transition-colors duration-300" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-gray-800 group-hover:text-gray-600 transition-colors duration-300">
              Feather Press
            </h1>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <a 
                key={item.name}
                href={item.href} 
                className={`relative transition-colors duration-300 font-medium ${
                  isActive(item.href) 
                    ? 'text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gray-800"></div>
                )}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            {/* Search Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative group hover:bg-gray-100 transition-all duration-300"
            >
              <Search className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors duration-300" />
            </Button>
            
            {/* Settings Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative group hover:bg-gray-100 transition-all duration-300"
            >
              <Settings className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors duration-300" />
            </Button>
            
            {/* User Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative group hover:bg-gray-100 transition-all duration-300"
            >
              <User className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors duration-300" />
            </Button>
            
            {/* New Post Button */}
            <Button 
              className="bg-gradient-to-r from-yellow-500 to-green-600 hover:from-yellow-600 hover:to-green-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300"
              onClick={() => navigate('/create-post')}
            >
              New Post
            </Button>
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden relative group"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-300" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-3 border-t border-gray-200">
            {navItems.map((item, index) => (
              <a 
                key={item.name}
                href={item.href} 
                className={`block px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive(item.href)
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
      
      {/* Background Blur */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md -z-10"></div>
    </nav>
  );
};

export default PageNavigation;

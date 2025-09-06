import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PenTool, Menu, X, Settings, User, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "./SettingsContext";
import { SettingsDrawer } from "./SettingsDrawer";
import { GlobalSearch } from "./GlobalSearch";
import { DEFAULT_SETTINGS } from "@/lib/utils";

export const Navigation = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Ensure settings is defined
  const siteSettings = settings || DEFAULT_SETTINGS;

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
    <>
    {/* Settings Drawer */}
    <SettingsDrawer 
      open={settingsOpen} 
      onOpenChange={setSettingsOpen} 
      onSignOut={handleLogout}
    />
    <nav className={`w-full sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg' 
        : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Hamburger + Logo */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-gray-100"
              onClick={() => setSettingsOpen(true)}
              title="Open settings"
            >
              <Menu className="w-5 h-5 text-black" />
            </Button>
            <div 
              className="flex items-center space-x-3 group cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="relative">
                <PenTool className="w-8 h-8 text-gray-800 group-hover:text-yellow-600 transition-colors duration-300 animate-float" />
                <div className="absolute inset-0 w-8 h-8 bg-brand-accent/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-800 group-hover:text-yellow-600 transition-colors duration-300">
                {siteSettings.title}
              </h1>
            </div>
          </div>

          {/* Center Navigation */}
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

          {/* Right Actions */}
          <div className="flex items-center space-x-3 lg:space-x-4">

            
            {/* Settings Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative group hover:bg-gray-100"
              onClick={() => setSettingsOpen(true)}
              title="Open settings"
            >
              <Settings className="w-5 h-5 text-black" />
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 flex items-center gap-2 hover:bg-gray-100">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} alt={user.username} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {user.displayName ? user.displayName[0].toUpperCase() : user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user.displayName || user.username}
                      </p>
                      {user.email && (
                        <p className="text-xs text-gray-500 truncate max-w-[120px]">{user.email}</p>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.displayName || user.username}</p>
                    {user.email && (
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/me')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile & Posts</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSettingsOpen(true)} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="default" 
                size="lg" 
                className="relative overflow-hidden group bg-gray-800 hover:bg-gray-900 text-white"
                onClick={() => navigate('/login')}
              >
                <span className="relative z-10 font-medium">Sign In</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden relative group"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-black group-hover:text-yellow-600 transition-colors duration-300" />
              ) : (
                <Menu className="w-5 h-5 text-black group-hover:text-yellow-600 transition-colors duration-300" />
              )}
            </Button>
          </div>
        </div>
        {/* Mobile Menu */}
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
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md -z-10"></div>

      {/* Global Search Dialog */}
      <GlobalSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </nav>
    <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} onSignOut={handleLogout} />
    </>
  );
};
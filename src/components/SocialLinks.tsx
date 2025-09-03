import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  ExternalLink
} from 'lucide-react';
import { useSettings } from '@/components/SettingsContext';

type SocialLinksProps = {
  variant?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
};

export const SocialLinks: React.FC<SocialLinksProps> = ({ 
  variant = 'horizontal', 
  size = 'md',
  showLabels = false,
  className = '' 
}) => {
  const { settings } = useSettings();

  const socialLinks = [
    {
      name: 'Facebook',
      url: settings.socialFacebook,
      icon: Facebook,
      color: 'text-blue-600 hover:text-blue-700'
    },
    {
      name: 'Twitter',
      url: settings.socialTwitter,
      icon: Twitter,
      color: 'text-sky-500 hover:text-sky-600'
    },
    {
      name: 'Instagram',
      url: settings.socialInstagram,
      icon: Instagram,
      color: 'text-pink-600 hover:text-pink-700'
    },
    {
      name: 'LinkedIn',
      url: settings.socialLinkedIn,
      icon: Linkedin,
      color: 'text-blue-700 hover:text-blue-800'
    },
    {
      name: 'YouTube',
      url: settings.socialYouTube,
      icon: Youtube,
      color: 'text-red-600 hover:text-red-700'
    }
  ].filter(link => link.url && link.url.trim() !== '');

  if (socialLinks.length === 0) {
    return null;
  }

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const containerClasses = variant === 'horizontal' 
    ? 'flex items-center gap-3' 
    : 'flex flex-col gap-2';

  return (
    <div className={`${containerClasses} ${className}`}>
      {socialLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Button
            key={link.name}
            variant="ghost"
            size="sm"
            asChild
            className={`${link.color} transition-colors duration-200 hover:bg-transparent p-2`}
            title={`Visit our ${link.name} page`}
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Icon className={sizeClasses[size]} />
              {showLabels && (
                <span className="text-sm font-medium">{link.name}</span>
              )}
              {!showLabels && (
                <ExternalLink className="w-3 h-3 opacity-50" />
              )}
            </a>
          </Button>
        );
      })}
    </div>
  );
};

export default SocialLinks;

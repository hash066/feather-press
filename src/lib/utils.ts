import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Settings storage helpers
export type ThemeType = 'system' | 'light' | 'dark' | 'colorful' | 'minimal';

export type SiteSettings = {
  // Site Identity
  title: string;
  description: string;
  logoDataUrl?: string;
  faviconDataUrl?: string;
  
  // Appearance
  theme: ThemeType;
  darkModeEnabled: boolean;
  autoDarkMode: boolean; // Follow system preference
  showSidebar: boolean;
  
  // Content & Display
  timezone: string;
  dateFormat: string; // e.g. 'PPpp' or Intl options key
  postsPerPage: number;
  commentsEnabled: boolean;
  
  // Social Media
  socialFacebook?: string;
  socialTwitter?: string;
  socialInstagram?: string;
  socialLinkedIn?: string;
  socialYouTube?: string;
  
  // AI Features
  aiTitleSuggestions: boolean;
  aiContentAssistance: boolean;
  
  // User Preferences (per user, stored separately)
  userPreferences?: {
    emailNotifications: boolean;
    publicProfile: boolean;
    showEmail: boolean;
  };
};

export type UserAccountSettings = {
  username: string;
  email?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  emailNotifications: boolean;
  publicProfile: boolean;
  showEmail: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: string;
  accountCreated?: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  title: 'Feather Press',
  description: 'Your Creative Writing Platform',
  theme: 'system',
  darkModeEnabled: false,
  autoDarkMode: true,
  showSidebar: true,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  dateFormat: 'PP',
  postsPerPage: 6,
  commentsEnabled: true,
  aiTitleSuggestions: true,
  aiContentAssistance: false,
};

export const DEFAULT_USER_SETTINGS: UserAccountSettings = {
  username: '',
  emailNotifications: true,
  publicProfile: true,
  showEmail: false,
  twoFactorEnabled: false,
};

export function loadSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem('site_settings');
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed } as SiteSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: SiteSettings) {
  try {
    localStorage.setItem('site_settings', JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function applyTheme(settings: SiteSettings) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Remove all theme classes
  root.classList.remove('dark', 'light', 'colorful', 'minimal');
  
  let activeTheme = settings.theme;
  
  // Handle auto dark mode
  if (settings.autoDarkMode && settings.theme === 'system') {
    activeTheme = prefersDark ? 'dark' : 'light';
  } else if (settings.darkModeEnabled) {
    activeTheme = 'dark';
  }
  
  // Apply theme class
  if (activeTheme !== 'system') {
    root.classList.add(activeTheme);
  }
  
  // Set CSS custom properties for themes
  applyThemeVariables(activeTheme);
}

function applyThemeVariables(theme: string) {
  const root = document.documentElement;
  
  switch (theme) {
    case 'dark':
      root.style.setProperty('--background', '0 0% 3.9%');
      root.style.setProperty('--foreground', '0 0% 98%');
      root.style.setProperty('--primary', '47.9 95.8% 53.1%'); // Yellow
      break;
    case 'light':
      root.style.setProperty('--background', '0 0% 100%');
      root.style.setProperty('--foreground', '0 0% 3.9%');
      root.style.setProperty('--primary', '47.9 95.8% 53.1%'); // Yellow
      break;
    case 'colorful':
      root.style.setProperty('--background', '340 100% 95%');
      root.style.setProperty('--foreground', '340 10% 5%');
      root.style.setProperty('--primary', '346.8 77.2% 49.8%'); // Pink
      break;
    case 'minimal':
      root.style.setProperty('--background', '0 0% 98%');
      root.style.setProperty('--foreground', '0 0% 15%');
      root.style.setProperty('--primary', '0 0% 25%'); // Gray
      break;
    default:
      // System/default theme
      root.style.setProperty('--background', '0 0% 100%');
      root.style.setProperty('--foreground', '0 0% 3.9%');
      root.style.setProperty('--primary', '47.9 95.8% 53.1%'); // Yellow
  }
}

export function applyFavicon(dataUrl?: string) {
  try {
    if (!dataUrl) return;
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = dataUrl;
  } catch {}
}

export function formatDateWithSettings(dateIso: string, settings: SiteSettings): string {
  try {
    const dtf = new Intl.DateTimeFormat(undefined, {
      timeZone: settings.timezone,
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
    return dtf.format(new Date(dateIso));
  } catch {
    return new Date(dateIso).toLocaleString();
  }
}
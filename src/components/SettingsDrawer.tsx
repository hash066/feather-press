import React, { useState } from 'react';
import { useSettings } from '@/components/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Globe, 
  Palette, 
  User, 
  Share2, 
  Sparkles, 
  Settings2,
  Sun,
  Moon,
  Monitor,
  Upload,
  LogOut,
  Save,
  RotateCcw
} from 'lucide-react';
import AccountSettings from '@/components/AccountSettings';
import { ThemeType } from '@/lib/utils';

type SettingsDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignOut: () => void;
};

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ open, onOpenChange, onSignOut }) => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('site');
  
  // Site Settings
  const [localTitle, setLocalTitle] = useState(settings.title);
  const [localDescription, setLocalDescription] = useState(settings.description);
  const [timezone, setTimezone] = useState(settings.timezone);
  const [dateFormat, setDateFormat] = useState(settings.dateFormat);
  const [postsPerPage, setPostsPerPage] = useState(settings.postsPerPage);
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>(settings.logoDataUrl);
  const [faviconDataUrl, setFaviconDataUrl] = useState<string | undefined>(settings.faviconDataUrl);
  
  // Appearance Settings
  const [theme, setTheme] = useState(settings.theme);
  const [darkModeEnabled, setDarkModeEnabled] = useState(settings.darkModeEnabled);
  const [autoDarkMode, setAutoDarkMode] = useState(settings.autoDarkMode);
  const [showSidebar, setShowSidebar] = useState(settings.showSidebar);
  
  // Content Settings
  const [commentsEnabled, setCommentsEnabled] = useState(settings.commentsEnabled);
  
  // Social Media
  const [facebook, setFacebook] = useState(settings.socialFacebook || '');
  const [twitter, setTwitter] = useState(settings.socialTwitter || '');
  const [instagram, setInstagram] = useState(settings.socialInstagram || '');
  const [linkedIn, setLinkedIn] = useState(settings.socialLinkedIn || '');
  const [youTube, setYouTube] = useState(settings.socialYouTube || '');
  
  // AI Features
  const [aiTitles, setAiTitles] = useState(settings.aiTitleSuggestions);
  const [aiContentAssistance, setAiContentAssistance] = useState(settings.aiContentAssistance);

  const saveAll = () => {
    updateSettings({ 
      title: localTitle, 
      description: localDescription, 
      theme, 
      darkModeEnabled,
      autoDarkMode,
      showSidebar,
      timezone,
      dateFormat,
      postsPerPage,
      commentsEnabled,
      socialFacebook: facebook,
      socialTwitter: twitter,
      socialInstagram: instagram,
      socialLinkedIn: linkedIn,
      socialYouTube: youTube,
      aiTitleSuggestions: aiTitles,
      aiContentAssistance,
      logoDataUrl,
      faviconDataUrl,
    });
  };

  const onFileToDataUrl = (file: File, cb: (url:string)=>void) => {
    const reader = new FileReader();
    reader.onload = () => cb(String(reader.result));
    reader.readAsDataURL(file);
  };

  const themeOptions: { value: ThemeType; label: string; icon: any; description: string }[] = [
    { value: 'system', label: 'System', icon: Monitor, description: 'Follow system preference' },
    { value: 'light', label: 'Light', icon: Sun, description: 'Light theme' },
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Dark theme' },
    { value: 'colorful', label: 'Colorful', icon: Palette, description: 'Vibrant colors' },
    { value: 'minimal', label: 'Minimal', icon: Settings2, description: 'Clean and simple' }
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[500px] max-w-[90vw] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Settings2 className="w-5 h-5" />
              Settings
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="px-6 py-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-6">
                  <TabsTrigger value="site" className="text-xs">
                    <Globe className="w-4 h-4 mr-1" />
                    Site
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="text-xs">
                    <Palette className="w-4 h-4 mr-1" />
                    Style
                  </TabsTrigger>
                  <TabsTrigger value="social" className="text-xs">
                    <Share2 className="w-4 h-4 mr-1" />
                    Social
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="text-xs">
                    <Sparkles className="w-4 h-4 mr-1" />
                    AI
                  </TabsTrigger>
                  <TabsTrigger value="account" className="text-xs">
                    <User className="w-4 h-4 mr-1" />
                    User
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="site" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Site Identity</CardTitle>
                      <CardDescription>Configure your site's basic information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="site-title">Site Title</Label>
                        <Input 
                          id="site-title" 
                          value={localTitle} 
                          onChange={(e) => setLocalTitle(e.target.value)}
                          placeholder="Your site name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="site-desc">Description</Label>
                        <Input 
                          id="site-desc" 
                          value={localDescription} 
                          onChange={(e) => setLocalDescription(e.target.value)}
                          placeholder="Brief description of your site"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Branding</CardTitle>
                      <CardDescription>Upload your logo and favicon</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">Site Logo</Label>
                          <div className="mt-2">
                            <Label htmlFor="logo-upload" className="cursor-pointer">
                              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 hover:border-muted-foreground/50 transition-colors">
                                {logoDataUrl ? (
                                  <img src={logoDataUrl} alt="Logo" className="h-12 w-auto mx-auto" />
                                ) : (
                                  <div className="text-center">
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground">Click to upload</p>
                                  </div>
                                )}
                              </div>
                            </Label>
                            <input
                              id="logo-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) onFileToDataUrl(f, setLogoDataUrl);
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm">Favicon</Label>
                          <div className="mt-2">
                            <Label htmlFor="favicon-upload" className="cursor-pointer">
                              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 hover:border-muted-foreground/50 transition-colors">
                                {faviconDataUrl ? (
                                  <img src={faviconDataUrl} alt="Favicon" className="h-8 w-8 mx-auto" />
                                ) : (
                                  <div className="text-center">
                                    <Upload className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground">16x16px</p>
                                  </div>
                                )}
                              </div>
                            </Label>
                            <input
                              id="favicon-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) onFileToDataUrl(f, setFaviconDataUrl);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Content Settings</CardTitle>
                      <CardDescription>Configure how content is displayed</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="tz">Timezone</Label>
                          <Input 
                            id="tz" 
                            value={timezone} 
                            onChange={(e) => setTimezone(e.target.value)}
                            placeholder="UTC"
                          />
                        </div>
                        <div>
                          <Label htmlFor="df">Date Format</Label>
                          <Input 
                            id="df" 
                            value={dateFormat} 
                            onChange={(e) => setDateFormat(e.target.value)}
                            placeholder="PP"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="ppp">Posts per page</Label>
                        <Input 
                          id="ppp" 
                          type="number" 
                          min={1} 
                          max={50} 
                          value={postsPerPage} 
                          onChange={(e) => setPostsPerPage(parseInt(e.target.value || '1'))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Enable Comments</Label>
                          <p className="text-xs text-muted-foreground">Allow users to comment on posts</p>
                        </div>
                        <Switch 
                          checked={commentsEnabled} 
                          onCheckedChange={setCommentsEnabled}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Theme Selection</CardTitle>
                      <CardDescription>Choose from 5 different themes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-3">
                        {themeOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <div
                              key={option.value}
                              className={`p-3 border rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                                theme === option.value 
                                  ? 'border-primary bg-primary/5' 
                                  : 'border-border'
                              }`}
                              onClick={() => setTheme(option.value)}
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">{option.label}</span>
                                    {theme === option.value && (
                                      <Badge variant="secondary" className="text-xs">Active</Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">{option.description}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Dark Mode Options</CardTitle>
                      <CardDescription>Control when dark mode is active</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Dark Mode</Label>
                          <p className="text-xs text-muted-foreground">Force dark theme regardless of system setting</p>
                        </div>
                        <Switch 
                          checked={darkModeEnabled} 
                          onCheckedChange={setDarkModeEnabled}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Auto Dark Mode</Label>
                          <p className="text-xs text-muted-foreground">Follow system dark/light preference</p>
                        </div>
                        <Switch 
                          checked={autoDarkMode} 
                          onCheckedChange={setAutoDarkMode}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Show Sidebar</Label>
                          <p className="text-xs text-muted-foreground">Display the sidebar navigation</p>
                        </div>
                        <Switch 
                          checked={showSidebar} 
                          onCheckedChange={setShowSidebar}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="social" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Social Media Links</CardTitle>
                      <CardDescription>Add links to your social media profiles</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input 
                          id="facebook"
                          value={facebook} 
                          onChange={(e) => setFacebook(e.target.value)} 
                          placeholder="https://facebook.com/yourpage"
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitter">Twitter / X</Label>
                        <Input 
                          id="twitter"
                          value={twitter} 
                          onChange={(e) => setTwitter(e.target.value)} 
                          placeholder="https://x.com/yourhandle"
                        />
                      </div>
                      <div>
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input 
                          id="instagram"
                          value={instagram} 
                          onChange={(e) => setInstagram(e.target.value)} 
                          placeholder="https://instagram.com/yourhandle"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input 
                          id="linkedin"
                          value={linkedIn} 
                          onChange={(e) => setLinkedIn(e.target.value)} 
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>
                      <div>
                        <Label htmlFor="youtube">YouTube</Label>
                        <Input 
                          id="youtube"
                          value={youTube} 
                          onChange={(e) => setYouTube(e.target.value)} 
                          placeholder="https://youtube.com/@yourchannel"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="ai" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Sparkles className="w-4 h-4" />
                        AI Features
                      </CardTitle>
                      <CardDescription>Enable AI-powered writing assistance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">AI Title Suggestions</Label>
                          <p className="text-xs text-muted-foreground">Get AI-generated title ideas when creating posts</p>
                        </div>
                        <Switch 
                          checked={aiTitles} 
                          onCheckedChange={setAiTitles}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">AI Content Assistance</Label>
                          <p className="text-xs text-muted-foreground">Get writing suggestions and improvements</p>
                        </div>
                        <Switch 
                          checked={aiContentAssistance} 
                          onCheckedChange={setAiContentAssistance}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {(aiTitles || aiContentAssistance) && (
                    <Card className="border-primary/20 bg-primary/5">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm font-medium mb-1">AI Features Enabled</p>
                            <p className="text-xs text-muted-foreground">
                              AI assistance will now appear in your post creation workflows to help with 
                              {aiTitles && 'title generation'}
                              {aiTitles && aiContentAssistance && ' and '}
                              {aiContentAssistance && 'content suggestions'}.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="account" className="space-y-6 mt-0">
                  <AccountSettings onSignOut={onSignOut} />
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-t bg-background/80 backdrop-blur-sm">
            <div className="flex gap-2">
              <Button onClick={saveAll} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save All Changes
              </Button>
              <Button variant="outline" onClick={resetSettings}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
            <Button 
              variant="ghost" 
              onClick={onSignOut}
              className="w-full mt-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsDrawer;



import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Code, Download, Upload, Settings } from 'lucide-react';

interface LovableConfig {
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  layout: {
    sidebarWidth: string;
    maxWidth: string;
    spacing: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
  };
}

interface LovableIntegrationProps {
  onConfigChange: (config: LovableConfig) => void;
  currentConfig: LovableConfig;
}

export const LovableIntegration: React.FC<LovableIntegrationProps> = ({
  onConfigChange,
  currentConfig
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<LovableConfig>(currentConfig);

  // Preset themes
  const presetThemes = {
    default: {
      primary: 'hsl(220, 26%, 14%)',
      secondary: 'hsl(220, 13%, 91%)',
      accent: 'hsl(43, 74%, 66%)',
      background: 'hsl(0, 0%, 100%)',
      foreground: 'hsl(220, 26%, 14%)'
    },
    dark: {
      primary: 'hsl(210, 40%, 98%)',
      secondary: 'hsl(217, 32%, 17%)',
      accent: 'hsl(43, 74%, 66%)',
      background: 'hsl(222, 84%, 5%)',
      foreground: 'hsl(210, 40%, 98%)'
    },
    warm: {
      primary: 'hsl(25, 95%, 53%)',
      secondary: 'hsl(48, 96%, 89%)',
      accent: 'hsl(142, 76%, 36%)',
      background: 'hsl(60, 9%, 98%)',
      foreground: 'hsl(20, 14%, 4%)'
    },
    cool: {
      primary: 'hsl(221, 83%, 53%)',
      secondary: 'hsl(210, 40%, 96%)',
      accent: 'hsl(262, 83%, 58%)',
      background: 'hsl(0, 0%, 100%)',
      foreground: 'hsl(222, 84%, 5%)'
    }
  };

  const handleConfigChange = (newConfig: Partial<LovableConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    onConfigChange(updatedConfig);
  };

  const applyPreset = (presetName: keyof typeof presetThemes) => {
    const preset = presetThemes[presetName];
    handleConfigChange({ theme: preset });
  };

  const exportConfig = () => {
    const configString = JSON.stringify(config, null, 2);
    const blob = new Blob([configString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chyrp-theme-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target?.result as string);
          handleConfigChange(importedConfig);
        } catch (error) {
          console.error('Error importing config:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 p-0 shadow-lg"
        aria-label="Open Lovable theme editor"
      >
        <Palette className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Lovable Theme Editor</span>
              <Badge variant="secondary">Beta</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Preset Themes */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Preset Themes</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(presetThemes).map(([name, theme]) => (
                <Button
                  key={name}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(name as keyof typeof presetThemes)}
                  className="justify-start"
                >
                  <div
                    className="w-4 h-4 rounded mr-2"
                    style={{ backgroundColor: theme.primary }}
                  />
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Customization */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Colors</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(config.theme).map(([key, value]) => (
                <div key={key}>
                  <label className="text-xs text-muted-foreground capitalize">
                    {key}
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => handleConfigChange({
                        theme: { ...config.theme, [key]: e.target.value }
                      })}
                      className="w-8 h-8 rounded border"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleConfigChange({
                        theme: { ...config.theme, [key]: e.target.value }
                      })}
                      className="flex-1 text-xs px-2 py-1 border rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Layout Settings */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Layout</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Sidebar Width</label>
                <select
                  value={config.layout.sidebarWidth}
                  onChange={(e) => handleConfigChange({
                    layout: { ...config.layout, sidebarWidth: e.target.value }
                  })}
                  className="w-full text-xs px-2 py-1 border rounded mt-1"
                >
                  <option value="w-64">Small (256px)</option>
                  <option value="w-80">Medium (320px)</option>
                  <option value="w-96">Large (384px)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Max Width</label>
                <select
                  value={config.layout.maxWidth}
                  onChange={(e) => handleConfigChange({
                    layout: { ...config.layout, maxWidth: e.target.value }
                  })}
                  className="w-full text-xs px-2 py-1 border rounded mt-1"
                >
                  <option value="max-w-4xl">Medium</option>
                  <option value="max-w-5xl">Large</option>
                  <option value="max-w-6xl">Extra Large</option>
                  <option value="max-w-7xl">Maximum</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Spacing</label>
                <select
                  value={config.layout.spacing}
                  onChange={(e) => handleConfigChange({
                    layout: { ...config.layout, spacing: e.target.value }
                  })}
                  className="w-full text-xs px-2 py-1 border rounded mt-1"
                >
                  <option value="compact">Compact</option>
                  <option value="normal">Normal</option>
                  <option value="relaxed">Relaxed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Typography</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Font Family</label>
                <select
                  value={config.typography.fontFamily}
                  onChange={(e) => handleConfigChange({
                    typography: { ...config.typography, fontFamily: e.target.value }
                  })}
                  className="w-full text-xs px-2 py-1 border rounded mt-1"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Font Size</label>
                <select
                  value={config.typography.fontSize}
                  onChange={(e) => handleConfigChange({
                    typography: { ...config.typography, fontSize: e.target.value }
                  })}
                  className="w-full text-xs px-2 py-1 border rounded mt-1"
                >
                  <option value="text-sm">Small</option>
                  <option value="text-base">Base</option>
                  <option value="text-lg">Large</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Line Height</label>
                <select
                  value={config.typography.lineHeight}
                  onChange={(e) => handleConfigChange({
                    typography: { ...config.typography, lineHeight: e.target.value }
                  })}
                  className="w-full text-xs px-2 py-1 border rounded mt-1"
                >
                  <option value="leading-tight">Tight</option>
                  <option value="leading-normal">Normal</option>
                  <option value="leading-relaxed">Relaxed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Import/Export */}
          <div className="flex justify-between pt-4 border-t">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportConfig}
                className="flex items-center space-x-1"
              >
                <Download className="h-3 w-3" />
                <span>Export</span>
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={importConfig}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Upload className="h-3 w-3" />
                  <span>Import</span>
                </Button>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Apply Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LovableIntegration;

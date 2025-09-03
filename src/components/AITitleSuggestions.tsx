import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Check,
  Wand2
} from 'lucide-react';
import { useSettings } from '@/components/SettingsContext';

type AITitleSuggestionsProps = {
  content?: string;
  keywords?: string[];
  onSelectTitle: (title: string) => void;
  className?: string;
};

export const AITitleSuggestions: React.FC<AITitleSuggestionsProps> = ({
  content = '',
  keywords = [],
  onSelectTitle,
  className = ''
}) => {
  const { settings } = useSettings();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Mock AI title generation (in a real app, this would call an AI service)
  const generateTitles = async () => {
    if (!settings.aiTitleSuggestions) return;

    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock title generation based on content and keywords
    const titleTemplates = [
      "The Ultimate Guide to {topic}",
      "5 Surprising Facts About {topic}",
      "How {topic} Changed My Life",
      "Why {topic} Matters More Than Ever",
      "The Future of {topic}: What You Need to Know",
      "{topic}: A Beginner's Complete Guide",
      "Mastering {topic} in 2024",
      "The Hidden Secrets of {topic}",
      "{topic} Trends That Will Shape Tomorrow",
      "Everything You Thought You Knew About {topic} is Wrong"
    ];

    const topics = keywords.length > 0 
      ? keywords 
      : extractTopicsFromContent(content);

    const generatedTitles = titleTemplates
      .slice(0, 6)
      .map(template => {
        const topic = topics[Math.floor(Math.random() * topics.length)] || 'Your Topic';
        return template.replace('{topic}', topic);
      });

    setSuggestions(generatedTitles);
    setLoading(false);
  };

  const extractTopicsFromContent = (text: string): string[] => {
    // Simple topic extraction (in a real app, this would use NLP)
    const words = text.toLowerCase().split(/\s+/);
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const topics = words
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .slice(0, 5);
    
    return topics.length > 0 ? topics : ['Technology', 'Life', 'Success', 'Innovation', 'Growth'];
  };

  const copyToClipboard = async (title: string, index: number) => {
    try {
      await navigator.clipboard.writeText(title);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy title:', error);
    }
  };

  if (!settings.aiTitleSuggestions) {
    return null;
  }

  return (
    <Card className={`border-dashed border-2 border-primary/20 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">AI Title Suggestions</h3>
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generateTitles}
            disabled={loading}
            className="text-xs"
          >
            {loading ? (
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3 mr-1" />
            )}
            {loading ? 'Generating...' : 'Generate'}
          </Button>
        </div>

        {suggestions.length === 0 && !loading && (
          <div className="text-center py-6 text-muted-foreground">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Click "Generate" to get AI-powered title suggestions</p>
          </div>
        )}

        {loading && (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-muted rounded-md"></div>
              </div>
            ))}
          </div>
        )}

        {suggestions.length > 0 && !loading && (
          <div className="space-y-2">
            {suggestions.map((title, index) => (
              <div
                key={index}
                className="group flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectTitle(title)}
                  className="flex-1 justify-start text-left h-auto py-2 px-3"
                >
                  <span className="text-sm font-medium">{title}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(title, index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2"
                  title="Copy title"
                >
                  {copiedIndex === index ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            ))}
            
            <div className="pt-2 border-t border-dashed border-muted">
              <p className="text-xs text-muted-foreground text-center">
                💡 Click any title to use it, or use the copy button to save for later
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AITitleSuggestions;

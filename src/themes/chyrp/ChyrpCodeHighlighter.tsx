import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface ChyrpCodeHighlighterProps {
  children: React.ReactNode;
}

export const ChyrpCodeHighlighter: React.FC<ChyrpCodeHighlighterProps> = ({
  children
}) => {
  useEffect(() => {
    // Initialize Prism.js highlighting
    if (typeof window !== 'undefined' && window.Prism) {
      window.Prism.highlightAll();
    }
  }, [children]);

  const copyToClipboard = async (codeElement: HTMLElement) => {
    const text = codeElement.textContent || '';
    try {
      await navigator.clipboard.writeText(text);
      // Show success feedback
      const button = codeElement.parentElement?.querySelector('.copy-button');
      if (button) {
        const originalContent = button.innerHTML;
        button.innerHTML = '<Check className="h-4 w-4" />';
        setTimeout(() => {
          button.innerHTML = originalContent;
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="chyrp-code-highlighter">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === 'pre') {
          const codeElement = child.props.children;
          if (codeElement && typeof codeElement === 'object' && codeElement.type === 'code') {
            const language = codeElement.props.className?.replace('language-', '') || '';
            
            return (
              <div className="relative group">
                <pre className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity copy-button"
                    onClick={() => {
                      const codeEl = child as any;
                      if (codeEl.ref?.current) {
                        copyToClipboard(codeEl.ref.current);
                      }
                    }}
                    aria-label="Copy code"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  {child}
                </pre>
                {language && (
                  <div className="absolute top-2 left-2">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {language}
                    </span>
                  </div>
                )}
              </div>
            );
          }
        }
        return child;
      })}
    </div>
  );
};

export default ChyrpCodeHighlighter;

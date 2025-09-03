import React from 'react';
import { ThemeProvider } from 'next-themes';
import { ChyrpLayout } from './ChyrpLayout';
import { ChyrpLightbox } from './ChyrpLightbox';
import { ChyrpCodeHighlighter } from './ChyrpCodeHighlighter';
import { ChyrpBackgroundElements } from './ChyrpBackgroundElements';

interface ChyrpThemeProps {
  children: React.ReactNode;
  siteTitle?: string;
  siteDescription?: string;
  author?: string;
  posts?: any[];
  categories?: any[];
  tags?: any[];
}

export const ChyrpTheme: React.FC<ChyrpThemeProps> = ({
  children,
  siteTitle = "Chyrp Lite",
  siteDescription = "A modern blog platform",
  author = "Anonymous",
  posts = [],
  categories = [],
  tags = []
}) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="chyrp-theme min-h-screen chyrp-page-bg text-foreground">
        <ChyrpBackgroundElements />
        <ChyrpLayout
          siteTitle={siteTitle}
          siteDescription={siteDescription}
          author={author}
          posts={posts}
          categories={categories}
          tags={tags}
        >
          {children}
        </ChyrpLayout>
        <ChyrpLightbox />
        <ChyrpCodeHighlighter />
      </div>
    </ThemeProvider>
  );
};

export default ChyrpTheme;

import React from 'react';
import { ChyrpHeader } from './ChyrpHeader';
import { ChyrpSidebar } from './ChyrpSidebar';
import { ChyrpFooter } from './ChyrpFooter';

interface ChyrpLayoutProps {
  children: React.ReactNode;
  siteTitle: string;
  siteDescription: string;
  author: string;
  posts: any[];
  categories: any[];
  tags: any[];
}

export const ChyrpLayout: React.FC<ChyrpLayoutProps> = ({
  children,
  siteTitle,
  siteDescription,
  author,
  posts,
  categories,
  tags
}) => {
  return (
    <div className="chyrp-layout flex flex-col min-h-screen">
      <ChyrpHeader 
        siteTitle={siteTitle}
        siteDescription={siteDescription}
      />
      
      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-1 px-4 py-8 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Sidebar */}
        <aside className="hidden lg:block w-80 bg-sidebar-background border-l border-sidebar-border">
          <ChyrpSidebar
            author={author}
            posts={posts}
            categories={categories}
            tags={tags}
          />
        </aside>
      </div>
      
      <ChyrpFooter siteTitle={siteTitle} />
    </div>
  );
};

export default ChyrpLayout;

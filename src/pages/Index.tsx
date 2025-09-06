import React from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { ContentTypesGrid } from '@/components/ContentTypesGrid';
import { FeaturesSection } from '@/components/FeaturesSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <ContentTypesGrid />
      <FeaturesSection />
    </div>
  );
};

export default Index;

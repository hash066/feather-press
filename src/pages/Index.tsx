import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ContentTypesGrid } from "@/components/ContentTypesGrid";
import { FeaturesSection } from "@/components/FeaturesSection";
import { StatsSection } from "@/components/StatsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <StatsSection />
        <ContentTypesGrid />
        <FeaturesSection />
      </main>
    </div>
  );
};

export default Index;

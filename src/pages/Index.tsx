import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <MapPlaceholder />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

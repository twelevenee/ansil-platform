import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { MapDashboard } from "@/components/MapDashboard";
import { AISearchSection } from "@/components/AISearchSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <MapDashboard />
        <AISearchSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

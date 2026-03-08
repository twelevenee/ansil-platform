import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { MapDashboard } from "@/components/MapDashboard";
import { DashboardCharts } from "@/components/DashboardCharts";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <MapDashboard />
        <DashboardCharts />
      </main>
      <Footer />

      {/* Modern chatbot widget */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {isHovered && (
          <div className="animate-in fade-in slide-in-from-right-2 duration-200">
            <div className="rounded-2xl bg-card border border-border shadow-card-hover px-4 py-2.5 backdrop-blur-sm">
              <p className="text-sm font-medium text-foreground whitespace-nowrap">
                {t("fab.help")}
              </p>
            </div>
          </div>
        )}
        
        <button
          onClick={() => navigate("/chat")}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative h-16 w-16 rounded-full bg-gradient-cta shadow-card-hover transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 flex items-center justify-center"
          aria-label={t("fab.help")}
        >
          {/* Pulse animation ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-cta opacity-75 animate-ping" style={{ animationDuration: '2s' }} />
          
          {/* Main button content */}
          <div className="relative flex items-center justify-center">
            <span className="text-3xl group-hover:scale-110 transition-transform duration-300" role="img" aria-label="chat">
              💭
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Index;

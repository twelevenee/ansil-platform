import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { MapDashboard } from "@/components/MapDashboard";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { BarChart3, ArrowRight } from "lucide-react";

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <MapDashboard />

        {/* Analytics Teaser */}
        <section className="mx-auto max-w-5xl px-4 py-12">
          <Link
            to="/analytics"
            className="group flex items-center justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {t("nav.analytics")}
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {t("analytics.subtitle")}
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

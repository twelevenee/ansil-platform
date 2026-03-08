import { Heart, Shield, MapPin, Store } from "lucide-react";
import { useRegionStats } from "@/hooks/usePrograms";
import { useLanguage } from "@/contexts/LanguageContext";
import { totalFacilities } from "@/data/safetyFacilities";

export function HeroSection() {
  const { data } = useRegionStats();
  const { t } = useLanguage();

  const totalPrograms = data?.totalPrograms || 0;
  const totalRegions = data?.stats ? Object.keys(data.stats).length : 0;

  const stats = [
    { icon: Heart, value: "390만+", label: t("hero.stat_women"), color: "text-rose-deep" },
    { icon: Shield, value: `${totalPrograms}+`, label: t("hero.stat_programs"), color: "text-sky-deep" },
    { icon: MapPin, value: `${totalRegions}개`, label: t("hero.stat_regions"), color: "text-lav-deep" },
    { icon: Store, value: `${totalFacilities.toLocaleString()}+`, label: t("safety.total_facilities"), color: "text-coral-deep" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-hero py-16 md:py-24">
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-sky-light/60 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-peach-light/60 blur-3xl" />

      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-3xl font-bold leading-tight text-foreground md:text-4xl">
            {t("hero.title_1")}
            <br />
            {t("hero.title_2")}
          </h1>
          <p className="mb-12 text-base text-muted-foreground md:text-lg">
            {t("hero.subtitle")}
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group rounded-2xl bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover md:p-6"
              >
                <stat.icon className={`mx-auto mb-3 h-7 w-7 ${stat.color}`} />
                <p className={`text-xl font-bold ${stat.color} md:text-2xl`}>
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

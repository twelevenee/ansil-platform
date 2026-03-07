import { Heart, Shield, MapPin } from "lucide-react";
import { useRegionStats } from "@/hooks/usePrograms";

export function HeroSection() {
  const { data } = useRegionStats();

  const totalPrograms = data?.totalPrograms || 0;
  const totalRegions = data?.stats ? Object.keys(data.stats).length : 0;

  const stats = [
    { icon: Heart, value: "390만+", label: "여성 1인가구", color: "text-rose-deep" },
    { icon: Shield, value: `${totalPrograms}+`, label: "전국 지원제도", color: "text-sky-deep" },
    { icon: MapPin, value: `${totalRegions}개`, label: "광역시·도 커버", color: "text-lavender-deep" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-hero py-16 md:py-24">
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-sky-light/60 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-peach-light/60 blur-3xl" />

      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-3xl font-bold leading-tight text-secondary md:text-4xl">
            여성 1인가구 안심지원,
            <br />
            한눈에 보세요
          </h1>
          <p className="mb-12 text-base text-muted-foreground md:text-lg">
            전국 지자체 지원제도를 모아서, AI가 나에게 맞는 걸 찾아드려요
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group rounded-2xl bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
              >
                <stat.icon className={`mx-auto mb-3 h-7 w-7 ${stat.color}`} />
                <p className={`text-2xl font-bold ${stat.color} md:text-3xl`}>
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
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

import { Link } from "react-router-dom";
import { Home, Shield, Heart, Activity, Users, ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNationalCategoryStats } from "@/hooks/usePrograms";

const categoryIcons: Record<string, React.ElementType> = {
  주거안전: Home, 귀가안전: Shield, 생활지원: Heart, 건강: Activity, 커뮤니티: Users,
};

const categoryBarClasses: Record<string, string> = {
  주거안전: "bg-sky-mid",
  귀가안전: "bg-lav-mid",
  생활지원: "bg-rose-mid",
  건강: "bg-coral-mid",
  커뮤니티: "bg-peach-mid",
};

const categoryTextClasses: Record<string, string> = {
  주거안전: "text-sky-deep",
  귀가안전: "text-lav-deep",
  생활지원: "text-rose-deep",
  건강: "text-coral-deep",
  커뮤니티: "text-peach-deep",
};

interface MapSidePanelProps {
  selectedRegion: { name: string; total: number; categories: Record<string, number> } | null;
  regionId: string | null;
}

export function MapSidePanel({ selectedRegion, regionId }: MapSidePanelProps) {
  const { data: nationalCategories } = useNationalCategoryStats();

  if (!selectedRegion) {
    const cats = nationalCategories || {};
    const maxVal = Math.max(...Object.values(cats), 1);

    return (
      <div className="flex h-full flex-col rounded-2xl border bg-card p-4 shadow-card md:p-6">
        <div className="mb-1 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-sky-deep" />
          <h3 className="text-base font-bold text-card-foreground md:text-lg">전국 지원제도 현황</h3>
        </div>
        <p className="mb-4 text-sm text-muted-foreground md:mb-6">카테고리별 지원제도 건수</p>

        <div className="flex flex-1 flex-col justify-center gap-3 md:gap-4">
          {Object.entries(cats).map(([cat, count]) => {
            const Icon = categoryIcons[cat] || Home;
            return (
              <div key={cat} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-card-foreground">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {cat}
                  </span>
                  <span className={`font-semibold ${categoryTextClasses[cat] || "text-rose-deep"}`}>{count}건</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${categoryBarClasses[cat] || "bg-rose-mid"} transition-all duration-700`}
                    style={{ width: `${(count / maxVal) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground md:mt-6">
          지도에서 지역을 클릭하면 상세 정보를 볼 수 있어요
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border bg-card p-4 shadow-card md:p-6">
      <div className="mb-1">
        <p className="text-xs font-medium text-rose-mid">선택된 지역</p>
        <h3 className="text-lg font-bold text-card-foreground md:text-xl">{selectedRegion.name}</h3>
      </div>
      <div className="mb-4 flex items-baseline gap-1 md:mb-5">
        <span className="text-2xl font-bold text-rose-deep md:text-3xl">{selectedRegion.total}</span>
        <span className="text-sm text-muted-foreground">개 지원제도</span>
      </div>

      <div className="flex flex-1 flex-col gap-2 md:gap-3">
        <p className="text-sm font-medium text-muted-foreground">카테고리별 현황</p>
        {Object.entries(selectedRegion.categories).map(([cat, count]) => {
          const Icon = categoryIcons[cat] || Home;
          return (
            <div key={cat} className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5 min-h-[44px]">
              <span className="flex items-center gap-2 text-sm text-card-foreground">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {cat}
              </span>
              <span className={`text-sm font-semibold ${categoryTextClasses[cat] || "text-rose-deep"}`}>{count}건</span>
            </div>
          );
        })}
      </div>

      <Link to={`/region/${encodeURIComponent(selectedRegion.name)}`} className="mt-4 md:mt-5">
        <Button className="w-full gap-2 rounded-xl bg-gradient-cta text-white hover:opacity-90 min-h-[48px]">
          이 지역 전체 보기
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}

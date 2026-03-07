import { Link } from "react-router-dom";
import { Home, Shield, Heart, Activity, Users, ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNationalCategoryStats } from "@/hooks/usePrograms";

const categoryIcons: Record<string, React.ElementType> = {
  주거안전: Home, 귀가안전: Shield, 생활지원: Heart, 건강: Activity, 커뮤니티: Users,
};

const categoryColorClasses: Record<string, string> = {
  주거안전: "bg-primary",
  귀가안전: "bg-secondary",
  생활지원: "bg-accent",
  건강: "bg-success",
  커뮤니티: "bg-muted-foreground",
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
      <div className="flex h-full flex-col rounded-xl border bg-card p-5 shadow-sm md:p-6">
        <div className="mb-1 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-card-foreground">전국 지원제도 현황</h3>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">카테고리별 지원제도 건수</p>

        <div className="flex flex-1 flex-col justify-center gap-4">
          {Object.entries(cats).map(([cat, count]) => {
            const Icon = categoryIcons[cat] || Home;
            return (
              <div key={cat} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-card-foreground">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {cat}
                  </span>
                  <span className="font-semibold text-primary">{count}건</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${categoryColorClasses[cat] || "bg-muted-foreground"} transition-all duration-700`}
                    style={{ width: `${(count / maxVal) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          지도에서 지역을 클릭하면 상세 정보를 볼 수 있어요
        </p>
      </div>
    );
  }

  // Map city name to URL-friendly ID
  const cityToId: Record<string, string> = {
    "서울특별시": "서울특별시", "부산광역시": "부산광역시", "대구광역시": "대구광역시",
    "인천광역시": "인천광역시", "광주광역시": "광주광역시", "대전광역시": "대전광역시",
    "울산광역시": "울산광역시", "세종특별자치시": "세종특별자치시", "경기도": "경기도",
    "강원특별자치도": "강원특별자치도", "충청북도": "충청북도", "충청남도": "충청남도",
    "전북특별자치도": "전북특별자치도", "전라남도": "전라남도", "경상북도": "경상북도",
    "경상남도": "경상남도", "제주특별자치도": "제주특별자치도",
  };

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-5 shadow-sm md:p-6">
      <div className="mb-1">
        <p className="text-xs font-medium text-primary">선택된 지역</p>
        <h3 className="text-xl font-bold text-card-foreground">{selectedRegion.name}</h3>
      </div>
      <div className="mb-5 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-primary">{selectedRegion.total}</span>
        <span className="text-sm text-muted-foreground">개 지원제도</span>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">카테고리별 현황</p>
        {Object.entries(selectedRegion.categories).map(([cat, count]) => {
          const Icon = categoryIcons[cat] || Home;
          return (
            <div key={cat} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
              <span className="flex items-center gap-2 text-sm text-card-foreground">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {cat}
              </span>
              <span className="text-sm font-semibold text-primary">{count}건</span>
            </div>
          );
        })}
      </div>

      <Link to={`/region/${encodeURIComponent(selectedRegion.name)}`} className="mt-5">
        <Button className="w-full gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
          이 지역 전체 보기
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}

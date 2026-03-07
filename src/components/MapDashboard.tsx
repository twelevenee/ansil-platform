import { useState } from "react";
import { KoreaMap } from "@/components/KoreaMap";
import { MapSidePanel } from "@/components/MapSidePanel";
import { useRegionStats } from "@/hooks/usePrograms";

export function MapDashboard() {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const { data, isLoading } = useRegionStats();

  // Map region_city names to map IDs
  const cityToId: Record<string, string> = {
    "서울특별시": "seoul", "부산광역시": "busan", "대구광역시": "daegu",
    "인천광역시": "incheon", "광주광역시": "gwangju", "대전광역시": "daejeon",
    "울산광역시": "ulsan", "세종특별자치시": "sejong", "경기도": "gyeonggi",
    "강원특별자치도": "gangwon", "충청북도": "chungbuk", "충청남도": "chungnam",
    "전북특별자치도": "jeonbuk", "전라남도": "jeonnam", "경상북도": "gyeongbuk",
    "경상남도": "gyeongnam", "제주특별자치도": "jeju",
  };

  const idToCity: Record<string, string> = Object.fromEntries(
    Object.entries(cityToId).map(([k, v]) => [v, k])
  );

  // Build programCounts for map
  const programCounts: Record<string, number> = {};
  if (data?.stats) {
    for (const [city, stat] of Object.entries(data.stats)) {
      const id = cityToId[city];
      if (id) programCounts[id] = stat.total;
    }
  }

  const selectedCity = selectedRegionId ? idToCity[selectedRegionId] : null;
  const selectedStats = selectedCity && data?.stats?.[selectedCity]
    ? { name: selectedCity, total: data.stats[selectedCity].total, categories: data.stats[selectedCity].categories }
    : null;

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <h2 className="mb-2 text-center text-2xl font-bold text-secondary md:text-3xl">
          전국 지도로 한눈에
        </h2>
        <p className="mb-8 text-center text-muted-foreground">
          관심 지역을 클릭하면 해당 지역의 지원제도를 확인할 수 있어요
        </p>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full lg:w-[65%]">
            <div className="rounded-xl border bg-card p-4 shadow-sm md:p-6">
              {isLoading ? (
                <div className="flex h-64 items-center justify-center text-muted-foreground">데이터를 불러오는 중...</div>
              ) : (
                <KoreaMap
                  selectedRegion={selectedRegionId}
                  onRegionClick={setSelectedRegionId}
                  programCounts={programCounts}
                />
              )}
            </div>
          </div>
          <div className="w-full lg:w-[35%]">
            <MapSidePanel selectedRegion={selectedStats} regionId={selectedRegionId} />
          </div>
        </div>
      </div>
    </section>
  );
}

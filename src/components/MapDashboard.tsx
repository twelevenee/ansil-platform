import { useState } from "react";
import { KoreaMap } from "@/components/KoreaMap";
import { MapSidePanel } from "@/components/MapSidePanel";
import { regionData } from "@/data/mockData";

export function MapDashboard() {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  const programCounts = Object.fromEntries(
    Object.entries(regionData).map(([id, data]) => [id, data.programCount])
  );

  const selectedRegion = selectedRegionId ? regionData[selectedRegionId] ?? null : null;

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
          {/* Map area — 65% on desktop */}
          <div className="w-full lg:w-[65%]">
            <div className="rounded-xl border bg-card p-4 shadow-sm md:p-6">
              <KoreaMap
                selectedRegion={selectedRegionId}
                onRegionClick={setSelectedRegionId}
                programCounts={programCounts}
              />
            </div>
          </div>

          {/* Side panel — 35% on desktop */}
          <div className="w-full lg:w-[35%]">
            <MapSidePanel selectedRegion={selectedRegion} />
          </div>
        </div>
      </div>
    </section>
  );
}

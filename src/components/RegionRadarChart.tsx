import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { CAT_LABEL_KEY } from "@/utils/categoryMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Legend, Tooltip,
} from "recharts";

const CAT_KEYS = ["주거안전", "귀가안전", "생활지원", "건강", "커뮤니티"];
const STAT_MAP: Record<string, string> = {
  주거안전: "safety_count",
  귀가안전: "commute_count",
  생활지원: "living_count",
  건강: "health_count",
  커뮤니티: "community_count",
};

function useRegionStatsRPC() {
  return useQuery({
    queryKey: ["regionStatsRPC"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_region_stats");
      if (error) throw error;
      return data;
    },
  });
}

export function RegionRadarChart({ regionCity }: { regionCity: string }) {
  const { data: stats = [] } = useRegionStatsRPC();
  const { t } = useLanguage();

  const regionStat = stats.find(s => s.region_city === regionCity);
  const seoulStat = stats.find(s => s.region_city === "서울특별시");

  const radarData = useMemo(() => {
    if (!regionStat) return [];
    return CAT_KEYS.map(cat => ({
      category: cat,
      region: Number(regionStat[STAT_MAP[cat] as keyof typeof regionStat]) || 0,
      seoul: seoulStat ? Number(seoulStat[STAT_MAP[cat] as keyof typeof seoulStat]) || 0 : 0,
    }));
  }, [regionStat, seoulStat]);

  const analysis = useMemo(() => {
    if (!radarData.length) return null;
    const sorted = [...radarData].sort((a, b) => b.region - a.region);
    const strongest = sorted[0];
    const weakest = sorted[sorted.length - 1];
    const maxGap = [...radarData].sort((a, b) => (b.seoul - b.region) - (a.seoul - a.region))[0];
    return { strongest, weakest, maxGap };
  }, [radarData]);

  if (!regionStat || !radarData.length) return null;
  if (regionCity === "서울특별시") return null;

  return (
    <Card className="mb-6 rounded-2xl shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">{t("region.radar_title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <div style={{ width: 380, height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} tickFormatter={(value: string) => CAT_LABEL_KEY[value] ? t(CAT_LABEL_KEY[value]) : value} />
                <PolarRadiusAxis tick={{ fontSize: 9 }} />
                <Radar name={regionCity.replace(/특별시|광역시|특별자치시|특별자치도|도$/g, "")}
                  dataKey="region" stroke="#E8917F" fill="#E8917F" fillOpacity={0.5} strokeWidth={2} />
                <Radar name={t("common.seoul")} dataKey="seoul"
                  stroke="#CBD5E1" fill="#CBD5E1" fillOpacity={0.15} strokeWidth={1.5} strokeDasharray="5 5" />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number, name: string) => [v, name]} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {analysis && (
          <div className="mt-4 space-y-1 text-sm text-muted-foreground">
            <p>
              {t("region.radar_strongest")}: <span className="font-semibold text-foreground">{CAT_LABEL_KEY[analysis.strongest.category] ? t(CAT_LABEL_KEY[analysis.strongest.category]) : analysis.strongest.category}</span> ({analysis.strongest.region}{t("common.count_suffix")})
              {" / "}
              {t("region.radar_weakest")}: <span className="font-semibold text-foreground">{CAT_LABEL_KEY[analysis.weakest.category] ? t(CAT_LABEL_KEY[analysis.weakest.category]) : analysis.weakest.category}</span> ({analysis.weakest.region}{t("common.count_suffix")})
            </p>
            {analysis.maxGap.seoul > analysis.maxGap.region && (
              <p>
                {t("region.radar_gap")}: <span className="font-semibold text-coral-deep">{CAT_LABEL_KEY[analysis.maxGap.category] ? t(CAT_LABEL_KEY[analysis.maxGap.category]) : analysis.maxGap.category}</span>
                {" "}({t("common.seoul")} {analysis.maxGap.seoul}{t("common.count_suffix")} vs {analysis.maxGap.region}{t("common.count_suffix")})
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

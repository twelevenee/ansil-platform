import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Treemap, ResponsiveContainer, ReferenceLine, Cell,
} from "recharts";

const CAT_COLORS: Record<string, string> = {
  주거안전: "#E8917F",
  귀가안전: "#4A7EC2",
  생활지원: "#F5A86E",
  건강: "#4CAF82",
  커뮤니티: "#C48DB0",
};
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

function shorten(name: string) {
  return name.replace(/특별시|광역시|특별자치시|특별자치도/g, "").replace(/도$/, "");
}

const TreemapContent = (props: any) => {
  const { x, y, width, height, name, depth } = props;
  if (width < 30 || height < 20) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={4}
        fill={depth === 2 ? (CAT_COLORS[name] || "#E8917F") : "transparent"}
        stroke="hsl(var(--background))" strokeWidth={2} fillOpacity={0.85} />
      {width > 45 && height > 28 && (
        <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="central"
          fontSize={depth === 1 ? 11 : 10} fill={depth === 2 ? "#fff" : "hsl(var(--foreground))"} fontWeight={depth === 1 ? 600 : 400}>
          {name}
        </text>
      )}
    </g>
  );
};

export function DashboardCharts() {
  const { data: stats = [], isLoading } = useRegionStatsRPC();
  const { t } = useLanguage();
  const [region1, setRegion1] = useState("서울특별시");
  const [region2, setRegion2] = useState("대전광역시");

  const lollipopData = useMemo(() =>
    [...stats].sort((a, b) => Number(b.total_count) - Number(a.total_count))
      .map(s => ({ name: shorten(s.region_city), fullName: s.region_city, count: Number(s.total_count) })),
    [stats]);

  const avg = useMemo(() => {
    if (!stats.length) return 0;
    return Math.round(stats.reduce((s, r) => s + Number(r.total_count), 0) / stats.length);
  }, [stats]);

  const stackedData = useMemo(() =>
    [...stats].sort((a, b) => Number(b.total_count) - Number(a.total_count))
      .map(s => ({
        name: shorten(s.region_city),
        주거안전: Number(s.safety_count), 귀가안전: Number(s.commute_count),
        생활지원: Number(s.living_count), 건강: Number(s.health_count), 커뮤니티: Number(s.community_count),
      })),
    [stats]);

  const radarData = useMemo(() => {
    const r1 = stats.find(s => s.region_city === region1);
    const r2 = stats.find(s => s.region_city === region2);
    return CAT_KEYS.map(cat => ({
      category: cat,
      [region1]: r1 ? Number(r1[STAT_MAP[cat] as keyof typeof r1]) : 0,
      [region2]: r2 ? Number(r2[STAT_MAP[cat] as keyof typeof r2]) : 0,
    }));
  }, [stats, region1, region2]);

  const treemapData = useMemo(() =>
    stats.filter(s => Number(s.total_count) > 0).map(s => ({
      name: shorten(s.region_city),
      children: CAT_KEYS
        .map(cat => ({ name: cat, size: Number(s[STAT_MAP[cat] as keyof typeof s]) }))
        .filter(c => c.size > 0),
    })),
    [stats]);

  const regionNames = useMemo(() => stats.map(s => s.region_city), [stats]);

  if (isLoading || !stats.length) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <h2 className="mb-2 text-center text-2xl font-bold text-foreground md:text-3xl">
          {t("analytics.section_title")}
        </h2>
        <p className="mb-8 text-center text-muted-foreground">
          {t("analytics.section_subtitle")}
        </p>

        <Tabs defaultValue="lollipop" className="w-full">
          <TabsList className="mx-auto mb-6 grid w-full max-w-2xl grid-cols-2 gap-1 md:grid-cols-4">
            <TabsTrigger value="lollipop" className="text-xs md:text-sm">{t("analytics.tab_lollipop")}</TabsTrigger>
            <TabsTrigger value="stacked" className="text-xs md:text-sm">{t("analytics.tab_stacked")}</TabsTrigger>
            <TabsTrigger value="radar" className="text-xs md:text-sm">{t("analytics.tab_radar")}</TabsTrigger>
            <TabsTrigger value="treemap" className="text-xs md:text-sm">{t("analytics.tab_treemap")}</TabsTrigger>
          </TabsList>

          {/* Tab 1: Lollipop */}
          <TabsContent value="lollipop">
            <Card className="rounded-2xl shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">{t("analytics.lollipop_title")}</CardTitle>
                <CardDescription>{t("analytics.lollipop_desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-2 md:mx-0">
                  <div style={{ minWidth: 500, height: Math.max(400, lollipopData.length * 36 + 60) }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={lollipopData} layout="vertical" margin={{ left: 10, right: 50, top: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v: number) => [`${v}건`, "제도 수"]} />
                        <ReferenceLine x={avg} stroke="#CBD5E1" strokeDasharray="5 5"
                          label={{ value: `평균 ${avg}`, position: "insideTopRight", fontSize: 10, fill: "#94A3B8" }} />
                        <Bar dataKey="count" barSize={10} radius={[0, 6, 6, 0]}>
                          {lollipopData.map((d, i) => (
                            <Cell key={i} fill={d.count >= avg ? "#E8917F" : "#CBD5E1"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Stacked Bar */}
          <TabsContent value="stacked">
            <Card className="rounded-2xl shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">{t("analytics.stacked_title")}</CardTitle>
                <CardDescription>{t("analytics.stacked_desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-2 md:mx-0">
                  <div style={{ minWidth: Math.max(600, stackedData.length * 50), height: 420 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stackedData} margin={{ left: 10, right: 10, top: 10, bottom: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} height={50} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        {CAT_KEYS.map(cat => (
                          <Bar key={cat} dataKey={cat} stackId="a" fill={CAT_COLORS[cat]} />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Radar */}
          <TabsContent value="radar">
            <Card className="rounded-2xl shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">{t("analytics.radar_title")}</CardTitle>
                <CardDescription>{t("analytics.radar_desc")}</CardDescription>
                <div className="mt-3 flex flex-wrap gap-3">
                  <Select value={region1} onValueChange={setRegion1}>
                    <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {regionNames.map(r => <SelectItem key={r} value={r}>{shorten(r)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <span className="self-center text-sm text-muted-foreground">vs</span>
                  <Select value={region2} onValueChange={setRegion2}>
                    <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {regionNames.map(r => <SelectItem key={r} value={r}>{shorten(r)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div style={{ width: 420, height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
                        <PolarRadiusAxis tick={{ fontSize: 10 }} />
                        <Radar name={shorten(region1)} dataKey={region1}
                          stroke="#E8917F" fill="#E8917F" fillOpacity={0.4} strokeWidth={2} />
                        <Radar name={shorten(region2)} dataKey={region2}
                          stroke="#4A7EC2" fill="#4A7EC2" fillOpacity={0.3} strokeWidth={2} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Treemap */}
          <TabsContent value="treemap">
            <Card className="rounded-2xl shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">{t("analytics.treemap_title")}</CardTitle>
                <CardDescription>{t("analytics.treemap_desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: "100%", height: 450 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                      data={treemapData}
                      dataKey="size"
                      aspectRatio={4 / 3}
                      stroke="hsl(var(--background))"
                      content={<TreemapContent />}
                    />
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-4">
                  {CAT_KEYS.map(cat => (
                    <div key={cat} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: CAT_COLORS[cat] }} />
                      {cat}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

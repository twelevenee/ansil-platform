import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { FileText, MapPin, Gift, CheckCircle, Home, Shield, ShoppingBag, Heart, Users } from "lucide-react";

const CAT_META: { key: string; icon: React.ElementType; chipActive: string; chipInactive: string; hsl: string }[] = [
  { key: "주거안전", icon: Home, chipActive: "bg-sky-mid text-white", chipInactive: "bg-sky-light text-sky-deep border border-sky-mid/30", hsl: "hsl(213, 55%, 67%)" },
  { key: "귀가안전", icon: Shield, chipActive: "bg-lav-mid text-white", chipInactive: "bg-lav-light text-lav-deep border border-lav-mid/30", hsl: "hsl(322, 28%, 66%)" },
  { key: "생활지원", icon: ShoppingBag, chipActive: "bg-rose-mid text-white", chipInactive: "bg-rose-light text-rose-deep border border-rose-mid/30", hsl: "hsl(345, 55%, 72%)" },
  { key: "건강", icon: Heart, chipActive: "bg-coral-mid text-white", chipInactive: "bg-coral-light text-coral-deep border border-coral-mid/30", hsl: "hsl(10, 57%, 70%)" },
  { key: "커뮤니티", icon: Users, chipActive: "bg-peach-mid text-white", chipInactive: "bg-peach-light text-peach-deep border border-peach-mid/30", hsl: "hsl(28, 86%, 69%)" },
];
const CAT_KEYS = CAT_META.map(c => c.key);
const STAT_MAP: Record<string, string> = {
  주거안전: "safety_count", 귀가안전: "commute_count", 생활지원: "living_count", 건강: "health_count", 커뮤니티: "community_count",
};

function shorten(name: string) {
  return name.replace(/특별시|광역시|특별자치시|특별자치도/g, "");
}

function useAllPrograms() {
  return useQuery({
    queryKey: ["allProgramsAnalytics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("programs").select("region_city, category, cost, status");
      if (error) throw error;
      return data;
    },
  });
}

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

const AnalyticsPage = () => {
  const { t } = useLanguage();
  const { data: programs = [] } = useAllPrograms();
  const { data: stats = [], isLoading } = useRegionStatsRPC();

  const totalPrograms = programs.length;
  const totalRegions = new Set(programs.map(p => p.region_city)).size;
  const freeCount = programs.filter(p => p.cost === "무료").length;
  const freePct = totalPrograms ? Math.round((freeCount / totalPrograms) * 100) : 0;
  const openCount = programs.filter(p => p.status === "신청가능").length;
  const openPct = totalPrograms ? Math.round((openCount / totalPrograms) * 100) : 0;

  const heatmapRegions = useMemo(() =>
    [...stats].sort((a, b) => Number(b.total_count) - Number(a.total_count)),
    [stats]);
  const maxCatCount = useMemo(() => {
    let max = 1;
    stats.forEach(s => CAT_KEYS.forEach(cat => {
      const v = Number(s[STAT_MAP[cat] as keyof typeof s]);
      if (v > max) max = v;
    }));
    return max;
  }, [stats]);

  const donutData = useMemo(() => {
    const free = programs.filter(p => p.cost === "무료").length;
    const paid = programs.filter(p => p.cost !== "무료" && p.cost !== "미확인").length;
    const unknown = programs.length - free - paid;
    return [
      { name: "무료", value: free, color: "hsl(213, 55%, 67%)" },
      { name: "유료", value: paid, color: "hsl(345, 55%, 72%)" },
      { name: "기타", value: unknown, color: "hsl(220, 9%, 80%)" },
    ].filter(d => d.value > 0);
  }, [programs]);

  // Category distribution donut
  const catDonutData = useMemo(() => {
    return CAT_META.map(cat => ({
      name: cat.key,
      value: programs.filter(p => p.category === cat.key).length,
      color: cat.hsl,
    })).filter(d => d.value > 0);
  }, [programs]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">{t("map.loading")}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container py-6 md:py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-1.5 text-2xl font-bold text-foreground md:text-3xl">{t("analytics.page_title")}</h1>
            <p className="text-sm text-muted-foreground md:text-base">{t("analytics.page_subtitle")}</p>
          </div>

          {/* Key Stats */}
          <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {[
              { icon: FileText, label: t("analytics.stat_total"), value: totalPrograms, suffix: "건", bg: "bg-sky-light", iconColor: "text-sky-deep", valueColor: "text-sky-deep" },
              { icon: MapPin, label: t("analytics.stat_regions"), value: totalRegions, suffix: "개 지역", bg: "bg-lav-light", iconColor: "text-lav-deep", valueColor: "text-lav-deep" },
              { icon: Gift, label: t("analytics.stat_free"), value: freePct, suffix: "%", bg: "bg-rose-light", iconColor: "text-rose-deep", valueColor: "text-rose-deep" },
              { icon: CheckCircle, label: t("analytics.stat_open"), value: openPct, suffix: "%", bg: "bg-peach-light", iconColor: "text-peach-deep", valueColor: "text-peach-deep" },
            ].map((item, i) => (
              <Card key={i} className="overflow-hidden rounded-2xl border-none shadow-card">
                <CardContent className="p-4 md:p-6">
                  <div className={`mb-3 inline-flex rounded-xl p-2 ${item.bg}`}>
                    <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                  </div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className={`text-2xl font-bold ${item.valueColor} md:text-3xl`}>
                    {item.value}<span className="ml-0.5 text-sm font-normal text-muted-foreground">{item.suffix}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Two-column: Category Distribution + Free Ratio */}
          <div className="mb-8 grid gap-4 md:grid-cols-2">
            {/* Category Distribution */}
            <Card className="rounded-2xl border-none shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">카테고리 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-[140px] h-[140px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={catDonutData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                          innerRadius={40} outerRadius={65} paddingAngle={2} strokeWidth={0}>
                          {catDonutData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number, name: string) => [`${v}건`, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {catDonutData.map(d => {
                      const meta = CAT_META.find(c => c.key === d.name)!;
                      const Icon = meta.icon;
                      return (
                        <div key={d.name} className="flex items-center gap-2 text-xs">
                          <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${meta.chipInactive}`}>
                            <Icon className="h-3 w-3" />
                            <span className="font-medium">{d.name}</span>
                          </div>
                          <span className="text-muted-foreground">{d.value}건</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Free Ratio */}
            <Card className="rounded-2xl border-none shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">{t("analytics.donut_title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-[140px] h-[140px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={donutData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                          innerRadius={40} outerRadius={65} paddingAngle={2} strokeWidth={0}>
                          {donutData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number, name: string) => [`${v}건`, name]} />
                        <text x="50%" y="46%" textAnchor="middle" dominantBaseline="central"
                          className="fill-foreground text-xl font-bold">{freePct}%</text>
                        <text x="50%" y="58%" textAnchor="middle" dominantBaseline="central"
                          className="fill-muted-foreground" style={{ fontSize: 10 }}>무료</text>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-2">
                    {donutData.map(d => (
                      <div key={d.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                        <span>{d.name}</span>
                        <span className="font-medium text-foreground">{d.value}건</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Heatmap */}
          <Card className="mb-8 rounded-2xl border-none shadow-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">{t("analytics.heatmap_title")}</CardTitle>
              <CardDescription className="text-xs">{t("analytics.heatmap_desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-2 md:mx-0">
                <table className="w-full min-w-[520px] border-collapse text-xs md:text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 text-left font-medium text-muted-foreground">지역</th>
                      {CAT_META.map(cat => {
                        const Icon = cat.icon;
                        return (
                          <th key={cat.key} className="p-2 text-center">
                            <div className="flex flex-col items-center gap-0.5">
                              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="font-medium text-muted-foreground text-[10px] md:text-xs">{cat.key}</span>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapRegions.map(region => (
                      <tr key={region.region_city} className="border-t border-border/30">
                        <td className="p-2 font-medium text-foreground">{shorten(region.region_city)}</td>
                        {CAT_META.map(cat => {
                          const val = Number(region[STAT_MAP[cat.key] as keyof typeof region]);
                          const intensity = maxCatCount > 0 ? val / maxCatCount : 0;
                          // Use each category's own color for the heatmap cells
                          const baseColor = cat.hsl;
                          return (
                            <td key={cat.key} className="p-1.5 text-center">
                              {val === 0 ? (
                                <div className="mx-auto flex h-8 w-11 items-center justify-center rounded-lg border border-dashed border-muted-foreground/20 text-muted-foreground/40 text-[10px] md:h-9 md:w-14">
                                  ✕
                                </div>
                              ) : (
                                <div
                                  className="mx-auto flex h-8 w-11 items-center justify-center rounded-lg text-xs font-medium md:h-9 md:w-14 transition-colors"
                                  style={{
                                    backgroundColor: baseColor.replace(")", `, ${0.12 + intensity * 0.55})`).replace("hsl", "hsla"),
                                    color: intensity > 0.45 ? "#fff" : "hsl(0, 0%, 18%)",
                                  }}
                                  title={`${shorten(region.region_city)} × ${cat.key} = ${val}건`}
                                >
                                  {val}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Source */}
          <div className="rounded-2xl bg-rose-light/50 p-5 text-center text-sm text-muted-foreground">
            <p>{t("analytics.source")}</p>
            <p className="mt-1 text-xs">{t("analytics.updated")}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AnalyticsPage;

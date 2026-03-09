import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { CAT_LABEL_KEY } from "@/utils/categoryMap";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { ChartTooltip } from "@/components/ui/chart-tooltip";
import { FileText, MapPin, Gift, CheckCircle, Home, Shield, ShoppingBag, Heart, Users, TrendingUp, Trophy, TrendingDown, ChevronDown, ChevronUp, Check, X } from "lucide-react";

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

function getGrade(sai: number, t: (k: string) => string) {
  if (sai >= 80) return { label: t("analytics.sai_grade_very_high"), bg: "bg-sky-light", text: "text-sky-deep" };
  if (sai >= 60) return { label: t("analytics.sai_grade_normal"), bg: "bg-peach-light", text: "text-peach-deep" };
  if (sai >= 40) return { label: t("analytics.sai_grade_low"), bg: "bg-coral-light", text: "text-coral-deep" };
  return { label: t("analytics.sai_grade_very_low"), bg: "bg-rose-light", text: "text-rose-deep" };
}

function SAIRankingRow({ row, rank, t }: { row: { region: string; sai: number }; rank: number; t: (k: string) => string }) {
  const grade = getGrade(row.sai, t);
  return (
    <div className="flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-2.5 min-h-[44px]">
      <span className="w-6 text-center text-xs font-medium text-muted-foreground">{rank}</span>
      <span className="flex-1 text-sm font-medium text-foreground">{shorten(row.region)}</span>
      <div className="flex items-center gap-2">
        <div className="hidden h-2 w-14 overflow-hidden rounded-full bg-muted md:block">
          <div className="h-full rounded-full bg-coral-mid transition-all duration-700" style={{ width: `${row.sai}%` }} />
        </div>
        <span className="w-8 text-right text-sm font-semibold text-foreground">{row.sai}</span>
      </div>
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${grade.bg} ${grade.text}`}>
        {grade.label}
      </span>
    </div>
  );
}

function SAIRankingSection({ saiData, t }: { saiData: { rows: { region: string; sai: number }[]; avg: number }; t: (k: string) => string }) {
  const [showAll, setShowAll] = useState(false);
  const top5 = saiData.rows.slice(0, 5);
  const bottom5 = saiData.rows.slice(-5).reverse();
  const highest = saiData.rows[0];
  const lowest = saiData.rows[saiData.rows.length - 1];

  return (
    <Card className="mb-8 rounded-2xl border-none shadow-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">{t("analytics.sai_ranking_title")}</CardTitle>
        <CardDescription className="text-xs">{t("analytics.sai_ranking_desc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* 3 Summary Cards */}
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <div className="rounded-xl bg-sky-light/60 p-3 text-center">
            <Trophy className="mx-auto mb-1.5 h-4 w-4 text-sky-deep" />
            <p className="text-[10px] text-muted-foreground">{t("analytics.sai_highest")}</p>
            {highest && (
              <>
                <p className="text-sm font-bold text-sky-deep">{shorten(highest.region)}</p>
                <p className="text-lg font-bold text-sky-deep">{highest.sai}</p>
              </>
            )}
          </div>
          <div className="rounded-xl bg-muted/60 p-3 text-center">
            <TrendingUp className="mx-auto mb-1.5 h-4 w-4 text-foreground" />
            <p className="text-[10px] text-muted-foreground">{t("analytics.sai_national_avg")}</p>
            <p className="text-lg font-bold text-foreground">{saiData.avg}</p>
          </div>
          <div className="rounded-xl bg-rose-light/60 p-3 text-center">
            <TrendingDown className="mx-auto mb-1.5 h-4 w-4 text-rose-deep" />
            <p className="text-[10px] text-muted-foreground">{t("analytics.sai_lowest")}</p>
            {lowest && (
              <>
                <p className="text-sm font-bold text-rose-deep">{shorten(lowest.region)}</p>
                <p className="text-lg font-bold text-rose-deep">{lowest.sai}</p>
              </>
            )}
          </div>
        </div>

        {/* Top 5 / Bottom 5 */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">{t("analytics.sai_top5")}</p>
            <div className="space-y-1.5">
              {top5.map((row, i) => <SAIRankingRow key={row.region} row={row} rank={i + 1} t={t} />)}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">{t("analytics.sai_bottom5")}</p>
            <div className="space-y-1.5">
              {bottom5.map((row) => {
                const rank = saiData.rows.findIndex(r => r.region === row.region) + 1;
                return <SAIRankingRow key={row.region} row={row} rank={rank} t={t} />;
              })}
            </div>
          </div>
        </div>

        {/* Collapsible full list */}
        <div>
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-muted/40 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 min-h-[40px]"
          >
            {showAll ? t("analytics.sai_hide_all") : t("analytics.sai_view_all").replace("{count}", String(saiData.rows.length))}
            {showAll ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          {showAll && (
            <div className="mt-3 space-y-1.5">
              {saiData.rows.map((row, i) => <SAIRankingRow key={row.region} row={row} rank={i + 1} t={t} />)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function HeatmapSection({
  heatmapRegions,
  maxCatCount,
  t,
}: {
  heatmapRegions: any[];
  maxCatCount: number;
  t: (k: string) => string;
}) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showCompare, setShowCompare] = useState(false);

  const selectedData = heatmapRegions.find(r => r.region_city === selectedRegion);

  return (
    <Card className="mb-8 rounded-2xl border-none shadow-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">{t("analytics.heatmap_title")}</CardTitle>
        <CardDescription className="text-xs">{t("analytics.heatmap_desc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Region selector chips */}
        <div className="flex flex-wrap gap-1.5">
          {heatmapRegions.map(region => (
            <button
              key={region.region_city}
              onClick={() => setSelectedRegion(selectedRegion === region.region_city ? null : region.region_city)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors min-h-[32px] ${
                selectedRegion === region.region_city
                  ? "bg-rose-mid text-white"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {shorten(region.region_city)}
            </button>
          ))}
        </div>

        {/* Selected region card view */}
        {selectedData ? (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-5 md:gap-3">
            {CAT_META.map(cat => {
              const val = Number(selectedData[STAT_MAP[cat.key] as keyof typeof selectedData]);
              const Icon = cat.icon;
              const hasSupport = val > 0;
              return (
                <div
                  key={cat.key}
                  className={`rounded-xl p-3 text-center transition-colors ${
                    hasSupport ? cat.chipInactive : "border border-dashed border-muted-foreground/20 bg-muted/20"
                  }`}
                >
                  <Icon className={`mx-auto mb-1.5 h-5 w-5 ${hasSupport ? "" : "text-muted-foreground/40"}`} />
                  <p className="text-xs font-medium">{t(CAT_LABEL_KEY[cat.key])}</p>
                  {hasSupport ? (
                    <p className="mt-1 text-lg font-bold">{val}<span className="text-xs font-normal">{t("analytics.count_suffix")}</span></p>
                  ) : (
                    <p className="mt-1 text-xs text-muted-foreground/50">{t("analytics.heatmap_no_support")}</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl bg-muted/30 py-8 text-center">
            <MapPin className="mx-auto mb-2 h-6 w-6 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{t("analytics.heatmap_select_region")}</p>
            <p className="mt-0.5 text-xs text-muted-foreground/60">{t("analytics.heatmap_select_desc")}</p>
          </div>
        )}

        {/* Expandable comparison matrix */}
        <div>
          <button
            onClick={() => setShowCompare(!showCompare)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-muted/40 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 min-h-[40px]"
          >
            {showCompare ? t("analytics.heatmap_hide_compare") : t("analytics.heatmap_compare_all")}
            {showCompare ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          {showCompare && (
            <div className="mt-3 overflow-x-auto -mx-2 md:mx-0">
              <table className="w-full min-w-[520px] border-collapse text-xs md:text-sm">
                <thead>
                  <tr>
                    <th className="p-2 text-left font-medium text-muted-foreground">{t("analytics.region")}</th>
                    {CAT_META.map(cat => {
                      const Icon = cat.icon;
                      return (
                        <th key={cat.key} className="p-2 text-center">
                          <div className="flex flex-col items-center gap-0.5">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium text-muted-foreground text-[10px] md:text-xs">{t(CAT_LABEL_KEY[cat.key])}</span>
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
                                title={`${shorten(region.region_city)} × ${t(CAT_LABEL_KEY[cat.key])} = ${val}${t("common.count_suffix")}`}
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
          )}
        </div>
      </CardContent>
    </Card>
  );
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

  // SAI calculation
  const saiData = useMemo(() => {
    const regionMap: Record<string, typeof programs> = {};
    programs.forEach(p => {
      if (!regionMap[p.region_city]) regionMap[p.region_city] = [];
      regionMap[p.region_city].push(p);
    });
    const maxCount = Math.max(...Object.values(regionMap).map(arr => arr.length), 1);

    const rows = Object.entries(regionMap).map(([region, progs]) => {
      const total = progs.length;
      const scaleScore = (total / maxCount) * 100;
      const freeScore = total ? (progs.filter(p => p.cost === "무료").length / total) * 100 : 0;
      const availableScore = total ? (progs.filter(p => p.status === "신청가능").length / total) * 100 : 0;
      const uniqueCats = new Set(progs.map(p => p.category)).size;
      const diversityScore = (uniqueCats / 5) * 100;
      const sai = Math.round(scaleScore * 0.4 + freeScore * 0.2 + availableScore * 0.2 + diversityScore * 0.2);
      return { region, sai };
    });

    rows.sort((a, b) => b.sai - a.sai);
    const avg = rows.length ? Math.round(rows.reduce((s, r) => s + r.sai, 0) / rows.length) : 0;
    return { rows, avg };
  }, [programs]);

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
      { name: t("analytics.free"), value: free, color: "hsl(213, 55%, 67%)" },
      { name: t("analytics.paid"), value: paid, color: "hsl(345, 55%, 72%)" },
      { name: t("analytics.other"), value: unknown, color: "hsl(220, 9%, 80%)" },
    ].filter(d => d.value > 0);
  }, [programs, t]);

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
          <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
            {[
              { icon: FileText, label: t("analytics.stat_total"), value: totalPrograms, suffix: t("common.count_suffix"), bg: "bg-sky-light", iconColor: "text-sky-deep", valueColor: "text-sky-deep" },
              { icon: MapPin, label: t("analytics.stat_regions"), value: totalRegions, suffix: t("common.region_count_suffix"), bg: "bg-lav-light", iconColor: "text-lav-deep", valueColor: "text-lav-deep" },
              { icon: Gift, label: t("analytics.stat_free"), value: freePct, suffix: "%", bg: "bg-rose-light", iconColor: "text-rose-deep", valueColor: "text-rose-deep" },
              { icon: CheckCircle, label: t("analytics.stat_open"), value: openPct, suffix: "%", bg: "bg-peach-light", iconColor: "text-peach-deep", valueColor: "text-peach-deep" },
              { icon: TrendingUp, label: t("analytics.sai_title"), value: saiData.avg, suffix: t("analytics.sai_national_avg"), bg: "bg-coral-light", iconColor: "text-coral-deep", valueColor: "text-coral-deep" },
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
                <CardTitle className="text-base font-semibold">{t("analytics.category_distribution")}</CardTitle>
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
                        <Tooltip content={<ChartTooltip valueFormatter={(v: number, name: string) => [`${v}${t("analytics.count_suffix")}`, CAT_LABEL_KEY[name] ? t(CAT_LABEL_KEY[name]) : name]} />} />
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
                            <span className="font-medium">{CAT_LABEL_KEY[d.name] ? t(CAT_LABEL_KEY[d.name]) : d.name}</span>
                          </div>
                          <span className="text-muted-foreground">{d.value}{t("analytics.count_suffix")}</span>
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
                        <Tooltip content={<ChartTooltip valueFormatter={(v: number, name: string) => [`${v}${t("analytics.count_suffix")}`, name]} />} />
                        <text x="50%" y="46%" textAnchor="middle" dominantBaseline="central"
                          className="fill-foreground text-xl font-bold">{freePct}%</text>
                        <text x="50%" y="58%" textAnchor="middle" dominantBaseline="central"
                          className="fill-muted-foreground" style={{ fontSize: 10 }}>{t("analytics.free")}</text>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-2">
                    {donutData.map(d => (
                      <div key={d.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                        <span>{d.name}</span>
                        <span className="font-medium text-foreground">{d.value}{t("analytics.count_suffix")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Heatmap - Region Selector */}
          <HeatmapSection
            heatmapRegions={heatmapRegions}
            maxCatCount={maxCatCount}
            t={t}
          />

          {/* SAI Ranking */}
          <SAIRankingSection saiData={saiData} t={t} />
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

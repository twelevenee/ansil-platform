import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProgramCard, categoryIcons } from "@/components/ProgramCard";
import { useRegionPrograms } from "@/hooks/usePrograms";
import { useLanguage } from "@/contexts/LanguageContext";
import { RegionRadarChart } from "@/components/RegionRadarChart";

const categories = ["전체", "주거안전", "귀가안전", "생활지원", "건강", "커뮤니티"];

const categoryChipActive: Record<string, string> = {
  전체: "bg-rose-mid text-white",
  주거안전: "bg-sky-mid text-white",
  귀가안전: "bg-lav-mid text-white",
  생활지원: "bg-rose-mid text-white",
  건강: "bg-coral-mid text-white",
  커뮤니티: "bg-peach-mid text-white",
};

const categoryChipInactive: Record<string, string> = {
  전체: "border bg-card text-muted-foreground hover:bg-rose-light hover:text-rose-deep",
  주거안전: "border bg-card text-muted-foreground hover:bg-sky-light hover:text-sky-deep",
  귀가안전: "border bg-card text-muted-foreground hover:bg-lav-light hover:text-lav-deep",
  생활지원: "border bg-card text-muted-foreground hover:bg-rose-light hover:text-rose-deep",
  건강: "border bg-card text-muted-foreground hover:bg-coral-light hover:text-coral-deep",
  커뮤니티: "border bg-card text-muted-foreground hover:bg-peach-light hover:text-peach-deep",
};

const gapAlerts: Record<string, string> = {
  "대전광역시": "병원동행서비스, 주택관리서비스",
  "부산광역시": "안심택시, 커뮤니티 프로그램",
  "대구광역시": "귀가동행서비스, 긴급돌봄",
  "인천광역시": "심리상담, 주택관리서비스",
  "광주광역시": "안심택시, 병원동행서비스",
  "울산광역시": "커뮤니티 프로그램, 심리상담",
  "경기도": "긴급돌봄, 주택관리서비스",
};

const catKeyMap: Record<string, string> = {
  전체: "region.all",
  주거안전: "cat.housing",
  귀가안전: "cat.commute",
  생활지원: "cat.living",
  건강: "cat.health",
  커뮤니티: "cat.community",
};

const RegionDetail = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("전체");
  const [aiQuery, setAiQuery] = useState("");

  const regionCity = cityName ? decodeURIComponent(cityName) : "";
  const { data: programs = [], isLoading } = useRegionPrograms(regionCity);

  const filtered = activeCategory === "전체" ? programs : programs.filter((p) => p.category === activeCategory);

  const gap = gapAlerts[regionCity];

  const categoryCounts: Record<string, number> = {};
  programs.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  const handleAiSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const text = aiQuery.trim() || `${regionCity} ${t("region.ai_default_suffix")}`;
    navigate(`/chat?q=${encodeURIComponent(text)}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container py-6 md:py-12">
          <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-rose-deep min-h-[44px] md:mb-6">
            <ArrowLeft className="h-4 w-4" /> {t("region.back")}
          </Link>

          <h1 className="mb-3 text-2xl font-bold text-foreground md:mb-4 md:text-3xl">{regionCity} {t("region.status_suffix")}</h1>

          <div className="mb-4 flex flex-wrap items-center gap-3 md:mb-6">
            <span className="text-sm text-muted-foreground">
              {t("region.total")} <span className="font-bold text-rose-deep">{programs.length}</span>{t("region.count_suffix")}
            </span>
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const Icon = categoryIcons[cat];
              return Icon ? (
                <span key={cat} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" /> {cat} {count}
                </span>
              ) : null;
            })}
          </div>

          {regionCity !== "서울특별시" && gap && (
            <div className="mb-4 flex items-start gap-3 rounded-2xl border border-peach bg-peach-light p-4 md:mb-6">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-peach-deep" />
              <p className="text-sm text-card-foreground">
                <span className="font-semibold">{t("region.gap_title")}</span> {gap}
              </p>
            </div>
          )}

          <div className="mb-4 -mx-4 px-4 md:mx-0 md:px-0 md:mb-6">
            <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-x-visible md:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors min-h-[40px] active:scale-95 ${
                    activeCategory === cat
                      ? categoryChipActive[cat]
                      : categoryChipInactive[cat]
                  }`}
                >
                  {catKeyMap[cat] ? t(catKeyMap[cat] as any) : cat}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border bg-card p-12 text-center text-muted-foreground">{t("map.loading")}</div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProgramCard key={p.id} program={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border bg-card p-12 text-center">
              <p className="text-muted-foreground">{t("region.no_results")}</p>
            </div>
          )}

          <div className="mt-8 rounded-2xl bg-gradient-cta p-5 text-center md:mt-12 md:p-8">
            <p className="mb-4 text-sm font-medium text-white">
              {t("region.ai_prompt")}
            </p>
            <form onSubmit={handleAiSearch} className="mx-auto flex max-w-lg items-center gap-2 rounded-xl bg-card p-2">
              <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
              <Input
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder={`${regionCity} ${t("region.ai_placeholder_suffix")}`}
                className="border-0 bg-transparent shadow-none focus-visible:ring-0 min-h-[44px]"
              />
              <Button type="submit" className="shrink-0 rounded-xl bg-rose-mid text-white hover:bg-rose-deep min-h-[44px]">
                {t("region.ai_ask")}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegionDetail;

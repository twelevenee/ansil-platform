import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Shield, Heart, Activity, Users, ArrowRight, BarChart3, Package, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNationalCategoryStats } from "@/hooks/usePrograms";
import { useLanguage } from "@/contexts/LanguageContext";
import { getFacilitiesByRegion } from "@/data/safetyFacilities";
import { CAT_LABEL_KEY } from "@/utils/categoryMap";

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
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"programs" | "facilities">("programs");

  if (!selectedRegion) {
    const cats = nationalCategories || {};
    const maxVal = Math.max(...Object.values(cats), 1);

    return (
      <div className="flex h-full flex-col rounded-2xl border bg-card p-4 shadow-card md:p-6">
        <div className="mb-1 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-sky-deep" />
          <h3 className="text-base font-bold text-card-foreground md:text-lg">{t("map.national_title")}</h3>
        </div>
        <p className="mb-4 text-sm text-muted-foreground md:mb-6">{t("map.national_subtitle")}</p>

        <div className="flex flex-1 flex-col justify-center gap-3 md:gap-4">
          {Object.entries(cats).map(([cat, count]) => {
            const Icon = categoryIcons[cat] || Home;
            return (
              <div key={cat} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-card-foreground">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {CAT_LABEL_KEY[cat] ? t(CAT_LABEL_KEY[cat]) : cat}
                  </span>
                  <span className={`font-semibold ${categoryTextClasses[cat] || "text-rose-deep"}`}>{count}{t("map.count_suffix")}</span>
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
          {t("map.click_hint")}
        </p>
      </div>
    );
  }

  const { lockers, guardians } = getFacilitiesByRegion(selectedRegion.name);

  return (
    <div className="flex h-full flex-col rounded-2xl border bg-card p-4 shadow-card md:p-6">
      <div className="mb-1">
        <p className="text-xs font-medium text-rose-mid">{t("map.selected_region")}</p>
        <h3 className="text-lg font-bold text-card-foreground md:text-xl">{selectedRegion.name}</h3>
      </div>
      <div className="mb-3 flex items-baseline gap-1 md:mb-4">
        <span className="text-2xl font-bold text-rose-deep md:text-3xl">{selectedRegion.total}</span>
        <span className="text-sm text-muted-foreground">{t("map.programs_count")}</span>
      </div>

      {/* Tabs */}
      <div className="mb-3 flex rounded-xl bg-muted/50 p-1">
        <button
          onClick={() => setActiveTab("programs")}
          className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors min-h-[36px] ${
            activeTab === "programs" ? "bg-card text-card-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          {t("safety.tab_programs")}
        </button>
        <button
          onClick={() => setActiveTab("facilities")}
          className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors min-h-[36px] ${
            activeTab === "facilities" ? "bg-card text-card-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          {t("safety.tab_title")}
        </button>
      </div>

      {activeTab === "programs" ? (
        <div className="flex flex-1 flex-col gap-2 md:gap-3">
          <p className="text-sm font-medium text-muted-foreground">{t("map.category_status")}</p>
          {(() => {
            const entries = Object.entries(selectedRegion.categories);
            const maxVal = Math.max(...entries.map(([, c]) => c), 1);
            return entries.map(([cat, count]) => {
              const Icon = categoryIcons[cat] || Home;
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-card-foreground">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {CAT_LABEL_KEY[cat] ? t(CAT_LABEL_KEY[cat]) : cat}
                    </span>
                    <span className={`font-semibold ${categoryTextClasses[cat] || "text-rose-deep"}`}>{count}{t("map.count_suffix")}</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${categoryBarClasses[cat] || "bg-rose-mid"} transition-all duration-700`}
                      style={{ width: `${(count / maxVal) * 100}%` }}
                    />
                  </div>
                </div>
              );
            });
          })()}
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Summary */}
          <div className="mb-3 flex gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-sky-light px-3 py-1.5 text-xs font-medium text-sky-deep">
              <Package className="h-3.5 w-3.5" />
              {t("safety.lockers")} {lockers.length}{t("safety.places_suffix")}
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-rose-light px-3 py-1.5 text-xs font-medium text-rose-deep">
              <Store className="h-3.5 w-3.5" />
              {t("safety.guardians")} {guardians.length}{t("safety.places_suffix")}
            </div>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto -mx-1 px-1 space-y-1.5" style={{ maxHeight: "260px" }}>
            {lockers.map((l, i) => (
              <div key={`l-${i}`} className="flex items-start gap-2.5 rounded-xl bg-muted/30 px-3 py-2.5 min-h-[44px]">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-mid" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-card-foreground truncate">{l.시설명}</p>
                  <p className="text-xs text-muted-foreground truncate">{l.소재지도로명주소 || l.소재지지번주소}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {t("safety.weekday_hours")}: {l.평일운영시작시각}~{l.평일운영종료시각}
                  </p>
                </div>
              </div>
            ))}
            {guardians.map((g, i) => (
              <div key={`g-${i}`} className="flex items-start gap-2.5 rounded-xl bg-muted/30 px-3 py-2.5 min-h-[44px]">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rose-mid" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-card-foreground truncate">{g.점포명}</p>
                  <p className="text-xs text-muted-foreground truncate">{g.소재지도로명주소 || g.소재지지번주소}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                      g.운영여부 === "Y"
                        ? "bg-sky-light text-sky-deep"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {g.운영여부 === "Y" ? t("safety.operating") : t("safety.closed")}
                    </span>
                    {g.여성안심지킴이집전화번호 && (
                      <span className="text-[10px] text-muted-foreground">📞 {g.여성안심지킴이집전화번호}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {lockers.length === 0 && guardians.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">{t("safety.no_facilities")}</p>
            )}
          </div>
        </div>
      )}

      <Link to={`/region/${encodeURIComponent(selectedRegion.name)}`} className="mt-4 md:mt-5">
        <Button className="w-full gap-2 rounded-xl bg-gradient-cta text-white hover:opacity-90 min-h-[48px]">
          {t("map.view_all")}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}

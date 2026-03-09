import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Home, Shield, Heart, ShoppingBag, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProgramCard } from "@/components/ProgramCard";
import { PortalCards } from "@/components/PortalCards";
import { usePrograms, useRegionCities } from "@/hooks/usePrograms";
import { useLanguage } from "@/contexts/LanguageContext";
import { CAT_LABEL_KEY } from "@/utils/categoryMap";
import type { TranslationKey } from "@/i18n/translations";

const categoryList = [
  { key: "주거안전", icon: Home },
  { key: "귀가안전", icon: Shield },
  { key: "건강", icon: Heart },
  { key: "생활지원", icon: ShoppingBag },
  { key: "커뮤니티", icon: Users },
];

const applyMethodList: { value: string; labelKey: TranslationKey }[] = [
  { value: "전체", labelKey: "programs.all_methods" },
  { value: "온라인", labelKey: "method.online" },
  { value: "전화", labelKey: "method.phone" },
  { value: "앱", labelKey: "method.app" },
  { value: "방문", labelKey: "method.visit" },
];

const categoryChipActive: Record<string, string> = {
  주거안전: "bg-sky-mid text-white",
  귀가안전: "bg-lav-mid text-white",
  생활지원: "bg-rose-mid text-white",
  건강: "bg-coral-mid text-white",
  커뮤니티: "bg-peach-mid text-white",
};

const categoryChipInactive: Record<string, string> = {
  주거안전: "border bg-sky-light text-sky-deep hover:bg-sky-mid/20",
  귀가안전: "border bg-lav-light text-lav-deep hover:bg-lav-mid/20",
  생활지원: "border bg-rose-light text-rose-deep hover:bg-rose-mid/20",
  건강: "border bg-coral-light text-coral-deep hover:bg-coral-mid/20",
  커뮤니티: "border bg-peach-light text-peach-deep hover:bg-peach-mid/20",
};

const ProgramsPage = () => {
  const { t } = useLanguage();
  const [regionFilter, setRegionFilter] = useState("all");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [methodFilter, setMethodFilter] = useState("all");
  const [freeOnly, setFreeOnly] = useState(false);
  const [openOnly, setOpenOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const { data: cities = [] } = useRegionCities();

  const { data: programs = [], isLoading } = usePrograms({
    regionCity: regionFilter !== "all" ? regionFilter : undefined,
    freeOnly,
    openOnly,
    search: searchQuery.trim() || undefined,
  });

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filtered = useMemo(() => {
    let result = programs;
    if (activeCategories.length > 0) {
      result = result.filter((p) => activeCategories.includes(p.category));
    }
    if (methodFilter !== "all") {
      result = result.filter((p) => {
        const method = (p as any).apply_method as string | null;
        if (!method) return false;
        return method.includes(methodFilter);
      });
    }
    result = [...result].sort((a, b) => {
      const aHas = a.portal_url ? 0 : 1;
      const bHas = b.portal_url ? 0 : 1;
      return aHas - bHas;
    });
    return result;
  }, [programs, activeCategories, methodFilter]);

  const activeFilterCount =
    activeCategories.length +
    (freeOnly ? 1 : 0) +
    (openOnly ? 1 : 0) +
    (regionFilter !== "all" ? 1 : 0) +
    (methodFilter !== "all" ? 1 : 0);

  return (
    <div className="flex min-h-screen flex-col bg-background pb-14 md:pb-0">
      <Navbar />
      <main className="flex-1">
        <div className="container py-6 md:py-12">
          <h1 className="mb-4 text-2xl font-bold text-foreground md:mb-6 md:text-3xl">{t("programs.title")}</h1>

          <PortalCards />

          <div className="mb-6 space-y-3 rounded-2xl border bg-card p-4 shadow-card md:space-y-4 md:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary min-h-[44px] sm:w-48"
              >
                <option value="all">{t("programs.all_regions")}</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary min-h-[44px] sm:w-36"
              >
                {applyMethodList.map((m) => (
                  <option key={m.value} value={m.value === "전체" ? "all" : m.value}>{t(m.labelKey)}</option>
                ))}
              </select>

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("programs.search_placeholder")}
                  className="pl-9 min-h-[44px] rounded-xl"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                className="sm:hidden min-h-[44px] gap-2 rounded-xl"
                onClick={() => setFiltersExpanded(!filtersExpanded)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {t("programs.filter")}
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>

            <div className={`${filtersExpanded ? "block" : "hidden"} sm:block`}>
              <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-x-visible sm:pb-0 scrollbar-hide">
                {categoryList.map(({ key, icon: CatIcon }) => (
                  <button
                    key={key}
                    onClick={() => toggleCategory(key)}
                    className={`shrink-0 inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-medium transition-colors min-h-[40px] active:scale-95 ${
                      activeCategories.includes(key)
                        ? categoryChipActive[key]
                        : categoryChipInactive[key]
                    }`}
                  >
                    <CatIcon className="h-3.5 w-3.5" />
                    {t(CAT_LABEL_KEY[key])}
                  </button>
                ))}
                <span className="mx-0.5 hidden h-8 w-px self-center bg-border sm:block" />
                <button
                  onClick={() => setFreeOnly(!freeOnly)}
                  className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium transition-colors min-h-[40px] active:scale-95 ${
                    freeOnly
                      ? "bg-sky-mid text-white"
                      : "border bg-sky-light text-sky-deep hover:bg-sky-mid/20"
                  }`}
                >
                  {t("programs.free_only")}
                </button>
                <button
                  onClick={() => setOpenOnly(!openOnly)}
                  className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium transition-colors min-h-[40px] active:scale-95 ${
                    openOnly
                      ? "bg-rose-mid text-white"
                      : "border bg-rose-light text-rose-deep hover:bg-rose-mid/20"
                  }`}
                >
                  {t("programs.open_only")}
                </button>
              </div>
            </div>
          </div>

          <p className="mb-5 text-sm text-muted-foreground">
            {t("programs.total_count")} <span className="font-bold text-primary">{filtered.length}</span>{t("programs.count_suffix")}
          </p>

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
              <p className="text-muted-foreground">{t("programs.no_results")}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProgramsPage;

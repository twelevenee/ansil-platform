import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProgramCard } from "@/components/ProgramCard";
import { getAllPrograms, filterRegions, regionData } from "@/data/mockData";

const categoryList = ["주거안전", "귀가안전", "생활지원", "건강", "커뮤니티"];

const ProgramsPage = () => {
  const [regionFilter, setRegionFilter] = useState("all");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [freeOnly, setFreeOnly] = useState(false);
  const [openOnly, setOpenOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const allPrograms = useMemo(() => getAllPrograms(), []);

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filtered = useMemo(() => {
    let result = allPrograms;
    if (regionFilter !== "all") result = result.filter((p) => p.region === regionFilter);
    if (activeCategories.length > 0) result = result.filter((p) => activeCategories.includes(p.category));
    if (freeOnly) result = result.filter((p) => p.costType === "free");
    if (openOnly) result = result.filter((p) => p.status === "open");
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.supportDetail.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allPrograms, regionFilter, activeCategories, freeOnly, openOnly, searchQuery]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8 md:py-12">
          <h1 className="mb-6 text-2xl font-bold text-secondary md:text-3xl">전체 지원제도</h1>

          {/* Filter bar */}
          <div className="mb-6 space-y-4 rounded-xl border bg-card p-4 shadow-sm md:p-5">
            {/* Row 1: Region + Search */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {filterRegions.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="제도명 또는 내용 검색"
                  className="pl-9"
                />
              </div>
            </div>

            {/* Row 2: Category chips + toggles */}
            <div className="flex flex-wrap items-center gap-2">
              {categoryList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    activeCategories.includes(cat)
                      ? "bg-primary text-primary-foreground"
                      : "border bg-background text-muted-foreground hover:bg-primary-light hover:text-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}

              <span className="mx-1 hidden h-5 w-px bg-border sm:block" />

              <button
                onClick={() => setFreeOnly(!freeOnly)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  freeOnly
                    ? "bg-success text-success-foreground"
                    : "border bg-background text-muted-foreground hover:bg-success/10 hover:text-success"
                }`}
              >
                무료만 보기
              </button>
              <button
                onClick={() => setOpenOnly(!openOnly)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  openOnly
                    ? "bg-success text-success-foreground"
                    : "border bg-background text-muted-foreground hover:bg-success/10 hover:text-success"
                }`}
              >
                신청가능만 보기
              </button>
            </div>
          </div>

          {/* Results count */}
          <p className="mb-5 text-sm text-muted-foreground">
            총 <span className="font-bold text-primary">{filtered.length}</span>건의 지원제도
          </p>

          {/* Cards grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProgramCard key={p.id} program={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border bg-card p-12 text-center">
              <p className="text-muted-foreground">검색 조건에 맞는 제도가 없습니다.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProgramsPage;

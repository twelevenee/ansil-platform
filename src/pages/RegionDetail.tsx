import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProgramCard, categoryIcons } from "@/components/ProgramCard";
import { regionData, mockPrograms, gapAlerts } from "@/data/mockData";

const categories = ["전체", "주거안전", "귀가안전", "생활지원", "건강", "커뮤니티"];

const RegionDetail = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("전체");
  const [aiQuery, setAiQuery] = useState("");

  const region = cityName ? regionData[cityName] : null;
  const programs = cityName ? mockPrograms[cityName] || [] : [];
  const gap = cityName ? gapAlerts[cityName] : null;
  const filtered = activeCategory === "전체" ? programs : programs.filter((p) => p.category === activeCategory);

  if (!region) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">지역을 찾을 수 없습니다.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAiSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const text = aiQuery.trim() || `${region.name} 지원제도 알려줘`;
    navigate(`/chat?q=${encodeURIComponent(text)}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8 md:py-12">
          <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> 전국 대시보드
          </Link>

          <h1 className="mb-4 text-2xl font-bold text-secondary md:text-3xl">{region.name} 지원제도 현황</h1>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground">
              총 <span className="font-bold text-primary">{region.programCount}</span>개 제도
            </span>
            {Object.entries(region.categories).map(([cat, count]) => {
              const Icon = categoryIcons[cat];
              return (
                <span key={cat} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" /> {cat} {count}
                </span>
              );
            })}
          </div>

          {cityName !== "seoul" && gap && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-accent bg-accent/10 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <p className="text-sm text-card-foreground">
                <span className="font-semibold">서울 대비 부족한 영역:</span> {gap}
              </p>
            </div>
          )}

          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "border bg-card text-muted-foreground hover:bg-primary-light hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProgramCard key={p.id} program={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border bg-card p-12 text-center">
              <p className="text-muted-foreground">해당 카테고리에 등록된 제도가 없습니다.</p>
            </div>
          )}

          <div className="mt-12 rounded-xl bg-secondary p-6 text-center md:p-8">
            <p className="mb-4 text-sm font-medium text-secondary-foreground">
              이 지역 지원에 대해 더 궁금하면 AI에게 물어보세요
            </p>
            <form onSubmit={handleAiSearch} className="mx-auto flex max-w-lg items-center gap-2 rounded-lg bg-card p-2">
              <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
              <Input
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder={`${region.name} 지원제도에 대해 물어보세요`}
                className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <Button type="submit" className="shrink-0 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                질문하기
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

import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Shield, Heart, Activity, Users, ChevronDown, ChevronUp, ExternalLink, Phone, Search, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { regionData, mockPrograms, gapAlerts, categoryBadgeClasses, type Program } from "@/data/mockData";

const categoryIcons: Record<string, React.ElementType> = {
  주거안전: Home, 귀가안전: Shield, 생활지원: Heart, 건강: Activity, 커뮤니티: Users,
};

const categories = ["전체", "주거안전", "귀가안전", "생활지원", "건강", "커뮤니티"];

function ProgramCard({ program }: { program: Program }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = categoryIcons[program.category] || Home;
  const badgeClass = categoryBadgeClasses[program.category] || "bg-muted text-muted-foreground";

  return (
    <div className="flex flex-col rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="flex flex-1 flex-col p-5">
        {/* Category tag */}
        <div className="mb-3 flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5" />
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}>
            {program.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-bold text-card-foreground">{program.name}</h3>

        {/* Description — 2 lines */}
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{program.supportDetail}</p>

        {/* Badges */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="outline" className={program.costType === "free" ? "border-success text-success" : "border-border text-muted-foreground"}>
            {program.cost}
          </Badge>
          <Badge variant="outline" className={program.status === "open" ? "border-success text-success" : "border-destructive text-destructive"}>
            {program.status === "open" ? "신청가능" : "마감"}
          </Badge>
        </div>

        {/* Buttons */}
        <div className="mt-auto flex items-center gap-2">
          <a href={program.applyUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button size="sm" className="w-full gap-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90" disabled={program.status === "closed"}>
              신청하기 <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
          <Button size="sm" variant="ghost" className="gap-1 text-muted-foreground" onClick={() => setExpanded(!expanded)}>
            자세히 {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t bg-muted/30 p-5 text-sm space-y-3">
          <Detail label="신청 방법" value={program.howToApply} />
          <Detail label="신청 기간" value={program.applyPeriod} />
          <Detail label="대상 조건" value={program.targetCondition} />
          <div>
            <span className="font-medium text-card-foreground">문의처: </span>
            <a href={`tel:${program.contact}`} className="inline-flex items-center gap-1 text-primary hover:underline">
              <Phone className="h-3.5 w-3.5" /> {program.contact}
            </a>
          </div>
          <div>
            <span className="font-medium text-card-foreground">출처: </span>
            <a href={program.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              원문 보기 <ExternalLink className="inline h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-medium text-card-foreground">{label}: </span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
}

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
          {/* Back */}
          <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> 전국 대시보드
          </Link>

          {/* Title + Summary */}
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

          {/* Gap Alert */}
          {cityName !== "seoul" && gap && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-accent bg-accent/10 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <p className="text-sm text-card-foreground">
                <span className="font-semibold">서울 대비 부족한 영역:</span> {gap}
              </p>
            </div>
          )}

          {/* Category Filter Tabs */}
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

          {/* Cards Grid */}
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

          {/* AI Prompt */}
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

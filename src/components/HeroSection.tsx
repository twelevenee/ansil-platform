import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function HeroSection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/chat?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-light via-background to-background py-16 md:py-24">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold tracking-wide text-primary animate-fade-in-up">
            여성 1인가구 안심지원 통합 플랫폼
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight text-secondary md:text-5xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            내 지역 안심 지원제도,
            <br />
            한눈에 찾아보세요
          </h1>
          <p className="mb-8 text-base text-muted-foreground md:text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            전국 17개 시·도의 안전·생활 지원제도를 지도로 확인하고,
            <br className="hidden md:block" />
            AI가 내 상황에 맞는 제도를 찾아드립니다.
          </p>

          {/* Search CTA */}
          <form
            onSubmit={handleSearch}
            className="mx-auto flex max-w-lg items-center gap-2 rounded-xl border bg-card p-2 shadow-lg animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="예: 서울 1인가구 안전 지원제도 알려줘"
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <Button type="submit" className="shrink-0 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
              검색
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const exampleQuestions = [
  "관악구 안심홈세트 알려줘",
  "밤에 귀가가 무서워요",
  "대전 지원제도",
  "혼자 병원 가기 힘들어요",
];

export function AISearchSection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const go = (text: string) => navigate(`/chat?q=${encodeURIComponent(text)}`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) go(query.trim());
  };

  return (
    <section className="bg-secondary py-16 md:py-20">
      <div className="container mx-auto max-w-2xl text-center">
        <MessageCircle className="mx-auto mb-4 h-8 w-8 text-primary" />
        <h2 className="mb-2 text-2xl font-bold text-secondary-foreground md:text-3xl">
          나에게 맞는 지원제도, AI가 찾아드려요
        </h2>
        <p className="mb-8 text-sm text-secondary-foreground/70">
          궁금한 점을 자유롭게 물어보세요
        </p>

        <form onSubmit={handleSubmit} className="mb-6 flex items-center gap-2 rounded-lg bg-card p-2 shadow-lg">
          <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="어떤 도움이 필요하신가요?"
            className="border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
          />
          <Button type="submit" className="shrink-0 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
            검색
          </Button>
        </form>

        <div className="flex flex-wrap justify-center gap-2">
          {exampleQuestions.map((q) => (
            <button
              key={q}
              onClick={() => go(q)}
              className="rounded-full border border-secondary-foreground/20 bg-card px-4 py-2 text-sm text-card-foreground transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

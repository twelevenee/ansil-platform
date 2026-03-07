import { useState } from "react";
import { Home, Shield, Heart, Activity, Users, ChevronDown, ChevronUp, ExternalLink, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categoryBadgeClasses, type Program } from "@/data/mockData";

export const categoryIcons: Record<string, React.ElementType> = {
  주거안전: Home, 귀가안전: Shield, 생활지원: Heart, 건강: Activity, 커뮤니티: Users,
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-medium text-card-foreground">{label}: </span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
}

export function ProgramCard({ program }: { program: Program }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = categoryIcons[program.category] || Home;
  const badgeClass = categoryBadgeClasses[program.category] || "bg-muted text-muted-foreground";

  return (
    <div className="flex flex-col rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5" />
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}>
            {program.category}
          </span>
        </div>
        <h3 className="mb-2 text-lg font-bold text-card-foreground">{program.name}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{program.supportDetail}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="outline" className={program.costType === "free" ? "border-success text-success" : "border-border text-muted-foreground"}>
            {program.cost}
          </Badge>
          <Badge variant="outline" className={program.status === "open" ? "border-success text-success" : "border-destructive text-destructive"}>
            {program.status === "open" ? "신청가능" : "마감"}
          </Badge>
        </div>
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

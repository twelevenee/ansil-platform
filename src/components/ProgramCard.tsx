import { useState } from "react";
import { Home, Shield, Heart, Activity, Users, ChevronDown, ChevronUp, ExternalLink, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Program } from "@/hooks/usePrograms";

export const categoryIcons: Record<string, React.ElementType> = {
  주거안전: Home, 귀가안전: Shield, 생활지원: Heart, 건강: Activity, 커뮤니티: Users,
};

const categoryBadgeClasses: Record<string, string> = {
  주거안전: "bg-sky-light text-sky-deep border border-sky-mid/30",
  귀가안전: "bg-lav-light text-lav-deep border border-lav-mid/30",
  생활지원: "bg-rose-light text-rose-deep border border-rose-mid/30",
  건강: "bg-coral-light text-coral-deep border border-coral-mid/30",
  커뮤니티: "bg-peach-light text-peach-deep border border-peach-mid/30",
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
  const isFree = program.cost === "무료";
  const isOpen = program.status === "신청가능";

  return (
    <div className="flex flex-col rounded-2xl border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <div className="mb-3 flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}>
            {program.category}
          </span>
        </div>
        <h3 className="mb-2 text-base font-bold text-card-foreground md:text-lg">{program.name}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{program.support_detail}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {/* 무료 = sky, 유료 = peach */}
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${
            isFree ? "bg-sky-light text-sky-deep border-sky-mid/30" : "bg-peach-light text-peach-deep border-peach-mid/30"
          }`}>
            {program.cost}
          </span>
          {/* 신청가능 = rose, 마감 = coral */}
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${
            isOpen ? "bg-rose-light text-rose-deep border-rose-mid/30" : "bg-coral-light text-coral-deep border-coral-mid/30"
          }`}>
            {isOpen ? "신청가능" : "마감"}
          </span>
        </div>
        <div className="mt-auto flex items-center gap-2">
          <a href={program.apply_url || "#"} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button
              size="sm"
              className="w-full gap-1 rounded-xl bg-rose-mid text-white hover:bg-rose-deep min-h-[44px]"
              disabled={!isOpen}
            >
              신청하기 <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
          <Button
            size="sm"
            variant="ghost"
            className="gap-1 text-muted-foreground min-h-[44px] min-w-[44px] hover:bg-lav-light hover:text-lav-deep"
            onClick={() => setExpanded(!expanded)}
          >
            자세히 {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="border-t bg-muted/30 p-4 text-sm space-y-3 md:p-5">
          <Detail label="신청 방법" value={program.how_to_apply} />
          {program.apply_period && <Detail label="신청 기간" value={program.apply_period} />}
          {program.target_age && <Detail label="대상 연령" value={program.target_age} />}
          <Detail label="대상" value={`${program.target_gender || ''} ${program.target_household || ''}`} />
          {program.contact && (
            <div>
              <span className="font-medium text-card-foreground">문의처: </span>
              <a href={`tel:${program.contact}`} className="inline-flex items-center gap-1 text-sky-deep hover:underline min-h-[44px]">
                <Phone className="h-3.5 w-3.5" /> {program.contact}
              </a>
            </div>
          )}
          {program.source_url && (
            <div>
              <span className="font-medium text-card-foreground">출처: </span>
              <a href={program.source_url} target="_blank" rel="noopener noreferrer" className="text-sky-deep hover:underline">
                원문 보기 <ExternalLink className="inline h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

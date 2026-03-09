import { useState } from "react";
import { Home, Shield, Heart, ShoppingBag, Users, ChevronDown, ChevronUp, ExternalLink, Phone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { CAT_LABEL_KEY } from "@/utils/categoryMap";
import type { Program } from "@/hooks/usePrograms";

export const categoryIcons: Record<string, React.ElementType> = {
  주거안전: Home, 귀가안전: Shield, 생활지원: ShoppingBag, 건강: Heart, 커뮤니티: Users,
};

const categoryBadgeClasses: Record<string, string> = {
  주거안전: "bg-sky-light text-sky-deep border border-sky-mid/30",
  귀가안전: "bg-lav-light text-lav-deep border border-lav-mid/30",
  생활지원: "bg-rose-light text-rose-deep border border-rose-mid/30",
  건강: "bg-coral-light text-coral-deep border border-coral-mid/30",
  커뮤니티: "bg-peach-light text-peach-deep border border-peach-mid/30",
};

const applyMethodColors: Record<string, string> = {
  "온라인 신청": "bg-sky-light text-sky-deep border-sky-mid/30",
  "온라인/전화": "bg-sky-light text-sky-deep border-sky-mid/30",
  "전화/온라인": "bg-sky-light text-sky-deep border-sky-mid/30",
  "전화 문의": "bg-coral-light text-coral-deep border-coral-mid/30",
  "전화/앱 신청": "bg-lav-light text-lav-deep border-lav-mid/30",
  "앱 신청": "bg-lav-light text-lav-deep border-lav-mid/30",
  "앱/콜센터": "bg-lav-light text-lav-deep border-lav-mid/30",
  "행정복지센터 방문": "bg-peach-light text-peach-deep border-peach-mid/30",
  "가족센터 방문/이메일": "bg-peach-light text-peach-deep border-peach-mid/30",
  "시청 문의": "bg-peach-light text-peach-deep border-peach-mid/30",
  "구청 이메일 신청": "bg-sky-light text-sky-deep border-sky-mid/30",
  "즉시 이용": "bg-rose-light text-rose-deep border-rose-mid/30",
  "전화/방문": "bg-peach-light text-peach-deep border-peach-mid/30",
};

function getApplyMethodColor(method: string | null): string {
  if (!method) return "bg-muted text-muted-foreground";
  return applyMethodColors[method] || "bg-muted text-muted-foreground";
}

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
  const { t } = useLanguage();
  const Icon = categoryIcons[program.category] || Home;
  const badgeClass = categoryBadgeClasses[program.category] || "bg-muted text-muted-foreground";
  const isFree = program.cost === "무료";
  const isOpen = program.status === "신청가능";
  const applyMethod = (program as any).apply_method as string | null;
  const portalUrl = (program as any).portal_url as string | null;

  return (
    <div className="group flex flex-col rounded-2xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover active:scale-[0.98]">
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <div className="mb-3 flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}>
            {CAT_LABEL_KEY[program.category] ? t(CAT_LABEL_KEY[program.category]) : program.category}
          </span>
        </div>
        <h3 className="mb-2 text-base font-bold text-card-foreground md:text-lg">{program.name}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{program.support_detail}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${
            isFree ? "bg-sky-light text-sky-deep border-sky-mid/30" : "bg-peach-light text-peach-deep border-peach-mid/30"
          }`}>
            {isFree ? t("common.free") : program.cost}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${
            isOpen ? "bg-rose-light text-rose-deep border-rose-mid/30" : "bg-coral-light text-coral-deep border-coral-mid/30"
          }`}>
            {isOpen ? t("card.open") : t("card.closed")}
          </span>
          {applyMethod && (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${getApplyMethodColor(applyMethod)}`}>
              {applyMethod}
            </span>
          )}
        </div>
        <div className="mt-auto flex items-center gap-2">
          <a href={program.apply_url || "#"} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button
              size="sm"
              className="w-full gap-1 rounded-xl bg-rose-mid text-white hover:bg-rose-deep min-h-[44px]"
              disabled={!isOpen}
            >
              {t("card.apply")} <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
          {portalUrl && (
            <a href={portalUrl} target="_blank" rel="noopener noreferrer">
              <Button
                size="sm"
                variant="outline"
                className="gap-1 min-h-[44px] min-w-[44px] rounded-xl border-sky-mid/30 text-sky-deep hover:bg-sky-light"
              >
                <Globe className="h-3.5 w-3.5" />
              </Button>
            </a>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="gap-1 text-muted-foreground min-h-[44px] min-w-[44px] hover:bg-lav-light hover:text-lav-deep"
            onClick={() => setExpanded(!expanded)}
          >
            {t("card.details")} {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="border-t bg-muted/30 p-4 text-sm space-y-3 md:p-5">
          <Detail label={t("card.apply_method")} value={program.how_to_apply} />
          {applyMethod && <Detail label={t("card.apply_type")} value={applyMethod} />}
          {program.apply_period && <Detail label={t("card.apply_period")} value={program.apply_period} />}
          {program.target_age && <Detail label={t("card.target_age")} value={program.target_age} />}
          <Detail label={t("card.target")} value={`${program.target_gender || ''} ${program.target_household || ''}`} />
          {program.contact && (
            <div>
              <span className="font-medium text-card-foreground">{t("card.contact")}: </span>
              <a href={`tel:${program.contact}`} className="inline-flex items-center gap-1 text-sky-deep hover:underline min-h-[44px]">
                <Phone className="h-3.5 w-3.5" /> {program.contact}
              </a>
            </div>
          )}
          {program.source_url && (
            <div>
              <span className="font-medium text-card-foreground">{t("card.source")}: </span>
              <a href={program.source_url} target="_blank" rel="noopener noreferrer" className="text-sky-deep hover:underline">
                {t("card.view_source")} <ExternalLink className="inline h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { ExternalLink, MapPin } from "lucide-react";
import { usePortals } from "@/hooks/usePortals";
import { useLanguage } from "@/contexts/LanguageContext";

const regionColors: Record<string, string> = {
  서울: "bg-sky-light text-sky-deep",
  경기: "bg-lav-light text-lav-deep",
  인천: "bg-rose-light text-rose-deep",
  전국: "bg-peach-light text-peach-deep",
};

export function PortalCards() {
  const { data: portals = [], isLoading } = usePortals();
  const { t } = useLanguage();

  if (isLoading || portals.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-lg font-bold text-foreground md:text-xl">{t("portal.title")}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {portals.map((portal) => (
          <a
            key={portal.id}
            href={portal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-2 rounded-2xl border bg-card p-4 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
          >
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${regionColors[portal.region] || "bg-muted text-muted-foreground"}`}>
                <MapPin className="mr-0.5 inline h-3 w-3" />
                {portal.region}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors">
              {portal.portal_name}
            </h3>
            {portal.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">{portal.description}</p>
            )}
            <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-sky-deep">
              {t("portal.go")} <ExternalLink className="h-3 w-3" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

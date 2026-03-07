import { MapPin } from "lucide-react";

export function MapPlaceholder() {
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <h2 className="mb-2 text-center text-2xl font-bold text-secondary md:text-3xl">
          전국 지도로 한눈에
        </h2>
        <p className="mb-8 text-center text-muted-foreground">
          관심 지역을 클릭하면 해당 지역의 지원제도를 확인할 수 있어요
        </p>

        <div className="mx-auto flex max-w-3xl items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 p-16 md:p-24">
          <div className="text-center">
            <MapPin className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">
              여기에 전국 지도가 들어갑니다
            </p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              Phase A-2에서 SVG 인터랙티브 지도 구현 예정
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

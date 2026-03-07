export function Footer() {
  return (
    <footer className="border-t bg-muted py-8">
      <div className="container space-y-2 text-center">
        <p className="text-xs text-muted-foreground">
          데이터 출처: 씽글벙글 서울, 공공데이터포털, 각 지자체 홈페이지
        </p>
        <p className="text-xs text-muted-foreground">
          이 서비스는 AI 기반으로 제공되며, 정확한 자격 여부는 해당 기관에 직접 확인해주세요.
        </p>
        <p className="pt-2 text-xs text-muted-foreground/60">
          © 2026 안심찾기. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

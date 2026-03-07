import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card py-10">
      <div className="container">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold text-secondary">안심찾기</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            여성 1인가구를 위한 안심지원 통합 플랫폼 · 문의:{" "}
            <span className="text-primary">help@ansimfind.kr</span>
          </p>
          <p className="text-xs text-muted-foreground/60">
            © 2026 안심찾기. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

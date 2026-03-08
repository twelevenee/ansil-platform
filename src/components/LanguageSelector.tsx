import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/i18n/translations";

const languages: { code: Language; flag: string; label: string; short: string }[] = [
  { code: "ko", flag: "🇰🇷", label: "한국어", short: "KR" },
  { code: "en", flag: "🇺🇸", label: "English", short: "EN" },
  { code: "vi", flag: "🇻🇳", label: "Tiếng Việt", short: "VI" },
  { code: "zh", flag: "🇨🇳", label: "中文", short: "ZH" },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === language)!;

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1.5 text-sm font-medium text-foreground shadow-sm transition-all hover:shadow-card active:scale-95 min-h-[36px]"
        aria-label="Language"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="text-xs font-semibold">{current.short}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border bg-card shadow-card-hover animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-1.5">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors min-h-[44px] ${
                  language === lang.code
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <span className="text-lg leading-none">{lang.flag}</span>
                <span>{lang.label}</span>
                {language === lang.code && (
                  <span className="ml-auto text-xs text-primary">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

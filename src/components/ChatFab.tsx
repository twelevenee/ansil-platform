import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

export const ChatFab = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  // Hide on chat page
  if (location.pathname === "/chat") return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 flex items-center gap-3 md:bottom-6">
      {isHovered && (
        <div className="animate-in fade-in slide-in-from-right-2 duration-200">
          <div className="rounded-2xl bg-card border border-border shadow-card-hover px-4 py-2.5 backdrop-blur-sm">
            <p className="text-sm font-medium text-foreground whitespace-nowrap">
              {t("fab.help")}
            </p>
          </div>
        </div>
      )}
      
      <button
        onClick={() => navigate("/chat")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative h-16 w-16 rounded-full bg-gradient-cta shadow-card-hover transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 flex items-center justify-center"
        aria-label={t("fab.help")}
      >
        {/* Pulse animation ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-cta opacity-75 animate-ping" style={{ animationDuration: '2s' }} />
        
        {/* Main button content */}
        <div className="relative flex items-center justify-center">
          <span className="text-3xl group-hover:scale-110 transition-transform duration-300" role="img" aria-label="chat">
            💭
          </span>
        </div>
      </button>
    </div>
  );
};

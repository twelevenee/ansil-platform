import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, ThumbsUp, ThumbsDown, ExternalLink, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/contexts/LanguageContext";
import { CAT_LABEL_KEY } from "@/utils/categoryMap";

interface RecommendedProgram {
  id: string;
  name: string;
  region_city: string;
  category: string;
  support_detail: string;
  cost: string;
  how_to_apply: string;
  contact: string | null;
  apply_url: string | null;
  source_url: string | null;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  feedback?: "up" | "down" | null;
  recommended_programs?: RecommendedProgram[];
  is_emergency?: boolean;
  chat_log_id?: string | null;
}

const categoryBadgeColors: Record<string, string> = {
  주거안전: "bg-sky-light text-sky-deep",
  귀가안전: "bg-lav-light text-lav-deep",
  생활지원: "bg-rose-light text-rose-deep",
  건강: "bg-coral-light text-coral-deep",
  커뮤니티: "bg-peach-light text-peach-deep",
};

function getSessionId(): string {
  let sid = sessionStorage.getItem("chat_session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("chat_session_id", sid);
  }
  return sid;
}

function TypingIndicator({ label }: { label: string }) {
  return (
    <div className="flex items-start gap-2">
      <img src={ansimiAvatar} alt="안심이" className="h-8 w-8 shrink-0 rounded-full object-cover" />
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border bg-card px-4 py-3 shadow-card">
        <span className="text-xs text-muted-foreground mr-2">{label}</span>
        <span className="h-2 w-2 animate-bounce rounded-full bg-lav-mid" style={{ animationDelay: "0ms" }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-rose-mid" style={{ animationDelay: "150ms" }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-peach-mid" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

function ProgramCard({ program, applyLabel, sourceLabel, freeLabel, catLabel }: { program: RecommendedProgram; applyLabel: string; sourceLabel: string; freeLabel: string; catLabel: string }) {
  const badgeClass = categoryBadgeColors[program.category] || "bg-muted text-muted-foreground";
  const phone = program.contact?.match(/[\d-]{7,}/)?.[0];
  const isFree = program.cost === "무료";

  return (
    <div className="rounded-xl border bg-card p-3 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="mb-2 flex items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${badgeClass}`}>
          {catLabel}
        </span>
        <span className="text-[10px] text-muted-foreground">{program.region_city}</span>
      </div>
      <h4 className="mb-1 text-sm font-semibold text-foreground">{program.name}</h4>
      <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">{program.support_detail}</p>
      <div className="mb-2 flex items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${isFree ? "bg-sky-light text-sky-deep" : "bg-peach-light text-peach-deep"}`}>
          {isFree ? freeLabel : program.cost}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {program.apply_url && (
          <a href={program.apply_url} target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-[36px] items-center gap-1 rounded-lg bg-rose-mid px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-rose-deep">
            {applyLabel} <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {phone && (
          <a href={`tel:${phone}`}
            className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted">
            📞 {phone}
          </a>
        )}
        {program.source_url && (
          <a href={program.source_url} target="_blank" rel="noopener noreferrer"
            className="text-[10px] text-muted-foreground underline hover:text-foreground">
            {sourceLabel}
          </a>
        )}
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onFeedback,
  applyLabel,
  sourceLabel,
  freeLabel,
  translateCat,
}: {
  message: ChatMessage;
  onFeedback?: (id: string, type: "up" | "down") => void;
  applyLabel: string;
  sourceLabel: string;
  freeLabel: string;
  translateCat: (cat: string) => string;
}) {
  const { t } = useLanguage();
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}>
      {!isUser && (
        <img src={ansimiAvatar} alt="안심이" className="h-8 w-8 shrink-0 rounded-full object-cover mt-1" />
      )}
      <div className="max-w-[85%] space-y-3 md:max-w-[75%]">
        {message.is_emergency && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
            <div className="text-sm font-semibold text-destructive">
              🚨 {t("chat.emergency_label")} <a href="tel:112" className="underline">{t("chat.emergency_police")}</a> | <a href="tel:1366" className="underline">{t("chat.emergency_women")}</a>
            </div>
          </div>
        )}

        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "rounded-tr-sm bg-rose-light text-card-foreground"
              : "rounded-tl-sm border border-rose-light/50 bg-card text-card-foreground shadow-card"
          }`}
        >
          {isUser ? (
            message.content
          ) : (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                  ul: ({ children }) => <ul className="list-disc pl-4 my-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-4 my-1">{children}</ol>,
                  li: ({ children }) => <li className="mb-0.5">{children}</li>,
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  h3: ({ children }) => <h3 className="font-bold text-base mt-2 mb-1">{children}</h3>,
                  h2: ({ children }) => <h2 className="font-bold text-base mt-3 mb-1">{children}</h2>,
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-sky-deep underline">
                      {children}
                    </a>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {message.recommended_programs && message.recommended_programs.length > 0 && (
          <div className="space-y-2">
            {message.recommended_programs.map((p) => (
              <ProgramCard key={p.id} program={p} applyLabel={applyLabel} sourceLabel={sourceLabel} freeLabel={freeLabel} catLabel={translateCat(p.category)} />
            ))}
          </div>
        )}

        {message.role === "assistant" && message.id !== "welcome" && onFeedback && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onFeedback(message.id, "up")}
              className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2.5 transition-colors ${
                message.feedback === "up" ? "bg-sky-light text-sky-deep" : "text-muted-foreground/40 hover:text-muted-foreground"
              }`}
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => onFeedback(message.id, "down")}
              className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2.5 transition-colors ${
                message.feedback === "down" ? "bg-coral-light text-coral-deep" : "text-muted-foreground/40 hover:text-muted-foreground"
              }`}
            >
              <ThumbsDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();

  const welcomeMessage: ChatMessage = {
    id: "welcome",
    role: "assistant",
    content: t("chat.welcome"),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoSentRef = useRef(false);
  const sessionId = useRef(getSessionId());

  const exampleChips = [t("chat.chip1"), t("chat.chip2"), t("chat.chip3"), t("chat.chip4")];

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  useEffect(() => {
    const handleResize = () => setTimeout(scrollToBottom, 100);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
      return () => window.visualViewport?.removeEventListener("resize", handleResize);
    }
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setChipsVisible(false);
      setIsTyping(true);

      if (window.matchMedia("(pointer: coarse)").matches) {
        inputRef.current?.blur();
      }

      try {
        const { data, error } = await supabase.functions.invoke("chat", {
          body: { message: text.trim(), session_id: sessionId.current },
        });

        if (error) throw error;

        const assistantMsg: ChatMessage = {
          id: Date.now().toString() + "-ai",
          role: "assistant",
          content: data.message,
          feedback: null,
          recommended_programs: data.recommended_programs,
          is_emergency: data.is_emergency,
          chat_log_id: data.chat_log_id,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (e: any) {
        console.error("Chat error:", e);
        toast({
          title: t("chat.error_title"),
          description: t("chat.error"),
          variant: "destructive",
        });
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping, t]
  );

  useEffect(() => {
    const q = searchParams.get("q");
    if (q && !autoSentRef.current) {
      autoSentRef.current = true;
      setTimeout(() => sendMessage(q), 300);
    }
  }, [searchParams, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleFeedback = async (id: string, type: "up" | "down") => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, feedback: m.feedback === type ? null : type } : m))
    );

    const msg = messages.find((m) => m.id === id);
    if (msg?.chat_log_id) {
      try {
        await supabase.from("feedback").insert({
          chat_log_id: msg.chat_log_id,
          rating: type === "up" ? 5 : 1,
        });
      } catch (e) {
        console.error("Feedback error:", e);
      }
    }
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto max-w-3xl space-y-4 px-4 py-4 pb-2 md:py-6">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} onFeedback={handleFeedback} applyLabel={t("chat.apply")} sourceLabel={t("chat.source")} freeLabel={t("common.free")} translateCat={(cat) => CAT_LABEL_KEY[cat] ? t(CAT_LABEL_KEY[cat]) : cat} />
            ))}

            {chipsVisible && messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pl-10">
                {exampleChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    className="min-h-[44px] rounded-full border bg-card px-3.5 py-2.5 text-xs text-card-foreground transition-all hover:-translate-y-0.5 hover:shadow-card-hover active:scale-95"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {isTyping && <TypingIndicator label={t("chat.typing")} />}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="border-t bg-card pb-[env(safe-area-inset-bottom)] mb-[52px] md:mb-0">
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chat.placeholder")}
              className="min-h-[44px] flex-1 rounded-xl border bg-background px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-rose-mid focus:ring-1 focus:ring-rose-mid"
              disabled={isTyping}
              enterKeyHint="send"
              autoComplete="off"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isTyping}
              className="min-h-[44px] min-w-[44px] shrink-0 rounded-xl bg-gradient-cta text-white hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, ThumbsUp, ThumbsDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

interface ProgramRec {
  name: string;
  region: string;
  cost: string;
  url: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  programs?: ProgramRec[];
  disclaimer?: string;
  feedback?: "up" | "down" | null;
}

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "ai",
  text: "안녕하세요! 여성 1인가구 안심지원 AI입니다 🏠\n\n거주 지역과 상황을 알려주시면 맞춤 지원제도를 찾아드릴게요.",
};

const exampleChips = [
  "관악구에 혼자 이사했는데 현관이 불안해요",
  "대전에서 혼자 사는데 지원 뭐가 있어요?",
  "밤에 혼자 귀가하는 게 무서워요",
  "혼자 아파서 병원 가기 힘들어요",
];

function mockAiResponse(userText: string): ChatMessage {
  return {
    id: Date.now().toString() + "-ai",
    role: "ai",
    text: userText.includes("귀가")
      ? "야간 귀가가 걱정되시군요. 이런 지원제도가 있어요:"
      : userText.includes("병원") || userText.includes("아파")
      ? "혼자 아플 때 도움이 되는 서비스들이에요:"
      : userText.includes("대전")
      ? "대전광역시에서 이용 가능한 지원제도를 찾았어요:"
      : "관악구 여성 1인가구라면 이런 지원을 받을 수 있어요:",
    programs: [
      { name: "안심홈 3종세트", region: "관악구", cost: "무료", url: "https://www.seoul.go.kr" },
      { name: "안전 도어지킴이", region: "서울 전체", cost: "월 9,900원", url: "https://www.seoul.go.kr" },
    ],
    disclaimer: "ℹ️ 정확한 자격 여부는 해당 기관에 직접 확인해주세요.",
    feedback: null,
  };
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2">
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-card border px-4 py-3 shadow-sm">
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "0ms" }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "150ms" }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onFeedback,
}: {
  message: ChatMessage;
  onFeedback?: (id: string, type: "up" | "down") => void;
}) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] md:max-w-[75%] space-y-3`}>
        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "rounded-tr-sm bg-primary-light text-card-foreground"
              : "rounded-tl-sm border bg-card text-card-foreground shadow-sm"
          }`}
        >
          {message.text}
        </div>

        {/* Program recommendation cards */}
        {message.programs && (
          <div className="space-y-2">
            {message.programs.map((p) => (
              <div key={p.name} className="flex items-center justify-between gap-2 rounded-xl border bg-card p-3 shadow-sm">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-card-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.region} · <span className={p.cost === "무료" ? "text-success" : "text-muted-foreground"}>{p.cost}</span>
                  </p>
                </div>
                <a href={p.url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="shrink-0 gap-1 text-xs text-primary hover:bg-primary-light min-h-[44px] min-w-[44px]">
                    신청 <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        {message.disclaimer && (
          <p className="text-xs text-muted-foreground">{message.disclaimer}</p>
        )}

        {/* Feedback buttons — 44px touch targets */}
        {message.role === "ai" && message.id !== "welcome" && onFeedback && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onFeedback(message.id, "up")}
              className={`rounded-md p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors ${
                message.feedback === "up" ? "bg-success/10 text-success" : "text-muted-foreground/40 hover:text-muted-foreground"
              }`}
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => onFeedback(message.id, "down")}
              className={`rounded-md p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors ${
                message.feedback === "down" ? "bg-destructive/10 text-destructive" : "text-muted-foreground/40 hover:text-muted-foreground"
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
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoSentRef = useRef(false);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle mobile viewport resize (keyboard open/close)
  useEffect(() => {
    const handleResize = () => {
      // Scroll to bottom when virtual keyboard appears
      setTimeout(scrollToBottom, 100);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
      return () => window.visualViewport?.removeEventListener("resize", handleResize);
    }
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        text: text.trim(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setChipsVisible(false);
      setIsTyping(true);

      // Blur input on mobile to close keyboard after sending
      if (window.matchMedia("(pointer: coarse)").matches) {
        inputRef.current?.blur();
      }

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, mockAiResponse(text)]);
      }, 2000);
    },
    [isTyping]
  );

  // Auto-send query param
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

  const handleFeedback = (id: string, type: "up" | "down") => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, feedback: m.feedback === type ? null : type } : m))
    );
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <Navbar />

      {/* Chat area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto max-w-3xl space-y-4 px-4 py-4 pb-2 md:py-6">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} onFeedback={handleFeedback} />
            ))}

            {/* Example chips — only after welcome, before first user message */}
            {chipsVisible && messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pl-0">
                {exampleChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    className="rounded-full border bg-card px-3.5 py-2.5 text-xs text-card-foreground transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95 min-h-[44px]"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input — sticky bottom with safe area */}
        <div className="border-t bg-card pb-[env(safe-area-inset-bottom)]">
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="궁금한 점을 물어보세요..."
              className="flex-1 rounded-lg border bg-background px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary min-h-[44px]"
              disabled={isTyping}
              enterKeyHint="send"
              autoComplete="off"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isTyping}
              className="shrink-0 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 min-h-[44px] min-w-[44px]"
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

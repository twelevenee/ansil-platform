import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const EMERGENCY_KEYWORDS = ["스토킹", "폭력", "성폭력", "살해", "자해", "죽고싶", "죽고 싶", "때려", "맞았", "협박"];

const REGION_MAP: Record<string, string> = {
  서울: "서울특별시", 부산: "부산광역시", 대구: "대구광역시", 인천: "인천광역시",
  광주: "광주광역시", 대전: "대전광역시", 울산: "울산광역시", 세종: "세종특별자치시",
  경기: "경기도", 강원: "강원특별자치도", 충북: "충청북도", 충남: "충청남도",
  전북: "전북특별자치도", 전남: "전라남도", 경북: "경상북도", 경남: "경상남도",
  제주: "제주특별자치도",
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  주거안전: ["안심홈", "현관", "CCTV", "도어", "보안", "잠금", "보조키", "문열림"],
  귀가안전: ["귀가", "귀갓길", "야간", "밤길", "지킴이", "스카우트", "동행"],
  생활지원: ["택배", "집수리", "생활비", "주택관리", "청소"],
  건강: ["병원", "의료", "아플", "진료", "건강", "상담", "심리"],
  커뮤니티: ["모임", "커뮤니티", "네트워킹", "자조"],
};

function detectRegion(text: string): string | null {
  for (const [short, full] of Object.entries(REGION_MAP)) {
    if (text.includes(short) || text.includes(full)) return full;
  }
  return null;
}

function detectCategory(text: string): string | null {
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((k) => text.includes(k))) return cat;
  }
  return null;
}

function isEmergency(text: string): boolean {
  return EMERGENCY_KEYWORDS.some((k) => text.includes(k));
}

function formatProgramContext(programs: any[]): string {
  return programs
    .map(
      (p) =>
        `[${p.category}] ${p.name} (${p.region_city} ${p.region_district || ""})\n지원내용: ${p.support_detail}\n비용: ${p.cost}\n신청방법: ${p.how_to_apply}\n문의: ${p.contact || "없음"}\n상태: ${p.status || "미확인"}`
    )
    .join("\n\n");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, session_id } = await req.json();
    if (!message) throw new Error("message is required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // --- Emergency detection ---
    const emergency = isEmergency(message);

    // --- Keyword-based search ---
    const detectedRegion = detectRegion(message);
    const detectedCategory = detectCategory(message);

    let matchedPrograms: any[] = [];

    // Search by region + category
    let query = supabase.from("programs").select("*");
    if (detectedRegion) {
      query = query.or(`region_city.eq.${detectedRegion},region_city.eq.전국`);
    }
    if (detectedCategory) {
      query = query.eq("category", detectedCategory);
    }
    const { data: keywordResults } = await query.limit(10);
    if (keywordResults) matchedPrograms = keywordResults;

    // If no keyword results, do a broader text search
    if (matchedPrograms.length === 0) {
      const words = message.replace(/[?？!！。.，,]/g, "").split(/\s+/).filter((w: string) => w.length >= 2);
      if (words.length > 0) {
        const orClause = words.map((w: string) => `name.ilike.%${w}%,support_detail.ilike.%${w}%,keywords.cs.{${w}}`).join(",");
        const { data: textResults } = await supabase.from("programs").select("*").or(orClause).limit(10);
        if (textResults) matchedPrograms = textResults;
      }
    }

    // Fallback: return some programs if still empty
    if (matchedPrograms.length === 0) {
      const { data: fallback } = await supabase.from("programs").select("*").limit(5);
      if (fallback) matchedPrograms = fallback;
    }

    // Deduplicate
    const seen = new Set<string>();
    matchedPrograms = matchedPrograms.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });

    // Filter to only programs with apply_url and limit to 2 for card display
    const cardPrograms = matchedPrograms.filter((p) => p.apply_url).slice(0, 2);

    // --- Build system prompt ---
    const programContext = formatProgramContext(matchedPrograms);
    const systemPrompt = `당신은 안실(ANSIL)이라는 여성 1인가구를 위한 안심지원 안내 AI입니다.
사용자의 거주 지역과 상황에 맞는 지원제도를 안내합니다.
반드시 친절하고 따뜻한 말투로 답변하세요.
각 추천 제도에 대해 **제도명**, 지원내용, 비용, 신청방법, 문의처를 포함하세요.
답변 마지막에 ℹ️ 정확한 자격 여부는 해당 기관에 직접 확인해주세요. 를 포함하세요.
스토킹, 폭력 등 위기 상황이 감지되면 즉시 112, 여성긴급전화 1366을 최우선 안내하세요.
답변은 한국어로 합니다. 마크다운 형식으로 깔끔하게 작성하세요.
중요: 볼드(**) 마크다운을 사용할 때 볼드 기호 바로 안쪽에 따옴표나 특수문자를 넣지 마세요. 예: **안실** (O), **'안실'** (X).

[통합 포털 정보 - 사용자가 "어디서 신청해요?" 등 신청 방법을 물으면 해당 지역 포털을 안내하세요]
- 서울: 씽글벙글 서울 1인가구 포털 https://1in.seoul.go.kr
- 경기: 경기도 1인가구 포털 https://www.gg.go.kr/1ingg
- 인천: 인천 1인가구 포털 https://www.incheon.go.kr/1in/index
- 전국: 복지로 (보건복지부) https://www.bokjiro.go.kr
- 전국: 찾기 쉬운 생활법령 https://www.easylaw.go.kr

[참고할 지원제도 데이터]
${programContext}`;

    // --- Call Lovable AI Gateway ---
    const aiMessages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ];

    if (emergency) {
      aiMessages.push({
        role: "system",
        content: "⚠️ 사용자가 위기 상황일 수 있습니다. 반드시 경찰 112, 여성긴급전화 1366을 가장 먼저 안내하세요.",
      });
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: aiMessages,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI 사용량이 초과되었습니다." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      return new Response(JSON.stringify({ error: "AI 서비스 오류가 발생했습니다." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const aiText = aiData.choices?.[0]?.message?.content || "죄송합니다. 답변을 생성하지 못했습니다.";

    const finalMessage = emergency
      ? `🚨 **긴급 연락처: 경찰 112 | 여성긴급전화 1366**\n\n${aiText}`
      : aiText;

    // --- Save to chat_logs ---
    const sources = matchedPrograms.map((p) => p.id);
    let chatLogId: string | null = null;

    const { data: logData } = await supabase
      .from("chat_logs")
      .insert({
        session_id: session_id || "anonymous",
        role: "user",
        message: message,
        matched_program_ids: sources,
      })
      .select("id")
      .single();

    if (logData) chatLogId = logData.id;

    // Save assistant response too
    await supabase.from("chat_logs").insert({
      session_id: session_id || "anonymous",
      role: "assistant",
      message: finalMessage,
      matched_program_ids: sources,
    });

    // --- Return response ---
    const responseBody = {
      message: finalMessage,
      recommended_programs: cardPrograms.map((p) => ({
        id: p.id,
        name: p.name,
        region_city: p.region_city,
        category: p.category,
        support_detail: p.support_detail,
        cost: p.cost,
        how_to_apply: p.how_to_apply,
        contact: p.contact,
        apply_url: p.apply_url,
        source_url: p.source_url,
      })),
      sources,
      is_emergency: emergency,
      chat_log_id: chatLogId,
    };

    return new Response(JSON.stringify(responseBody), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

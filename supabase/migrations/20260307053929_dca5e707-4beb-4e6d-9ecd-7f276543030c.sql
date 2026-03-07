
-- 1. Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. program_embeddings table
CREATE TABLE public.program_embeddings (
  id text PRIMARY KEY REFERENCES public.programs(id) ON DELETE CASCADE,
  content text NOT NULL,
  embedding vector(1536),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.program_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Program embeddings are publicly readable"
  ON public.program_embeddings FOR SELECT
  USING (true);

-- 3. match_programs function
CREATE OR REPLACE FUNCTION public.match_programs(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5
)
RETURNS TABLE (id text, content text, similarity float)
LANGUAGE sql STABLE
SET search_path = 'public'
AS $$
  SELECT
    pe.id,
    pe.content,
    (1 - (pe.embedding <=> query_embedding))::float AS similarity
  FROM public.program_embeddings pe
  WHERE 1 - (pe.embedding <=> query_embedding) > match_threshold
  ORDER BY pe.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- 4. chat_logs table
CREATE TABLE public.chat_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  message text NOT NULL,
  matched_program_ids text[],
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chat logs are publicly insertable"
  ON public.chat_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Chat logs are publicly readable"
  ON public.chat_logs FOR SELECT
  USING (true);

-- 5. feedback table
CREATE TABLE public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_log_id uuid REFERENCES public.chat_logs(id) ON DELETE CASCADE,
  program_id text REFERENCES public.programs(id) ON DELETE CASCADE,
  rating int CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Feedback is publicly insertable"
  ON public.feedback FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Feedback is publicly readable"
  ON public.feedback FOR SELECT
  USING (true);

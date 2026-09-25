CREATE TABLE public.pix_transactions (
  id text PRIMARY KEY,
  webhook_token text,
  status text NOT NULL DEFAULT 'PENDING',
  paid_at timestamptz,
  last_checked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.pix_transactions TO service_role;
ALTER TABLE public.pix_transactions ENABLE ROW LEVEL SECURITY;
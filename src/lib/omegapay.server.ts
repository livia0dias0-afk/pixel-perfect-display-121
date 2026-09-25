import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const PAID_STATUSES = ["PAID", "APPROVED", "COMPLETED", "CONFIRMED"];

/** Consulta a OmegaPay e grava o resultado. Retorna paid=false se a consulta for bloqueada. */
export async function checkAndStore(transactionId: string) {
  const pk = process.env["OMEGAPAY_PUBLIC_KEY"];
  const sk = process.env["OMEGAPAY_SECRET_KEY"];
  await supabaseAdmin.from("pix_transactions").update({ last_checked_at: new Date().toISOString() }).eq("id", transactionId);
  if (!pk || !sk) return { status: "UNKNOWN", paid: false };
  const res = await fetch(
    `https://app.omegapayments.com.br/api/v1/gateway/transactions?id=${encodeURIComponent(transactionId)}`,
    { headers: { "x-public-key": pk, "x-secret-key": sk } },
  );
  if (!res.ok) return { status: res.status === 429 ? "RATE_LIMITED" : "PENDING", paid: false };
  const j: any = await res.json().catch(() => null);
  if (j?.id && String(j.id) !== transactionId) return { status: "PENDING", paid: false };
  const status = String(j?.status ?? "PENDING").toUpperCase();
  return markStatus(transactionId, status);
}

export async function markStatus(transactionId: string, status: string) {
  const paid = PAID_STATUSES.includes(status);
  await supabaseAdmin
    .from("pix_transactions")
    .update(paid ? { status, paid_at: new Date().toISOString() } : { status })
    .eq("id", transactionId);
  return { status, paid };
}

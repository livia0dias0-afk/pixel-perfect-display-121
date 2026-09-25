import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual, createHash } from "crypto";

const same = (a: string, b: string) =>
  timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());

// Aviso automático da OmegaPay quando o status de um Pix muda.
export const Route = createFileRoute("/api/public/omegapay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body: any = await request.json().catch(() => null);
        if (!body || typeof body !== "object") return new Response("bad request", { status: 400 });
        const tx = body.transaction ?? body.data ?? body;
        const id = String(tx?.id ?? tx?.transactionId ?? body.transactionId ?? "").slice(0, 200);
        if (!id) return new Response("missing id", { status: 400 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { checkAndStore, markStatus } = await import("@/lib/omegapay.server");
        const { data: row } = await supabaseAdmin
          .from("pix_transactions")
          .select("webhook_token")
          .eq("id", id)
          .maybeSingle();
        if (!row) return new Response("unknown", { status: 404 });

        const token = String(body.webhookToken ?? body.token ?? tx?.webhookToken ?? request.headers.get("x-webhook-token") ?? "");
        const status = String(tx?.status ?? body.status ?? "").toUpperCase();
        if (row.webhook_token && token && same(token, row.webhook_token) && status) {
          await markStatus(id, status); // token confere: aviso veio da OmegaPay
        } else {
          console.warn("Webhook OmegaPay sem token válido; confirmando direto na OmegaPay", Object.keys(body));
          await checkAndStore(id); // não confia no aviso: confirma na própria OmegaPay
        }
        return new Response("ok");
      },
    },
  },
});

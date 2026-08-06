import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  amount: z.number().positive().max(100000),
  description: z.string().trim().min(1).max(140),
});

function pickPixCode(payload: unknown): string | null {
  const seen = new Set<unknown>();
  const keys = ["qrcode", "qrCode", "qr_code", "pixCode", "pix_code", "copiaecola", "copyPaste", "emv", "brcode", "brCode", "payload"];
  const walk = (node: unknown): string | null => {
    if (!node || typeof node !== "object" || seen.has(node)) return null;
    seen.add(node);
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      if (typeof v === "string" && keys.includes(k) && v.length > 30) return v;
    }
    for (const v of Object.values(node as Record<string, unknown>)) {
      const found = walk(v);
      if (found) return found;
    }
    return null;
  };
  return walk(payload);
}

export const createPixCharge = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const ci = process.env["MISTICPAY_CLIENT_ID"];
    const cs = process.env["MISTICPAY_CLIENT_SECRET"];
    if (!ci || !cs) {
      throw new Error("Pagamento indisponível: credenciais da MisticPay não configuradas.");
    }

    const transactionId = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const res = await fetch("https://api.misticpay.com/api/transactions/create", {
      method: "POST",
      headers: { ci, cs, "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: data.amount,
        payerName: "Cliente Klara",
        payerDocument: "00000000191",
        transactionId,
        description: data.description,
      }),
    });

    const raw = await res.text();
    let parsed: unknown = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }

    if (!res.ok) {
      console.error("MisticPay error", res.status, raw.slice(0, 500));
      const providerMessage =
        parsed && typeof parsed === "object" && typeof (parsed as { message?: unknown }).message === "string"
          ? (parsed as { message: string }).message
          : null;
      throw new Error(
        providerMessage
          ? `Não foi possível gerar o Pix: ${providerMessage}`
          : "Não foi possível gerar o Pix agora. Tente novamente.",
      );
    }


    const pixCode = pickPixCode(parsed);
    if (!pixCode) {
      console.error("MisticPay: código Pix não encontrado na resposta", raw.slice(0, 500));
      throw new Error("Pix gerado, mas o código não foi retornado. Tente novamente.");
    }

    return { transactionId, pixCode };
  });

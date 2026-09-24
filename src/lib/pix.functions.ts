import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  amount: z.number().min(0.01).max(100000),
  description: z.string().trim().min(1).max(140),
});

type OmegaResponse = {
  transactionId?: string;
  status?: string;
  pix?: { code?: string };
  message?: string;
  errorDescription?: string;
  details?: unknown;
};

export const createPixCharge = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const publicKey = process.env["OMEGAPAY_PUBLIC_KEY"];
    const secretKey = process.env["OMEGAPAY_SECRET_KEY"];
    if (!publicKey || !secretKey) {
      throw new Error("Pagamento indisponível: chaves da OmegaPay não configuradas.");
    }

    const identifier = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const res = await fetch("https://app.omegapayments.com.br/api/v1/gateway/pix/receive", {
      method: "POST",
      headers: {
        "x-public-key": publicKey,
        "x-secret-key": secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier,
        amount: data.amount,
        client: {
          name: "Cliente Carmen",
          email: "cliente@carmenlucia.com",
        },
        products: [{ id: "assinatura", name: data.description, quantity: 1, price: data.amount }],
      }),
    });

    const raw = await res.text();
    let parsed: OmegaResponse | null = null;
    try {
      parsed = JSON.parse(raw) as OmegaResponse;
    } catch {
      parsed = null;
    }

    if (!res.ok) {
      console.error("OmegaPay error", res.status, raw.slice(0, 500));
      const msg = parsed?.message ?? parsed?.errorDescription;
      throw new Error(msg ? `Não foi possível gerar o Pix: ${msg}` : "Não foi possível gerar o Pix agora. Tente novamente.");
    }

    const pixCode = parsed?.pix?.code;
    if (!pixCode) {
      console.error("OmegaPay: código Pix ausente", raw.slice(0, 500));
      const msg = parsed?.errorDescription;
      throw new Error(msg ? `Não foi possível gerar o Pix: ${msg}` : "Pix gerado, mas o código não foi retornado. Tente novamente.");
    }

    return { transactionId: parsed?.transactionId ?? identifier, pixCode };
  });

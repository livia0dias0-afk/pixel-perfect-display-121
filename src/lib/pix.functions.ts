import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  amount: z.number().positive().max(100000),
  description: z.string().trim().min(1).max(140),
});

export const createPixCharge = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const pk = process.env["OMEGAPAY_PUBLIC_KEY"];
    const sk = process.env["OMEGAPAY_SECRET_KEY"];
    if (!pk || !sk) {
      throw new Error("Pagamento indisponível: credenciais da OmegaPay não configuradas.");
    }

    const identifier = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const res = await fetch("https://app.omegapayments.com.br/api/v1/gateway/pix/receive", {
      method: "POST",
      headers: { "x-public-key": pk, "x-secret-key": sk, "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier,
        amount: data.amount,
        client: {
          name: "Cliente Carmen",
          email: "cliente@carmenlucia.com",
          phone: "(11) 99999-9999",
          document: "00000000191",
        },
        products: [{ id: "assinatura", name: data.description, quantity: 1, price: data.amount }],
      }),
    });

    const raw = await res.text();
    let parsed: any = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }

    if (!res.ok) {
      console.error("OmegaPay error", res.status, raw.slice(0, 800));
      const msg = typeof parsed?.message === "string" ? parsed.message : null;
      throw new Error(msg ? `Não foi possível gerar o Pix: ${msg}` : "Não foi possível gerar o Pix agora. Tente novamente.");
    }

    const pixCode: string | undefined = parsed?.pix?.code;
    if (!pixCode) {
      console.error("OmegaPay: código Pix ausente", raw.slice(0, 800));
      throw new Error("Pix gerado, mas o código não foi retornado. Tente novamente.");
    }

    return { transactionId: parsed?.transactionId ?? identifier, pixCode };
  });

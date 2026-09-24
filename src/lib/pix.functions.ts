import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const firstNames = ["Maria", "Ana", "Julia", "Beatriz", "Larissa", "Camila", "Fernanda", "Paula", "Renata", "Carla", "Lucia", "Rosa", "Helena", "Vera", "Sonia", "Claudia", "Teresa", "Monica", "Silvia", "Regina"];
const lastNames = ["Silva", "Santos", "Oliveira", "Souza", "Lima", "Costa", "Pereira", "Almeida", "Ferreira", "Rodrigues", "Gomes", "Martins", "Ribeiro", "Carvalho", "Barbosa", "Rocha", "Dias", "Nunes", "Mendes", "Cardoso"];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDigits(n: number): string {
  let s = "";
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
  return s;
}

function randomClient() {
  const first = randomFrom(firstNames);
  const last = randomFrom(lastNames);
  const suffix = randomDigits(4);
  return {
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${suffix}@carmenlucia.com`,
    phone: `(11) 9${randomDigits(4)}-${randomDigits(4)}`,
    document: randomDigits(11),
  };
}

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

    const client = randomClient();
    let identifier = "";
    let res!: Response;
    let raw = "";
    for (let attempt = 0; attempt < 3; attempt++) {
      identifier = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      res = await fetch("https://app.omegapayments.com.br/api/v1/gateway/pix/receive", {
        method: "POST",
        headers: { "x-public-key": pk, "x-secret-key": sk, "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          amount: data.amount,
          client,
          products: [{ id: "assinatura", name: data.description, quantity: 1, price: data.amount }],
        }),
      });
      raw = await res.text();
      if (res.status < 500) break;
      console.error("OmegaPay 5xx, tentando de novo", res.status, raw.slice(0, 300));
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }
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

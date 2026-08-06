import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { X, Check } from "lucide-react";
import { createPixCharge } from "@/lib/pix.functions";
import coverAsset from "@/assets/cover.jpg.asset.json";
import avatarAsset from "@/assets/avatar.jpg.asset.json";

const benefits = ["Acesso ao conteúdo", "Chat exclusivo com o criador", "Cancele a qualquer hora"];

function priceToNumber(price: string) {
  return Number(price.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
}

export default function CheckoutModal({
  price,
  onClose,
}: {
  price: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generatePix = useServerFn(createPixCharge);

  useEffect(() => {
    let active = true;
    setError(null);
    setLoading(true);
    generatePix({
      data: {
        amount: priceToNumber(price),
        description: `Assinatura Klara - ${price}`,
      },
    })
      .then((result) => {
        if (!active) return;
        setPixCode(result.pixCode);
        setCopied(false);
      })
      .catch((e: unknown) => {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Falha ao gerar o Pix.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-3">
      <div className="relative max-h-[92vh] w-full max-w-sm overflow-y-auto rounded-2xl bg-card shadow-card">
        <div className="relative">
          <img
            src={coverAsset.url}
            alt="Capa do perfil de Klara"
            width={1200}
            height={600}
            decoding="async"
            className="h-24 w-full object-cover"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="relative px-4 pb-4">
          <img
            src={avatarAsset.url}
            alt="Klara"
            width={512}
            height={512}
            loading="lazy"
            decoding="async"
            className="absolute -top-8 left-4 size-16 rounded-full border-4 border-card object-cover"
          />
          <div className="pl-20 pt-2">
            <p className="text-sm font-semibold text-foreground">Klara</p>
            <p className="text-xs text-muted-foreground">@klarinha</p>
          </div>

          <h2 className="mt-4 text-base font-bold text-foreground">Benefícios exclusivos</h2>
          <ul className="mt-2 space-y-1.5">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="size-4 text-brand" strokeWidth={2.5} />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border px-4 py-4">
          <h3 className="text-base font-bold text-foreground">Formas de pagamento</h3>
          <p className="mt-2 text-xs text-muted-foreground">Valor</p>
          <p className="text-lg font-bold text-foreground">{price}</p>

          {pixCode ? (
            <>
              <div className="mt-3 max-h-24 overflow-y-auto break-all rounded-lg border border-border px-3 py-2.5 text-xs text-muted-foreground">
                {pixCode}
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(pixCode);
                  setCopied(true);
                }}
                className="plan-gradient mt-3 w-full rounded-full py-3 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
              >
                {copied ? "Código Pix copiado" : "Copiar código Pix"}
              </button>
            </>
          ) : (
            <>
              {error && <p className="mt-3 text-xs text-destructive">{error}</p>}
              <div className="mt-3 w-full rounded-full bg-muted py-3 text-center text-sm font-semibold text-muted-foreground">
                {loading
                  ? "Gerando código Pix..."
                  : error
                    ? "Não foi possível gerar o Pix"
                    : "Aguarde..."}
              </div>
            </>
          )}

          <div className="my-4 h-px bg-border" />

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-muted py-3 text-sm font-semibold text-muted-foreground"
          >
            Pay
          </button>

          <button
            type="button"
            className="mt-3 w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Pagar com cartão de crédito
          </button>

          <button
            type="button"
            className="mt-3 w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Pagar com <span className="font-bold text-foreground">PicPay</span>
          </button>

          <div className="relative mt-5">
            <span className="absolute -top-2.5 left-3 z-10 rounded-md border border-brand bg-card px-2 py-0.5 text-[10px] font-bold text-brand">
              Carteira
            </span>
            <button
              type="button"
              className="w-full rounded-full bg-foreground py-3 text-sm font-semibold text-background"
            >
              Recarregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

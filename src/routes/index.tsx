import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { createPixCharge } from "@/lib/pix.functions";
import { useEffect, useState } from "react";

import {
  Globe,
  Image as ImageIcon,
  Clapperboard,
  Lock,
  Heart,
  BadgeCheck,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Instagram,
  MoreVertical,
  MessageCircle,
  DollarSign,
  Bookmark,
  FileText,
  X,
  Check,
} from "lucide-react";
import coverImg from "@/assets/cover.jpg";
import avatarImg from "@/assets/avatar.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Klara (@klarinha) | Assinatura exclusiva" },
      {
        name: "description",
        content:
          "Assine o perfil de Klara e tenha acesso a 655 postagens e 1.146 mídias exclusivas. Planos a partir de R$ 20,00.",
      },
      { property: "og:title", content: "Klara (@klarinha)" },
      {
        property: "og:description",
        content:
          "Conteúdo exclusivo: 655 postagens e 1.146 mídias. Assine agora a partir de R$ 20,00.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Profile,
});

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-1.84-2.48V9.76a5.71 5.71 0 1 0 4.93 5.65V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.29 4.29 0 0 1-3.24-1.48z" />
    </svg>
  );
}

const stats = [
  { icon: ImageIcon, value: "688" },
  { icon: Clapperboard, value: "458" },
  { icon: Lock, value: "75" },
  { icon: Heart, value: "321.1K" },
];

const plans = [
  { label: "3 meses (20% off )", price: "R$ 60,00" },
  { label: "6 meses (30% off )", price: "R$ 105,00" },
];

const benefits = ["Acesso ao conteúdo", "Chat exclusivo com o criador", "Cancele a qualquer hora"];

function priceToNumber(price: string) {
  return Number(price.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
}

function CheckoutModal({ price, onClose }: { price: string; onClose: () => void }) {
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
            src={coverImg}
            alt="Capa do perfil de Klara"
            width={1200}
            height={600}
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
            src={avatarImg}
            alt="Klara"
            width={512}
            height={512}
            loading="lazy"
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
                {loading ? "Gerando código Pix..." : error ? "Não foi possível gerar o Pix" : "Aguarde..."}
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

function Profile() {
  const [openPlans, setOpenPlans] = useState(true);
  const [tab, setTab] = useState<"posts" | "media">("posts");
  const [checkoutPrice, setCheckoutPrice] = useState<string | null>(null);


  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 flex items-center justify-center border-b border-border bg-background px-4 py-3">
        <span className="text-xl font-extrabold tracking-tight text-foreground">
          privacy<span className="text-brand">.</span>
        </span>
        <button
          type="button"
          aria-label="Idioma"
          className="absolute right-4 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Globe className="size-5" />
        </button>
      </header>

      <main className="mx-auto w-full max-w-md px-2 pb-10">
        <section className="mt-2 overflow-hidden rounded-2xl bg-card shadow-card">
          <img
            src={coverImg}
            alt="Capa do perfil de Klara"
            width={1200}
            height={600}
            className="h-32 w-full object-cover"
          />

          <div className="relative px-4 pb-4">
            <img
              src={avatarImg}
              alt="Foto de perfil de Klara"
              width={512}
              height={512}
              loading="lazy"
              className="absolute -top-10 left-4 size-20 rounded-full border-4 border-card object-cover"
            />

            <div className="flex items-center gap-4 pl-24 pt-3 text-sm font-medium text-foreground">
              {stats.map(({ icon: Icon, value }) => (
                <span key={value} className="flex items-center gap-1">
                  <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
                  {value}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-1.5">
              <h1 className="text-xl font-bold text-foreground">Klara</h1>
              <BadgeCheck className="size-5 fill-verified text-card" />
            </div>
            <p className="text-sm text-muted-foreground">@klarinha</p>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Talvez você já me conheça de algum lugar… 23 anos, gaúcha, DJ nas horas vagas e
              recém…
            </p>

            <div className="mt-3 flex items-center gap-2">
              {[Instagram, XIcon, TikTokIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Rede social"
                  className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-accent"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-3 rounded-2xl bg-card p-4 shadow-card">
          <div className="rounded-2xl bg-muted/60 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Sparkles className="size-5 text-brand" />
              Oferta de assinatura
            </div>

            <div className="mt-3 flex items-center gap-2">
              <img
                src={avatarImg}
                alt="Klara"
                width={512}
                height={512}
                loading="lazy"
                className="size-8 shrink-0 rounded-full object-cover"
              />
              <div className="flex-1 rounded-full bg-card px-4 py-2 text-sm text-foreground">
                Vem ver tudo aqui!
              </div>
            </div>

            <div className="relative mt-5">
              <span className="absolute -top-3 left-3 z-10 rounded-md bg-card px-2.5 py-1 text-xs font-bold text-brand-green shadow-card">
                Economize 20%
              </span>
              <button
                type="button"
                onClick={() => setCheckoutPrice("R$ 20,00")}
                className="plan-gradient w-full rounded-full py-3 text-base font-semibold text-foreground transition-opacity hover:opacity-90"
              >
                Assinar agora R$ 20,00
              </button>
            </div>

            <p className="mt-2 text-right text-xs text-muted-foreground">
              Preço original <span className="line-through">R$ 25,00</span>
            </p>
          </div>
        </section>

        <section className="mt-3 rounded-2xl bg-card p-4 shadow-card">
          <button
            type="button"
            onClick={() => setOpenPlans((v) => !v)}
            className="flex w-full items-center justify-between"
          >
            <span className="text-base font-semibold text-foreground">Assinaturas</span>
            {openPlans ? (
              <ChevronUp className="size-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-5 text-muted-foreground" />
            )}
          </button>

          {openPlans && (
            <div className="mt-3 space-y-3">
              {plans.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setCheckoutPrice(p.price)}
                  className="plan-gradient flex w-full items-center justify-between rounded-full px-5 py-3 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
                >
                  <span>{p.label}</span>
                  <span>{p.price}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="mt-4">
          <div className="grid grid-cols-2 rounded-2xl bg-card shadow-card">
            <button
              type="button"
              onClick={() => setTab("posts")}
              className={`flex items-center justify-center gap-2 rounded-tl-2xl py-3 text-sm font-medium transition-colors ${
                tab === "posts"
                  ? "border-b-2 border-brand text-brand"
                  : "border-b-2 border-transparent text-foreground"
              }`}
            >
              <FileText className="size-4" />
              655 Postagens
            </button>
            <button
              type="button"
              onClick={() => setTab("media")}
              className={`flex items-center justify-center gap-2 rounded-tr-2xl py-3 text-sm font-medium transition-colors ${
                tab === "media"
                  ? "border-b-2 border-brand text-brand"
                  : "border-b-2 border-transparent text-foreground"
              }`}
            >
              <Clapperboard className="size-4" />
              1.146 Mídias
            </button>
          </div>

          <article className="mt-3 overflow-hidden rounded-2xl bg-card shadow-card">
            <div className="flex items-center gap-2 p-3">
              <img
                src={avatarImg}
                alt="Klara"
                width={512}
                height={512}
                loading="lazy"
                className="size-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                  Klara
                  <BadgeCheck className="size-4 fill-verified text-card" />
                </div>
                <p className="text-xs text-muted-foreground">@klarinha</p>
              </div>
              <button type="button" aria-label="Mais opções" className="text-foreground">
                <MoreVertical className="size-5" />
              </button>
            </div>

            <div className="relative flex aspect-square flex-col items-center justify-center bg-muted">
              <Lock className="size-12 text-muted-foreground" strokeWidth={1.5} />
              <div className="mt-4 flex items-center gap-4 text-sm font-medium text-foreground">
                {stats
                  .filter((s) => s.value !== "75")
                  .map(({ icon: Icon, value }) => (
                    <span key={value} className="flex items-center gap-1">
                      <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
                      {value}
                    </span>
                  ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 text-foreground">
              <div className="flex items-center gap-4">
                <Heart className="size-5" strokeWidth={1.5} />
                <MessageCircle className="size-5" strokeWidth={1.5} />
                <DollarSign className="size-5 rounded-full ring-1 ring-current" strokeWidth={1.5} />
              </div>
              <Bookmark className="size-5" strokeWidth={1.5} />
            </div>
          </article>
        </section>
      </main>

      {checkoutPrice && (
        <CheckoutModal price={checkoutPrice} onClose={() => setCheckoutPrice(null)} />
      )}
    </div>

  );
}

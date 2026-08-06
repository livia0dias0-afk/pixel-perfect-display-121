import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";

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
} from "lucide-react";
import coverAsset from "@/assets/cover.jpg.asset.json";
import avatarAsset from "@/assets/avatar.jpg.asset.json";
import { GiftIntro } from "@/components/GiftIntro";

const CheckoutModal = lazy(() => import("@/components/CheckoutModal"));


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
    links: [
      { rel: "preload", as: "image", href: coverAsset.url, fetchpriority: "high" },
      { rel: "preload", as: "image", href: avatarAsset.url },
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

function Profile() {
  const [openPlans, setOpenPlans] = useState(true);
  const [tab, setTab] = useState<"posts" | "media">("posts");
  const [checkoutPrice, setCheckoutPrice] = useState<string | null>(null);
  const [giftOpened, setGiftOpened] = useState(false);

  if (!giftOpened) {
    return <GiftIntro onOpen={() => setGiftOpened(true)} />;
  }

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
            src={coverAsset.url}
            alt="Capa do perfil de Klara"
            width={1200}
            height={600}
            fetchPriority="high"
            decoding="async"
            className="h-32 w-full object-cover"
          />

          <div className="relative px-4 pb-4">
            <img
              src={avatarAsset.url}
              alt="Foto de perfil de Klara"
              width={512}
              height={512}
              loading="lazy"
              decoding="async"
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
              Tenho 19 anos, e adoro me exibir e explorar minha sensualidade. Aqui você encontra
              conteúdo exclusivo, ousado e sem frescura, com vídeos, fotos e acesso direto ao meu
              chat privado. 🔞😈
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
                src={avatarAsset.url}
                alt="Klara"
                width={512}
                height={512}
                loading="lazy"
              decoding="async"
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
                className="plan-gradient animate-cta-pulse w-full rounded-full py-3 text-base font-semibold text-foreground transition-opacity hover:opacity-90"
              >
                Assinar agora R$ 20,00
              </button>
              <span
                aria-hidden="true"
                className="animate-tap-hint pointer-events-none absolute -bottom-4 right-8 z-10 select-none text-3xl drop-shadow-lg"
              >
                👆
              </span>
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
                src={avatarAsset.url}
                alt="Klara"
                width={512}
                height={512}
                loading="lazy"
              decoding="async"
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
        <Suspense fallback={null}>
          <CheckoutModal price={checkoutPrice} onClose={() => setCheckoutPrice(null)} />
        </Suspense>
      )}
    </div>

  );
}

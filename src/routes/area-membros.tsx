import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getMembersContent } from "@/lib/pix.functions";

export const Route = createFileRoute("/area-membros")({
  head: () => ({
    meta: [
      { title: "Área de membros | Carmen" },
      { name: "description", content: "Conteúdo exclusivo liberado para assinantes de Carmen." },
      { property: "og:title", content: "Área de membros | Carmen" },
      { property: "og:description", content: "Vídeos e fotos exclusivos para assinantes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: async () => {
    const r = await getMembersContent();
    if (!r.allowed) throw redirect({ to: "/" });
    return r;
  },
  errorComponent: () => (
    <div className="p-6 text-center text-sm text-muted-foreground">Não foi possível carregar a área de membros. Atualize a página.</div>
  ),
  notFoundComponent: () => <div className="p-6 text-center text-sm">Página não encontrada.</div>,
  component: MembersArea,
});

function MembersArea() {
  const { midias } = Route.useLoaderData();
  const [selecionada, setSelecionada] = useState<(typeof midias)[number] | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-md px-3 py-4">
        <section className="rounded-2xl bg-card p-4 shadow-card">
          <h1 className="text-lg font-bold text-foreground">Bem-vindo(a) à área de membros! 💖</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Seu acesso está liberado. Aproveite todos os vídeos e fotos exclusivos.
          </p>
        </section>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {midias.map((midia) => (
            <Button
              key={midia.id}
              type="button"
              variant="ghost"
              aria-label={`Abrir vídeo ${midia.id}`}
              onClick={() => setSelecionada(midia)}
              className="relative aspect-square h-auto w-full overflow-hidden rounded-xl bg-muted p-0 hover:bg-muted/90"
            >
              {midia.poster ? (
                <img src={midia.poster} alt="" loading="lazy" className="pointer-events-none absolute inset-0 size-full object-cover" />
              ) : (
                <video
                  src={midia.url}
                  preload="metadata"
                  muted
                  playsInline
                  tabIndex={-1}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 size-full object-cover"
                />
              )}
              <span className="relative flex size-9 items-center justify-center rounded-full bg-background/80">
                <Play className="size-5 text-foreground" aria-hidden="true" />
              </span>
            </Button>
          ))}
        </div>
      </main>
      <Dialog open={selecionada !== null} onOpenChange={(open) => { if (!open) setSelecionada(null); }}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-3xl border-0 bg-background p-3 sm:p-4">
          <DialogTitle className="sr-only">{selecionada ? `Vídeo ${selecionada.id}` : "Mídia"}</DialogTitle>
          {selecionada && (
            <video
              key={selecionada.id}
              src={selecionada.url}
              poster={selecionada.poster ?? undefined}
              controls
              controlsList="nodownload"
              disablePictureInPicture
              playsInline
              className="aspect-video max-h-[80vh] w-full bg-foreground object-contain"
            >
              Seu navegador não consegue reproduzir este vídeo.
            </video>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

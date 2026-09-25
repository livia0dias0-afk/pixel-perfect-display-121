import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import posterSi8bx5 from "@/assets/gallery-si8bx5.jpg.asset.json";
import posterUfwruf from "@/assets/gallery-ufwruf.jpg.asset.json";
import posterWvrn7z from "@/assets/gallery-wvrn7z.jpg.asset.json";
import posterZ79w79 from "@/assets/gallery-z79w79.jpg.asset.json";

export const ACCESS_KEY = "carmen_access";

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
  component: MembersArea,
});

const midias = [
  { id: 1, tipo: "video", url: "https://files.catbox.moe/si8bx5.mp4" },
  { id: 2, tipo: "video", url: "https://files.catbox.moe/ufwruf.mp4" },
  { id: 3, tipo: "video", url: "https://files.catbox.moe/si8bx5.mp4" },
  { id: 4, tipo: "video", url: "https://files.catbox.moe/wvrn7z.mp4" },
  { id: 5, tipo: "foto", url: "https://files.catbox.moe/z79w79.mp4" },
] as const;

type Midia = (typeof midias)[number];

// O quinto link foi identificado como video/mp4, apesar de estar marcado como foto.
const isVideo = (midia: Midia) => midia.tipo === "video" || /\.mp4(?:$|[?#])/i.test(midia.url);
const posterById: Record<Midia["id"], string> = {
  1: posterSi8bx5.url,
  2: posterUfwruf.url,
  3: posterSi8bx5.url,
  4: posterWvrn7z.url,
  5: posterZ79w79.url,
};

function MembersArea() {
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);
  const [selecionada, setSelecionada] = useState<Midia | null>(null);

  useEffect(() => {
    if (localStorage.getItem(ACCESS_KEY)) setOk(true);
    else navigate({ to: "/" });
  }, [navigate]);

  if (!ok) return <div className="min-h-screen bg-background" />;

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
              aria-label={`Abrir ${isVideo(midia) ? "vídeo" : "foto"} ${midia.id}`}
              onClick={() => setSelecionada(midia)}
              className="relative aspect-square h-auto w-full overflow-hidden rounded-xl bg-muted p-0 hover:bg-muted/90"
            >
              {isVideo(midia) ? (
                <>
                  <img src={posterById[midia.id]} alt="" loading="lazy" className="pointer-events-none absolute inset-0 size-full object-cover" />
                  <span className="relative flex size-9 items-center justify-center rounded-full bg-background/80">
                    <Play className="size-5 text-foreground" aria-hidden="true" />
                  </span>
                </>
              ) : (
                <>
                  <img src={midia.url} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
                  <ImageIcon className="relative size-6 text-muted-foreground" aria-hidden="true" />
                </>
              )}
            </Button>
          ))}
        </div>
      </main>
      <Dialog open={selecionada !== null} onOpenChange={(open) => { if (!open) setSelecionada(null); }}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-3xl border-0 bg-background p-3 sm:p-4">
          <DialogTitle className="sr-only">
            {selecionada ? `${isVideo(selecionada) ? "Vídeo" : "Foto"} ${selecionada.id}` : "Mídia"}
          </DialogTitle>
          {selecionada && (isVideo(selecionada) ? (
            <video
              key={selecionada.id}
              src={selecionada.url}
              poster={posterById[selecionada.id]}
              controls
              controlsList="nodownload"
              disablePictureInPicture
              playsInline
              className="aspect-video max-h-[80vh] w-full bg-foreground object-contain"
            >
              Seu navegador não consegue reproduzir este vídeo.
            </video>
          ) : (
            <img src={selecionada.url} alt={`Foto ${selecionada.id}`} className="max-h-[80vh] w-full object-contain" />
          ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}

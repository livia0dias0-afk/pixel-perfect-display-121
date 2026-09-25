import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, Image as ImageIcon } from "lucide-react";

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

const items = Array.from({ length: 12 }, (_, i) => ({ id: i, video: i % 3 === 0 }));

function MembersArea() {
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);

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
          {items.map((it) => (
            <div key={it.id} className="flex aspect-square items-center justify-center rounded-xl bg-muted">
              {it.video ? (
                <Play className="size-6 text-muted-foreground" />
              ) : (
                <ImageIcon className="size-6 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

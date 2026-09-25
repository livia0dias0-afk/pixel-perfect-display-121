import { useSession } from "@tanstack/react-start/server";
import posterSi8bx5 from "@/assets/gallery-si8bx5.jpg.asset.json";
import posterUfwruf from "@/assets/gallery-ufwruf.jpg.asset.json";
import posterWvrn7z from "@/assets/gallery-wvrn7z.jpg.asset.json";
import posterZ79w79 from "@/assets/gallery-z79w79.jpg.asset.json";

export type AccessSession = { paid?: boolean; transactionId?: string; paidAt?: number };

export function accessSession() {
  return useSession<AccessSession>({
    password: process.env["SESSION_SECRET"]!,
    name: "carmen-access",
    maxAge: 60 * 60 * 24 * 365,
    cookie: { httpOnly: true, secure: true, sameSite: "lax", path: "/" },
  });
}

// Lista de mídias fica só no servidor: só é enviada a quem tem pagamento confirmado.
export const MIDIAS = [
  { id: 1, url: "https://files.catbox.moe/si8bx5.mp4", poster: posterSi8bx5.url },
  { id: 2, url: "https://files.catbox.moe/ufwruf.mp4", poster: posterUfwruf.url },
  { id: 3, url: "https://files.catbox.moe/si8bx5.mp4", poster: posterSi8bx5.url },
  { id: 4, url: "https://files.catbox.moe/wvrn7z.mp4", poster: posterWvrn7z.url },
  { id: 5, url: "https://files.catbox.moe/z79w79.mp4", poster: posterZ79w79.url },
  { id: 6, url: "https://files.catbox.moe/w3beyc.mp4", poster: null },
  { id: 7, url: "https://files.catbox.moe/v2gp5w.mp4", poster: null },
  { id: 8, url: "https://files.catbox.moe/r7zcc1.mp4", poster: null },
  { id: 9, url: "https://files.catbox.moe/5gh1yx.mp4", poster: null },
] as { id: number; url: string; poster: string | null }[];

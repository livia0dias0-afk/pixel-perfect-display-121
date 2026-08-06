import { useCallback, useState } from "react";

const ICONS = ["🍓", "❤️", "⭐", "🚀", "🐶", "🍕"] as const;
const LABELS: Record<string, string> = {
  "🍓": "morango",
  "❤️": "coração",
  "⭐": "estrela",
  "🚀": "foguete",
  "🐶": "cachorro",
  "🍕": "pizza",
};

function shuffle<T>(list: readonly T[]): T[] {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i]!, arr[j]!] = [arr[j]!, arr[i]!];
  }
  return arr;
}

function newChallenge() {
  const tiles = shuffle(ICONS);
  return { tiles, target: tiles[Math.floor(Math.random() * tiles.length)]! };
}

export function GiftIntro({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  const [showAccess, setShowAccess] = useState(false);
  const [challenge, setChallenge] = useState(newChallenge);
  const [status, setStatus] = useState<"idle" | "wrong" | "ok">("idle");
  const [wrongIcon, setWrongIcon] = useState<string | null>(null);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(() => setShowAccess(true), 700);
  };

  const handlePick = useCallback(
    (icon: string) => {
      if (status === "ok") return;
      if (icon === challenge.target) {
        setStatus("ok");
        setWrongIcon(null);
        window.setTimeout(onOpen, 600);
        return;
      }
      setStatus("wrong");
      setWrongIcon(icon);
      window.setTimeout(() => {
        setChallenge(newChallenge());
        setWrongIcon(null);
      }, 500);
    },
    [challenge.target, status, onOpen],
  );

  if (showAccess) {
    return (
      <div className="gift-intro fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center">
        <div className="animate-gift-reveal flex w-full max-w-sm flex-col items-center">
          <div className="gift-opened-icon select-none text-[4rem] leading-none" aria-hidden="true">
            🎉
          </div>
          <h1 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
            Parabéns, seu acesso foi desbloqueado!
          </h1>

          <div className="captcha-card mt-6 w-full rounded-2xl p-4 text-left">
            <p className="text-sm font-semibold text-white">Confirme que você não é um robô</p>
            <p className="mt-1 text-sm text-white/70">
              Toque na imagem do{" "}
              <span className="font-bold text-white">
                {challenge.target} {LABELS[challenge.target]}
              </span>
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="Verificação">
              {challenge.tiles.map((icon) => {
                const isOk = status === "ok" && icon === challenge.target;
                const isWrong = wrongIcon === icon;
                return (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handlePick(icon)}
                    aria-label={LABELS[icon]}
                    className={`captcha-tile flex aspect-square items-center justify-center rounded-xl text-3xl transition-transform active:scale-95 ${
                      isOk ? "captcha-tile-ok" : ""
                    } ${isWrong ? "captcha-tile-wrong" : ""}`}
                  >
                    {isOk ? "✅" : icon}
                  </button>
                );
              })}
            </div>

            <p
              aria-live="polite"
              className={`mt-3 text-center text-sm font-semibold ${
                status === "ok"
                  ? "text-emerald-400"
                  : status === "wrong"
                    ? "text-red-300"
                    : "text-white/50"
              }`}
            >
              {status === "ok"
                ? "Verificado! Liberando seu acesso..."
                : status === "wrong"
                  ? "Ops, tente de novo"
                  : "É rapidinho: só um toque"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gift-intro fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold text-white sm:text-4xl">Você recebeu um</h1>
      <p className="gift-glow-text mt-2 text-3xl font-bold sm:text-4xl">Presente Surpresa!</p>
      <p className="mt-4 text-sm text-white/70">Toque na caixa para abrir... 😈</p>

      <button
        type="button"
        onClick={handleOpen}
        aria-label="Abrir presente surpresa"
        className={`gift-box mt-8 select-none text-[6rem] leading-none transition-transform sm:text-[7rem] ${
          opening ? "gift-box-open" : "animate-gift-shake"
        }`}
      >
        🎁
      </button>
    </div>
  );
}

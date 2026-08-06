import { useState } from "react";

export function GiftIntro({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(onOpen, 700);
  };

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

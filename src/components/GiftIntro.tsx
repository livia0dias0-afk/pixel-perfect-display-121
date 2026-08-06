import { useState } from "react";

export function GiftIntro({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  const [showAccess, setShowAccess] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(() => setShowAccess(true), 700);
  };

  if (showAccess) {
    return (
      <div className="gift-intro fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center">
        <div className="animate-gift-reveal flex w-full max-w-sm flex-col items-center">
          <div className="gift-opened-icon select-none text-[5rem] leading-none" aria-hidden="true">
            🎉
          </div>
          <h1 className="mt-8 text-2xl font-bold text-white sm:text-3xl">
            Parabéns, seu acesso foi desbloqueado!
          </h1>
          <button
            type="button"
            onClick={onOpen}
            className="gift-access-button mt-8 rounded-full px-10 py-4 text-base font-bold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            Acessar ✅
          </button>
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

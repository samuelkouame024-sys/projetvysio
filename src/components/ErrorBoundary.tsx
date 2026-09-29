import { Component, type ReactNode } from "react";
import { WA_DEFAULT } from "../data";

/* Filet de sécurité : si un composant casse (réseau, vidéo, CMS),
   le visiteur voit un écran de secours avec WhatsApp — jamais une page blanche. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { broken: boolean }> {
  state = { broken: false };

  static getDerivedStateFromError() {
    return { broken: true };
  }

  componentDidCatch(err: unknown) {
    // Log local uniquement, aucune PII envoyée.
    console.error("[VYZIO] UI error:", err);
  }

  render() {
    if (!this.state.broken) return this.props.children;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#05060a] px-6 text-center text-white">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">Petit souci technique</p>
        <h1 className="font-display mt-4 text-[36px] font-extrabold leading-tight">
          La vidéo a sauté.
          <br />
          On reste joignable.
        </h1>
        <p className="mt-4 max-w-sm text-[15px] text-white/70">
          Rechargez la page, ou écrivez-nous directement — on répond vite.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a
            href={WA_DEFAULT}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#3b6bff] px-8 text-[16px] font-extrabold text-white"
          >
            Écrire sur WhatsApp
          </a>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/40 px-8 text-[16px] font-bold text-white"
          >
            Recharger
          </button>
        </div>
      </div>
    );
  }
}

"use client";

import { useState } from "react";
import { avaliarQueixa } from "@/lib/api";

export function SatisfactionRating({ numero }: { numero: string }) {
  const [rating, setRating] = useState<number | null>(null);
  const [comentario, setComentario] = useState("");
  const [sent, setSent] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  if (sent) {
    return <p className="text-sm text-[var(--color-mist)]">Obrigado. A sua avaliação ajuda o SIC a melhorar o atendimento.</p>;
  }

  async function enviar() {
    if (!rating || enviando) return;
    setEnviando(true);
    setErro("");

    const resultado = await avaliarQueixa(numero, rating, comentario.trim() || undefined);
    setEnviando(false);

    if (!resultado.success) {
      setErro(resultado.error ?? "Não foi possível registar a avaliação. Tente novamente.");
      return;
    }

    setSent(true);
  }

  return (
    <div>
      <p className="text-sm text-[var(--color-paper)]">Como avalia o atendimento neste processo?</p>
      <div className="mt-3 flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            className={`h-9 w-9 rounded-md border text-sm font-semibold transition ${
              rating && n <= rating
                ? "border-[var(--color-beacon)] bg-[var(--color-beacon)]/15 text-[var(--color-beacon)]"
                : "border-paper/10 text-[var(--color-mist)] hover:border-paper/25"
            }`}
            aria-label={`${n} de 5`}
          >
            {n}
          </button>
        ))}
      </div>
      {rating !== null && (
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows={2}
          placeholder="Comentário (opcional)"
          className="mt-3 w-full rounded-lg border border-paper/10 bg-[var(--color-ink)] px-3 py-2 text-xs text-[var(--color-paper)] placeholder:text-[var(--color-mist-dim)] focus:border-[var(--color-beacon)]/60"
        />
      )}
      {erro && <p className="mt-2 text-xs text-[var(--color-alert)]">{erro}</p>}
      <button
        type="button"
        disabled={!rating || enviando}
        onClick={enviar}
        className="mt-4 rounded-lg bg-[var(--color-beacon)] px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] disabled:opacity-40"
      >
        {enviando ? "A enviar…" : "Enviar avaliação"}
      </button>
    </div>
  );
}

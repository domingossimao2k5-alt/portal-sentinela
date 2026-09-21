"use client";

import { useState } from "react";
import { StatusTimeline } from "@/components/StatusTimeline";
import { CaseChat } from "@/components/CaseChat";
import { SatisfactionRating } from "@/components/SatisfactionRating";
import { consultarQueixa } from "@/lib/api";

type Status = "idle" | "loading" | "found" | "not-found" | "error";

const ORDEM_ESTADOS = ["recebida", "em_analise", "encaminhada", "concluida"];

function TimelineSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-paper/10" />
          <div className="h-3 w-32 rounded bg-paper/10" />
        </div>
      ))}
    </div>
  );
}

export function ProtocolTracker() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [notFoundMsg, setNotFoundMsg] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [statusAtual, setStatusAtual] = useState("");
  const [datas, setDatas] = useState<{ createdAt?: string; updatedAt?: string }>({});

  async function lookup() {
    if (!code.trim()) return;
    setStatus("loading");

    const resultado = await consultarQueixa(code.trim().toUpperCase());

    if (!resultado.success) {
      const semLigacao = resultado.error?.includes("contactar");
      setNotFoundMsg(resultado.error ?? "Não encontrámos nenhuma denúncia com este código.");
      setStatus(semLigacao ? "error" : "not-found");
      return;
    }

    // "arquivada" (migração 0026) é um segundo estado de encerramento —
    // conta como o último passo da timeline ("Encerrada"), tal como
    // "concluida".
    const indice =
      resultado.queixa.status === "arquivada"
        ? ORDEM_ESTADOS.length - 1
        : ORDEM_ESTADOS.indexOf(resultado.queixa.status);
    setActiveIndex(indice === -1 ? 0 : indice);
    setStatusAtual(resultado.queixa.status);
    setDatas({ createdAt: resultado.queixa.created_at, updatedAt: resultado.queixa.updated_at });
    setStatus("found");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    lookup();
  }

  const encerrada = statusAtual === "concluida" || statusAtual === "arquivada";

  return (
    <div className="card p-6 sm:p-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-beacon)]">
        Acompanhar processo
      </p>
      <h3 className="mt-2 font-[var(--font-display)] text-xl text-[var(--color-paper)]">
        Consulte o estado da sua denúncia
      </h3>
      <p className="mt-1 text-sm text-[var(--color-mist)]">
        Introduza o código de protocolo que recebeu no fim do registo. Não é
        necessário criar conta nem identificar-se.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="QE-2026-0001"
          aria-label="Código de protocolo"
          className="w-full rounded-lg border border-paper/10 bg-[var(--color-ink)] px-4 py-3 font-mono text-sm text-[var(--color-paper)] placeholder:text-[var(--color-mist-dim)] focus:border-[var(--color-beacon)]/60"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-[var(--color-beacon)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-beacon-dim)] disabled:opacity-60"
          disabled={status === "loading"}
        >
          {status === "loading" ? "A verificar…" : "Consultar"}
        </button>
      </form>

      {status === "loading" && (
        <div className="mt-6">
          <TimelineSkeleton />
        </div>
      )}

      {status === "not-found" && (
        <p className="mt-4 text-sm text-[var(--color-alert)]">{notFoundMsg}</p>
      )}

      {status === "error" && (
        <div className="mt-4 rounded-lg border border-[var(--color-alert)]/30 bg-[var(--color-alert)]/[0.06] px-4 py-3">
          <p className="text-sm text-[var(--color-alert)]">
            Não foi possível ligar ao servidor. Verifique a sua ligação e tente novamente.
          </p>
          <button
            type="button"
            onClick={lookup}
            className="mt-2 text-xs font-semibold text-[var(--color-paper)] underline decoration-dotted"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {status === "found" && (
        <div className="mt-7 space-y-7">
          <div>
            <StatusTimeline activeIndex={activeIndex} createdAt={datas.createdAt} updatedAt={datas.updatedAt} />
          </div>

          {!encerrada && <CaseChat numero={code.trim().toUpperCase()} />}

          {encerrada && (
            <div className="rounded-xl border border-paper/10 bg-[var(--color-ink)] p-5">
              <SatisfactionRating numero={code.trim().toUpperCase()} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

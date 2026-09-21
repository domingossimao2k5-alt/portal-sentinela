"use client";

import { useEffect, useState } from "react";
import { obterEstatisticasPublicas, type CategoriaEstatistica } from "@/lib/api";

export function CrimeStatsChart() {
  const [dados, setDados] = useState<CategoriaEstatistica[]>([]);
  const [estado, setEstado] = useState<"a-carregar" | "pronto" | "erro" | "vazio">("a-carregar");

  useEffect(() => {
    let montado = true;
    obterEstatisticasPublicas().then((resultado) => {
      if (!montado) return;
      if (!resultado.success) {
        setEstado("erro");
        return;
      }
      if (resultado.categorias.length === 0) {
        setEstado("vazio");
        return;
      }
      setDados(resultado.categorias);
      setEstado("pronto");
    });
    return () => {
      montado = false;
    };
  }, []);

  if (estado === "a-carregar") {
    return <div className="h-40 animate-pulse rounded-md bg-paper/[0.03]" aria-hidden="true" />;
  }

  if (estado === "erro") {
    return <p className="text-sm text-[var(--color-alert)]">Não foi possível obter as estatísticas agora.</p>;
  }

  if (estado === "vazio") {
    return <p className="text-sm text-[var(--color-mist)]">Sem ocorrências registadas nos últimos 30 dias.</p>;
  }

  const max = Math.max(...dados.map((d) => d.total));

  return (
    <div>
      <div className="flex items-end gap-4 sm:gap-6">
        {dados.map((d) => (
          <div key={d.categoria} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-xs text-[var(--color-mist)]">{d.total}</span>
            <div className="flex h-40 w-full items-end rounded-md bg-paper/[0.03]">
              <div
                className="w-full rounded-md bg-gradient-to-t from-[var(--color-beacon-dim)] to-[var(--color-beacon)]"
                style={{ height: `${(d.total / max) * 100}%` }}
              />
            </div>
            <span className="text-center text-[11px] leading-tight text-[var(--color-mist-dim)]">
              {d.categoria}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-[var(--color-mist-dim)]">
        Nº de processos por categoria registados na Caála nos últimos 30 dias. Dados agregados, nenhum registo é identificável.
      </p>
    </div>
  );
}

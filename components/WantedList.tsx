"use client";

import { useEffect, useMemo, useState } from "react";
import { obterItensPublicos, type ItemPublico } from "@/lib/api";

const FILTERS = ["Todos", "Procurado", "Desaparecido", "Objecto recuperado", "Veículo recuperado"] as const;

const CATEGORIA_PARA_FILTRO: Record<ItemPublico["categoria"], (typeof FILTERS)[number]> = {
  procurado: "Procurado",
  desaparecido: "Desaparecido",
  objecto_recuperado: "Objecto recuperado",
  veiculo_recuperado: "Veículo recuperado",
};

function formatarData(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-AO", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

export function WantedList() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Todos");
  const [query, setQuery] = useState("");
  const [itens, setItens] = useState<ItemPublico[]>([]);
  const [estado, setEstado] = useState<"a-carregar" | "pronto" | "erro">("a-carregar");

  useEffect(() => {
    let montado = true;
    obterItensPublicos().then((resultado) => {
      if (!montado) return;
      if (!resultado.success) {
        setEstado("erro");
        return;
      }
      setItens(resultado.itens);
      setEstado("pronto");
    });
    return () => {
      montado = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return itens.filter((i) => {
      const categoriaFiltro = CATEGORIA_PARA_FILTRO[i.categoria];
      const matchesFilter = filter === "Todos" || categoriaFiltro === filter;
      const matchesQuery =
        !query.trim() ||
        `${i.titulo} ${i.detalhe ?? ""}`.toLowerCase().includes(query.trim().toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [itens, filter, query]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                filter === f
                  ? "border-[var(--color-beacon)] bg-[var(--color-beacon)]/10 text-[var(--color-beacon)]"
                  : "border-paper/10 text-[var(--color-mist)] hover:border-paper/25"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar…"
          className="w-full rounded-lg border border-paper/10 bg-[var(--color-ink-2)] px-3.5 py-2 text-sm text-[var(--color-paper)] placeholder:text-[var(--color-mist-dim)] focus:border-[var(--color-beacon)]/60 sm:w-56"
        />
      </div>

      {estado === "a-carregar" && (
        <div className="mt-5 animate-pulse space-y-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-xl border border-paper/10 bg-paper/[0.03]" />
          ))}
        </div>
      )}

      {estado === "erro" && (
        <p className="mt-5 text-sm text-[var(--color-alert)]">
          Não foi possível obter a lista agora. Tente recarregar a página.
        </p>
      )}

      {estado === "pronto" && (
        <ul className="mt-5 divide-y divide-paper/10 overflow-hidden rounded-xl border border-paper/10">
          {filtered.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-4 bg-[var(--color-ink-2)] px-4 py-4">
              <div className="flex items-start gap-3">
                {item.foto_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.foto_url}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                )}
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--color-beacon)]">
                    {CATEGORIA_PARA_FILTRO[item.categoria]}
                    {item.urgencia === "critico" && " · Crítico"}
                  </span>
                  <p className="mt-1 text-sm text-[var(--color-paper)]">{item.titulo}</p>
                  {item.detalhe && <p className="mt-0.5 text-xs text-[var(--color-mist)]">{item.detalhe}</p>}
                  {item.local && <p className="mt-0.5 text-xs text-[var(--color-mist-dim)]">{item.local}</p>}
                  {item.recompensa && (
                    <p className="mt-0.5 text-xs text-[var(--color-beacon)]">
                      Recompensa: {item.recompensa.toLocaleString("pt-AO")} Kz
                    </p>
                  )}
                </div>
              </div>
              <span className="shrink-0 text-xs text-[var(--color-mist-dim)]">{formatarData(item.data_referencia)}</span>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="bg-[var(--color-ink-2)] px-4 py-6 text-center text-sm text-[var(--color-mist)]">
              Nada encontrado para esta pesquisa.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

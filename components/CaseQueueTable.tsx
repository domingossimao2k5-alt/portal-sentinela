import Link from "next/link";

export type CasoFila = {
  id: string;
  protocol: string;
  category: string;
  bairro: string;
  status: string;
  priority: "Alta" | "Normal" | "Baixa";
  updated: string;
};

const PRIORITY_STYLE: Record<string, string> = {
  Alta: "text-[var(--color-alert)] border-[var(--color-alert)]/40",
  Normal: "text-[var(--color-beacon)] border-[var(--color-beacon)]/40",
  Baixa: "text-[var(--color-mist)] border-paper/15",
};

export function CaseQueueTable({ cases }: { cases: CasoFila[] }) {
  if (cases.length === 0) {
    return (
      <div className="rounded-xl border border-paper/10 px-4 py-6 text-center text-sm text-[var(--color-mist)]">
        Sem queixas na fila.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-paper/10">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-paper/10 text-xs uppercase tracking-wide text-[var(--color-mist-dim)]">
            <th className="px-4 py-3 font-normal">Protocolo</th>
            <th className="px-4 py-3 font-normal">Categoria</th>
            <th className="px-4 py-3 font-normal">Bairro</th>
            <th className="px-4 py-3 font-normal">Prioridade</th>
            <th className="px-4 py-3 font-normal">Estado</th>
            <th className="px-4 py-3 font-normal">Actualizado</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.id} className="border-b border-paper/5 last:border-0 hover:bg-paper/[0.02]">
              <td className="px-4 py-3 font-mono text-xs text-[var(--color-paper)]">
                <Link href={`/investigador/casos/${c.id}`} className="underline decoration-dotted hover:text-[var(--color-beacon)]">
                  {c.protocol}
                </Link>
              </td>
              <td className="px-4 py-3 text-[var(--color-mist)]">{c.category}</td>
              <td className="px-4 py-3 text-[var(--color-mist)]">{c.bairro}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full border px-2 py-0.5 text-[11px] ${PRIORITY_STYLE[c.priority]}`}>
                  {c.priority}
                </span>
              </td>
              <td className="px-4 py-3 text-[var(--color-mist)]">{c.status}</td>
              <td className="px-4 py-3 text-xs text-[var(--color-mist-dim)]">{c.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

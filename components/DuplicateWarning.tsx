"use client";

import { useMemo } from "react";

const RECENT_REPORTS = [
  { category: "Roubo ou furto", bairro: "zona 2", protocol: "SNT-2026-014021", when: "há 2 dias" },
  { category: "Vandalismo", bairro: "caála-sede", protocol: "SNT-2026-013877", when: "há 4 dias" },
  { category: "Tráfico de droga", bairro: "zona 4", protocol: "SNT-2026-013650", when: "há 6 dias" },
];

export function DuplicateWarning({ category, location }: { category: string; location: string }) {
  const match = useMemo(() => {
    if (!category || !location.trim()) return null;
    const loc = location.toLowerCase();
    return (
      RECENT_REPORTS.find((r) => r.category === category && loc.includes(r.bairro)) || null
    );
  }, [category, location]);

  if (!match) return null;

  return (
    <div className="mt-3 rounded-lg border border-[var(--color-beacon)]/30 bg-[var(--color-beacon)]/[0.06] px-4 py-3 text-xs text-[var(--color-mist)]">
      <p className="text-[var(--color-paper)]">
        Já existe uma denúncia semelhante ({match.category.toLowerCase()}) registada {match.when} nesta zona.
      </p>
      <p className="mt-1">
        Se for o mesmo caso, pode consultar o protocolo{" "}
        <span className="font-mono text-[var(--color-beacon)]">{match.protocol}</span> Continue se for uma situação diferente.
      </p>
    </div>
  );
}

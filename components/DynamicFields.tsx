"use client";

import { useState } from "react";

type Field = { key: string; label: string; placeholder: string };

const FIELDS_BY_CATEGORY: Record<string, Field[]> = {
  "Roubo ou furto": [
    { key: "bem", label: "O que foi levado", placeholder: "Ex.: telemóvel, motorizada, dinheiro…" },
    { key: "valor", label: "Valor estimado", placeholder: "Ex.: 45 000kzs" },
  ],
  "Violência doméstica": [
    { key: "relacao", label: "Relação com a pessoa envolvida (opcional)", placeholder: "Ex.: cônjuge, familiar…" },
    { key: "feridos", label: "Há feridos que precisem de assistência agora?", placeholder: "Sim / Não / Não sei" },
  ],
  "Agressão física": [
    { key: "assistencia", label: "Foi preciso assistência médica?", placeholder: "Sim / Não" },
  ],
  "Tráfico de droga": [
    { key: "substancia", label: "Tipo de substância (se souber)", placeholder: "Ex.: liamba, outra…" },
    { key: "quantidade", label: "Quantidade aproximada", placeholder: "Ex.: pequenas embalagens, sacos…" },
  ],
  Corrupção: [
    { key: "entidade", label: "Entidade ou instituição envolvida", placeholder: "Ex.: repartição, empresa…" },
    { key: "cargo", label: "Cargo da pessoa envolvida (se souber)", placeholder: "Ex.: funcionário, chefe de secção…" },
  ],
  Vandalismo: [
    { key: "bem_danificado", label: "O que foi danificado", placeholder: "Ex.: muro, viatura, espaço público…" },
  ],
  "Pessoa desaparecida": [
    { key: "idade", label: "Idade aproximada", placeholder: "Ex.: 34 anos" },
    { key: "caracteristicas", label: "Características físicas", placeholder: "Altura, roupa na última vez vista…" },
    { key: "ultima_vez", label: "Quando foi vista pela última vez", placeholder: "Ex.: ontem à tarde, hoje..." },
  ],
};

export function DynamicFields({
  category,
  onChange,
}: {
  category: string;
  onChange?: (values: Record<string, string>) => void;
}) {
  const fields = FIELDS_BY_CATEGORY[category];
  const [values, setValues] = useState<Record<string, string>>({});

  if (!fields) return null;

  function update(key: string, value: string) {
    const next = { ...values, [key]: value };
    setValues(next);
    onChange?.(next);
  }

  return (
    <div className="mt-4 space-y-3 rounded-lg border border-paper/10 bg-[var(--color-ink-2)] p-4">
      <p className="text-xs uppercase tracking-wide text-[var(--color-mist-dim)]">
        Detalhes específicos: {category}
      </p>
      {fields.map((f) => (
        <div key={f.key}>
          <label className="mb-1 block text-xs text-[var(--color-mist)]">{f.label}</label>
          <input
            value={values[f.key] || ""}
            onChange={(e) => update(f.key, e.target.value)}
            placeholder={f.placeholder}
            className="w-full rounded-md border border-paper/10 bg-[var(--color-ink)] px-3 py-2 text-sm text-[var(--color-paper)] placeholder:text-[var(--color-mist-dim)] focus:border-[var(--color-beacon)]/60"
          />
        </div>
      ))}
    </div>
  );
}

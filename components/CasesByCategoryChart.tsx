export function CasesByCategoryChart({ data }: { data: { label: string; value: number }[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-[var(--color-mist)]">Sem queixas registadas ainda.</p>;
  }

  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-36 shrink-0 truncate text-xs text-[var(--color-mist)]" title={d.label}>
            {d.label}
          </span>
          <div className="h-2.5 flex-1 rounded-full bg-paper/[0.05]">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-[var(--color-beacon-dim)] to-[var(--color-beacon)]"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="w-6 shrink-0 text-right text-xs text-[var(--color-mist-dim)]">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

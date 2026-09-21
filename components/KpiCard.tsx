export function KpiCard({
  label,
  value,
  delta,
  deltaGood,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaGood?: boolean;
}) {
  return (
    <div className="card p-5">
      <p className="text-xs uppercase tracking-wide text-[var(--color-mist-dim)]">{label}</p>
      <p className="mt-2 font-[var(--font-display)] text-3xl text-[var(--color-paper)]">{value}</p>
      {delta && (
        <p className={`mt-1 text-xs ${deltaGood ? "text-emerald-700" : "text-[var(--color-alert)]"}`}>
          {delta}
        </p>
      )}
    </div>
  );
}

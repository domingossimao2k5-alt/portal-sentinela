function toPoints(values: number[], width: number, height: number, max: number) {
  if (values.length < 2) return "";
  const step = width / (values.length - 1);
  return values
    .map((v, i) => `${i * step},${height - (v / max) * height}`)
    .join(" ");
}

export function CasesTrendChart({
  weekLabels,
  received,
  resolved,
}: {
  weekLabels: string[];
  received: number[];
  resolved: number[];
}) {
  const width = 480;
  const height = 160;
  const max = Math.max(1, ...received, ...resolved) * 1.15;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1="0"
            x2={width}
            y1={height * f}
            y2={height * f}
            stroke="var(--color-line)"
            strokeWidth="1"
          />
        ))}
        <polyline points={toPoints(received, width, height, max)} fill="none" stroke="var(--color-mist)" strokeWidth="2" />
        <polyline
          points={toPoints(resolved, width, height, max)}
          fill="none"
          stroke="var(--color-beacon)"
          strokeWidth="2.5"
        />
      </svg>
      <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--color-mist-dim)]">
        {weekLabels.map((w, i) => (
          <span key={`${w}-${i}`}>{w}</span>
        ))}
      </div>
      <div className="mt-3 flex gap-5 text-xs">
        <span className="flex items-center gap-1.5 text-[var(--color-mist)]">
          <span className="h-0.5 w-4 bg-[var(--color-mist)]" /> Recebidas
        </span>
        <span className="flex items-center gap-1.5 text-[var(--color-paper)]">
          <span className="h-0.5 w-4 bg-[var(--color-beacon)]" /> Resolvidas
        </span>
      </div>
    </div>
  );
}

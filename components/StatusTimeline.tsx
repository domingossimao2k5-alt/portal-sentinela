const LABELS = ["Recebida", "Em triagem", "Encaminhada", "Encerrada"];

export function StatusTimeline({
  activeIndex,
  createdAt,
  updatedAt,
}: {
  activeIndex: number;
  
  createdAt?: string;
  updatedAt?: string;
}) {
  function formatar(iso?: string) {
    if (!iso) return "";
    return new Date(iso).toLocaleString("pt-AO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <ol className="mt-2 space-y-0">
      {LABELS.map((label, i) => {
        const reached = i <= activeIndex;
        const timestamp = i === 0 ? formatar(createdAt) : i === activeIndex ? formatar(updatedAt) : "";
        return (
          <li key={label} className="flex gap-3 pb-5 last:pb-0">
            <div className="flex flex-col items-center">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full transition-colors duration-500 ${
                  reached ? "bg-[var(--color-beacon)]" : "bg-paper/15"
                } ${i === activeIndex ? "pulse-dot" : ""}`}
              />
              {i < LABELS.length - 1 && (
                <span
                  className={`mt-1 w-px flex-1 origin-top transition-colors duration-500 ${
                    reached ? "bg-[var(--color-beacon)]/40" : "bg-paper/10"
                  }`}
                />
              )}
            </div>
            <div className="-mt-0.5 transition-opacity duration-500" style={{ opacity: reached ? 1 : 0.6 }}>
              <p className={`text-sm ${reached ? "text-[var(--color-paper)]" : "text-[var(--color-mist-dim)]"}`}>
                {label}
              </p>
              {timestamp && reached && (
                <p className="font-mono text-xs text-[var(--color-mist-dim)]">{timestamp}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

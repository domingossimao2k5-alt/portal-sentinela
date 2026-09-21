/**
 * SentinelaLoader — indicador de carregamento com o logotipo oficial do
 * SIC, no mesmo espírito do loader do ERP interno (anel giratório,
 * respiração e brilho diagonal sobre o brasão).
 */
const TAMANHOS = {
  sm: { caixa: "w-12 h-12", anel: 44 },
  md: { caixa: "w-20 h-20", anel: 76 },
  lg: { caixa: "w-28 h-28", anel: 108 },
} as const;

export function SentinelaLoader({
  tamanho = "md",
  legenda,
  ecraCompleto = false,
}: {
  tamanho?: keyof typeof TAMANHOS;
  legenda?: string;
  ecraCompleto?: boolean;
}) {
  const { caixa, anel } = TAMANHOS[tamanho];
  const raio = anel / 2 - 3;
  const perimetro = 2 * Math.PI * raio;

  const conteudo = (
    <div className="flex flex-col items-center gap-4">
      <div className={`relative ${caixa} animate-loader-pulse`}>
        <svg viewBox={`0 0 ${anel} ${anel}`} className="absolute inset-0 w-full h-full animate-loader-spin">
          <circle
            cx={anel / 2}
            cy={anel / 2}
            r={raio}
            fill="none"
            stroke="url(#loaderRingGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${perimetro * 0.28} ${perimetro}`}
          />
          <defs>
            <linearGradient id="loaderRingGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#60a5fa" stopOpacity="0" />
              <stop offset="1" stopColor="#2563eb" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-[18%] rounded-2xl overflow-hidden">
          <img src="/brand/logo-sic.svg" alt="" aria-hidden className="w-full h-full object-contain" />
          <div
            className="absolute inset-0 animate-loader-shimmer pointer-events-none"
            style={{
              background: "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%)",
            }}
          />
        </div>
      </div>

      {legenda && <p className="text-sm text-muted animate-pulse">{legenda}</p>}
    </div>
  );

  if (!ecraCompleto) return conteudo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink)]/80 backdrop-blur-[4px]">
      {conteudo}
    </div>
  );
}

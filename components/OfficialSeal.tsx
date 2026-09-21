"use client";


export function OfficialSeal() {
  return (
    <div
      className="stamp-in relative mx-auto aspect-square w-full max-w-[280px]"
      role="img"
      aria-label="Selo do Serviço de Investigação Criminal do Município da Caála"
    >
      <svg viewBox="0 0 200 200" className="h-full w-full" style={{ transform: "rotate(-8deg)" }}>
        <defs>
          <path id="rimTop" d="M 20,100 A 80,80 0 0 1 180,100" fill="none" />
          <path id="rimBottom" d="M 180,100 A 80,80 0 0 1 20,100" fill="none" />
        </defs>

        <circle cx="100" cy="100" r="92" fill="none" stroke="var(--color-beacon)" strokeWidth="1.2" opacity="0.55" />
        <circle cx="100" cy="100" r="80" fill="none" stroke="var(--color-beacon)" strokeWidth="1.6" opacity="0.8" />
        <circle cx="100" cy="100" r="56" fill="none" stroke="var(--color-beacon)" strokeWidth="1" opacity="0.5" />

        {/* borda perfurada, como o anel de um carimbo de borracha */}
        {Array.from({ length: 40 }).map((_, i) => {
          const angle = (i / 40) * 2 * Math.PI;
          const x = 100 + 92 * Math.cos(angle);
          const y = 100 + 92 * Math.sin(angle);
          return <circle key={i} cx={x} cy={y} r="1" fill="var(--color-beacon)" opacity="0.4" />;
        })}

        <text fontSize="10.5" letterSpacing="2.5" fill="var(--color-beacon)" opacity="0.9">
          <textPath href="#rimTop" startOffset="50%" textAnchor="middle">
            SERVIÇO DE INVESTIGAÇÃO CRIMINAL
          </textPath>
        </text>
        <text fontSize="10.5" letterSpacing="2.5" fill="var(--color-beacon)" opacity="0.9">
          <textPath href="#rimBottom" startOffset="50%" textAnchor="middle">
            MUNICÍPIO DA CAÁLA · HUAMBO
          </textPath>
        </text>
      </svg>

      {/* Brasão oficial do SIC, centrado dentro do anel do selo */}
      <div className="absolute inset-[26%] rounded-full overflow-hidden" style={{ transform: "rotate(-8deg)" }}>
        <img
          src="/brand/logo-sic.svg"
          alt=""
          aria-hidden
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
}

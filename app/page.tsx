import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { OfficialSeal } from "@/components/OfficialSeal";
import { RevealOnView } from "@/components/RevealOnView";
import { SpotlightCard } from "@/components/SpotlightCard";
import { ProtocolTracker } from "@/components/ProtocolTracker";

const services = [
  {
    href: "/denuncia?tipo=anonima",
    label: "Denúncia anónima",
    desc: "Relate um crime ou situação suspeita sem se identificar.",
    tag: "Sem identificação",
  },
  {
    href: "/denuncia?tipo=queixa",
    label: "Queixa electrónica",
    desc: "Apresente uma queixa formal identificada.",
    tag: "Com acompanhamento directo",
  },
  {
    href: "#acompanhar",
    label: "Acompanhar processo",
    desc: "Já denunciou? Consulte o estado actual do seu caso a qualquer momento, com o código de validação que recebeu.",
    tag: "Código de protocolo",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        {
        <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-16 md:pt-24">
          <div className="grid gap-12 md:grid-cols-5 md:items-start">
            <RevealOnView className="md:col-span-3">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-beacon)]">
                SENTINELA · SIC Município da Caála
              </p>
              <h1 className="mt-5 font-[var(--font-display)] text-4xl font-medium leading-[1.15] text-[var(--color-paper)] sm:text-5xl">
                A Caála tem quem vigia por si.
              </h1>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[var(--color-mist)]">
                O Sentinela é o canal oficial de denúncia e queixa do Serviço de
                Investigação Criminal da Caála, sob tutela do Ministério do
                Interior. Registe uma ocorrência em minutos e acompanhe o processo do início ao fim.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/denuncia"
                  className="rounded-lg bg-[var(--color-beacon)] px-6 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-beacon-dim)]"
                >
                  Fazer uma denúncia
                </Link>
                <Link
                  href="/identificacao-cadaveres"
                  className="rounded-lg border border-paper/15 px-6 py-3 text-sm font-semibold text-[var(--color-paper)] transition hover:border-paper/30"
                >
                  Ajude na investigação
                </Link>
              </div>
            </RevealOnView>

            <RevealOnView delayMs={150} className="md:col-span-2 md:justify-self-end md:pt-6">
              <OfficialSeal />
            </RevealOnView>
          </div>
        </section>
}
        {/* Service paths */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <RevealOnView>
            <h2 className="font-[var(--font-display)] text-2xl text-[var(--color-paper)]">
              Escolha como quer reportar
            </h2>
          </RevealOnView>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {services.map((s, i) => (
              <RevealOnView key={s.label} delayMs={i * 100}>
                <SpotlightCard>
                  <span className="font-mono text-[11px] uppercase tracking-wide text-[var(--color-beacon)]">
                    {s.tag}
                  </span>
                  <h3 className="mt-3 font-[var(--font-display)] text-lg text-[var(--color-paper)]">
                    {s.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-mist)]">
                    {s.desc}
                  </p>
                  <Link
                    href={s.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-paper)] group-hover:text-[var(--color-beacon)]"
                  >
                    Continuar
                  </Link>
                </SpotlightCard>
              </RevealOnView>
            ))}
          </div>
        </section>

        {/* Trust band */}
        <section id="seguranca" className="border-y border-paper/10 bg-[var(--color-ink-2)]">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <RevealOnView>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-beacon)]">
                Como protegemos os seus dados
              </p>
              <h2 className="mt-3 max-w-xl font-[var(--font-display)] text-2xl text-[var(--color-paper)]">
                O anonimato é sempre eficaz.
              </h2>
            </RevealOnView>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {[
                {
                  t: "Sem registo de origem",
                  d: "Em denúncias anónimas, não guardamos dados que permitam identificá-lo.",
                },
                {
                  t: "Encriptação de ponta a ponta",
                  d: "O conteúdo da denúncia é encriptado antes de chegar aos investigadores do SIC.",
                },
                {
                  t: "Acesso restrito e auditado",
                  d: "Só investigadores atribuídos ao caso acedem ao processo, e cada acesso fica registado.",
                },
              ].map((item, i) => (
                <RevealOnView key={item.t} delayMs={i * 100}>
                  <p className="font-[var(--font-display)] text-base text-[var(--color-paper)]">{item.t}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-mist)]">{item.d}</p>
                </RevealOnView>
              ))}
            </div>
          </div>
        </section>

        {/* Protocol tracker */}
        <section id="acompanhar" className="mx-auto max-w-2xl px-6 py-20">
          <RevealOnView>
            <ProtocolTracker />
          </RevealOnView>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

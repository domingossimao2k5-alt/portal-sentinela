import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RevealOnView } from "@/components/RevealOnView";
import { WantedList } from "@/components/WantedList";
import { CrimeStatsChart } from "@/components/CrimeStatsChart";
import { ZoneAlertSignup } from "@/components/ZoneAlertSignup";

export default function TransparenciaPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-6 pb-8 pt-16">
          <RevealOnView>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-beacon)]">
              Espaço público
            </p>
            <h1 className="mt-3 font-[var(--font-display)] text-3xl text-[var(--color-paper)] sm:text-4xl">
              Transparência do SIC Caála
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-mist)]">
              Informação pública, sem necessidade de criar conta: procurados,
              desaparecidos e recuperações, estatísticas agregadas de
              criminalidade, e alertas por bairro para quem quiser subscrever.
            </p>
          </RevealOnView>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-10">
          <RevealOnView>
            <h2 className="font-[var(--font-display)] text-xl text-[var(--color-paper)]">
              Procurados, desaparecidos e recuperações
            </h2>
          </RevealOnView>
          <RevealOnView delayMs={100}>
            <div className="mt-6">
              <WantedList />
            </div>
          </RevealOnView>
        </section>

        <section className="mx-auto max-w-2xl px-6 py-16">
          <RevealOnView>
            <h2 className="font-[var(--font-display)] text-xl text-[var(--color-paper)]">
              Alertas por bairro
            </h2>
            <p className="mt-2 text-sm text-[var(--color-mist)]">
              Receba um aviso do SIC quando houver uma ocorrência relevante perto de si.
            </p>
            <div className="mt-6">
              <ZoneAlertSignup />
            </div>
          </RevealOnView>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

import { InternalHeader } from "@/components/InternalHeader";
import { KpiCard } from "@/components/KpiCard";
import { CasesByCategoryChart } from "@/components/CasesByCategoryChart";
import { CasesTrendChart } from "@/components/CasesTrendChart";
import { CaseQueueTable } from "@/components/CaseQueueTable";
import { createClient } from "@/lib/supabase/server";
import { obterDadosInvestigador } from "@/lib/investigador-data";

export default async function InvestigadorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { kpis, trend, porCategoria, fila } = await obterDadosInvestigador();

  return (
    <>
      <InternalHeader email={user?.email ?? undefined} />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-steel)]">
          Visão geral · SIC Caála
        </p>
        <h1 className="mt-2 font-[var(--font-display)] text-2xl text-[var(--color-paper)]">
          Painel de casos
        </h1>

        {/* KPI row */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Queixas na fila" value={String(kpis.total)} />
          <KpiCard
            label="Tempo médio até triagem"
            value={kpis.horasAteTriagem !== null ? `${kpis.horasAteTriagem}h` : "—"}
          />
          <KpiCard
            label="Prazo excedido (72h)"
            value={String(kpis.prazoExcedido)}
            delta={kpis.prazoExcedido > 0 ? "Requer atenção" : undefined}
          />
          <KpiCard
            label="Críticas em aberto"
            value={String(kpis.criticasAbertas)}
            delta={kpis.semAtribuicao > 0 ? `${kpis.semAtribuicao} sem atribuição` : undefined}
          />
        </div>

        {/* Charts */}
        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <div className="card p-6 lg:col-span-3">
            <h2 className="font-[var(--font-display)] text-lg text-[var(--color-paper)]">
              Casos recebidos vs. resolvidos
            </h2>
            <p className="text-xs text-[var(--color-mist-dim)]">Últimas 6 semanas</p>
            <div className="mt-6">
              <CasesTrendChart weekLabels={trend.weekLabels} received={trend.received} resolved={trend.resolved} />
            </div>
          </div>

          <div className="card p-6 lg:col-span-2">
            <h2 className="font-[var(--font-display)] text-lg text-[var(--color-paper)]">
              Casos abertos por categoria
            </h2>
            <div className="mt-6">
              <CasesByCategoryChart data={porCategoria} />
            </div>
          </div>
        </div>

        {/* Queue */}
        <div className="mt-8">
          <h2 className="font-[var(--font-display)] text-lg text-[var(--color-paper)]">
            Fila de casos recentes
          </h2>
          <div className="mt-4">
            <CaseQueueTable cases={fila} />
          </div>
        </div>
      </main>
    </>
  );
}

import { createClient } from "@/lib/supabase/server";

const STATUS_LABEL: Record<string, string> = {
  recebida: "Recebida",
  em_analise: "Em triagem",
  encaminhada: "Encaminhada",
  concluida: "Concluída",
  arquivada: "Arquivada",
};

const PRIORIDADE_LABEL: Record<string, "Alta" | "Normal" | "Baixa"> = {
  critica: "Alta",
  alta: "Alta",
  media: "Normal",
  baixa: "Baixa",
};

function tempoRelativo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.round(diffMs / 60000);
  if (min < 60) return `há ${Math.max(min, 1)} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  return `há ${d} d`;
}

export type IndicadoresQueixas = {
  total: number;
  recebidas: number;
  em_analise: number;
  encaminhadas: number;
  concluidas: number;
  arquivadas: number;
  sem_atribuicao: number;
  prazo_excedido: number;
  criticas_abertas: number;
  horas_ate_triagem: number | null;
};

/**
 * Dados reais do painel /investigador: indicadores agregados (RPC
 * queixas_indicadores, já usada pelo ERP), mais tendência semanal,
 * categorias e fila calculadas aqui a partir das queixas eletrónicas
 * das últimas 6 semanas. RLS garante que só um investigador autenticado
 * chega até aqui (ver migrações 0006/0026 — select "authenticated").
 *
 * Não há um campo dedicado de "data de resolução" no schema — usa-se
 * updated_at das queixas já concluídas/arquivadas como aproximação.
 */
export async function obterDadosInvestigador() {
  const supabase = await createClient();

  const [{ data: indicadores }, { data: queixas }] = await Promise.all([
    supabase.rpc("queixas_indicadores", { p_prazo_horas: 72 }).maybeSingle(),
    supabase
      .from("queixas_eletronicas")
      .select("id, numero_queixa, tipo_ocorrencia, status, prioridade, created_at, updated_at, zonas(nome)")
      .gte("created_at", new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString())
      .order("updated_at", { ascending: false }),
  ]);

  const lista = queixas ?? [];

  // --- Tendência semanal (6 semanas) ---
  const semanas: { inicio: Date; fim: Date }[] = [];
  const hoje = new Date();
  for (let i = 5; i >= 0; i--) {
    const fim = new Date(hoje.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const inicio = new Date(fim.getTime() - 7 * 24 * 60 * 60 * 1000);
    semanas.push({ inicio, fim });
  }
  const weekLabels = semanas.map((_, i) => `S${i + 1}`);
  const received = semanas.map(
    ({ inicio, fim }) =>
      lista.filter((q) => {
        const t = new Date(q.created_at).getTime();
        return t >= inicio.getTime() && t < fim.getTime();
      }).length
  );
  const resolved = semanas.map(
    ({ inicio, fim }) =>
      lista.filter((q) => {
        if (q.status !== "concluida" && q.status !== "arquivada") return false;
        const t = new Date(q.updated_at).getTime();
        return t >= inicio.getTime() && t < fim.getTime();
      }).length
  );

  // --- Por categoria (top 7) ---
  const contagemCategoria = new Map<string, number>();
  for (const q of lista) {
    contagemCategoria.set(q.tipo_ocorrencia, (contagemCategoria.get(q.tipo_ocorrencia) ?? 0) + 1);
  }
  const porCategoria = [...contagemCategoria.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);

  // --- Fila (8 mais recentes, por actualização) ---
  const fila = lista.slice(0, 8).map((q) => {
    const zona = (q as { zonas?: { nome: string } | { nome: string }[] | null }).zonas;
    const nomeZona = Array.isArray(zona) ? zona[0]?.nome : zona?.nome;
    return {
      id: q.id as string,
      protocol: q.numero_queixa as string,
      category: q.tipo_ocorrencia as string,
      bairro: nomeZona ?? "Zona não classificada",
      status: STATUS_LABEL[q.status as string] ?? q.status,
      priority: PRIORIDADE_LABEL[q.prioridade as string] ?? "Normal",
      updated: tempoRelativo(q.updated_at as string),
    };
  });

  const ind = indicadores as IndicadoresQueixas | null;

  return {
    kpis: {
      total: ind?.total ?? 0,
      criticasAbertas: ind?.criticas_abertas ?? 0,
      prazoExcedido: ind?.prazo_excedido ?? 0,
      horasAteTriagem: ind?.horas_ate_triagem ?? null,
      semAtribuicao: ind?.sem_atribuicao ?? 0,
    },
    trend: { weekLabels, received, resolved },
    porCategoria,
    fila,
  };
}

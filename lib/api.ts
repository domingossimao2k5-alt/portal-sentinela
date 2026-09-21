export class ApiConfigError extends Error {}

function baseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_SENTINELA;
  if (!url) {
    throw new ApiConfigError(
      "Não é possível contactar o Sentinela."
    );
  }
  return url.replace(/\/$/, "");
}

export type RespostaApi<T> =
  | ({ success: true } & T)
  | { success: false; error?: string; fieldErrors?: Record<string, string[]> };

async function pedido<T>(caminho: string, init: RequestInit): Promise<RespostaApi<T>> {
  let resposta: Response;
  try {
    resposta = await fetch(`${baseUrl()}${caminho}`, init);
  } catch {
    return { success: false, error: "Não foi possível contactar o servidor. Verifique a sua ligação." };
  }

  let corpo: RespostaApi<T>;
  try {
    corpo = await resposta.json();
  } catch {
    return { success: false, error: "Resposta inesperada do servidor." };
  }

  return corpo;
}

/** Submete uma queixa eletrónica (formulário de denúncia). */
export async function submeterQueixa(formData: FormData) {
  return pedido<{ numeroQueixa: string }>("/api/portal/queixas", {
    method: "POST",
    body: formData,
  });
}

/** Consulta o estado de uma queixa pelo número de protocolo. */
export async function consultarQueixa(numero: string) {
  return pedido<{
    queixa: {
      numero_queixa: string;
      tipo_ocorrencia: string;
      status: string;
      created_at: string;
      updated_at: string;
    };
  }>("/api/portal/queixas/consultar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numero }),
  });
}

/** Submete o formulário de apoio à identificação. */
export async function submeterIdentificacao(formData: FormData) {
  return pedido<{ protocolo: string }>("/api/portal/identificacao", {
    method: "POST",
    body: formData,
  });
}

export type ItemPublico = {
  id: string;
  categoria: "procurado" | "desaparecido" | "objecto_recuperado" | "veiculo_recuperado";
  titulo: string;
  detalhe: string | null;
  foto_url: string | null;
  local: string | null;
  data_referencia: string;
  urgencia: string | null;
  recompensa: number | null;
};

/** Lista pública de procurados, desaparecidos e achados (Transparência). */
export async function obterItensPublicos() {
  return pedido<{ itens: ItemPublico[] }>("/api/portal/itens-publicos", { method: "GET" });
}

export type CategoriaEstatistica = { categoria: string; total: number };

/** Estatísticas agregadas de criminalidade dos últimos 30 dias (Transparência). */
export async function obterEstatisticasPublicas() {
  return pedido<{ categorias: CategoriaEstatistica[] }>("/api/portal/estatisticas-publicas", { method: "GET" });
}

export type MensagemQueixa = { remetente: "cidadao" | "investigador"; texto: string; created_at: string };

/** Lê a conversa de uma queixa pelo protocolo. */
export async function obterMensagensQueixa(numero: string) {
  return pedido<{ mensagens: MensagemQueixa[] }>(
    `/api/portal/queixas/mensagens?numero=${encodeURIComponent(numero)}`,
    { method: "GET" }
  );
}

/** Envia uma mensagem do queixoso na conversa da sua queixa. */
export async function enviarMensagemQueixa(numero: string, texto: string) {
  return pedido<{ mensagem: { id: string; created_at: string } }>("/api/portal/queixas/mensagens", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numero, texto }),
  });
}

/** Regista a avaliação de satisfação de uma queixa encerrada. */
export async function avaliarQueixa(numero: string, nota: number, comentario?: string) {
  return pedido<Record<string, never>>("/api/portal/queixas/avaliar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numero, nota, comentario: comentario || null }),
  });
}

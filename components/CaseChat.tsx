"use client";

import { useEffect, useRef, useState } from "react";
import { obterMensagensQueixa, enviarMensagemQueixa, type MensagemQueixa } from "@/lib/api";

// Intervalo de atualização automática da conversa — não há WebSocket/
// realtime aqui (o portal fala com o Sentinela só por HTTP simples), por
// isso o "quase tempo real" é feito por polling discreto enquanto o
// painel está aberto.
const INTERVALO_ATUALIZACAO_MS = 15000;

export function CaseChat({ numero }: { numero: string }) {
  const [messages, setMessages] = useState<MensagemQueixa[]>([]);
  const [draft, setDraft] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [carregado, setCarregado] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let montado = true;

    async function atualizar() {
      const resultado = await obterMensagensQueixa(numero);
      if (!montado || !resultado.success) return;
      setMessages(resultado.mensagens);
      setCarregado(true);
    }

    atualizar();
    const intervalo = setInterval(atualizar, INTERVALO_ATUALIZACAO_MS);
    return () => {
      montado = false;
      clearInterval(intervalo);
    };
  }, [numero]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  async function send() {
    const texto = draft.trim();
    if (!texto || enviando) return;
    setEnviando(true);
    setErro("");

    const resultado = await enviarMensagemQueixa(numero, texto);
    setEnviando(false);

    if (!resultado.success) {
      setErro(resultado.error ?? "Não foi possível enviar a mensagem. Tente novamente.");
      return;
    }

    setMessages((m) => [...m, { remetente: "cidadao", texto, created_at: resultado.mensagem.created_at }]);
    setDraft("");
  }

  return (
    <div className="card">
      <div className="border-b border-white/40 dark:border-white/10 px-4 py-3">
        <p className="text-sm text-[var(--color-paper)]">Conversa com o investigador</p>
        <p className="text-xs text-[var(--color-mist-dim)]">
          A sua identidade permanece protegida. O investigador só vê esta conversa, nunca dados pessoais que não tenha partilhado aqui.
        </p>
      </div>

      <div ref={listRef} className="max-h-56 space-y-2.5 overflow-y-auto px-4 py-3">
        {!carregado && (
          <p className="text-center text-xs text-[var(--color-mist-dim)]">A carregar conversa…</p>
        )}
        {carregado && messages.length === 0 && (
          <p className="text-center text-xs text-[var(--color-mist-dim)]">
            Ainda sem mensagens. Escreva abaixo se quiser acrescentar alguma informação.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.remetente === "cidadao" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-xs ${
                m.remetente === "cidadao"
                  ? "bg-[var(--color-beacon)] text-[var(--color-ink)]"
                  : "bg-white/60 dark:bg-white/10 text-[var(--color-paper)]"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.texto}</p>
              <p className={`mt-1 text-[10px] ${m.remetente === "cidadao" ? "text-[var(--color-ink)]/60" : "text-[var(--color-mist-dim)]"}`}>
                {new Date(m.created_at).toLocaleString("pt-AO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {erro && <p className="px-4 pb-2 text-xs text-[var(--color-alert)]">{erro}</p>}

      <div className="flex gap-2 border-t border-white/40 dark:border-white/10 p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Escreva uma mensagem…"
          disabled={enviando}
          className="input-field flex-1 !py-2 !text-xs"
        />
        <button onClick={send} disabled={enviando || !draft.trim()} className="btn-primary !px-3 !py-2 !text-xs disabled:opacity-50">
          {enviando ? "A enviar…" : "Enviar"}
        </button>
      </div>
    </div>
  );
}

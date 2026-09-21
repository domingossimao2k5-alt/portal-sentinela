"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FileDropzone } from "@/components/FileDropzone";
import { HoneypotField } from "@/components/HoneypotField";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { useAntiAbuse } from "@/lib/useAntiAbuse";
import { submeterIdentificacao } from "@/lib/api";

export default function IdentificacaoCadaveresPage() {
  const [submitted, setSubmitted] = useState(false);
  const [protocol, setProtocol] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [descricao, setDescricao] = useState("");
  const [localReferencia, setLocalReferencia] = useState("");
  const [contact, setContact] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [consentimento, setConsentimento] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const antiAbuse = useAntiAbuse();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = antiAbuse.check();
    if (!result.ok) {
      setBlockReason(result.reason);
      return;
    }
    if (!consentimento) {
      setBlockReason("É necessário aceitar a Política de Privacidade para submeter.");
      return;
    }

    setBlockReason("");
    setSubmitting(true);

    const formData = new FormData();
    formData.set("descricao", descricao);
    formData.set("local_referencia", localReferencia);
    formData.set("contacto", contact);
    formData.set("consentimento_aceite", String(consentimento));
    formData.set("turnstileToken", turnstileToken);
    formData.set("website", antiAbuse.honeypot);
    attachments.forEach((f) => formData.append("anexos", f));

    const resultado = await submeterIdentificacao(formData);
    setSubmitting(false);

    if (!resultado.success) {
      setBlockReason(resultado.error ?? "Não foi possível submeter a informação. Tente novamente.");
      return;
    }

    antiAbuse.markSubmitted();
    setProtocol(resultado.protocolo);
    setSubmitted(true);
  }

  return (
    <>
      <SiteHeader />
      <main className="px-6 py-16">
        <div className="mx-auto max-w-lg">
          {!submitted ? (
            <>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-beacon)]">
                Apoio ao cidadão
              </p>
              <h1 className="mt-3 font-[var(--font-display)] text-2xl text-[var(--color-paper)]">
                Apoio à identificação
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-mist)]">
                Se acredita que pode ajudar a identificar uma pessoa através
                dos registos do SIC, ou está à procura de um familiar,
                preencha as informações que tiver disponíveis. A nossa equipa
                de apoio entrará em contacto.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label className="mb-1 block text-xs text-[var(--color-mist)]">
                    Características que possam ajudar na identificação
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Idade aproximada, altura, sinais particulares, local e data em que a pessoa desapareceu ou foi encontrada…"
                    className="w-full rounded-lg border border-paper/10 bg-[var(--color-ink-2)] px-4 py-3 text-sm text-[var(--color-paper)] placeholder:text-[var(--color-mist-dim)] focus:border-[var(--color-beacon)]/60"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-[var(--color-mist)]">
                    Local aproximado
                  </label>
                  <input
                    value={localReferencia}
                    onChange={(e) => setLocalReferencia(e.target.value)}
                    placeholder="Bairro, município ou referência"
                    className="w-full rounded-lg border border-paper/10 bg-[var(--color-ink-2)] px-4 py-3 text-sm text-[var(--color-paper)] placeholder:text-[var(--color-mist-dim)] focus:border-[var(--color-beacon)]/60"
                  />
                </div>

                <div>
                  <p className="mb-1 text-xs text-[var(--color-mist)]">
                    Fotografia ou documento de apoio (opcional)
                  </p>
                  <FileDropzone onFilesChange={setAttachments} />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-[var(--color-mist)]">
                    O seu contacto, para a equipa poder responder-lhe
                  </label>
                  <input
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Telefone ou e-mail"
                    className="w-full rounded-lg border border-paper/10 bg-[var(--color-ink-2)] px-4 py-3 text-sm text-[var(--color-paper)] placeholder:text-[var(--color-mist-dim)] focus:border-[var(--color-beacon)]/60"
                  />
                  <p className="mt-1.5 text-xs text-[var(--color-mist-dim)]">
                    Este processo não pode ser anónimo, a nossa equipa de apoio precisará de entrar em contacto.
                  </p>
                </div>

                <HoneypotField value={antiAbuse.honeypot} onChange={antiAbuse.setHoneypot} />

                <TurnstileWidget onToken={setTurnstileToken} />

                <label className="mt-2 flex items-start gap-2.5 text-xs text-[var(--color-mist-dim)]">
                  <input
                    type="checkbox"
                    checked={consentimento}
                    onChange={(e) => setConsentimento(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    Li e aceito a{" "}
                    <Link href="/privacidade" className="underline decoration-dotted hover:text-[var(--color-mist)]">
                      Política de Privacidade
                    </Link>
                    .
                  </span>
                </label>

                {blockReason && <p className="text-sm text-[var(--color-alert)]">{blockReason}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-[var(--color-beacon)] px-6 py-3 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-beacon-dim)] disabled:opacity-50"
                >
                  {submitting ? "A enviar…" : "Enviar informação"}
                </button>
              </form>
            </>
          ) : (
            <div className="reveal rounded-2xl border border-paper/10 bg-[var(--color-ink-2)] p-8 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-beacon)]">
                Informação recebida
              </p>
              <h1 className="mt-3 font-[var(--font-display)] text-2xl text-[var(--color-paper)]">
                Obrigado por ajudar
              </h1>
              <p className="mt-4 text-sm text-[var(--color-mist)]">
                A equipa de identificação da SIC Caála vai analisar a informação e entrará em contacto através de <span className="text-[var(--color-paper)]">{contact}</span>.
              </p>
              <div className="mt-6 rounded-xl border border-[var(--color-beacon)]/30 bg-[var(--color-ink)] py-4">
                <p className="font-mono text-xl tracking-wide text-[var(--color-beacon)]">{protocol}</p>
              </div>
              <Link
                href="/"
                className="mt-8 inline-block rounded-lg border border-paper/15 px-6 py-3 text-sm font-semibold text-[var(--color-paper)] hover:border-paper/30"
              >
                Voltar ao início
              </Link>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}


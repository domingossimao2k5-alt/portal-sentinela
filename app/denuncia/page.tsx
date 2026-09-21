"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DynamicFields } from "@/components/DynamicFields";
import { FileDropzone } from "@/components/FileDropzone";
import { GeoCapture } from "@/components/GeoCapture";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { DuplicateWarning } from "@/components/DuplicateWarning";
import { HoneypotField } from "@/components/HoneypotField";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { useAntiAbuse } from "@/lib/useAntiAbuse";
import { submeterQueixa } from "@/lib/api";

const CATEGORIES = [
  "Roubo ou furto",
  "Violência doméstica",
  "Agressão física",
  "Tráfico de droga",
  "Corrupção",
  "Vandalismo",
  "Pessoa desaparecida",
  "Outro",
];

function DenunciaForm() {
  const params = useSearchParams();
  const anonima = params.get("tipo") !== "queixa";

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [notifyPhone, setNotifyPhone] = useState("");
  const [extraFields, setExtraFields] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<File[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [consentimento, setConsentimento] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [protocol, setProtocol] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const antiAbuse = useAntiAbuse();

  const totalSteps = 3;

  function next() {
    if (step < totalSteps) setStep(step + 1);
  }
  function back() {
    if (step > 1) setStep(step - 1);
  }

  async function submit() {
    const local = antiAbuse.check();
    if (!local.ok) {
      setBlockReason(local.reason);
      return;
    }
    if (!consentimento) {
      setBlockReason("É necessário aceitar os Termos de Uso e a Política de Privacidade para submeter.");
      return;
    }

    setBlockReason("");
    setSubmitting(true);

    const formData = new FormData();
    formData.set("tipo_ocorrencia", category);
    formData.set("descricao", description);
    formData.set("local_ocorrencia", location);
    formData.set("anonima", String(anonima));
    formData.set("consentimento_aceite", String(consentimento));
    formData.set("campos_extra", JSON.stringify(extraFields));
    formData.set("turnstileToken", turnstileToken);
    formData.set("website", antiAbuse.honeypot);
    if (coords) {
      formData.set("latitude", String(coords.lat));
      formData.set("longitude", String(coords.lng));
    }
    if (anonima) {
      if (notifyPhone) formData.set("notificacao_telefone", notifyPhone);
    } else {
      formData.set("nome_queixoso", contact ? contact : "");
      formData.set("contacto", contact);
    }
    attachments.forEach((f) => formData.append("anexos", f));
    if (voiceBlob) formData.set("nota_voz", voiceBlob, "nota-de-voz.webm");

    const resultado = await submeterQueixa(formData);
    setSubmitting(false);

    if (!resultado.success) {
      setBlockReason(resultado.error ?? "Não foi possível submeter a denúncia. Tente novamente.");
      return;
    }

    antiAbuse.markSubmitted();
    setProtocol(resultado.numeroQueixa);
    setStep(4);
  }

  if (step === 4) {
    return (
      <div className="reveal mx-auto max-w-lg rounded-2xl border border-paper/10 bg-[var(--color-ink-2)] p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-beacon)]">
          Registo concluído
        </p>
        <h1 className="mt-3 font-[var(--font-display)] text-2xl text-[var(--color-paper)]">
          O seu caso foi recebido pelo SIC Caála
        </h1>
        <p className="mt-4 text-sm text-[var(--color-mist)]">
          Guarde este código. É a única forma de consultar o estado do seu processo{" "}
          {anonima ? "sem se identificar" : "e de o associarmos ao seu contacto"}.
        </p>
        <div className="mt-6 rounded-xl border border-[var(--color-beacon)]/30 bg-[var(--color-ink)] py-4">
          <p className="font-mono text-2xl tracking-wide text-[var(--color-beacon)]">{protocol}</p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/#acompanhar"
            className="rounded-lg bg-[var(--color-beacon)] px-6 py-3 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-beacon-dim)]"
          >
            Acompanhar este processo
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-paper/15 px-6 py-3 text-sm font-semibold text-[var(--color-paper)] hover:border-paper/30"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-beacon)]">
        {anonima ? "Denúncia anónima" : "Queixa electrónica"} · Passo {step} de {totalSteps}
      </p>

      <div className="mt-3 mb-8 flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i < step ? "bg-[var(--color-beacon)]" : "bg-paper/10"
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div>
          <h1 className="font-[var(--font-display)] text-2xl text-[var(--color-paper)]">
            O que aconteceu?
          </h1>
          <div className="mt-6 grid gap-2.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCategory(c);
                  next();
                }}
                className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                  category === c
                    ? "border-[var(--color-beacon)] text-[var(--color-paper)]"
                    : "border-paper/10 text-[var(--color-mist)] hover:border-paper/25"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1 className="font-[var(--font-display)] text-2xl text-[var(--color-paper)]">
            Descreva a ocorrência
          </h1>
          <p className="mt-2 text-sm text-[var(--color-mist)]">
            Inclua data, local aproximado e quaisquer detalhes relevantes. Quanto mais concreto, mais fácil é para o SIC agir.
          </p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            placeholder="Descreva o que viu ou viveu…"
            className="mt-5 w-full rounded-lg border border-paper/10 bg-[var(--color-ink-2)] px-4 py-3 text-sm text-[var(--color-paper)] placeholder:text-[var(--color-mist-dim)] focus:border-[var(--color-beacon)]/60"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Local aproximado (bairro, rua, referência)"
            className="mt-3 w-full rounded-lg border border-paper/10 bg-[var(--color-ink-2)] px-4 py-3 text-sm text-[var(--color-paper)] placeholder:text-[var(--color-mist-dim)] focus:border-[var(--color-beacon)]/60"
          />
          <DuplicateWarning category={category} location={location} />

          <GeoCapture onCapture={setCoords} />
          <VoiceRecorder onChange={setVoiceBlob} />

          <div>
            <p className="mt-4 text-sm text-[var(--color-paper)]">Provas (opcional)</p>
            <FileDropzone onFilesChange={setAttachments} />
          </div>

          {category && <DynamicFields category={category} onChange={setExtraFields} />}

          {!anonima && (
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="O seu contacto (telefone ou e-mail)"
              className="mt-3 w-full rounded-lg border border-paper/10 bg-[var(--color-ink-2)] px-4 py-3 text-sm text-[var(--color-paper)] placeholder:text-[var(--color-mist-dim)] focus:border-[var(--color-beacon)]/60"
            />
          )}

          {anonima && (
            <div className="mt-3">
              <input
                value={notifyPhone}
                onChange={(e) => setNotifyPhone(e.target.value)}
                placeholder="Telefone só para receber SMS de actualização (opcional)"
                className="w-full rounded-lg border border-paper/10 bg-[var(--color-ink-2)] px-4 py-3 text-sm text-[var(--color-paper)] placeholder:text-[var(--color-mist-dim)] focus:border-[var(--color-beacon)]/60"
              />
              <p className="mt-1.5 text-xs text-[var(--color-mist-dim)]">
                Este número fica ligado apenas a notificações.
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button onClick={back} className="text-sm text-[var(--color-mist)] hover:text-[var(--color-paper)]">
              ← Voltar
            </button>
            <button
              onClick={next}
              disabled={!description.trim()}
              className="rounded-lg bg-[var(--color-beacon)] px-6 py-2.5 text-sm font-semibold text-[var(--color-ink)] disabled:opacity-40"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h1 className="font-[var(--font-display)] text-2xl text-[var(--color-paper)]">
            Reveja antes de enviar
          </h1>
          <dl className="mt-6 space-y-4 rounded-xl border border-paper/10 bg-[var(--color-ink-2)] p-5 text-sm">
            <div>
              <dt className="text-[var(--color-mist-dim)]">Categoria</dt>
              <dd className="mt-0.5 text-[var(--color-paper)]">{category || "Não especificada"}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-mist-dim)]">Descrição</dt>
              <dd className="mt-0.5 text-[var(--color-paper)]">{description || "—"}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-mist-dim)]">Local</dt>
              <dd className="mt-0.5 text-[var(--color-paper)]">
                {location || "Não indicado"}
                {coords && ` · GPS ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`}
              </dd>
            </div>
            {Object.keys(extraFields).length > 0 && (
              <div>
                <dt className="text-[var(--color-mist-dim)]">Detalhes da categoria</dt>
                <dd className="mt-0.5 space-y-0.5 text-[var(--color-paper)]">
                  {Object.entries(extraFields)
                    .filter(([, v]) => v.trim())
                    .map(([k, v]) => (
                      <p key={k}>{v}</p>
                    ))}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-[var(--color-mist-dim)]">Anexos</dt>
              <dd className="mt-0.5 text-[var(--color-paper)]">
                {[
                  attachments.length > 0 && `${attachments.length} ficheiro(s)`,
                  voiceBlob && "nota de voz",
                ]
                  .filter(Boolean)
                  .join(" · ") || "Nenhum"}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--color-mist-dim)]">Identificação</dt>
              <dd className="mt-0.5 text-[var(--color-paper)]">
                {anonima
                  ? notifyPhone
                    ? `Anónima, com notificações por SMS em ${notifyPhone}`
                    : "Anónima, nenhum dado pessoal será guardado"
                  : contact || "Não indicada"}
              </dd>
            </div>
          </dl>

          <HoneypotField value={antiAbuse.honeypot} onChange={antiAbuse.setHoneypot} />

          <label className="mt-4 flex items-start gap-2.5 text-xs text-[var(--color-mist-dim)]">
            <input
              type="checkbox"
              checked={consentimento}
              onChange={(e) => setConsentimento(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              Li e aceito os Termos de Uso e a{" "}
              <Link href="/privacidade" className="underline decoration-dotted hover:text-[var(--color-mist)]">
                Política de Privacidade
              </Link>
              .
            </span>
          </label>

          <TurnstileWidget onToken={setTurnstileToken} />

          {blockReason && (
            <p className="mt-4 text-sm text-[var(--color-alert)]">{blockReason}</p>
          )}

          <div className="mt-6 flex justify-between">
            <button onClick={back} className="text-sm text-[var(--color-mist)] hover:text-[var(--color-paper)]">
              ← Voltar
            </button>
            <button
              onClick={submit}
              disabled={submitting}
              className="rounded-lg bg-[var(--color-beacon)] px-6 py-2.5 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-beacon-dim)] disabled:opacity-50"
            >
              {submitting ? "A enviar…" : "Enviar denúncia"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DenunciaPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] px-6 py-16">
        <Suspense fallback={null}>
          <DenunciaForm />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

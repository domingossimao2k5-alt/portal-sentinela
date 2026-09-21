import Link from "next/link";
import { notFound } from "next/navigation";
import { InternalHeader } from "@/components/InternalHeader";
import { createClient } from "@/lib/supabase/server";
import { ReplyForm } from "./ReplyForm";

export default async function CasoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: queixa }, { data: mensagens }] = await Promise.all([
    supabase.from("queixas_eletronicas").select("*").eq("id", id).maybeSingle(),
    supabase.from("queixas_mensagens").select("*").eq("queixa_id", id).order("created_at", { ascending: true }),
  ]);

  if (!queixa) notFound();

  return (
    <>
      <InternalHeader email={user?.email ?? undefined} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/investigador" className="text-xs text-[var(--color-mist-dim)] underline decoration-dotted">
          ← Voltar ao painel
        </Link>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-steel)]">
              {queixa.numero_queixa}
            </p>
            <h1 className="mt-1 font-[var(--font-display)] text-xl text-[var(--color-paper)]">
              {queixa.tipo_ocorrencia}
            </h1>
          </div>
          <span className="shrink-0 rounded-full border border-paper/15 px-3 py-1 text-xs text-[var(--color-mist)]">
            {queixa.status}
          </span>
        </div>

        <div className="card mt-6 p-5">
          <p className="text-xs uppercase tracking-wide text-[var(--color-mist-dim)]">Descrição</p>
          <p className="mt-1.5 whitespace-pre-wrap text-sm text-[var(--color-paper)]">{queixa.descricao}</p>
          {queixa.local_ocorrencia && (
            <p className="mt-3 text-xs text-[var(--color-mist-dim)]">Local: {queixa.local_ocorrencia}</p>
          )}
          <p className="mt-1 text-xs text-[var(--color-mist-dim)]">
            Contacto do queixoso: {queixa.contacto ?? "—"} {queixa.anonima && "(modo anónimo)"}
          </p>
        </div>

        <div className="card mt-6">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-sm text-[var(--color-paper)]">Conversa com o queixoso</p>
          </div>
          <div className="max-h-80 space-y-2.5 overflow-y-auto px-4 py-3">
            {(mensagens ?? []).length === 0 && (
              <p className="text-center text-xs text-[var(--color-mist-dim)]">Ainda sem mensagens nesta queixa.</p>
            )}
            {(mensagens ?? []).map((m) => (
              <div key={m.id} className={`flex ${m.remetente === "investigador" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-xs ${
                    m.remetente === "investigador"
                      ? "bg-[var(--color-beacon)] text-[var(--color-ink)]"
                      : "bg-white/10 text-[var(--color-paper)]"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.texto}</p>
                  <p className={`mt-1 text-[10px] ${m.remetente === "investigador" ? "text-[var(--color-ink)]/60" : "text-[var(--color-mist-dim)]"}`}>
                    {new Date(m.created_at).toLocaleString("pt-AO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <ReplyForm queixaId={id} />
        </div>
      </main>
    </>
  );
}

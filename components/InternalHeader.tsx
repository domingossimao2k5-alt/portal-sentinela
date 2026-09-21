import { sair } from "@/app/investigador/actions";

export function InternalHeader({ email }: { email?: string } = {}) {
  return (
    <header className="border-b border-[var(--color-line)] bg-[var(--color-ink-2)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <img
            src="/brand/logo-sic.svg"
            alt="Brasão do Serviço de Investigação Criminal"
            className="h-7 w-7 shrink-0"
          />
          <span className="font-[var(--font-display)] text-lg text-[var(--color-paper)]">
            Sentinela <span className="font-body text-sm font-normal text-[var(--color-mist)]">/ Painel do investigador</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          {email && <span className="text-xs text-[var(--color-mist-dim)]">{email}</span>}
          <span className="rounded-full border border-[var(--color-steel)]/40 bg-[var(--color-steel)]/10 px-3 py-1 text-xs text-[var(--color-steel)]">
            Acesso restrito
          </span>
          {email && (
            <form action={sair}>
              <button
                type="submit"
                className="text-xs text-[var(--color-mist-dim)] underline decoration-dotted hover:text-[var(--color-mist)]"
              >
                Sair
              </button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}

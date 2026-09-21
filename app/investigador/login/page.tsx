import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";

export default async function InvestigadorLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectedFrom?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { redirectedFrom } = await searchParams;

  if (user) {
    redirect(redirectedFrom && redirectedFrom.startsWith("/investigador") ? redirectedFrom : "/investigador");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-ink)] px-6">
      <div className="card w-full max-w-sm p-8">
        <div className="flex items-center gap-2.5">
          <img src="/brand/logo-sic.svg" alt="" className="h-8 w-8" />
          <span className="font-[var(--font-display)] text-lg text-[var(--color-paper)]">Sentinela</span>
        </div>
        <p className="mt-1 text-sm text-[var(--color-mist-dim)]">Painel do investigador: acesso restrito</p>

        <LoginForm redirectedFrom={redirectedFrom} />

        <p className="mt-6 text-xs text-[var(--color-mist-dim)]">
          Use a mesma conta que utiliza no Sentinela (ERP interno). Sem acesso? Contacte o administrador do sistema.
        </p>
      </div>
    </main>
  );
}

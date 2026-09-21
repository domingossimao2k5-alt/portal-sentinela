import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[60vh] items-center justify-center px-6 py-20">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-beacon)]">
            Ups!!
          </p>
          <h1 className="mt-3 font-[var(--font-display)] text-3xl text-[var(--color-paper)]">
            Esta página não existe no arquivo do Sentinela
          </h1>
          <p className="mt-3 text-sm text-[var(--color-mist)]">
            Verifique o endereço, ou volte para começar de novo.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-lg bg-[var(--color-beacon)] px-6 py-3 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-beacon-dim)]"
          >
            Voltar ao início
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

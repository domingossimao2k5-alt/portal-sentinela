import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[var(--color-ink)]/85 backdrop-blur-xl">
  
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="/brand/logo-sic.svg"
            alt="Brasão do Serviço de Investigação Criminal"
            className="h-9 w-9 shrink-0"
          />
          <span className="font-[var(--font-display)] text-lg tracking-tight text-[var(--color-paper)]">
            Sentinela <span className="text-[var(--color-mist)] font-body text-sm font-normal">/ SIC Caála</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-[var(--color-mist)] md:flex">
          <Link href="/denuncia" className="hover:text-[var(--color-paper)]">Denunciar</Link>
          <Link href="/identificacao-cadaveres" className="hover:text-[var(--color-paper)]">Apoio à identificação</Link>
          <Link href="/protecao-dados" className="hover:text-[var(--color-paper)]">Como protegemos os seus dados</Link>
          <Link href="/transparencia" className="hover:text-[var(--color-paper)]">Transparência</Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          
        </div>
      </div>
    </header>
  );
}

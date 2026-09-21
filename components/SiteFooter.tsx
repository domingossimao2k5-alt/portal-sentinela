export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-line)] py-10">
      <div className="mx-auto max-w-6xl px-6 text-sm text-[var(--color-mist)]">
        <div className="flex flex-col justify-between gap-6 sm:flex-row">
          <div className="flex items-start gap-3">
            <img
              src="/brand/logo-sic.svg"
              alt="Brasão do Serviço de Investigação Criminal"
              className="h-10 w-10 shrink-0 opacity-90"
            />
            <div>
              <p className="font-[var(--font-display)] text-base text-[var(--color-paper)]">Sentinela</p>
              <p className="mt-1 max-w-xs">
                Serviços de Investigação Criminal do Município da Caála, sob tutela do Ministério do Interior da República de Angola. Um canal directo, seguro e acompanhável entre o cidadão e o SIC.
              </p>
            </div>
          </div>
          <div className="flex gap-10">
            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-[var(--color-mist-dim)]">Serviços</p>
              <ul className="space-y-1.5">
                <li><a href="/denuncia" className="hover:text-[var(--color-paper)]">Denúncia anónima</a></li>
                <li><a href="/transparencia" className="hover:text-[var(--color-paper)]">Transparência</a></li>
                <li><a href="/privacidade" className="hover:text-[var(--color-paper)]">Privacidade</a></li>
                <li><a href="/identificacao-cadaveres" className="hover:text-[var(--color-paper)]">Apoio à identificação</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-[var(--color-mist-dim)]">Contacto</p>
              <ul className="space-y-1.5">
                <li>servicosdeinvestigacaocriminal@gov.ao</li>
                <li>[Rua Serpa pinto, Caála, Huambo]</li>
                
                <li><a href="tel:111" className="hover:text-[var(--color-paper)]">Linha de emergência: 111</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--color-line)] pt-6 text-xs leading-relaxed text-[var(--color-mist-dim)]">
          <p>
            O tratamento de dados pessoais neste portal rege-se pela Lei n.º 22/11, de 17 de Junho, Lei da Protecção de Dados Pessoais, e pelas normas do Código de Processo Penal aplicáveis à participação de crimes. Consulte a <a href="/privacidade" className="underline decoration-dotted hover:text-[var(--color-mist)]">política de privacidade</a> para o detalhe.
          </p>
          <p className="mt-2">
            NIF: 5412015093.
          </p>
          <p className="mt-2">
            O terminal de emergência 111 activo em todos minicípios.
          </p>
        </div>

        <p className="mt-6 text-xs text-[var(--color-mist-dim)]">
          © {new Date().getFullYear()} Sentinela - SIC Caála. Todas as denúncias são tratadas com confidencialidade.
        </p>
      </div>
    </footer>
  );
}

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const SECTIONS = [
  {
    title: "Encriptamos tudo, sempre",
    body: "A nossa equipa cifra cada denúncia, anexo e coordenada de localização antes de ficarem guardados, e cifra também o trajecto entre o seu telefone e os nossos servidores. Isto significa que, mesmo que alguém conseguisse aceder fisicamente aos discos onde os dados vivem, não conseguiria lê-los sem a  que gerimos à parte, fora do alcance de quem administra a base de dados no dia-a-dia.",
  },
  {
    title: "Limitamos quem pode ver o quê",
    body: "Configurámos o sistema para que cada investigador só veja os processos que lhe foram formalmente atribuídos, e cada chefia só veja os processos da sua área de comando. Não existe um utilizador com acesso a tudo por defeito mesmo dentro da equipa técnica. Esta separação está imposta na própria base de dados, não apenas escondida no ecrã, para que não possa ser contornada.",
  },
  {
    title: "Registamos cada acesso",
    body: "Sempre que alguém da nossa equipa abre, altera ou exporta um processo, isso fica registado de forma permanente, quem foi, quando, e o que fez. Estes registos não podem ser editados nem apagados por quem os gerou, e são a primeira coisa que revemos sempre que há suspeita de um acesso indevido.",
  },
  {
    title: "Separamos o que pode ser cruzado",
    body: "Quando deixa um contacto só para notificações numa denúncia anónima, garantimos que esse número fica numa tabela distinta do conteúdo da denúncia, sem qualquer chave que as ligue. Nenhum membro da equipa, por mais acesso que tenha, consegue partir de um número de telefone e chegar ao texto que escreveu, porque construímos o sistema para que essa ligação simplesmente não exista.",
  },
  {
    title: "Formamos e responsabilizamos quem tem acesso",
    body: "Todo o elemento do SIC Caála com acesso ao Sentinela passa por formação sobre o tratamento correcto de dados pessoais antes de lhe ser atribuída uma conta, e assina o compromisso de confidencialidade que a função exige. O uso indevido de um acesso é apurado a partir dos registos de auditoria e tratado como falta disciplinar.",
  },
  {
    title: "Vigiamos e respondemos a incidentes",
    body: "Mantemos cópias de segurança cifradas e monitorização activa da infra-estrutura, para detectar cedo qualquer comportamento fora do normal. Perante uma suspeita de acesso indevido, a nossa equipa consegue revogar credenciais de imediato, isolar o processo afectado e reconstruir exactamente o que foi visto ou alterado, a partir dos registos de auditoria.",
  },
  {
    title: "Guardamos só o tempo necessário",
    body: "A equipa mantém os dados enquanto o processo estiver activo e pelo período legalmente exigido após o encerramento. Passado esse prazo, eliminamos ou anonimizamos a informação. Não conservamos processos arquivados indefinidamente, nem os reaproveitamos para outro fim.",
  },
  {
    title: "Seguimos a lei, não apenas a boa vontade",
    body: "O nosso tratamento de dados segue os princípios da Lei n.º 22/11, de 17 de Junho, Lei de Protecção de Dados Pessoais de Angola: recolhemos apenas o que a investigação exige, usamo-lo apenas para essa finalidade, e cada pessoa da equipa com acesso é identificável e responsável pelo que faz com essa informação.",
  },
];

export default function PrivacidadePage() {
  return (
    <>
      <SiteHeader />
      <main className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-beacon)]">
            Política de privacidade
          </p>
          <h1 className="mt-3 font-[var(--font-display)] text-3xl text-[var(--color-paper)]">
            Como a nossa equipa protege os seus dados
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-mist)]">
            Esta página explica, exactamente, o que fazemos no dia-a-dia para proteger a sua denúncia, desde o momento em que a envia até ao dia em que o processo é encerrado.
          </p>

          <div className="mt-10 space-y-8">
            {SECTIONS.map((s) => (
              <div key={s.title} className="border-t border-paper/10 pt-6">
                <h2 className="font-[var(--font-display)] text-lg text-[var(--color-paper)]">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-mist)]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
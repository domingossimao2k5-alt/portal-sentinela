import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const SECTIONS = [
  {
    title: "Denúncia anónima",
    body: "Não recolhemos nome, endereço IP, identificador de dispositivo, nem qualquer outro dado que permita associar a denúncia a si. O conteúdo que escrever, os anexos e a localização que decidir partilhar são a única informação registada.",
  },
  {
    title: "Queixa electrónica",
    body: "Quando escolhe identificar-se, guardamos apenas o contacto que fornecer, para que o investigador atribuído possa falar consigo. Esse contacto não é partilhado fora do processo.",
  },
  {
    title: "Notificações por SMS em denúncias anónimas",
    body: "Se deixar um número só para notificações, esse número é guardado separadamente do conteúdo da denúncia mesmo internamente, não é possível ligar as duas informações.",
  },
  {
    title: "Anexos e localização",
    body: "Fotos, vídeos, áudio e coordenadas GPS ficam guardados de forma encriptada e só são usados no contexto da investigação do seu caso.",
  },
  {
    title: "Quem acede aos dados",
    body: "Apenas investigadores atribuídos ao caso têm acesso ao processo. Cada acesso é registado e auditável.",
  },
  {
    title: "Quanto tempo guardamos",
    body: "Os dados são conservados enquanto o processo estiver activo e pelo período legalmente exigido após o encerramento, findo o qual são eliminados ou anonimizados.",
  },
  {
    title: "Os seus direitos",
    body: "Pode pedir a eliminação dos seus dados de contacto numa queixa identificada a qualquer momento, através do canal de contacto do SIC Caála. Em denúncias anónimas, não há dados pessoais para eliminar, por não existirem à partida.",
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
            Como tratamos os seus dados
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-mist)]">
            Esta página explica, exactamente o que o Sentinela guarda, o que nunca guarda, e quem pode aceder à sua denúncia.
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

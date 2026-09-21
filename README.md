# Portal Sentinela — Denúncias Eletrónicas

Portal público de denúncias eletrónicas do SIC-Caála (Serviço de Investigação Criminal), um projeto Next.js 15 independente do ERP interno **SENTINELA**, comunicando apenas com os endpoints públicos da API (`/api/portal/queixas`, `/queixas/consultar`, `/identificacao`).

## Stack

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS v4**
- **TypeScript**

## Funcionalidades principais

- Submissão de denúncia eletrónica (com captura geográfica, upload de ficheiros e gravação de áudio)
- Consulta de protocolo/estado de denúncia
- Botão de pânico com partilha honesta de coordenadas
- Página de transparência (estatísticas e lista de procurados)
- Proteção anti-spam via honeypot e Cloudflare Turnstile
- Painel `/investigador` (login + casos) — autenticação Supabase partilhada com o ERP principal (SENTINELA), sessão independente por domínio, RLS herdada das mesmas políticas do ERP

## Configuração local

1. Instalar dependências:
   ```bash
   npm install
   ```
2. Copiar `.env.example` para `.env.local` e preencher as variáveis:
   ```bash
   cp .env.example .env.local
   ```
3. Correr em ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_API_SENTINELA` | URL base da API pública do backend SENTINELA |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Chave de site do Cloudflare Turnstile (anti-spam) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projecto Supabase (mesmo projecto do ERP principal) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anónima/pública do Supabase — **nunca** a `service_role` key |

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a build de produção |
| `npm run start` | Inicia o servidor em modo produção |
| `npm run lint` | Executa o linter |

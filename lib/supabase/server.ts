/**
 * Cliente Supabase para Server Components e Server Actions do painel do
 * investigador (/investigador). Usa cookies para persistência de sessão.
 *
 * É o MESMO projecto Supabase do ERP principal (Sentinela) — os
 * investigadores autenticam-se aqui com a mesma conta que já usam lá.
 * A sessão do portal é independente da sessão do ERP (aplicações
 * diferentes, domínios diferentes, sem cookies partilhados), mas o
 * utilizador e a password são os mesmos porque `auth.users` é partilhado.
 *
 * A leitura de dados (RLS) segue exactamente as mesmas políticas do ERP:
 * qualquer investigador autenticado pode ler queixas_eletronicas e
 * processos (ver migrações 0003 e 0006), por isso não é preciso nenhuma
 * rota proxy no ERP — este cliente consulta o Supabase directamente.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Ignora erro em Server Components (middleware trata)
          }
        },
      },
    }
  );
}

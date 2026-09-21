/**
 * Middleware de autenticação Supabase do portal.
 *
 * Ao contrário do ERP principal (protegido por omissão, com uma lista de
 * excepções públicas), este portal é PÚBLICO por omissão — é a aplicação
 * do cidadão. A única área que exige sessão é o painel interno do
 * investigador, "/investigador" — antes desta migração não tinha
 * nenhuma autenticação e era servido como HTML público comum.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const AREA_RESTRITA = "/investigador";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const precisaSessao =
    request.nextUrl.pathname.startsWith(AREA_RESTRITA) &&
    request.nextUrl.pathname !== `${AREA_RESTRITA}/login`;

  // Nas restantes rotas (todo o portal público) não vale a pena pagar o
  // custo de verificar sessão a cada pedido.
  if (!precisaSessao) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = `${AREA_RESTRITA}/login`;
    url.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

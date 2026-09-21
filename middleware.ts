import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Corre em tudo excepto ficheiros estáticos e imagens — mesmo padrão
     * do ERP principal. Só tem efeito real em /investigador (ver
     * lib/supabase/middleware.ts), mas o matcher fica amplo para não
     * ter de ser reajustado sempre que uma nova rota restrita aparecer.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

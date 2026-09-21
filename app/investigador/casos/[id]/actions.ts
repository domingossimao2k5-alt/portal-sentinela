"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function responderQueixa(queixaId: string, formData: FormData) {
  const texto = String(formData.get("texto") || "").trim();
  if (!texto) return { error: "Mensagem vazia." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Sessão expirada." };

  const { error } = await supabase.from("queixas_mensagens").insert({
    queixa_id: queixaId,
    remetente: "investigador",
    autor_id: user.id,
    texto,
  });

  if (error) {
    return { error: "Não foi possível enviar a resposta." };
  }

  revalidatePath(`/investigador/casos/${queixaId}`);
  return { error: undefined };
}

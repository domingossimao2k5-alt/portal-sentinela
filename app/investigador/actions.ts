"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function entrar(formData: FormData): Promise<{ error?: string } | void> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const redirectedFrom = String(formData.get("redirectedFrom") || "/investigador");

  if (!email || !password) {
    return { error: "Indique o email e a palavra-passe." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Credenciais inválidas." };
  }

  redirect(redirectedFrom.startsWith("/investigador") ? redirectedFrom : "/investigador");
}

export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/investigador/login");
}

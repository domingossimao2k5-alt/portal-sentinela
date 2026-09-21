"use client";

import { useActionState } from "react";
import { entrar } from "../actions";

export function LoginForm({ redirectedFrom }: { redirectedFrom?: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      const resultado = await entrar(formData);
      return resultado ?? undefined;
    },
    undefined
  );

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="redirectedFrom" value={redirectedFrom ?? ""} />
      <div>
        <label className="text-xs text-[var(--color-mist-dim)]" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="input-field mt-1 w-full"
        />
      </div>
      <div>
        <label className="text-xs text-[var(--color-mist-dim)]" htmlFor="password">
          Palavra-passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="input-field mt-1 w-full"
        />
      </div>

      {state?.error && <p className="text-sm text-[var(--color-alert)]">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-50">
        {pending ? "A entrar…" : "Entrar"}
      </button>
    </form>
  );
}

"use client";

import { useRef, useState, useTransition } from "react";
import { responderQueixa } from "./actions";

export function ReplyForm({ queixaId }: { queixaId: string }) {
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(formData: FormData) {
    setErro("");
    startTransition(async () => {
      const resultado = await responderQueixa(queixaId, formData);
      if (resultado?.error) {
        setErro(resultado.error);
        return;
      }
      formRef.current?.reset();
    });
  }

  return (
    <div>
      <form ref={formRef} action={onSubmit} className="flex gap-2 border-t border-white/10 p-3">
        <input
          name="texto"
          placeholder="Escreva uma resposta ao queixoso…"
          disabled={pending}
          className="input-field flex-1 !py-2 !text-xs"
        />
        <button type="submit" disabled={pending} className="btn-primary !px-3 !py-2 !text-xs disabled:opacity-50">
          {pending ? "A enviar…" : "Responder"}
        </button>
      </form>
      {erro && <p className="px-3 pb-3 text-xs text-[var(--color-alert)]">{erro}</p>}
    </div>
  );
}

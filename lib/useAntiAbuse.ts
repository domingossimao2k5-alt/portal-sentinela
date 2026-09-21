"use client";

import { useEffect, useRef, useState } from "react";

const RATE_LIMIT_KEY = "sentinela:last-submission";
const RATE_LIMIT_MS = 60_000; // one submission per minute per browser
const MIN_FILL_MS = 3_000; // forms filled in under 3s are almost always bots

export function useAntiAbuse() {
  const startedAt = useRef(Date.now());
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function check(): { ok: true } | { ok: false; reason: string } {
    if (honeypot.trim() !== "") {
      // A hidden field only a script would fill. Reject silently-ish —
      // no need to explain the mechanism to a bot (or a curious human).
      return { ok: false, reason: "Não foi possível validar o envio. Tente novamente." };
    }

    if (Date.now() - startedAt.current < MIN_FILL_MS) {
      return { ok: false, reason: "Reveja o formulário com calma antes de enviar." };
    }

    if (typeof window !== "undefined") {
      const last = Number(window.sessionStorage.getItem(RATE_LIMIT_KEY) || 0);
      if (Date.now() - last < RATE_LIMIT_MS) {
        const wait = Math.ceil((RATE_LIMIT_MS - (Date.now() - last)) / 1000);
        return { ok: false, reason: `Já recebemos um envio seu há pouco. Aguarde ${wait}s antes de submeter outra denúncia.` };
      }
    }

    return { ok: true };
  }

  function markSubmitted() {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
    }
  }

  return { honeypot, setHoneypot, check, markSubmitted };
}

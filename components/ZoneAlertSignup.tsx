"use client";

import { useState } from "react";

const BAIRROS = [
  "Bloco 7",
  "Caála Velha",
  "Calilongue",
  "Cangola",
  "Catelenga Nova",
  "Catelenga Velha",
  "Caviti",
  "Centalidade",
  "Chandenda",
  "Compão",
  "Codume",
  "CRC",
  "Lua Cheia",
  "Lua Nova",
  "Mangumbala",
  "Rua M",
  "São Paulo",
];

export function ZoneAlertSignup() {
  const [bairro, setBairro] = useState(BAIRROS[0]);
  const [contact, setContact] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contact.trim()) return;
    setSubscribed(true);
  }

  if (subscribed) {
    return (
      <p className="text-sm text-[var(--color-mist)]">
        Passará a receber alertas do SIC para <span className="text-[var(--color-paper)]">{bairro}</span>. Pode cancelar a qualquer momento a partir da mensagem recebida.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <select
        value={bairro}
        onChange={(e) => setBairro(e.target.value)}
        className="rounded-lg border border-paper/10 bg-[var(--color-ink-2)] px-3.5 py-3 text-sm text-[var(--color-paper)] focus:border-[var(--color-beacon)]/60"
      >
        {BAIRROS.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
      <input
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="Telefone ou e-mail"
        className="flex-1 rounded-lg border border-paper/10 bg-[var(--color-ink-2)] px-3.5 py-3 text-sm text-[var(--color-paper)] placeholder:text-[var(--color-mist-dim)] focus:border-[var(--color-beacon)]/60"
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-[var(--color-beacon)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-beacon-dim)]"
      >
        Subscrever alertas
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";

type Coords = { lat: number; lng: number } | null;

export function GeoCapture({ onCapture }: { onCapture?: (c: Coords) => void }) {
  const [coords, setCoords] = useState<Coords>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  function capture() {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(c);
        onCapture?.(c);
        setStatus("idle");
      },
      () => setStatus("error"),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={capture}
        className="flex w-full items-center justify-between rounded-lg border border-paper/10 bg-[var(--color-ink-2)] px-4 py-3 text-sm text-[var(--color-paper)] hover:border-[var(--color-beacon)]/50"
      >
        <span>
          {coords
            ? `Localização anexada · ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
            : "Anexar a minha localização actual"}
        </span>
        <span className="text-xs text-[var(--color-beacon)]">
          {status === "loading" ? "A obter…" : coords ? "Alterar" : "Usar GPS"}
        </span>
      </button>
      {status === "error" && (
        <p className="mt-1.5 text-xs text-[var(--color-alert)]">
          Não foi possível obter a localização. Pode continuar sem ela ou descrever o local no texto acima.
        </p>
      )}
      <p className="mt-1.5 text-xs text-[var(--color-mist-dim)]">
        Ajuda os investigadores a chegar mais depressa ao local.
      </p>
    </div>
  );
}

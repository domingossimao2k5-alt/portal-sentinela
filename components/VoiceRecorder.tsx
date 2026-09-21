"use client";

import { useRef, useState } from "react";

export function VoiceRecorder({ onChange }: { onChange?: (blob: Blob | null) => void }) {
  const [status, setStatus] = useState<"idle" | "recording" | "recorded" | "error">("idle");
  const [url, setUrl] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setUrl(URL.createObjectURL(blob));
        setStatus("recorded");
        onChange?.(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      recorderRef.current = recorder;
      setStatus("recording");
    } catch {
      setStatus("error");
    }
  }

  function stop() {
    recorderRef.current?.stop();
  }

  function discard() {
    setUrl(null);
    setStatus("idle");
    onChange?.(null);
  }

  return (
    <div className="mt-3 rounded-lg border border-paper/10 bg-[var(--color-ink-2)] px-4 py-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-paper)]">
          Prefere falar em vez de escrever?
        </p>
        {status === "idle" && (
          <button
            type="button"
            onClick={start}
            className="rounded-md border border-[var(--color-beacon)]/40 px-3 py-1.5 text-xs font-semibold text-[var(--color-beacon)]"
          >
            Gravar nota de voz
          </button>
        )}
        {status === "recording" && (
          <button
            type="button"
            onClick={stop}
            className="flex items-center gap-2 rounded-md border border-[var(--color-alert)]/50 px-3 py-1.5 text-xs font-semibold text-[var(--color-alert)]"
          >
            <span className="h-2 w-2 rounded-full bg-[var(--color-alert)] pulse-dot" />
            A gravar · parar
          </button>
        )}
      </div>

      {status === "recorded" && url && (
        <div className="mt-3 flex items-center gap-3">
          <audio controls src={url} className="h-9 w-full" />
          <button
            type="button"
            onClick={discard}
            className="shrink-0 text-xs text-[var(--color-mist)] hover:text-[var(--color-alert)]"
          >
            Descartar
          </button>
        </div>
      )}

      {status === "error" && (
        <p className="mt-2 text-xs text-[var(--color-alert)]">
          Não foi possível aceder ao microfone. Pode continuar apenas por escrito.
        </p>
      )}
    </div>
  );
}

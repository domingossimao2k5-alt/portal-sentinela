"use client";

import { useRef, useState } from "react";

type Attachment = {
  id: string;
  name: string;
  sizeKb: number;
  kind: string;
  progress: number;
  error?: string;
  file: File;
};

const MAX_SIZE_MB = 25;

export function FileDropzone({
  onChange,
  onFilesChange,
}: {
  onChange?: (files: Attachment[]) => void;
  /** Ficheiros reais (sem erro), para submissão — ver denuncia/page.tsx. */
  onFilesChange?: (files: File[]) => void;
}) {
  const [files, setFiles] = useState<Attachment[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function updateAndEmit(next: Attachment[]) {
    setFiles(next);
    onChange?.(next);
    onFilesChange?.(next.filter((f) => !f.error).map((f) => f.file));
  }

  function simulateUpload(id: string) {
    const tick = () => {
      setFiles((prev) => {
        const next = prev.map((f) => {
          if (f.id !== id || f.error) return f;
          const progress = Math.min(100, f.progress + 12 + Math.random() * 18);
          return { ...f, progress };
        });
        onChange?.(next);
        const current = next.find((f) => f.id === id);
        if (current && current.progress < 100 && !current.error) {
          setTimeout(tick, 180);
        }
        return next;
      });
    };
    setTimeout(tick, 180);
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const additions: Attachment[] = Array.from(list).map((f) => {
      const sizeKb = Math.round(f.size / 1024);
      const tooLarge = sizeKb > MAX_SIZE_MB * 1024;
      return {
        id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
        name: f.name,
        sizeKb,
        kind: f.type.split("/")[0] || "ficheiro",
        progress: tooLarge ? 0 : 0,
        error: tooLarge ? `Excede o limite de ${MAX_SIZE_MB} MB` : undefined,
        file: f,
      };
    });
    const next = [...files, ...additions];
    updateAndEmit(next);
    additions.filter((a) => !a.error).forEach((a) => simulateUpload(a.id));
  }

  function remove(id: string) {
    updateAndEmit(files.filter((f) => f.id !== id));
  }

  return (
    <div className="mt-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-lg border border-dashed px-4 py-6 text-center text-sm transition ${
          dragging
            ? "border-[var(--color-beacon)] bg-[var(--color-beacon)]/5"
            : "border-paper/15 text-[var(--color-mist)] hover:border-paper/30"
        }`}
      >
        <p>Arraste ficheiros para aqui, ou clique para escolher</p>
        <p className="mt-1 text-xs text-[var(--color-mist-dim)]">
          Fotos, vídeos, áudio ou PDF · até {MAX_SIZE_MB} MB por ficheiro
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,application/pdf"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="rounded-md border border-paper/10 bg-[var(--color-ink-2)] px-3 py-2 text-xs text-[var(--color-paper)]"
            >
              <div className="flex items-center justify-between">
                <span className="truncate">
                  {f.name} <span className="text-[var(--color-mist-dim)]">· {f.sizeKb} KB</span>
                </span>
                <button
                  type="button"
                  onClick={() => remove(f.id)}
                  className="ml-3 shrink-0 text-[var(--color-mist)] hover:text-[var(--color-alert)]"
                  aria-label={`Remover ${f.name}`}
                >
                  Remover
                </button>
              </div>

              {f.error ? (
                <p className="mt-1.5 text-[var(--color-alert)]">{f.error}</p>
              ) : (
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-paper/10">
                  <div
                    className="h-full rounded-full bg-[var(--color-beacon)] transition-[width] duration-200"
                    style={{ width: `${f.progress}%` }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

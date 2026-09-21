export function PanicButton() {
  return (
    <a
      href="tel:111"
      title="Ligar 111 (Polícia Nacional)"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-[var(--color-alert)]/50 bg-[var(--color-ink)]/95 px-5 py-3 text-sm font-semibold text-[var(--color-alert)] shadow-lg shadow-black/40 backdrop-blur hover:scale-[1.03] hover:border-[var(--color-alert)] active:scale-[0.97] transition-all duration-300 ease-out"
    >
      <span className="h-2 w-2 rounded-full bg-[var(--color-alert)] pulse-dot" />
      Ligar 111
    </a>
  );
}

"use client";

import { useTheme } from "./ThemeProvider";


export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      title={theme === "dark" ? "Modo claro" : "Modo escuro"}
      className="relative w-9 h-9 flex items-center justify-center rounded-2xl
                 bg-white/50 dark:bg-white/[0.06] border border-white/70 dark:border-white/10
                 text-slate-600 dark:text-slate-300 backdrop-blur-xl
                 hover:bg-white/75 dark:hover:bg-white/[0.12] hover:scale-[1.05]
                 active:scale-[0.95]
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400
                 transition-all duration-300 ease-out"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 absolute transition-all duration-300 ease-out scale-100 rotate-0 dark:scale-0 dark:-rotate-90 dark:opacity-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 absolute transition-all duration-300 ease-out scale-0 rotate-90 opacity-0 dark:scale-100 dark:rotate-0 dark:opacity-100"
        fill="currentColor"
      >
        <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 1020.354 15.354z" />
      </svg>
    </button>
  );
}

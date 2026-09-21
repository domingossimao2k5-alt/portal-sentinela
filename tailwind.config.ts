import type { Config } from "tailwindcss";

// Configuração Tailwind do portal — espelha exactamente a paleta e os
// tokens do sistema principal Sentinela (Liquid Glass), para que os dois
// produtos (ERP interno e portal público de denúncias) partilhem a mesma
// identidade visual, incluindo suporte a modo escuro.
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta institucional Sentinela
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        status: {
          identificado: "#16a34a",
          nao_identificado: "#dc2626",
          pendente: "#ca8a04",
          investigacao: "#2563eb",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "glass-sm": "0 2px 12px -2px rgb(15 23 42 / 0.08)",
        glass:
          "inset 0 1px 0 0 rgb(255 255 255 / 0.4), 0 8px 32px -6px rgb(15 23 42 / 0.14)",
        "glass-lg":
          "inset 0 1px 0 0 rgb(255 255 255 / 0.5), 0 24px 64px -12px rgb(15 23 42 / 0.22)",
        "glass-dark-sm": "0 2px 12px -2px rgb(0 0 0 / 0.35)",
        "glass-dark":
          "inset 0 1px 0 0 rgb(255 255 255 / 0.06), 0 8px 32px -6px rgb(0 0 0 / 0.55)",
        "glass-dark-lg":
          "inset 0 1px 0 0 rgb(255 255 255 / 0.08), 0 24px 70px -12px rgb(0 0 0 / 0.65)",
        card: "inset 0 1px 0 0 rgb(255 255 255 / 0.55), 0 20px 50px -15px rgb(15 23 42 / 0.22)",
        "card-dark":
          "inset 0 1px 0 0 rgb(255 255 255 / 0.07), 0 22px 60px -15px rgb(0 0 0 / 0.65)",
        "card-lg":
          "inset 0 1px 0 0 rgb(255 255 255 / 0.65), 0 30px 80px -18px rgb(15 23 42 / 0.32)",
        "card-lg-dark":
          "inset 0 1px 0 0 rgb(255 255 255 / 0.1), 0 30px 90px -18px rgb(0 0 0 / 0.75)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

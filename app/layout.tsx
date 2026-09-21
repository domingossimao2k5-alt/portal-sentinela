import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PanicButton } from "@/components/PanicButton";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import AnimatedBackground from "@/components/background/AnimatedBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Portal de Denúncias - Sentinela | SIC Caála",
    template: "%s | Sentinela",
  },
  description:
    "Denuncie de forma anónima ou faça a sua queixa electrónica junto do Serviço de Investigação Criminal do Município da Caála. Acompanhe o estado do seu processo em tempo real.",
  applicationName: "Sentinela",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/brand/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/brand/apple-icon-180x180.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/brand/favicon.ico"],
  },
  openGraph: {
    title: "Portal de Denúncias - Sentinela | SIC Caála",
    description:
      "Canal oficial de denúncia e queixa do Serviço de Investigação Criminal do Município da Caála.",
    locale: "pt_AO",
    type: "website",
    siteName: "Sentinela",
  },

};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("sentinela-portal-theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-AO" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <AnimatedBackground />
          {children}
          <PanicButton />
        </ThemeProvider>
      </body>
    </html>
  );
}

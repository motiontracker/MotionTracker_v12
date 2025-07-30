import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MotionTracker - Rastreamento avançado de eventos",
  description: "Rastreamento avançado de eventos que transforma dados em insights acionáveis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="pt-BR" suppressHydrationWarning>
        <head>
          <link rel="stylesheet" href="/css/main.min.css" />
          <link rel="stylesheet" href="/css/theme.min.css" />
        </head>
        <body className={fontSans.className}>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    </>
  );
}
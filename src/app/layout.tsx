import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "a0.dev | Build Full-Stack Apps with AI",
  description: "Build, preview, edit, manage database schemas, connect webhooks, and deploy full-stack web applications dynamically with AI agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full bg-[#070709] text-[#f4f4f5] flex flex-col font-sans selection:bg-accent-blue/30 selection:text-white">
        {/* Glow Effects */}
        <div className="fixed -top-40 -left-40 w-96 h-96 bg-[var(--accent-blue)]/10 rounded-full bg-glow-blob pointer-events-none z-0" />
        <div className="fixed top-1/2 -right-40 w-[400px] h-[400px] bg-[var(--accent-pink)]/5 rounded-full bg-glow-blob pointer-events-none z-0" />
        <div className="relative z-10 flex flex-col flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Fact Checker — Decentralized Truth Protocol",
  description: "The world's first decentralized fact-checking protocol powered by AI validators on GenLayer. Submit claims, verify truth, earn reputation.",
  keywords: ["fact-check", "blockchain", "GenLayer", "AI", "decentralized", "truth", "verification"],
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}

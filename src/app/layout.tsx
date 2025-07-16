import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "1ere Classe - Réservation de bus",
  description: "Voyagez confortablement en Mauritanie avec 1ere Classe.",
  keywords: "bus, réservation, Mauritanie, transport",
  authors: [{ name: "1ere Classe Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full" dir="ltr">
      <body className={`${inter.className} h-full bg-gray-50 dark:bg-gray-900`}>
        {children}
      </body>
    </html>
  );
}

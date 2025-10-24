import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Memories - Capsules Mémoires",
  description: "Application pour créer et partager des souvenirs enrichis avec la famille",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}

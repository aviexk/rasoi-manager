import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rasoi Manager — Restaurant Operations for India",
  description: "Procurement & inventory management built for Indian restaurants. Powered by PetPooja POS integration and WhatsApp ordering.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-50">{children}</body>
    </html>
  );
}

// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import CopticFontPreference from "./CopticFontPreference";

export const metadata: Metadata = {
  title: "Coptic",
  description: "Coptic learning + dictionary",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CopticFontPreference />
        {children}
      </body>
    </html>
  );
}
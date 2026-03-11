// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import CopticFontPreference from "./CopticFontPreference";
import ThemePreference, { themeInitScript } from "./ThemePreference";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <CopticFontPreference />
        <ThemePreference />
        {children}
      </body>
    </html>
  );
  }
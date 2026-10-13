// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import AudioUnlock from "./AudioUnlock";
import CopticFontPreference from "./CopticFontPreference";
import MobileChinDock from "./MobileChinDock";
import ThemePreference, { themeInitScript } from "./ThemePreference";

export const metadata: Metadata = {
  title: "Coptic",
  description: "Coptic learning + dictionary",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
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
        <AudioUnlock />
        <CopticFontPreference />
        <ThemePreference />
        <div className="mobile-chin-page-shell">{children}</div>
        <MobileChinDock />
      </body>
    </html>
  );
}

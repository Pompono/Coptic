"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  applyCopticFontMode,
  COPTIC_FONT_STORAGE_KEY,
  type CopticFontMode,
} from "./CopticFontPreference";
import { applyThemeMode, THEME_STORAGE_KEY, type ThemeMode } from "./ThemePreference";

export default function Page() {
  const [fontMode, setFontMode] = useState<CopticFontMode>("unicode");
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  useEffect(() => {
        const savedFont = localStorage.getItem(COPTIC_FONT_STORAGE_KEY);
    const font: CopticFontMode = savedFont === "avva" ? "avva" : "unicode";
    setFontMode(font);
    applyCopticFontMode(font);

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const theme: ThemeMode =
      savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    setThemeMode(theme);
    applyThemeMode(theme);
      }, []);

  const onToggleFont = (nextMode: CopticFontMode) => {
    setFontMode(nextMode);
    localStorage.setItem(COPTIC_FONT_STORAGE_KEY, nextMode);
    applyCopticFontMode(nextMode);
  };

  const onToggleTheme = (nextMode: ThemeMode) => {
    setThemeMode(nextMode);
    localStorage.setItem(THEME_STORAGE_KEY, nextMode);
    applyThemeMode(nextMode);
  };

  const toggleButtonStyle = (active: boolean) => ({
    minWidth: 64,
    padding: "6px 10px",
    border: "none",
    cursor: "pointer",
        background: active ? "var(--toggle-active-bg)" : "transparent",
    color: active ? "var(--toggle-active-text)" : "var(--text-color)",
        fontWeight: 700,
    fontSize: 12,
    lineHeight: 1.2,
    textAlign: "center" as const,
    fontFamily: "inherit",
  });

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto", position: "relative", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 10 }}>Coptic</h1>

      <p style={{ opacity: 0.85, marginBottom: 24 }}>
        A real learning flow: lessons → practice → progress.
      </p>

      <div style={{ display: "flex", gap: 12 }}>
        <Link
          href="/learn"
          style={{
            display: "inline-block",
            padding: "12px 18px",
            borderRadius: 12,
                        background: "var(--accent-color)",
            color: "var(--accent-contrast-color)",
                        fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Start Learning →
        </Link>

        <Link
          href="/dictionary"
          style={{
            display: "inline-block",
            padding: "12px 18px",
            borderRadius: 12,
                        border: "1px solid var(--border-color)",
            color: "var(--text-color)",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Dictionary →
        </Link>


        <Link
          href="/translator"
          style={{
            display: "inline-block",
            padding: "12px 18px",
            borderRadius: 12,
            border: "1px solid var(--border-color)",
            color: "var(--text-color)",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Translator →
        </Link>
      </div>

      <div
        style={{
          position: "fixed",
          right: 10,
          bottom: 10,
          zIndex: 20,
          display: "inline-flex",
          alignItems: "center",
                    gap: 10,
          border: "1px solid var(--border-color)",
          borderRadius: 10,
          padding: "6px 8px",
                    background: "var(--panel-bg)",
          backdropFilter: "blur(2px)",
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }} aria-label="Theme toggle">
          <span style={{ fontSize: 12, opacity: 0.9, whiteSpace: "nowrap" }}>Theme</span>
          <div
            style={{
              display: "inline-flex",
              border: "1px solid var(--border-color)",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <button type="button" onClick={() => onToggleTheme("light")} style={toggleButtonStyle(themeMode === "light")}>
              Light
            </button>
            <button type="button" onClick={() => onToggleTheme("dark")} style={toggleButtonStyle(themeMode === "dark")}>
              Dark
            </button>
          </div>
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }} aria-label="Coptic font toggle">
          <span style={{ fontSize: 12, opacity: 0.9, whiteSpace: "nowrap" }}>Coptic Font</span>

          <div
            style={{
              display: "inline-flex",
              border: "1px solid var(--border-color)",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <button type="button" onClick={() => onToggleFont("unicode")} style={toggleButtonStyle(fontMode === "unicode")}>
              Standard
            </button>
            <button type="button" onClick={() => onToggleFont("avva")} style={toggleButtonStyle(fontMode === "avva")}>
              New
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  applyCopticFontMode,
  COPTIC_FONT_STORAGE_KEY,
  type CopticFontMode,
} from "../CopticFontPreference";
import {
  COPTIC_KEYBOARD_ENABLED_STORAGE_KEY,
  isCopticKeyboardEnabled,
} from "../CopticKeyboardPreference";
import { applyThemeMode, THEME_STORAGE_KEY, type ThemeMode } from "../ThemePreference";

export default function SettingsPage() {
  const [fontMode, setFontMode] = useState<CopticFontMode>("unicode");
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [keyboardEnabled, setKeyboardEnabled] = useState(true);
  const [isNarrowLayout, setIsNarrowLayout] = useState(false);

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

    setKeyboardEnabled(isCopticKeyboardEnabled());
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 430px)");
    const syncNarrowLayout = () => setIsNarrowLayout(mediaQuery.matches);

    syncNarrowLayout();
    mediaQuery.addEventListener("change", syncNarrowLayout);

    return () => {
      mediaQuery.removeEventListener("change", syncNarrowLayout);
    };
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

  const onToggleKeyboardEnabled = (nextEnabled: boolean) => {
    setKeyboardEnabled(nextEnabled);
    localStorage.setItem(COPTIC_KEYBOARD_ENABLED_STORAGE_KEY, String(nextEnabled));
  };

  const toggleButtonStyle = (active: boolean) => ({
    minWidth: 76,
    padding: "8px 12px",
    border: "none",
    cursor: "pointer",
    background: active ? "var(--toggle-active-bg)" : "transparent",
    color: active ? "var(--toggle-active-text)" : "var(--text-color)",
    fontWeight: 700,
    fontSize: 13,
    lineHeight: 1.2,
    textAlign: "center" as const,
    fontFamily: "inherit",
  });

  const toggleRowStyle = {
    display: "grid",
    gridTemplateColumns: isNarrowLayout ? "1fr" : "minmax(160px, max-content) auto",
    alignItems: "center",
    columnGap: 10,
    rowGap: isNarrowLayout ? 8 : 0,
  } as const;

  const toggleLabelStyle = {
    fontSize: 14,
    fontWeight: 600,
    maxWidth: "100%",
    overflowWrap: "anywhere" as const,
  } as const;

  const toggleControlStyle = {
    display: "inline-flex",
    border: "1px solid var(--border-color)",
    borderRadius: 8,
    overflow: "hidden",
    justifySelf: "end",
  } as const;

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto", minHeight: "100vh" }}>
      <Link href="/" style={{ color: "var(--text-color)", textDecoration: "none", opacity: 0.9 }}>
        ← Back
      </Link>

      <h1 style={{ marginTop: 12, marginBottom: 8, fontSize: 34, fontWeight: 800 }}>Settings</h1>
      <p style={{ marginBottom: 24, opacity: 0.85 }}>Customize the app to fit your needs!</p>

      <section
        style={{
          display: "grid",
          gap: 20,
          border: "1px solid var(--border-color)",
          borderRadius: 12,
          padding: 18,
          background: "var(--panel-bg)",
        }}
      >
        <div style={toggleRowStyle} aria-label="Theme toggle">
          <span style={toggleLabelStyle}>App Theme</span>
          <div style={toggleControlStyle}>
            <button type="button" onClick={() => onToggleTheme("light")} style={toggleButtonStyle(themeMode === "light")}>
              Light
            </button>
            <button type="button" onClick={() => onToggleTheme("dark")} style={toggleButtonStyle(themeMode === "dark")}>
              Dark
            </button>
          </div>
        </div>

        <div style={toggleRowStyle} aria-label="Coptic font toggle">
          <span style={toggleLabelStyle}>Coptic Font</span>

          <div style={toggleControlStyle}>
            <button type="button" onClick={() => onToggleFont("unicode")} style={toggleButtonStyle(fontMode === "unicode")}>
              Standard
            </button>
            <button type="button" onClick={() => onToggleFont("avva")} style={toggleButtonStyle(fontMode === "avva")}>
              New
            </button>
          </div>
        </div>

        <div
          style={toggleRowStyle}
          aria-label="On-screen Coptic keyboard toggle"
        >
          <span style={toggleLabelStyle}>On-screen Coptic Keyboard</span>

          <div style={toggleControlStyle}>
            <button
              type="button"
              onClick={() => onToggleKeyboardEnabled(false)}
              style={toggleButtonStyle(!keyboardEnabled)}
            >
              Disabled
            </button>
            <button
              type="button"
              onClick={() => onToggleKeyboardEnabled(true)}
              style={toggleButtonStyle(keyboardEnabled)}
            >
              Enabled
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
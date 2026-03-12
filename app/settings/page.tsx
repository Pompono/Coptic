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
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, flexWrap: "wrap" }} aria-label="Theme toggle">
          <span style={{ fontSize: 14, fontWeight: 600, minWidth: 95 }}>App Theme</span>
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

        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, flexWrap: "wrap" }} aria-label="Coptic font toggle">
          <span style={{ fontSize: 14, fontWeight: 600, minWidth: 95 }}>Coptic Font</span>

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

        <div
          style={{ display: "inline-flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}
          aria-label="On-screen Coptic keyboard toggle"
        >
          <span style={{ fontSize: 14, fontWeight: 600, minWidth: 160 }}>On-screen Coptic keyboard</span>

          <div
            style={{
              display: "inline-flex",
              border: "1px solid var(--border-color)",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => onToggleKeyboardEnabled(true)}
              style={toggleButtonStyle(keyboardEnabled)}
            >
              Enabled
            </button>
            <button
              type="button"
              onClick={() => onToggleKeyboardEnabled(false)}
              style={toggleButtonStyle(!keyboardEnabled)}
            >
              Disabled
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
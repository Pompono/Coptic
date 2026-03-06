"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  applyCopticFontMode,
  COPTIC_FONT_STORAGE_KEY,
  type CopticFontMode,
} from "./CopticFontPreference";

export default function Page() {
  const [fontMode, setFontMode] = useState<CopticFontMode>("unicode");

  useEffect(() => {
    const saved = localStorage.getItem(COPTIC_FONT_STORAGE_KEY);
    const mode: CopticFontMode = saved === "avva" ? "avva" : "unicode";
    setFontMode(mode);
    applyCopticFontMode(mode);
  }, []);

  const onToggleFont = (nextMode: CopticFontMode) => {
    setFontMode(nextMode);
    localStorage.setItem(COPTIC_FONT_STORAGE_KEY, nextMode);
    applyCopticFontMode(nextMode);
  };

  const toggleButtonStyle = (active: boolean) => ({
    minWidth: 64,
    padding: "6px 10px",
    border: "none",
    cursor: "pointer",
    background: active ? "white" : "transparent",
    color: active ? "black" : "white",
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
            background: "white",
            color: "black",
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
            border: "1px solid rgba(255,255,255,0.2)",
            color: "white",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Dictionary →
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
          gap: 8,
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: 10,
          padding: "6px 8px",
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(2px)",
        }}
        aria-label="Coptic font toggle"
      >
        <span style={{ fontSize: 12, opacity: 0.9, whiteSpace: "nowrap" }}>Coptic Font</span>

        <div
          style={{
            display: "inline-flex",
            border: "1px solid rgba(255,255,255,0.25)",
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
    </main>
  );
}
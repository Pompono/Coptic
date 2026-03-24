"use client";

import { useEffect } from "react";

export const COPTIC_FONT_STORAGE_KEY = "coptic-font-mode";
export type CopticFontMode = "unicode" | "avva";

export function applyCopticFontMode(mode: CopticFontMode) {
  document.documentElement.dataset.copticFont = mode;
}

export default function CopticFontPreference() {
  useEffect(() => {
    const saved = localStorage.getItem(COPTIC_FONT_STORAGE_KEY);
    const mode: CopticFontMode = saved === "unicode" ? "unicode" : "avva";
    applyCopticFontMode(mode);
  }, []);

  return null;
}

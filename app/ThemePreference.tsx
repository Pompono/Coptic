"use client";

import { useEffect } from "react";

export const THEME_STORAGE_KEY = "theme-mode";
export type ThemeMode = "dark" | "light";

export function applyThemeMode(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode;
}

function getPreferredTheme(): ThemeMode {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "dark" || saved === "light") {
    return saved;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const themeInitScript = `(() => {
  try {
    const key = "${THEME_STORAGE_KEY}";
    const saved = localStorage.getItem(key);
    const mode = saved === "dark" || saved === "light"
      ? saved
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = mode;
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();`;

export default function ThemePreference() {
  useEffect(() => {
    const mode = getPreferredTheme();
    applyThemeMode(mode);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemThemeChange = () => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        applyThemeMode(media.matches ? "dark" : "light");
      }
    };

    media.addEventListener("change", onSystemThemeChange);
    return () => media.removeEventListener("change", onSystemThemeChange);
  }, []);

  return null;
}

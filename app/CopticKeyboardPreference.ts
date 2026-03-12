"use client";

export const COPTIC_KEYBOARD_ENABLED_STORAGE_KEY = "coptic-keyboard-enabled";

export function isCopticKeyboardEnabled(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  return localStorage.getItem(COPTIC_KEYBOARD_ENABLED_STORAGE_KEY) !== "false";
}

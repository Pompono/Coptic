"use client";

import { useEffect } from "react";
import { audioService } from "@/lib/audioService";

export default function AudioUnlock() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let removed = false;

    const removeListeners = () => {
      if (removed) {
        return;
      }

      removed = true;
      window.removeEventListener("pointerdown", handleUnlock);
      window.removeEventListener("touchstart", handleUnlock);
      window.removeEventListener("click", handleUnlock);
      window.removeEventListener("keydown", handleUnlock);
    };

    const handleUnlock = () => {
      void audioService.unlock().then(removeListeners).catch(() => {
        // Keep listeners in place so the next gesture can retry.
      });
    };

    window.addEventListener("pointerdown", handleUnlock, { passive: true });
    window.addEventListener("touchstart", handleUnlock, { passive: true });
    window.addEventListener("click", handleUnlock, { passive: true });
    window.addEventListener("keydown", handleUnlock);

    return removeListeners;
  }, []);

  return null;
}
